import { Events } from '../services/Events';
import { Requests } from '../services/Requests';
import { TraktApi } from './TraktApi';

class _TraktScrobble extends TraktApi {
  constructor() {
    super();

    this.START = 1;
    this.PAUSE = 2;
    this.STOP = 3;

    this.start = this.start.bind(this);
    this.pause = this.pause.bind(this);
    this.stop = this.stop.bind(this);
    this.send = this.send.bind(this);
  }

  /**
   * @param {import('../models/ScrobbleItem').ScrobbleItem} item
   * @returns {Promise}
   */
  async start(item) {
    await this.send(item, this.START);
  }

  /**
   * @param {import('../models/ScrobbleItem').ScrobbleItem} item
   * @returns {Promise}
   */
  async pause(item) {
    await this.send(item, this.PAUSE);
  }

  /**
   * @param {import('../models/ScrobbleItem').ScrobbleItem} item
   * @returns {Promise}
   */
  async stop(item) {
    await this.send(item, this.STOP);
  }

  /**
   * @param {import('../models/ScrobbleItem').ScrobbleItem} item
   * @param {number} scrobbleType
   * @returns {Promise}
   */
  async send(item, scrobbleType) {
    let path = '';
    switch (scrobbleType) {
      case this.START: {
        path = '/start';
        break;
      }
      case this.PAUSE: {
        path = '/pause';
        break;
      }
      case this.STOP: {
        path = '/stop';
        break;
      }
    }
    try {
      await Requests.send({
        url: `${this.SCROBBLE_URL}${path}`,
        method: 'POST',
        body: item.data,
      });
      await Events.dispatch(Events.SCROBBLE_SUCCESS, { item, scrobbleType });
    } catch (err) {
      await Events.dispatch(Events.SCROBBLE_FAILED, { item, scrobbleType, error: err });
    }
  }
}

const TraktScrobble = new _TraktScrobble();

export { TraktScrobble };