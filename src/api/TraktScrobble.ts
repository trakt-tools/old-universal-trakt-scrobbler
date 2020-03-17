import { Events, EventDispatcher } from '../services/Events';
import { Requests } from '../services/Requests';
import { TraktApi } from './TraktApi';
import { ScrobbleItem } from '../models/ScrobbleItem';
import { Messaging } from '../services/Messaging';

class _TraktScrobble extends TraktApi {
  START: number;
  PAUSE: number;
  STOP: number;

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

  async start(item: ScrobbleItem): Promise<void> {
    if (!browser.isBackgroundPage) {
      await Messaging.toBackground({ action: 'start-scrobble' });
    }
    await this.send(item, this.START);
  }

  async pause(item: ScrobbleItem): Promise<void> {
    await this.send(item, this.PAUSE);
  }

  async stop(item: ScrobbleItem): Promise<void> {
    await this.send(item, this.STOP);
    if (!browser.isBackgroundPage) {
      await Messaging.toBackground({ action: 'stop-scrobble' });
    }
  }

  async send(item: ScrobbleItem, scrobbleType: number): Promise<void> {
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
      const data: TraktScrobbleData = {} as TraktScrobbleData;
      if (item.type === 'show') {
        data.episode = {
          ids: {
            trakt: item.id,
          },
        };
      } else {
        data.movie = {
          ids: {
            trakt: item.id,
          },
        };
      }
      data.progress = item.progress;
      await Requests.send({
        url: `${this.SCROBBLE_URL}${path}`,
        method: 'POST',
        body: data,
      });
      await EventDispatcher.dispatch(Events.SCROBBLE_SUCCESS, { item, scrobbleType });
    } catch (err) {
      await EventDispatcher.dispatch(Events.SCROBBLE_ERROR, { item, scrobbleType, error: err });
    }
  }
}

const TraktScrobble = new _TraktScrobble();

export { TraktScrobble };