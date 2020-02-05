import { BrowserAction } from '../../../services/BrowserAction';
import { BrowserStorage } from '../../../services/BrowserStorage';
import { Errors } from '../../../services/Errors';
import { Messaging } from '../../../services/Messaging';
import { Notifications } from '../../../services/Notifications';
import { NetflixController } from './NetflixController';
import { NetflixEvents } from './NetflixEvents';

init();

async function init() {
  browser.isBackgroundPage = false;
  getApiDefs();
  if (BrowserStorage.isSyncAvailable) {
    await BrowserStorage.sync();
  }
  const values = await BrowserStorage.get('options');
  if (values.options) {
    if (values.options.allowRollbar) {
      Errors.startRollbar();
      Errors.startListeners();
    }
    if (values.options.showNotifications) {
      Notifications.startListeners();
    }
  }
  BrowserAction.startListeners();
  NetflixController.startListeners();
  NetflixEvents.startListeners();
}

/**
 * @returns {Promise}
 */
async function getApiDefs() {
  try {
    if (window.wrappedJSObject) {
      // Firefox wraps page objects, so we can access the global netflix object by unwrapping it.
      let authUrl = '';
      let buildIdentifier = '';
      const netflix = window.wrappedJSObject.netflix;
      if (netflix) {
        authUrl = netflix.reactContext.models.userInfo.data.authURL;
        buildIdentifier = netflix.reactContext.models.serverDefs.data.BUILD_IDENTIFIER;
        XPCNativeWrapper(window.wrappedJSObject.netflix);
      }
      if (authUrl && buildIdentifier) {
        await Messaging.toBackground({ action: 'set-netflix-api-defs', authUrl, buildIdentifier });
      }
    } else {
      // Chrome does not allow accessing page objects from extensions, so we need to inject a script into the page and exchange messages in order to access the global netflix object.
      const script = document.createElement('script');
      script.textContent = `
        window.addEventListener('uts-sendApiDefs', () => {
          let authUrl = '';
          let buildIdentifier = '';
          if (netflix) {
            authUrl = netflix.reactContext.models.userInfo.data.authURL;
            buildIdentifier = netflix.reactContext.models.serverDefs.data.BUILD_IDENTIFIER;
          }
          const event = new CustomEvent('uts-receiveApiDefs', {
            detail: { authUrl, buildIdentifier },
          });
          window.dispatchEvent(event);
        });
        window.addEventListener('uts-sendSession', () => {
          let session;
          if (netflix) {
            const sessions = netflix.appContext.state.playerApp.getState().videoPlayer.playbackStateBySessionId;
            const currentId = Object.keys(sessions)
              .filter(id => id.startsWith('watch'))[0];
            session = JSON.stringify((currentId && Object.assign({}, sessions[currentId])) || null);
          }
          const event = new CustomEvent('uts-receiveSession', {
            detail: { session },
          });
          window.dispatchEvent(event);
        });
      `;
      document.body.appendChild(script);
      window.addEventListener('uts-receiveApiDefs', receiveApiDefs, false);
      const event = new CustomEvent('uts-sendApiDefs');
      window.dispatchEvent(event);
    }
  } catch (err) {
    Errors.log('Failed to set API defs.', err);
  }
}

/**
 * @param {Event} event
 * @returns {Promise}
 */
async function receiveApiDefs(event) {
  window.removeEventListener('uts-receiveApiDefs', receiveApiDefs);
  const { authUrl, buildIdentifier } = event.detail;
  if (authUrl && buildIdentifier) {
    await Messaging.toBackground({ action: 'set-netflix-api-defs', authUrl, buildIdentifier });
  }
}