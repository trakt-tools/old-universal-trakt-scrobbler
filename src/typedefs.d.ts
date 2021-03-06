declare type GenericObject = {
  [key: string]: any,
};

declare type TraktManualAuth = {
  callback: Function,
  tabId: number,
};

declare interface IItem {
  id: number | string,
  type: 'show' | 'movie',
  title: string,
  year: number,
  season?: number,
  episode?: number,
  episodeTitle?: string,
  isCollection?: boolean,
  trakt?: IScrobbleItem | TraktNotFound,
}

declare interface IScrobbleItem {
  id: number,
  tmdbId: number,
  type: 'show' | 'movie',
  title: string,
  year: number,
  season?: number,
  episode?: number,
  episodeTitle?: string,
  progress: number,
}

declare type TraktNotFound = {
  notFound: true,
};

declare type StorageValues = {
  auth?: TraktAuthDetails,
  currentItem?: IScrobbleItem,
  options?: StorageValuesOptions,
  traktCache?: {
    [key: string]: string,
  },
};

declare interface TraktScrobbleData {
  movie?: {
    ids: {
      trakt: number,
    },
  },
  episode?: {
    ids: {
      trakt: number,
    },
  },
  progress: number,
}

declare type TraktAuthDetails = {
  access_token: string,
  token_type: string,
  expires_in: number,
  refresh_token: string,
  scope: string,
  created_at: number,
};

declare type StorageValuesOptions = {
  allowRollbar: boolean,
  grantCookies: boolean,
  sendReceiveSuggestions: boolean,
  showNotifications: boolean,
};

declare type Options = {
  [key: string]: Option,
};

declare type Option = {
  id: keyof StorageValuesOptions,
  name: string,
  description: string,
  value: boolean,
  origins: string[],
  permissions: browser.permissions.Permission[];
};

declare type ErrorEventData = {
  error: ErrorDetails | RequestException,
};

declare type ErrorDetails = {
  message?: string,
};

declare type RequestException = {
  request: RequestDetails,
  status: number,
  text: string,
};

declare type RequestDetails = {
  url: string,
  method: string,
  body?: string | Object,
};

declare type EventDispatcherListeners = {
  [key: number]: Function[],
};

declare interface OptionEventData {
  id: string;
  checked: boolean;
}

declare type TraktSearchEpisodeItem = TraktEpisodeItem & TraktSearchShowItem;

declare interface TraktEpisodeItem {
  episode: {
    season: number;
    number: number;
    title: string;
    ids: {
      trakt: number;
      tmdb: number;
    }
  }
}

declare interface TraktSearchShowItem {
  show: {
    title: string;
    year: number;
    ids: {
      trakt: number;
      tmdb: number;
    }
  }
}

declare interface TraktSearchMovieItem {
  movie: {
    title: string;
    year: number;
    ids: {
      trakt: number;
      tmdb: number;
    }
  }
}

declare interface NrkLastSeen {
  at: string;
  percentageWatched: string;
  percentageAssumedFinished: string;
}

declare interface NrkProgramInfo {
  id: string
  title: string
  mainTitle: string
  viewCount: number
  description: string
  programType: 'Program' | 'Episode'
  seriesId: string
  episodeNumber: string
  totalEpisodesInSeason: string
  episodeNumberOrDate: string
  seasonNumber: string
  productionYear: number
}

declare interface NetflixMetadataResponse {
  value: {
    videos: {[key: number]: NetflixMetadataItem}; //TODO verify {Object<string, NetflixMetadataItem>} value.videos
  }
}

declare type NetflixMetadataItem = NetflixMetadataShowItem|NetflixMetadataMovieItem;

declare interface NetflixMetadataShowItem {
  releaseYear: number;
  summary: {
    episode: number;
    id: number;
    season: number;
  }
}

declare interface NetflixMetadataMovieItem {
  releaseYear: number;
  summary: {
    id: number;
  }
}

declare interface ScrobbleEventData {
  item: IScrobbleItem,
  scrobbleType: number,
  error: RequestException,
}

declare interface ScrobbleProgressEventData {
  progress: number,
}

declare interface NetflixSingleMetadataItem {
  video: NetflixMetadataShow | NetflixMetadataMovie,
}

declare interface NetflixMetadataGeneric {
  id: number,
  title: string,
  type: 'show' | 'movie',
  year: number,
}

declare type NetflixMetadataShow = NetflixMetadataGeneric & {
  currentEpisode: number,
  seasons: NetflixMetadataShowSeason[],
};

declare interface NetflixMetadataShowSeason {
  episodes: NetflixMetadataShowEpisode[],
  seq: number,
  shortName: string,
}

declare interface NetflixMetadataShowEpisode {
  id: number,
  seq: number,
  title: string,
}

declare type NetflixMetadataMovie = NetflixMetadataGeneric & {
};

declare interface NetflixSession {
  currentTime: number,
  duration: number,
  paused: boolean,
  playing: boolean,
  videoId: number,
}

declare interface IScrobbleParser {
  parseItem(): Promise<IItem>,
}

declare interface HboGoSession {
  content: HboGoMetadataItem,
  playing: boolean,
  paused: boolean,
  progress: number,
}

declare type HboGoMetadataItem = HboGoMetadataShowItem | HboGoMetadataMovieItem;

declare interface HboGoMetadataShowItem {
  Category: 'Series'
  Id: string
  Index: number
  Name: string
  ProductionYear: number
  SeasonIndex: number
  SeriesName: string
}

declare interface HboGoMetadataMovieItem {
  Category: 'Movies'
  Id: string
  Name: string
  ProductionYear: number
}

declare interface AmazonPrimeSession {
  playing: boolean,
  paused: boolean,
  progress: number,
}

declare interface AmazonPrimeMetadataItem {
  catalogMetadata: {
    catalog: {
      entityType: 'TV Show' | 'Movie',
      episodeNumber?: number,
      id: string,
      title: string,
    },
    family?: {
      tvAncestors: [
        {
          catalog: {
            seasonNumber: number,
          }
        },
        {
          catalog: {
            title: string,
          }
        }
      ]
    }
  }
}