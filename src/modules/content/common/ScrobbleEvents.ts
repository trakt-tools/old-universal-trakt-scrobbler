import { Events, EventDispatcher } from '../../../services/Events';

class ScrobbleEvents {
  changeListener: any;
  isPaused: boolean;
  isPlaying: boolean;

  constructor() {
    this.changeListener = null;
    this.isPaused = false;
    this.isPlaying = false;

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
    // To implement in inherited classes.
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

export { ScrobbleEvents };