import { BrowserAction } from '../../../services/BrowserAction';
import { BrowserStorage } from '../../../services/BrowserStorage';
import { Errors } from '../../../services/Errors';
import { Notifications } from '../../../services/Notifications';
import { AmazonPrimeController } from './AmazonPrimeController';
import { AmazonPrimeEvents } from './AmazonPrimeEvents';

init();

async function init() {
  browser.isBackgroundPage = false;
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
  AmazonPrimeController.startListeners();
  AmazonPrimeEvents.startListeners();
}