import { Button, Typography } from '@material-ui/core';
import * as React from 'react';
import { Messaging } from '../../../services/Messaging';
import { PopupInfo } from '../components/PopupInfo';

const AboutPage: React.FC = () => {
  async function onLinkClick(url: string): Promise<void> {
    await Messaging.toBackground({ action: 'create-tab', url });
  }

  return (
    <PopupInfo>
      <Typography variant="h6">{browser.i18n.getMessage('aboutMessage')}</Typography>
      <Button
        color="secondary"
        onClick={() => onLinkClick('https://github.com/trakt-tools/universal-trakt-scrobbler')}
        variant="contained"
      >
        {browser.i18n.getMessage('readMore')}
      </Button>
    </PopupInfo>
  );
};

export { AboutPage };