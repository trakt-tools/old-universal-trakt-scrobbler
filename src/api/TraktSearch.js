import { ScrobbleItem } from '../models/ScrobbleItem';
import { Events } from '../services/Events';
import { Requests } from '../services/Requests';
import { TraktApi } from './TraktApi';

class _TraktSearch extends TraktApi {
  constructor() {
    super();

    this.find = this.find.bind(this);
    this.findItem = this.findItem.bind(this);
    this.findEpisode = this.findEpisode.bind(this);
    this.findEpisodeByTitle = this.findEpisodeByTitle.bind(this);
    this.getEpisodeUrl = this.getEpisodeUrl.bind(this);
    this.formatEpisodeTitle = this.formatEpisodeTitle.bind(this);
  }

  /**
   * @param {import('../models/Item').Item} item
   * @returns {Promise<ScrobbleItem>}
   */
  async find(item) {
    let scrobbleItem = null;
    try {
      let data = null;
      if (item.type === 'show') {
        data = await this.findEpisode(item);
      } else {
        data = await this.findItem(item);
      }
      if (data) {
        scrobbleItem = new ScrobbleItem({ type: item.type, data });
        await Events.dispatch(Events.SEARCH_SUCCESS, { data });
      } else {
        throw {
          request: {
            item,
          },
          status: 404,
          text: 'Item not found.',
        };
      }
    } catch (err) {
      await Events.dispatch(Events.SEARCH_ERROR, { error: err });
    }
    return scrobbleItem;
  }

  /**
   * @param {import('../models/Item').Item} item
   * @returns {Promise<TraktSearchData>}
   * @throws {RequestException}
   */
  async findItem(item) {
    let data = null;
    const text = await Requests.send({
      url: `${this.SEARCH_URL}/${item.type}?query=${encodeURIComponent(item.title)}`,
      method: 'GET',
    });
    const foundItems = JSON.parse(text);
    if (item.type === 'movie') {
      // Get the exact match if there are multiple movies with the same name by checking the year.
      data = foundItems
        .filter(foundItem => foundItem.movie.title === item.title && foundItem.movie.year === item.year)[0];
    } else {
      data = foundItems[0];
    }
    if (!data) {
      throw {
        request: {
          item,
        },
        status: 404,
        text,
      };
    }
    return data;
  }

  /**
   * @param {import('../models/Item').Item} item
   * @returns {Promise<TraktEpisodeDetails>}
   */
  async findEpisode(item) {
    let episode = null;
    const data = await this.findItem(item);
    const text = await Requests.send({
      url: this.getEpisodeUrl(item, data.show.ids.slug),
      method: 'GET',
    });
    const foundEpisodes = JSON.parse(text);
    if ((item.isCollection && item.epTitle) || !item.episode) {
      episode = this.findEpisodeByTitle(item, data, foundEpisodes);
    } else {
      episode = Object.assign(foundEpisodes, data);
    }
    return episode;
  }

  /**
   * @param {import('../models/Item').Item} item
   * @param {TraktShowDetails} show
   * @param {Array<TraktEpisodeDetails>} foundEpisodes
   * @returns {TraktEpisodeDetails}
   * @throws {RequestException}
   */
  findEpisodeByTitle(item, show, foundEpisodes) {
    let episode = null;
    for (let foundEpisode of foundEpisodes) {
      if (foundEpisode.type === 'episode') {
        foundEpisode = foundEpisode.episode;
      }
      if (item.epTitle && foundEpisode.title && this.formatEpisodeTitle(foundEpisode.title) === this.formatEpisodeTitle(item.epTitle)) {
        episode = foundEpisode;
        break;
      }
    }
    if (!episode) {
      throw {
        request: {
          item,
          show,
        },
        status: 404,
        text: 'Episode not found.',
      };
    }
    episode = Object.assign(episode, show);
    return episode;
  }

  /**
   * @param {import('../models/Item').Item} item
   * @param {string} slug
   * @returns {string}
   */
  getEpisodeUrl(item, slug) {
    let url = '';
    if (item.isCollection && item.epTitle) {
      url = `${this.SEARCH_URL}/episode?query=${encodeURIComponent(item.epTitle)}`;
    } else if (item.episode) {
      url = `${this.SHOWS_URL}/${slug}/seasons/${item.season}/episodes/${item.episode}?extended=images`;
    } else {
      url = `${this.SHOWS_URL}/${slug}/seasons/${item.season}?extended=images`;
    }
    return url;
  }

  /**
   * @param {string} title
   * @returns {string}
   */
  formatEpisodeTitle(title) {
    return title
      .toLowerCase()
      .replace(/(^|\s)(a|an|the)(\s)/g, '$1$3')
      .replace(/\s/g, '');
  }
}

const TraktSearch = new _TraktSearch();

export { TraktSearch };