import { Box, Typography } from '@material-ui/core';
import * as React from 'react';
import { PopupInfo } from './PopupInfo';
import { PopupTmdbImage } from './PopupTmdbImage';
import { ScrobbleItem } from '../../../models/ScrobbleItem';

interface IPopupWatching {
  item: ScrobbleItem,
}

const PopupWatching: React.FC<IPopupWatching> = ({ item }) => {
  return (
    <Box>
      <PopupTmdbImage item={item}/>
      <Box className="popup-watching--overlay-color"/>
      <Box className="popup-watching--content">
        <PopupInfo>
          <Typography variant="overline">{browser.i18n.getMessage('nowScrobbling')}</Typography>
          {item.type === 'show' ? (
            <>
              <Typography variant="h6">{item.episodeTitle}</Typography>
              <Typography variant="subtitle2">{browser.i18n.getMessage('from')}</Typography>
              <Typography variant="subtitle1">{item.title}</Typography>
            </>
          ) : (
            <Typography variant="h6">{item.title}</Typography>
          )}
        </PopupInfo>
      </Box>
    </Box>
  );
};

export { PopupWatching };