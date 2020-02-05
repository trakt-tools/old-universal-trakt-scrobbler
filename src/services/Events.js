import { Errors } from './Errors';

class _Events {
  constructor() {
    this.LOGIN_SUCCESS = 1;
    this.LOGIN_ERROR = 2;
    this.LOGOUT_SUCCESS = 3;
    this.LOGOUT_ERROR = 4;
    this.SCROBBLE_SUCCESS = 5;
    this.SCROBBLE_ERROR = 6;
    this.SCROBBLE_ACTIVE = 7;
    this.SCROBBLE_INACTIVE = 8;
    this.SCROBBLE_START = 9;
    this.SCROBBLE_PAUSE = 10;
    this.SCROBBLE_STOP = 11;
    this.SCROBBLE_PROGRESS = 12;
    this.SEARCH_SUCCESS = 13;
    this.SEARCH_ERROR = 14;
    this.OPTIONS_CLEAR = 15;
    this.OPTION_CHANGE = 16;
    this.DIALOG_SHOW = 17;
    this.SNACKBAR_SHOW = 18;

    /** @type {Object<number, Array<Function>>} */
    this.listeners = {};

    this.subscribe = this.subscribe.bind(this);
    this.unsubscribe = this.unsubscribe.bind(this);
    this.dispatch = this.dispatch.bind(this);
  }

  /**
   * @param {number} eventType
   * @param {Function} listener
   */
  subscribe(eventType, listener) {
    if (!this.listeners[eventType]) {
      this.listeners[eventType] = [];
    }
    this.listeners[eventType].push(listener);
  }

  /**
   * @param {number} eventType
   * @param {Function} listener
   */
  unsubscribe(eventType, listener) {
    if (this.listeners[eventType]) {
      this.listeners[eventType] = this.listeners[eventType]
        .filter(fn => fn !== listener);
    }
  }

  /**
   * @param {number} eventType
   * @param {Object<string, any>} data
   * @returns {Promise}
   */
  async dispatch(eventType, data) {
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

const Events = new _Events();

export { Events };