import { TraktAuth } from '../../api/TraktAuth';
import { BrowserStorage } from '../../services/BrowserStorage';
import { Errors } from '../../services/Errors';
import { Requests } from '../../services/Requests';
import { TraktScrobble } from '../../api/TraktScrobble';

let apiDefs = {};
let scrobblingTabId = null;

init();

async function init() {
  browser.isBackgroundPage = true;
  await BrowserStorage.sync();
  const values = await BrowserStorage.get('options');
  if (values.options && values.options.allowRollbar) {
    Errors.startRollbar();
  }
  browser.tabs.onRemoved.addListener(onTabRemoved);
  browser.runtime.onMessage.addListener(onMessage);
}

async function onTabRemoved(tabId) {
  // Check if the tab that was closed was the tab that was scrobbling, in which case, stop the scrobble.
  if (tabId === scrobblingTabId) {
    const values = await BrowserStorage.get('currentItem');
    if (values.currentItem) {
      await TraktScrobble.stop(values.currentItem);
      await BrowserStorage.remove('currentItem');
    }
    await setInactiveIcon();
    scrobblingTabId = null;
  }
}

function setActiveIcon() {
  return browser.browserAction.setIcon({
    path: browser.runtime.getURL('images/uts-icon-selected-38.png'),
  });
}

function setInactiveIcon() {
  return browser.browserAction.setIcon({
    path: browser.runtime.getURL('images/uts-icon-38.png'),
  });
}

/**
 * @param {string} request
 * @param {Object} sender
 * @returns {Promise}
 */
function onMessage(request, sender) {
  let executingAction = null;
  request = JSON.parse(request);
  switch (request.action) {
    case 'check-login': {
      executingAction = TraktAuth.validateToken();
      break;
    }
    case 'create-tab': {
      executingAction = browser.tabs.create({
        url: request.url,
        active: true,
      });
      break;
    }
    case 'finish-login': {
      executingAction = TraktAuth.finishManualAuth(request.redirectUrl);
      break;
    }
    case 'get-netflix-api-defs': {
      executingAction = Promise.resolve(apiDefs.netflix);
      break;
    }
    case 'login': {
      executingAction = TraktAuth.authorize();
      break;
    }
    case 'logout': {
      executingAction = TraktAuth.revokeToken();
      break;
    }
    case 'send-request': {
      executingAction = Requests.send(request.request);
      break;
    }
    case 'set-active-icon': {
      executingAction = setActiveIcon();
      break;
    }
    case 'set-inactive-icon': {
      executingAction = setInactiveIcon();
      break;
    }
    case 'set-netflix-api-defs': {
      apiDefs.netflix = {
        authUrl: request.authUrl,
        buildIdentifier: request.buildIdentifier,
      };
      executingAction = Promise.resolve();
      break;
    }
    case 'show-notification': {
      executingAction = browser.permissions.contains({ permissions: ['notifications'] })
        .then(hasPermissions => {
          if (hasPermissions) {
            return browser.notifications.create({
              type: 'basic',
              iconUrl: 'images/uts-icon-128.png',
              title: request.title,
              message: request.message,
            });
          }
        });
      break;
    }
    case 'start-scrobble': {
      executingAction = new Promise(async resolve => {
        if (scrobblingTabId) {
          // Stop the previous scrobble if it exists.
          const values = await BrowserStorage.get('currentItem');
          if (values.currentItem) {
            await TraktScrobble.stop(values.currentItem);
            await BrowserStorage.remove('currentItem');
          }
        }
        scrobblingTabId = sender.tab.id;
        resolve();
      });
      break;
    }
    case 'stop-scrobble': {
      scrobblingTabId = null;
      executingAction = Promise.resolve();
      break;
    }
  }
  return new Promise(resolve => {
    executingAction
      .then(response => {
        resolve(JSON.stringify(response || null));
      })
      .catch(err => {
        Errors.log('Failed to execute action.', err);
        resolve(JSON.stringify({
          error: err.message ? { message: err.message } : err,
        }));
      });
  });
}