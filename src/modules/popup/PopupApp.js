import { Box } from '@material-ui/core';
import { createBrowserHistory } from 'history';
import React, { useEffect, useState } from 'react';
import { Redirect, Route, Router, Switch } from 'react-router-dom';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { Events } from '../../services/Events';
import { Session } from '../../services/Session';
import { PopupHeader } from './components/PopupHeader';
import { AboutPage } from './pages/AboutPage';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';

const history =  createBrowserHistory();

function PopupApp() {
  const [isLoggedIn, setLoggedIn] = useState(Session.isLoggedIn);

  useEffect(() => {
    function startListeners() {
      Events.subscribe(Events.LOGIN_SUCCESS, onLogin);
      Events.subscribe(Events.LOGOUT_SUCCESS, onLogout);
    }

    function stopListeners() {
      Events.unsubscribe(Events.LOGIN_SUCCESS, onLogin);
      Events.unsubscribe(Events.LOGOUT_SUCCESS, onLogout);
    }

    function onLogin() {
      setLoggedIn(true);
    }

    function onLogout() {
      setLoggedIn(false);
      history.push('/login');
    }

    startListeners();
    return stopListeners;
  }, []);

  return (
    <ErrorBoundary>
      <PopupHeader
        history={history}
        isLoggedIn={isLoggedIn}
      />
      <Box classes={{ root: 'popup-container' }}>
        <Box classes={{ root: 'popup-container--overlay-image' }}/>
        <Box classes={{ root: 'popup-container--overlay-color' }}/>
        <Box classes={{ root: 'popup-container--content' }}>
          <Router history={history}>
            <Switch>
              <Route
                component={LoginPage}
                path="/login"
              />
              <Route
                component={HomePage}
                path="/home"
              />
              <Route
                component={AboutPage}
                path="/about"
              />
              <Redirect to="/login"/>
            </Switch>
          </Router>
        </Box>
      </Box>
    </ErrorBoundary>
  );
}

export { PopupApp };