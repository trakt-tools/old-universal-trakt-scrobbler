import { Item } from '../../../models/Item';
import { Requests } from '../../../services/Requests';
import { Errors } from '../../../services/Errors';

class _AmazonPrimeApi {
  API_URL: string;
  sessionListener: Function;

  constructor() {
    this.API_URL = 'https://atv-ps.primevideo.com';

    this.sessionListener = null;

    this.getItem = this.getItem.bind(this);
    this.parseMetadata = this.parseMetadata.bind(this);
  }

  async getItem(id: string): Promise<Item> {
    let item: Item = null;
    try {
      const responseText = await Requests.send({
        url: `${this.API_URL}/cdp/catalog/GetPlaybackResources?asin=${id}&consumptionType=Streaming&desiredResources=CatalogMetadata&deviceID=21de9f61b9ea631b704325f9bb991dd53891cdebfddeb6c73ce1efad&deviceTypeID=AOAGZA014O5RE&firmware=1&gascEnabled=true&resourceUsage=CacheResources&videoMaterialType=Feature&titleDecorationScheme=primary-content&uxLocale=en_US`,
        method: 'GET',
      });
      item = this.parseMetadata(JSON.parse(responseText));
    } catch (err) {
      Errors.error('Failed to get item.', err);
      item = null;
    }
    return item;
  }

  parseMetadata(metadata: AmazonPrimeMetadataItem): Item {
    let item: Item = null;
    const id = metadata.catalogMetadata.catalog.id;
    const type = metadata.catalogMetadata.catalog.entityType === 'TV Show' ? 'show' : 'movie';
    const year: number = null;
    if (type === 'show') {
      const title = metadata.catalogMetadata.family.tvAncestors[1].catalog.title;
      const season = metadata.catalogMetadata.family.tvAncestors[0].catalog.seasonNumber;
      const episode = metadata.catalogMetadata.catalog.episodeNumber;
      const episodeTitle = metadata.catalogMetadata.catalog.title;
      const isCollection = false;
      item = new Item({ id, type, title, year, isCollection, season, episode, episodeTitle });
    } else {
      const title = metadata.catalogMetadata.catalog.title;
      item = new Item({ id, type, title, year });
    }
    return item;
  }
}

const AmazonPrimeApi = new _AmazonPrimeApi();

export { AmazonPrimeApi };