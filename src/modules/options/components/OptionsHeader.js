import { AppBar, Toolbar, Typography } from '@material-ui/core';
import React from 'react';

function OptionsHeader() {
  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6">{browser.i18n.getMessage('options')}</Typography>
      </Toolbar>
    </AppBar>
  );
}

export { OptionsHeader };