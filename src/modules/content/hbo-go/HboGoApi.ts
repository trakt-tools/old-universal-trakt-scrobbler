import { Item } from '../../../models/Item';

class _HboGoApi {
  sessionListener: Function;

  constructor() {
    this.sessionListener = null;

    this.isShow = this.isShow.bind(this);
    this.parseMetadata = this.parseMetadata.bind(this);
    this.getSession = this.getSession.bind(this);
    this.receiveSession = this.receiveSession.bind(this);
  }

  isShow(historyItem: HboGoMetadataItem): historyItem is HboGoMetadataShowItem {
    return historyItem.Category === 'Series';
  }

  parseMetadata(metadata: HboGoMetadataItem) {
    let item: Item = null;
    const id = metadata.Id;
    const type = metadata.Category === 'Series' ? 'show' : 'movie';
    const year = metadata.ProductionYear || null;
    if (this.isShow(metadata)) {
      const title = metadata.SeriesName.trim();
      const season = metadata.SeasonIndex;
      const episode = metadata.Index;
      const episodeTitle = metadata.Name.trim();
      const isCollection = false;
      item = new Item({ id, type, title, year, season, episode, episodeTitle, isCollection });
    } else {
      const title = metadata.Name.trim();
      item = new Item({ id, type, title, year });
    }
    return item;
  }

  getSession(): Promise<HboGoSession> {
    return Promise.resolve(undefined);
    return new Promise(resolve => {
      if (window.wrappedJSObject) {
        // Firefox wraps page objects, so we can access the global sdk object by unwrapping it.
        let session;
        const sdk = window.wrappedJSObject.sdk;
        if (sdk) {
          const content = sdk.analytics.content;
          const progress = sdk.player.currentPlaybackProgress.source._value.progressPercent;
          const paused = sdk.analytics.paused;
          const playing = typeof progress !== 'undefined' && !paused;
          session = (typeof progress !== 'undefined' && content && { content, playing, paused, progress }) || null;
          XPCNativeWrapper(window.wrappedJSObject.sdk);
        }
        resolve(session);
      } else {
        // Chrome does not allow accessing page objects from extensions, so we need to inject a script into the page and exchange messages in order to access the global sdk object.
        this.sessionListener = this.receiveSession.bind(this, resolve);
        window.addEventListener('uts-receiveSession', this.sessionListener, false);
        const event = new CustomEvent('uts-sendSession');
        window.dispatchEvent(event);
      }
    });
  }

  receiveSession(resolve: Function, event: Event) {
    window.removeEventListener('uts-receiveSession', this.sessionListener);
    const session = JSON.parse(event.detail.session);
    resolve(session);
  }
}

const HboGoApi = new _HboGoApi();

export { HboGoApi };