import { TraktScrobble } from '../api/TraktScrobble';
import { BrowserStorage } from './BrowserStorage';
import { Events, EventDispatcher } from './Events';
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
    EventDispatcher.subscribe(Events.SCROBBLE_SUCCESS, this.onScrobbleSuccess);
    EventDispatcher.subscribe(Events.SCROBBLE_ERROR, this.onScrobbleError);
  }

  async onScrobbleSuccess(data: ScrobbleEventData): Promise<void> {
    await this.onScrobble(data, true);
  }

  async onScrobbleError(data: ScrobbleEventData): Promise<void> {
    await this.onScrobble(data, false);
  }

  async onScrobble(data: ScrobbleEventData, isSuccess: boolean): Promise<void> {
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

  async getTitleFromException(err: RequestException): Promise<string> {
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

  async show(title: string, message: string): Promise<void> {
    await Messaging.toBackground({ action: 'show-notification', title, message });
  }
}

const Notifications = new _Notifications();

export { Notifications };