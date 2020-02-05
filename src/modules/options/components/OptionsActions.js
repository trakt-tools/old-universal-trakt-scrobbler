import { Box, Button, Divider } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { BrowserStorage } from '../../../services/BrowserStorage';
import { Events } from '../../../services/Events';

function OptionsActions() {
  const [cacheSize, setCacheSize] = useState('0 B');

  /**
   * @returns {Promise}
   */
  async function updateTraktCacheSize() {
    setCacheSize(await BrowserStorage.getSize('traktCache'));
  }

  /**
   * @returns {Promise}
   */
  async function onClearStorageClick() {
    await Events.dispatch(Events.DIALOG_SHOW, {
      title: browser.i18n.getMessage('confirmClearStorageTitle'),
      message: browser.i18n.getMessage('confirmClearStorageMessage'),
      onConfirm: async () => {
        try {
          await BrowserStorage.clear(true);
          await Events.dispatch(Events.SNACKBAR_SHOW, {
            messageName: 'clearStorageSuccess',
            severity: 'success',
          });
          await Events.dispatch(Events.OPTIONS_CLEAR, {});
          updateTraktCacheSize();
        } catch (err) {
          Errors.error('Failed to clear storage.', err);
          await Events.dispatch(Events.SNACKBAR_SHOW, {
            messageName: 'clearStorageFailed',
            severity: 'error',
          });
        }
      },
    });
  }

  /**
   * @returns {Promise}
   */
  async function onClearTraktCacheClick() {
    await Events.dispatch(Events.DIALOG_SHOW, {
      title: browser.i18n.getMessage('confirmClearTraktCacheTitle'),
      message: browser.i18n.getMessage('confirmClearTraktCacheMessage'),
      onConfirm: async () => {
        try {
          await BrowserStorage.remove('traktCache');
          await Events.dispatch(Events.SNACKBAR_SHOW, {
            messageName: 'clearTraktCacheSuccess',
            severity: 'success',
          });
          updateTraktCacheSize();
        } catch (err) {
          Errors.error('Failed to clear Trakt cache.', err);
          await Events.dispatch(Events.SNACKBAR_SHOW, {
            messageName: 'clearTraktCacheFailed',
            severity: 'error',
          });
        }
      },
    });
  }

  useEffect(() => {
    updateTraktCacheSize();
  }, []);

  return (
    <Box classes={{ root: 'options-actions--container' }}>
      <Divider/>
      <Box classes={{ root: 'options-actions' }}>
        <Button
          onClick={onClearStorageClick}
          variant="contained"
        >
          {browser.i18n.getMessage('clearStorage')}
        </Button>
        <Button
          onClick={onClearTraktCacheClick}
          variant="contained"
        >
          {browser.i18n.getMessage('clearTraktCache')} (<span>{cacheSize}</span>)
        </Button>
      </Box>
    </Box>
  );
}

export { OptionsActions };