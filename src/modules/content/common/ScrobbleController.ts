import { TraktScrobble } from '../../../api/TraktScrobble';
import { TraktSearch } from '../../../api/TraktSearch';
import { BrowserStorage } from '../../../services/BrowserStorage';
import { Errors } from '../../../services/Errors';
import { Events, EventDispatcher } from '../../../services/Events';
import { Item } from '../../../models/Item';

class ScrobbleController {
  parser: IScrobbleParser;
  item: Item;
  reachedScrobbleThreshold: boolean;
  scrobbleThreshold: number;

  constructor(parser: IScrobbleParser) {
    this.parser = parser;
    this.item = null;
    this.reachedScrobbleThreshold = false;
    this.scrobbleThreshold = 80.0;

    this.startListeners = this.startListeners.bind(this);
    this.onStart = this.onStart.bind(this);
    this.onPause = this.onPause.bind(this);
    this.onStop = this.onStop.bind(this);
    this.onProgress = this.onProgress.bind(this);
    this.getCurrentItem = this.getCurrentItem.bind(this);
  }

  startListeners() {
    EventDispatcher.subscribe(Events.SCROBBLE_START, this.onStart);
    EventDispatcher.subscribe(Events.SCROBBLE_PAUSE, this.onPause);
    EventDispatcher.subscribe(Events.SCROBBLE_STOP, this.onStop);
    EventDispatcher.subscribe(Events.SCROBBLE_PROGRESS, this.onProgress);
  }

  async onStart(): Promise<void> {
    try {
      this.reachedScrobbleThreshold = false;
      if (!this.item) {
        this.item = await this.parser.parseItem();
      }
      if (this.item) {
        if (!this.item.trakt) {
          this.item.trakt = await TraktSearch.find(this.item);
        }
        if (this.item.trakt && !('notFound' in this.item.trakt)) {
          await TraktScrobble.start(this.item.trakt);
          await BrowserStorage.set({ currentItem: this.getCurrentItem() }, false);
        }
      }
    } catch (err) {
      Errors.log('Failed to parse item.', err);
    }
  }

  async onPause(): Promise<void> {
    if (this.item && this.item.trakt && !('notFound' in this.item.trakt)) {
      await TraktScrobble.pause(this.item.trakt);
    }
  }

  async onStop(): Promise<void> {
    if (this.item && this.item.trakt && !('notFound' in this.item.trakt)) {
      await TraktScrobble.stop(this.item.trakt);
      await BrowserStorage.remove('currentItem');
      this.item.trakt = null;
    }
    this.item = null;
    this.reachedScrobbleThreshold = false;
  }

  async onProgress(data: ScrobbleProgressEventData): Promise<void> {
    if (this.item && this.item.trakt && !('notFound' in this.item.trakt)) {
      this.item.trakt.progress = data.progress;
      if (!this.reachedScrobbleThreshold && this.item.trakt.progress > this.scrobbleThreshold) {
        // Update the stored progress after reaching the scrobble threshold to make sure that the item is scrobbled on tab close.
        await BrowserStorage.set({ currentItem: this.item.trakt }, false);
        this.reachedScrobbleThreshold = true;
      }
    }
  }

  getCurrentItem(): IScrobbleItem {
    return this.item && this.item.trakt && !('notFound' in this.item.trakt) ? this.item.trakt : null;
  }
}

export { ScrobbleController };