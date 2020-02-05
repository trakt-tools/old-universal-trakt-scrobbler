import { Box, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import { PopupInfo } from './PopupInfo';
import { PopupTmdbImage } from './PopupTmdbImage';

function PopupWatching({ item }) {
  return (
    <Box>
      <PopupTmdbImage item={item}/>
      <Box classes={{ root: 'popup-watching--overlay-color' }}/>
      <Box classes={{ root: 'popup-watching--content' }}>
        <PopupInfo>
          <Typography variant="overline">{browser.i18n.getMessage('nowScrobbling')}</Typography>
          {item.show ? (
            <>
              <Typography variant="h6">{item.title}</Typography>
              <Typography variant="subtitle2">{browser.i18n.getMessage('from')}</Typography>
              <Typography variant="subtitle1">{item.show.title}</Typography>
            </>
          ) : (
            <Typography variant="h6">{item.title}</Typography>
          )}
        </PopupInfo>
      </Box>
    </Box>
  );
}

PopupWatching.propTypes = {
  item: PropTypes.object.isRequired,
};

export { PopupWatching };
