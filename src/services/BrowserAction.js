import { Events } from './Events';
import { Messaging } from './Messaging';

class _BrowserAction {
  constructor() {
    this.startListeners = this.startListeners.bind(this);
    this.setActiveIcon = this.setActiveIcon.bind(this);
    this.setInactiveIcon = this.setInactiveIcon.bind(this);
  }

  startListeners() {
    Events.subscribe(Events.SCROBBLE_ACTIVE, this.setActiveIcon);
    Events.subscribe(Events.SCROBBLE_INACTIVE, this.setInactiveIcon);
  }

  /**
   * @returns {Promise}
   */
  async setActiveIcon() {
    await Messaging.toBackground({ action: 'set-active-icon' });
  }

  /**
   * @returns {Promise}
   */
  async setInactiveIcon() {
    await Messaging.toBackground({ action: 'set-inactive-icon' });
  }
}

const BrowserAction = new _BrowserAction();

export { BrowserAction };