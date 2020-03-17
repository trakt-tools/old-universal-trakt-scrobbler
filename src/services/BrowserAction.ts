import { Events, EventDispatcher } from './Events';
import { Messaging } from './Messaging';

class _BrowserAction {
  constructor() {
    this.startListeners = this.startListeners.bind(this);
    this.setActiveIcon = this.setActiveIcon.bind(this);
    this.setInactiveIcon = this.setInactiveIcon.bind(this);
  }

  startListeners() {
    EventDispatcher.subscribe(Events.SCROBBLE_ACTIVE, this.setActiveIcon);
    EventDispatcher.subscribe(Events.SCROBBLE_INACTIVE, this.setInactiveIcon);
  }

  async setActiveIcon(): Promise<void> {
    await Messaging.toBackground({ action: 'set-active-icon' });
  }

  async setInactiveIcon(): Promise<void> {
    await Messaging.toBackground({ action: 'set-inactive-icon' });
  }
}

const BrowserAction = new _BrowserAction();

export { BrowserAction };