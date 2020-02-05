import { Events } from '../../../services/Events';
import { NetflixApi } from './NetflixApi';
import { NetflixParser } from './NetflixParser';

class _NetflixEvents {
  constructor() {
    /** @type {Object} */
    this.changeListener = null;

    /** @type {boolean} */
    this.isPaused = false;

    /** @type {boolean} */
    this.isPlaying = false;

    /** @type {number} */
    this.progress = 0.0;

    /** @type {string} */
    this.url = '';

    /** @type {number} */
    this.videoId = 0;

    this.startListeners = this.startListeners.bind(this);
    this.stopListeners = this.stopListeners.bind(this);
    this.getLocation = this.getLocation.bind(this);
    this.addChangeListener = this.addChangeListener.bind(this);
    this.stopChangeListener = this.stopChangeListener.bind(this);
    this.checkForChanges = this.checkForChanges.bind(this);
    this.onUrlChange = this.onUrlChange.bind(this);
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

  /**
   * For testing purposes.
   * @returns {string}
   */
  getLocation() {
    return window.location.href;
  }

  addChangeListener() {
    this.checkForChanges();
  }

  stopChangeListener() {
    window.clearTimeout(this.changeListener);
    this.changeListener = null;
  }

  /**
   * @returns {Promise}
   */
  async checkForChanges() {
    // If we can access the global netflix object from the page, there is no need to parse the page in order to retrieve information about the item being watched.
    const session = await NetflixApi.getSession();
    if (typeof session !== 'undefined') {
      if (session) {
        if (this.videoId !== session.videoId) {
          if (this.isPlaying) {
            await this.stop();
          }
          await this.start();
          this.videoId = session.videoId;
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
          const newProgress = Math.round((session.currentTime / session.duration) * 10000) / 100;
          if (this.progress !== newProgress) {
            await this.updateProgress(newProgress);
            this.progress = newProgress;
          }
        }
      } else if (this.isPlaying || this.isPaused) {
        await this.stop();
      }
    } else {
      const newUrl = this.getLocation();
      if (this.url !== newUrl) {
        await this.onUrlChange(this.url, newUrl);
        this.url = newUrl;
      }
      if (this.isPlaying) {
        const newProgress = NetflixParser.parseProgress();
        if (this.progress === newProgress) {
          if (!this.isPaused) {
            await this.pause();
            this.isPaused = true;
          }
        } else {
          if (this.isPaused) {
            await this.play();
            this.isPaused = false;
          }
          await this.updateProgress(newProgress);
          this.progress = newProgress;
        }
      }
    }
    this.changeListener = window.setTimeout(this.checkForChanges, 500);
  }

  /**
   * @param {string} oldUrl
   * @param {string} newUrl
   * @returns {Promise}
   */
  async onUrlChange(oldUrl, newUrl) {
    if (oldUrl.includes('watch') && newUrl.includes('watch')) {
      await this.stop();
      await this.start();
      this.isPlaying = true;
    } else if (oldUrl.includes('watch') && !newUrl.includes('watch')) {
      await this.stop();
      this.isPlaying = false;
    } else if (!oldUrl.includes('watch') && newUrl.includes('watch')) {
      await this.start();
      this.isPlaying = true;
    }
  }

  /**
   * @returns {Promise}
   */
  async start() {
    await Events.dispatch(Events.SCROBBLE_START, {});
    await Events.dispatch(Events.SCROBBLE_ACTIVE, {});
  }

  /**
   * @returns {Promise}
   */
  async pause() {
    await Events.dispatch(Events.SCROBBLE_PAUSE, {});
    await Events.dispatch(Events.SCROBBLE_INACTIVE, {});
  }

  /**
   * @returns {Promise}
   */
  async stop() {
    await Events.dispatch(Events.SCROBBLE_STOP, {});
    if (!this.isPaused) {
      await Events.dispatch(Events.SCROBBLE_INACTIVE, {});
    }
  }

  /**
   * @param {number} newProgress
   * @returns {Promise}
   */
  async updateProgress(newProgress) {
    await Events.dispatch(Events.SCROBBLE_PROGRESS, { progress: newProgress });
  }
}

const NetflixEvents = new _NetflixEvents();

export { NetflixEvents };