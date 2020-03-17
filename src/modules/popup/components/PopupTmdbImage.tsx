import { Box } from '@material-ui/core';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { secrets } from '../../../secrets';
import { Errors } from '../../../services/Errors';
import { Requests } from '../../../services/Requests';
import { ScrobbleItem } from '../../../models/ScrobbleItem';

interface IPopupTmdbImage {
  item: ScrobbleItem,
}

const PopupTmdbImage: React.FC<IPopupTmdbImage> = ({ item }) => {
  const [imageConfig, setImageConfig] = useState({
    host: null,
    width: {
      movie: null,
      show: null,
    }
  });
  const [imageUrl, setImageUrl] = useState('https://trakt.tv/assets/placeholders/thumb/poster-2d5709c1b640929ca1ab60137044b152.png');

  useEffect(() => {
    async function getConfig(): Promise<void> {
      try {
        const responseText = await Requests.send({
          url: `https://api.themoviedb.org/3/configuration?api_key=${secrets.tmdbApiKey}`,
          method: 'GET',
        });
        const responseJson = JSON.parse(responseText);
        setImageConfig({
          host: responseJson.images.secure_base_url,
          width: {
            movie: responseJson.images.poster_sizes[2],
            show: responseJson.images.still_sizes[2],
          },
        });
      } catch (err) {
        Errors.warning('Failed to get TMDB config.', err);
      }
    }

    getConfig();
  }, []);

  useEffect(() => {
    async function getImageUrl(): Promise<void> {
      if (item && item.tmdbId && imageConfig.host) {
        try {
          const responseText = await Requests.send({
            url: getApiUrl(),
            method: 'GET',
          });
          const responseJson = JSON.parse(responseText);
          if (!responseJson.status_code || responseJson.status_code !== 25) {
            const imageKey = item.type === 'show' ? 'stills' : 'posters';
            const image = responseJson[imageKey][0];
            if (image) {
              setImageUrl(`${imageConfig.host}${imageConfig.width[item.type]}${image.file_path}`);
            }
          }
        } catch (err) {
          Errors.warning('Failed to find item on TMDB.', err);
        }
      }
    }

    function getApiUrl(): string {
      let type = '';
      let path = '';
      if (item.type === 'show') {
        type = 'tv';
        path = `${item.tmdbId}/season/${item.season}/episode/${item.episode}`;
      } else {
        type = 'movie';
        path = item.tmdbId.toString();
      }
      return `https://api.themoviedb.org/3/${type}/${path}/images?api_key=${secrets.tmdbApiKey}`;
    }

    getImageUrl();
  }, [imageConfig, item]);

  return (
    <Box
      className="popup-watching--overlay-image"
      style={{ backgroundImage: `url(${imageUrl})` }}
    ></Box>
  );
};

export { PopupTmdbImage };