import React from 'react';
import ReactDOM from 'react-dom';
import '../../assets/assets';
import { BrowserStorage } from '../../services/BrowserStorage';
import { Errors } from '../../services/Errors';
import { PopupApp } from './PopupApp';

init();

async function init() {
  browser.isBackgroundPage = false;
  if (BrowserStorage.isSyncAvailable) {
    await BrowserStorage.sync();
  }
  const values = await BrowserStorage.get('options');
  if (values.options && values.options.allowRollbar) {
    Errors.startRollbar();
  }
  const root = document.querySelector('#root');
  ReactDOM.render(<PopupApp/>, root);
}