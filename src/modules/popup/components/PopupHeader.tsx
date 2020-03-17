import { AppBar, Button, Toolbar } from '@material-ui/core';
import * as React from 'react';
import { UtsLeftRight } from '../../../components/UtsLeftRight';
import { Messaging } from '../../../services/Messaging';
import { Session } from '../../../services/Session';
import { History } from 'history';

interface IPopupHeader {
  history: History,
  isLoggedIn: boolean,
}

const PopupHeader: React.FC<IPopupHeader> = ({ history, isLoggedIn }) => {
  function onRouteClick(path: string) {
    history.push(path);
  }

  async function onLinkClick(url: string): Promise<void> {
    await Messaging.toBackground({ action: 'create-tab', url });
  }

  async function onLogoutClick(): Promise<void> {
    await Session.logout();
  }

  return (
    <AppBar
      className="popup-header"
      position="sticky"
    >
      <Toolbar>
        <UtsLeftRight
          centerVertically={true}
          left={(
            <>
              <Button
                color="inherit"
                onClick={() => onRouteClick('/home')}
              >
                {browser.i18n.getMessage('home')}
              </Button>
              <Button
                color="inherit"
                onClick={() => onRouteClick('/about')}
              >
                {browser.i18n.getMessage('about')}
              </Button>
              <Button
                color="inherit"
                onClick={() => onLinkClick(browser.runtime.getURL('html/options.html'))}
              >
                {browser.i18n.getMessage('options')}
              </Button>
            </>
          )}
          right={isLoggedIn  && (
            <Button
              color="inherit"
              onClick={onLogoutClick}
            >
              {browser.i18n.getMessage('logout')}
            </Button>
          )}
        />
      </Toolbar>
    </AppBar>
  );
};

export { PopupHeader };