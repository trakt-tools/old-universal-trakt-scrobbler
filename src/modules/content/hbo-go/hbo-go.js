import { BrowserAction } from '../../../services/BrowserAction';
import { BrowserStorage } from '../../../services/BrowserStorage';
import { Errors } from '../../../services/Errors';
import { Notifications } from '../../../services/Notifications';
import { HboGoController } from './HboGoController';
import { HboGoEvents } from './HboGoEvents';

init();

async function init() {
  browser.isBackgroundPage = false;
  addSessionEvent();
  await BrowserStorage.sync();
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
  HboGoController.startListeners();
  HboGoEvents.startListeners();
}

function addSessionEvent() {
  if (!window.wrappedJSObject) {
    // Chrome does not allow accessing page objects from extensions, so we need to inject a script into the page and exchange messages in order to access the global sdk object.
    const script = document.createElement('script');
    script.textContent = `
      window.addEventListener('uts-sendSession', () => {
        let session;
        if (sdk) {
          const content = sdk.analytics.content;
          const progress = sdk.player.currentPlaybackProgress.source._value.progressPercent;
          const paused = sdk.analytics.paused;
          const playing = typeof progress !== 'undefined' && !paused;
          session = JSON.stringify((typeof progress !== 'undefined' && content && { content, playing, paused, progress }) || null);
        }
        const event = new CustomEvent('uts-receiveSession', {
          detail: { session },
        });
        window.dispatchEvent(event);
      });
    `;
    document.body.appendChild(script);
  }
}