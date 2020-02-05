import { TraktAuth } from '../api/TraktAuth';
import { BrowserStorage } from './BrowserStorage';
import { Messaging } from './Messaging';

class _Requests {
  constructor() {
    this.send = this.send.bind(this);
    this.sendDirectly = this.sendDirectly.bind(this);
    this.fetch = this.fetch.bind(this);
    this.getOptions = this.getOptions.bind(this);
    this.getHeaders = this.getHeaders.bind(this);
  }

  /**
   * @param {RequestDetails} request
   * @returns {Promise<string>}
   * @throws {RequestException}
   */
  async send(request) {
    let text = '';
    if (browser.isBackgroundPage || request.url.includes(window.location.host)) {
      text = await this.sendDirectly(request);
    } else {
      const response = await Messaging.toBackground({ action: 'send-request', request });
      text = response;
      if (response.error) {
        throw response.error;
      }
    }
    return text;
  }

  /**
   * @param {RequestDetails} request
   * @returns {Promise<string>}
   * @throws {RequestException}
   */
  async sendDirectly(request) {
    let status = 0;
    let text = '';
    try {
      const response = await this.fetch(request);
      status = response.status;
      text = await response.text();
      if (status < 200 || status >= 400) {
        throw text;
      }
    } catch (err) {
      throw { request, status, text };
    }
    return text;
  }

  /**
   * @param {RequestDetails} request
   * @returns {Promise<Response>}
   */
  async fetch(request) {
    let fetch = window.fetch;
    let options = await this.getOptions(request);
    if (window.wrappedJSObject) {
      // Firefox wraps page objects, so if we want to send the request from a container, we have to unwrap them.
      fetch = XPCNativeWrapper(window.wrappedJSObject.fetch);
      window.wrappedJSObject.fetchOptions = cloneInto(options, window);
      options = XPCNativeWrapper(window.wrappedJSObject.fetchOptions);
    }
    return fetch(request.url, options);
  }

  /**
   * @param {RequestDetails} request
   * @returns {Promise<Object<string, any>}
   */
  async getOptions(request) {
    return {
      method: request.method,
      headers: await this.getHeaders(request),
      body: typeof request.body === 'string' ? request.body : JSON.stringify(request.body),
    };
  }

  /**
   * @param {RequestDetails} request
   * @returns {Promise<Object<string, string>>}
   */
  async getHeaders(request) {
    const headers = {
      'Content-Type': typeof request.body === 'string' ? 'application/x-www-form-urlencoded' : 'application/json',
    };
    if (request.url.includes('trakt.tv')) {
      Object.assign(headers, TraktAuth.getHeaders());
      const values = await BrowserStorage.get('auth');
      if (values.auth && values.auth.access_token) {
        headers['Authorization'] = `Bearer ${values.auth.access_token}`;
      }
    }
    return headers;
  }
}

const Requests = new _Requests();

export { Requests };