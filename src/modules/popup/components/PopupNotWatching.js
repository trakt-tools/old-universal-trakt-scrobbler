import { Typography } from '@material-ui/core';
import React from 'react';
import { PopupInfo } from './PopupInfo';

function PopupNotWatching() {
  return (
    <PopupInfo>
      <Typography variant="h6">{browser.i18n.getMessage('notWatching')}</Typography>
    </PopupInfo>
  );
}

export { PopupNotWatching };