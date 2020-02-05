import { CircularProgress, Container } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { UtsCenter } from '../../components/UtsCenter';
import { UtsDialog } from '../../components/UtsDialog';
import { UtsSnackbar } from '../../components/UtsSnackbar';
import { BrowserStorage } from '../../services/BrowserStorage';
import { Errors } from '../../services/Errors';
import { Events } from '../../services/Events';
import { OptionsActions } from './components/OptionsActions';
import { OptionsHeader } from './components/OptionsHeader';
import { OptionsList } from './components/OptionsList';

function OptionsApp() {
  const [content, setContent] = useState({
    isLoading: true,
    options: {},
  });

  /**
   * @returns {Promise}
   */
  async function resetOptions() {
    setContent({
      isLoading: false,
      options: await BrowserStorage.getOptions(),
    });
  }

  useEffect(() => {
    function startListeners() {
      Events.subscribe(Events.OPTIONS_CLEAR, resetOptions);
      Events.subscribe(Events.OPTION_CHANGE, onOptionChange);
    }

    function stopListeners() {
      Events.unsubscribe(Events.OPTIONS_CLEAR, resetOptions);
      Events.unsubscribe(Events.OPTION_CHANGE, onOptionChange);
    }

    /**
     * @param {OptionEventData} data
     */
    function onOptionChange(data) {
      const optionsToSave = {};
      const options = {
        ...content.options,
        [data.id]: {
          ...content.options[data.id],
          value: data.checked,
        },
      };
      for (const option of Object.values(options)) {
        optionsToSave[option.id] = option.value;
      }
      const option = options[data.id];
      if (option.permissions || option.origins) {
        if (option.value) {
          browser.permissions.request({
            permissions: option.permissions || [],
            origins: option.origins || [],
          });
        } else {
          browser.permissions.remove({
            permissions: option.permissions || [],
            origins: option.origins || [],
          });
        }
      }
      BrowserStorage.set({ options: optionsToSave }, true)
        .then(async () => {
          setContent({
            isLoading: false,
            options,
          });
          await Events.dispatch(Events.SNACKBAR_SHOW, {
            messageName: 'saveOptionSuccess',
            severity: 'success',
          });
        })
        .catch(async err => {
          Errors.error('Failed to save option.', err);
          await Events.dispatch(Events.SNACKBAR_SHOW, {
            messageName: 'saveOptionFailed',
            severity: 'error',
          });
        });
    }

    startListeners();
    return stopListeners;
  }, [content]);

  useEffect(() => {
    resetOptions();
  }, []);

  return (
    <ErrorBoundary>
      <OptionsHeader/>
      <Container classes={{ root: 'options-container' }}>
        {content.isLoading ? (
          <UtsCenter>
            <CircularProgress/>
          </UtsCenter>
        ) : (
          <>
            <OptionsList options={Object.values(content.options)}/>
            <OptionsActions/>
          </>
        )}
        <UtsDialog/>
        <UtsSnackbar/>
      </Container>
    </ErrorBoundary>
  );
}

export { OptionsApp };