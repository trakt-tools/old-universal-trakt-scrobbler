import { Errors } from './Errors';

enum Events {
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  LOGOUT_SUCCESS,
  LOGOUT_ERROR,
  SCROBBLE_SUCCESS,
  SCROBBLE_ERROR,
  SCROBBLE_ACTIVE,
  SCROBBLE_INACTIVE,
  SCROBBLE_START,
  SCROBBLE_PAUSE,
  SCROBBLE_STOP,
  SCROBBLE_PROGRESS,
  SEARCH_SUCCESS,
  SEARCH_ERROR,
  OPTIONS_CHANGE,
  OPTIONS_CLEAR,
  DIALOG_SHOW,
  SNACKBAR_SHOW,
}

class _EventDispatcher {
  listeners: EventDispatcherListeners;

  constructor() {
    this.listeners = {};

    this.subscribe = this.subscribe.bind(this);
    this.unsubscribe = this.unsubscribe.bind(this);
    this.dispatch = this.dispatch.bind(this);
  }

  subscribe(eventType: Events, listener: Function): void {
    if (!this.listeners[eventType]) {
      this.listeners[eventType] = [];
    }
    this.listeners[eventType].push(listener);
  }

  unsubscribe(eventType: Events, listener: Function): void {
    if (this.listeners[eventType]) {
      this.listeners[eventType] = this.listeners[eventType].filter(fn => fn !== listener);
    }
  }

  async dispatch(eventType: Events, data: GenericObject): Promise<void> {
    if (this.listeners[eventType]) {
      for (const listener of this.listeners[eventType]) {
        try {
          await listener(data);
        } catch (err) {
          Errors.log('Failed to dispatch.', err);
        }
      }
    }
  }
}

const EventDispatcher = new _EventDispatcher();

export { Events, EventDispatcher };