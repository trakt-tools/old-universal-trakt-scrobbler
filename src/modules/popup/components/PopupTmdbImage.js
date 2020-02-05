import { Box } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { secrets } from '../../../secrets';
import { Errors } from '../../../services/Errors';
import { Requests } from '../../../services/Requests';

function PopupTmdbImage({ item }) {
  const [imageConfig, setImageConfig] = useState({
    host: null,
    width: {
      movie: null,
      show: null,
    }
  });
  const [imageUrl, setImageUrl] = useState('https://trakt.tv/assets/placeholders/thumb/poster-2d5709c1b640929ca1ab60137044b152.png');

  useEffect(() => {
    /**
     * @returns {Promise}
     */
    async function getConfig() {
      try {
        const text = await Requests.send({
          url: `https://api.themoviedb.org/3/configuration?api_key=${secrets.tmdbApiKey}`,
          method: 'GET',
        });
        const json = JSON.parse(text);
        setImageConfig({
          host: json.images.secure_base_url,
          width: {
            movie: json.images.poster_sizes[2],
            show: json.images.still_sizes[2],
          },
        });
      } catch (err) {
        Errors.warning('Failed to get TMDB config.', err);
      }
    }

    getConfig();
  }, []);

  useEffect(() => {
    /**
     * @returns {Promise}
     */
    async function getImageUrl() {
      if (item && item.ids && item.ids.tmdb && imageConfig.host) {
        try {
          const text = await Requests.send({
            url: getApiUrl(),
            method: 'GET',
          });
          const json = JSON.parse(text);
          if (!json.status_code || json.status_code !== 25) {
            const imageKey = item.type === 'show' ? 'stills' : 'posters';
            const image = json[imageKey][0];
            if (image) {
              setImageUrl(`${imageConfig.host}${imageConfig.width[item.type]}${image.file_path}`);
            }
          }
        } catch (err) {
          Errors.warning('Failed to find item on TMDB.', err);
        }
      }
    }

    /**
     * @returns {string}
     */
    function getApiUrl() {
      let type = '';
      let path = '';
      if (item.type === 'show') {
        type = 'tv';
        path = `${item.show.ids.tmdb}/season/${item.season}/episode/${item.number}`;
      } else {
        type = 'movie';
        path = item.ids && item.ids.tmdb;
      }
      return `https://api.themoviedb.org/3/${type}/${path}/images?api_key=${secrets.tmdbApiKey}`;
    }

    getImageUrl();
  }, [imageConfig, item]);

  return (
    <Box
      classes={{ root: 'popup-watching--overlay-image' }}
      style={{ backgroundImage: `url(${imageUrl})` }}
    ></Box>
  );
}

PopupTmdbImage.propTypes = {
  item: PropTypes.object.isRequired,
};

export { PopupTmdbImage };