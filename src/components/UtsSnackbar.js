import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React, { useEffect, useState } from 'react';
import { Events } from '../services/Events';

function UtsSnackbar() {
  const [snackbar, setSnackbar] = useState({
    isOpen: false,
    message: '',
    severity: 'info',
  });

  function closeSnackbar() {
    setSnackbar(prevSnackbar => ({
      ...prevSnackbar,
      isOpen: false,
    }));
  }

  useEffect(() => {
    function startListeners() {
      Events.subscribe(Events.SNACKBAR_SHOW, showSnackbar);
    }

    function stopListeners() {
      Events.unsubscribe(Events.SNACKBAR_SHOW, showSnackbar);
    }

    /**
     * @param {Object} data
     */
    function showSnackbar(data) {
      setSnackbar({
        isOpen: true,
        message: browser.i18n.getMessage(data.messageName),
        severity: data.severity,
      });
    }

    startListeners();
    return stopListeners;
  }, []);

  return (
    <Snackbar
      autoHideDuration={3000}
      onClose={closeSnackbar}
      open={snackbar.isOpen}
    >
      <Alert
        elevation={6}
        severity={snackbar.severity}
        variant="filled"
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
}

export { UtsSnackbar };