import { TraktScrobble } from '../../../api/TraktScrobble';
import { TraktSearch } from '../../../api/TraktSearch';
import { BrowserStorage } from '../../../services/BrowserStorage';
import { Errors } from '../../../services/Errors';
import { Events } from '../../../services/Events';
import { NetflixParser } from './NetflixParser';

class _NetflixController {
  constructor() {
    /** @type {import('../../../models/Item').Item} */
    this.item = null;

    /** @type {import('../../../models/ScrobbleItem').ScrobbleItem} */
    this.scrobbleItem = null;

    this.startListeners = this.startListeners.bind(this);
    this.onStart = this.onStart.bind(this);
    this.onPause = this.onPause.bind(this);
    this.onStop = this.onStop.bind(this);
    this.onProgress = this.onProgress.bind(this);
    this.getCurrentItem = this.getCurrentItem.bind(this);
  }

  startListeners() {
    Events.subscribe(Events.SCROBBLE_START, this.onStart);
    Events.subscribe(Events.SCROBBLE_PAUSE, this.onPause);
    Events.subscribe(Events.SCROBBLE_STOP, this.onStop);
    Events.subscribe(Events.SCROBBLE_PROGRESS, this.onProgress);
  }

  /**
   * @returns {Promise}
   */
  async onStart() {
    try {
      if (!this.item) {
        this.item = await NetflixParser.parseItem();
      }
      if (!this.scrobbleItem && this.item) {
        this.scrobbleItem = await TraktSearch.find(this.item);
      }
      if (this.scrobbleItem) {
        await TraktScrobble.start(this.scrobbleItem);
        await BrowserStorage.set({ currentItem: this.getCurrentItem() });
      }
    } catch (err) {
      Errors.log('Failed to parse item.', err);
    }
  }

  /**
   * @returns {Promise}
   */
  async onPause() {
    if (this.scrobbleItem) {
      await TraktScrobble.pause(this.scrobbleItem);
    }
  }

  /**
   * @returns {Promise}
   */
  async onStop() {
    if (this.scrobbleItem) {
      await TraktScrobble.stop(this.scrobbleItem);
      await BrowserStorage.remove('currentItem');
      this.scrobbleItem = null;
    }
    this.item = null;
  }

  /**
   *
   * @param {ScrobbleProgressEventData} data
   */
  onProgress(data) {
    if (this.scrobbleItem) {
      this.scrobbleItem.data.progress = data.progress;
    }
  }

  /**
   * @returns {Object}
   */
  getCurrentItem() {
    let item = null;
    if (this.item && this.scrobbleItem) {
      if (this.item.type === 'show') {
        item = this.scrobbleItem.data.episode;
      } else {
        item = this.scrobbleItem.data.movie;
      }
    }
    return item;
  }
}

const NetflixController = new _NetflixController();

export { NetflixController };