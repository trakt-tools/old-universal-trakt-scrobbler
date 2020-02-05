/**
 * @typedef {Object} ErrorEventData
 * @property {RequestException} error
 */

/**
 * @typedef {Object} LoginEventData
 * @property {TraktAuthDetails} auth
 */

/**
 * @typedef {Object} OptionEventData
 * @property {string} id
 * @property {boolean} checked
 */

/**
 * @typedef {Object} RequestDetails
 * @property {string} url
 * @property {string} method
 * @property {string|Object<string, any>} body
 */

/**
 * @typedef {Object} RequestException
 * @property {RequestDetails} request
 * @property {number} status
 * @property {string} text
 */

/**
 * @typedef {Object} SearchEventData
 * @property {TraktSearchData} data
 */

/**
 * @typedef {Object} ScrobbleEventData
 * @property {import('./models/ScrobbleItem').ScrobbleItem} item
 * @property {number} scrobbleType
 * @property {RequestException} error
 */

/**
 * @typedef {Object} ScrobbleProgressEventData
 * @property {number} progress
 */

/**
 * @typedef {Object} StorageValues
 * @property {TraktAuthDetails} auth
 * @property {TraktSearchData} currentItem
 * @property {Object} options
 * @property {boolean} options.allowRollbar
 * @property {boolean} options.showNotifications
 * @property {boolean} options.sendReceiveCorrections
 * @property {boolean} options.grantCookies
 * @property {Object} traktCache
 */

/**
 * @typedef {Object} TraktAuthDetails
 * @property {string} access_token
 * @property {string} token_type
 * @property {number} expires_in
 * @property {string} refresh_token
 * @property {string} scope
 * @property {number} created_at
 */

/**
 * @typedef {Object} TraktEpisodeDetails
 * @property {'episode'} type
 * @property {number} score
 * @property {Object} episode
 * @property {number} episode.season
 * @property {number} episode.number
 * @property {string} episode.title
 * @property {Object} episode.ids
 * @property {number} episode.ids.trakt
 * @property {number} episode.ids.tvdb
 * @property {number} episode.ids.tmdb
 * @property {Object} show
 * @property {string} show.title
 * @property {number} show.year
 * @property {Object} show.ids
 * @property {number} show.ids.trakt
 * @property {string} show.ids.slug
 * @property {number} show.ids.tvdb
 * @property {string} show.ids.imdb
 * @property {number} show.ids.tmdb
 */

/**
 * @typedef {Object} TraktManualAuth
 * @property {Function} callback
 * @property {number} tabId
 */

/**
 * @typedef {Object} TraktMovieDetails
 * @property {string} type
 * @property {number} score
 * @property {Object} movie
 * @property {string} movie.title
 * @property {number} movie.year
 * @property {Object} movie.ids
 * @property {number} movie.ids.trakt
 * @property {string} movie.ids.slug
 * @property {string} movie.ids.imdb
 * @property {number} movie.ids.tmdb
 */

/**
 * @typedef {TraktMovieDetails|TraktShowDetails|TraktEpisodeDetails} TraktSearchData
 */

/**
 * @typedef {Object} TraktShowDetails
 * @property {'show'} type
 * @property {number} score
 * @property {Object} show
 * @property {string} show.title
 * @property {number} show.year
 * @property {Object} show.ids
 * @property {number} show.ids.trakt
 * @property {string} show.ids.slug
 * @property {number} show.ids.tvdb
 * @property {string} show.ids.imdb
 * @property {number} show.ids.tmdb
 */