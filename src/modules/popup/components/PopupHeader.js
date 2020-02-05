import { AppBar, Button, Toolbar } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import { UtsLeftRight } from '../../../components/UtsLeftRight';
import { Messaging } from '../../../services/Messaging';
import { Session } from '../../../services/Session';

function PopupHeader({ history, isLoggedIn }) {
  /**
   * @param {string} path
   */
  function onRouteClick(path) {
    history.push(path);
  }

  /**
   * @param {string} url
   * @returns {Promise}
   */
  async function onLinkClick(url) {
    await Messaging.toBackground({ action: 'create-tab', url });
  }

  /**
   * @returns {Promise}
   */
  async function onLogoutClick() {
    await Session.logout();
  }

  return (
    <AppBar
      classes={{ root: 'popup-header' }}
      position="sticky"
    >
      <Toolbar>
        <UtsLeftRight
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
}

PopupHeader.propTypes = {
  history: PropTypes.object.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
};

export { PopupHeader };