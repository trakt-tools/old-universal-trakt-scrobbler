import { Events, EventDispatcher } from '../../../services/Events';
import { HboGoApi } from './HboGoApi';

class _HboGoEvents {
  changeListener: any;
  isPaused: boolean;
  isPlaying: boolean;
  progress: number;
  url: string;
  videoId: string;

  constructor() {
    this.changeListener = null;
    this.isPaused = false;
    this.isPlaying = false;
    this.progress = 0.0;
    this.url = '';
    this.videoId = '';

    this.startListeners = this.startListeners.bind(this);
    this.stopListeners = this.stopListeners.bind(this);
    this.getLocation = this.getLocation.bind(this);
    this.addChangeListener = this.addChangeListener.bind(this);
    this.stopChangeListener = this.stopChangeListener.bind(this);
    this.checkForChanges = this.checkForChanges.bind(this);
    this.start = this.start.bind(this);
    this.pause = this.pause.bind(this);
    this.stop = this.stop.bind(this);
    this.updateProgress = this.updateProgress.bind(this);
  }

  startListeners() {
    this.addChangeListener();
  }

  stopListeners() {
    this.stopChangeListener();
  }

  getLocation(): string {
    return window.location.href;
  }

  addChangeListener() {
    this.checkForChanges();
  }

  stopChangeListener() {
    window.clearTimeout(this.changeListener);
    this.changeListener = null;
  }

  async checkForChanges(): Promise<void> {
    // If we can access the global sdk object from the page, there is no need to parse the page in order to retrieve information about the item being watched.
    const session = await HboGoApi.getSession();
    if (typeof session !== 'undefined') {
      if (session) {
        if (this.videoId !== session.content.Id) {
          if (this.isPlaying) {
            await this.stop();
          }
          await this.start();
          this.videoId = session.content.Id;
          this.isPaused = false;
          this.isPlaying = true;
        } else if ((this.isPaused !== session.paused) || (this.isPlaying !== session.playing)) {
          if (session.paused) {
            if (!this.isPaused) {
              await this.pause();
            }
          } else if (session.playing) {
            if (!this.isPlaying) {
              await this.start();
            }
          } else if (this.isPlaying) {
            await this.stop();
          }
          this.isPaused = session.paused;
          this.isPlaying = session.playing;
        }
        if (this.isPlaying) {
          const newProgress = session.progress;
          if (this.progress !== newProgress) {
            await this.updateProgress(newProgress);
            this.progress = newProgress;
          }
        }
      } else if (this.isPlaying || this.isPaused) {
        await this.stop();
      }
    } else {
      // TODO: Implement manual parsing.
    }
    this.changeListener = window.setTimeout(this.checkForChanges, 500);
  }

  async start(): Promise<void> {
    await EventDispatcher.dispatch(Events.SCROBBLE_START, {});
    await EventDispatcher.dispatch(Events.SCROBBLE_ACTIVE, {});
  }

  async pause(): Promise<void> {
    await EventDispatcher.dispatch(Events.SCROBBLE_PAUSE, {});
    await EventDispatcher.dispatch(Events.SCROBBLE_INACTIVE, {});
  }

  async stop(): Promise<void> {
    await EventDispatcher.dispatch(Events.SCROBBLE_STOP, {});
    if (!this.isPaused) {
      await EventDispatcher.dispatch(Events.SCROBBLE_INACTIVE, {});
    }
  }

  async updateProgress(newProgress: number): Promise<void> {
    await EventDispatcher.dispatch(Events.SCROBBLE_PROGRESS, { progress: newProgress });
  }
}

const HboGoEvents = new _HboGoEvents();

export { HboGoEvents };