import { Snackbar } from '@material-ui/core';
import {Alert, Color} from '@material-ui/lab';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { EventDispatcher, Events } from '../services/Events';

interface SnackbarData {
  messageName: string;
  messageArgs: string[];
  severity: Color;
}

interface SnackBarState {
  isOpen: boolean;
  message: string;
  severity: Color
}

const UtsSnackbar: React.FC = () => {
  const [snackbar, setSnackbar] = useState<SnackBarState>({
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
      EventDispatcher.subscribe(Events.SNACKBAR_SHOW, showSnackbar);
    }

    function stopListeners() {
      EventDispatcher.unsubscribe(Events.SNACKBAR_SHOW, showSnackbar);
    }

    function showSnackbar(data: SnackbarData) {
      setSnackbar({
        isOpen: true,
        message: browser.i18n.getMessage(data.messageName, data.messageArgs || []),
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
};

export { UtsSnackbar };