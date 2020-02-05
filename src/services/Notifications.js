import { TraktScrobble } from '../api/TraktScrobble';
import { BrowserStorage } from './BrowserStorage';
import { Events } from './Events';
import { Messaging } from './Messaging';

class _Notifications {
  constructor() {
    this.startListeners = this.startListeners.bind(this);
    this.onScrobbleSuccess = this.onScrobbleSuccess.bind(this);
    this.onScrobbleError = this.onScrobbleError.bind(this);
    this.onScrobble = this.onScrobble.bind(this);
    this.getTitleFromException = this.getTitleFromException.bind(this);
    this.show = this.show.bind(this);
  }

  startListeners() {
    Events.subscribe(Events.SCROBBLE_SUCCESS, this.onScrobbleSuccess);
    Events.subscribe(Events.SCROBBLE_ERROR, this.onScrobbleError);
  }

  /**
   * @param {ScrobbleEventData} data
   * @returns {Promise}
   */
  async onScrobbleSuccess(data) {
    await this.onScrobble(data, true);
  }

  /**
   * @param {ScrobbleEventData} data
   * @returns {Promise}
   */
  async onScrobbleError(data) {
    await this.onScrobble(data, false);
  }

  /**
   * @param {ScrobbleEventData} data
   * @param {boolean} isSuccess
   * @returns {Promise}
   */
  async onScrobble(data, isSuccess) {
    if (data.item && data.item.title) {
      let title = '';
      let message = '';
      if (isSuccess) {
        title = data.item.title;
        switch (data.scrobbleType) {
          case TraktScrobble.START: {
            message = browser.i18n.getMessage('scrobbleStarted');
            break;
          }
          case TraktScrobble.PAUSE: {
            message = browser.i18n.getMessage('scrobblePaused');
            break;
          }
          case TraktScrobble.STOP: {
            message = browser.i18n.getMessage('scrobbleStopped');
            break;
          }
        }
      } else {
        title = await this.getTitleFromException(data.error);
        message = `${browser.i18n.getMessage('couldNotScrobble')} ${data.item.title}`;
      }
      await this.show(title, message);
    }
  }

  /**
   * @param {RequestException} err
   * @returns {Promise<string>}
   */
  async getTitleFromException(err) {
    let title = '';
    if (err) {
      if (err.status === 404) {
        title = browser.i18n.getMessage('errorNotificationNotFound');
      } else if (err.status === 0) {
        const values = await BrowserStorage.get('auth');
        if (values.auth && values.auth.access_token) {
          title = browser.i18n.getMessage('errorNotificationServers');
        } else {
          title = browser.i18n.getMessage('errorNotificationLogin');
        }
      } else {
        title =  browser.i18n.getMessage('errorNotificationServers');
      }
    } else {
      title = browser.i18n.getMessage('errorNotification');
    }
    return title;
  }

  /**
   * @param {string} title
   * @param {string} message
   * @returns {Promise}
   */
  async show(title, message) {
    await Messaging.toBackground({ action: 'show-notification', title, message });
  }
}

const Notifications = new _Notifications();

export { Notifications };