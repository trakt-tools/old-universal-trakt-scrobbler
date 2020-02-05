
import { Item } from '../../../models/Item';
import { Errors } from '../../../services/Errors';
import { Messaging } from '../../../services/Messaging';
import { Requests } from '../../../services/Requests';

class _NetflixApi {
  constructor() {
    this.HOST_URL = 'https://www.netflix.com';
    this.API_URL = `${this.HOST_URL}/api/shakti`;
    this.ACTIVATE_URL = `${this.HOST_URL}/Activate`;
    this.AUTH_REGEX = /"authURL":"(.*?)"/;
    this.BUILD_IDENTIFIER_REGEX = /"BUILD_IDENTIFIER":"(.*?)"/;

    /** @type {boolean} */
    this.isActivated = false;

    /** @type {string} */
    this.authUrl = '';

    /** @type {string} */
    this.buildIdentifier = '';

    /** @type {Function} */
    this.sessionListener = null;

    this.extractAuthUrl = this.extractAuthUrl.bind(this);
    this.extractBuildIdentifier = this.extractBuildIdentifier.bind(this);
    this.activate = this.activate.bind(this);
    this.getItem = this.getItem.bind(this);
    this.parseMetadata = this.parseMetadata.bind(this);
    this.getSession = this.getSession.bind(this);
    this.receiveSession = this.receiveSession.bind(this);
  }

  /**
   * @param {string} text
   * @returns {string}
   */
  extractAuthUrl(text) {
    return text.match(this.AUTH_REGEX)[1];
  }

  /**
   * @param {string} text
   * @param {string}
   */
  extractBuildIdentifier(text) {
    return text.match(this.BUILD_IDENTIFIER_REGEX)[1];
  }

  /**
   * @returns {Promise}
   */
  async activate() {
    // If we can access the global netflix object from the page, there is no need to send a request to Netflix in order to retrieve the API definitions.
    const apiDefs = await Messaging.toBackground({ action: 'get-netflix-api-defs' });
    if (apiDefs.authUrl && apiDefs.buildIdentifier) {
      this.authUrl = apiDefs.authUrl;
      this.buildIdentifier = apiDefs.buildIdentifier;
      this.isActivated = true;
    } else {
      const text = await Requests.send({
        url: this.ACTIVATE_URL,
        method: 'GET',
      });
      this.authUrl = this.extractAuthUrl(text);
      this.buildIdentifier = this.extractBuildIdentifier(text);
      this.isActivated = true;
    }
  }

  /**
   * @param {string} id
   * @returns {Promise<Item>}
   */
  async getItem(id) {
    let item = null;
    if (!this.isActivated) {
      await this.activate();
    }
    try {
      const text = await Requests.send({
        url: `${this.API_URL}/${this.buildIdentifier}/metadata?languages=en-US&movieid=${id}`,
        method: 'GET',
      });
      item = this.parseMetadata(JSON.parse(text));
    } catch (err) {
      Errors.error('Failed to get item.', err);
      item = null;
    }
    return item;
  }

  /**
   * @param {Object} metadata
   * @returns {Item}
   */
  parseMetadata(metadata) {
    let item = null;
    const type = metadata.video.type;
    const title = metadata.video.title;
    const year = metadata.video.year;
    if (type === 'show') {
      let episodeInfo = null;
      const seasonInfo = metadata.video.seasons
        .filter(season => season.episodes
          .filter(episode => {
            const isMatch = episode.id === metadata.video.currentEpisode;
            if (isMatch) {
              episodeInfo = episode;
            }
            return isMatch;
          })[0]
        )[0];
      const isCollection = seasonInfo.shortName.includes('C');
      const season = seasonInfo.seq;
      const episode = episodeInfo.seq;
      const epTitle = episodeInfo.title;
      item = new Item({ type, title, year, isCollection, season, episode, epTitle });
    } else {
      item = new Item({ type, title, year });
    }
    return item;
  }

  /**
   * @returns {Promise<Object>}
   */
  getSession() {
    return new Promise(resolve => {
      if (window.wrappedJSObject) {
        // Firefox wraps page objects, so we can access the global netflix object by unwrapping it.
        let session;
        const netflix = window.wrappedJSObject.netflix;
        if (netflix) {
          const sessions = netflix.appContext.state.playerApp.getState().videoPlayer.playbackStateBySessionId;
          const currentId = Object.keys(sessions)
            .filter(id => id.startsWith('watch'))[0];
          session = (currentId && Object.assign({}, sessions[currentId])) || null;
          XPCNativeWrapper(window.wrappedJSObject.netflix);
        }
        resolve(session);
      } else {
        // Chrome does not allow accessing page objects from extensions, so we need to inject a script into the page and exchange messages in order to access the global netflix object.
        this.sessionListener = this.receiveSession.bind(this, resolve);
        window.addEventListener('uts-receiveSession', this.sessionListener, false);
        const event = new CustomEvent('uts-sendSession');
        window.dispatchEvent(event);
      }
    });
  }

  /**
   * @param {Function} resolve
   * @param {Event} event
   */
  receiveSession(resolve, event) {
    window.removeEventListener('uts-receiveSession', this.sessionListener);
    const session = JSON.parse(event.detail.session);
    resolve(session);
  }
}

const NetflixApi = new _NetflixApi();

export { NetflixApi };