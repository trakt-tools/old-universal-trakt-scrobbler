import { Box } from '@material-ui/core';
import { createBrowserHistory } from 'history';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Redirect, Route, Router, Switch } from 'react-router-dom';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { Events, EventDispatcher } from '../../services/Events';
import { Session } from '../../services/Session';
import { PopupHeader } from './components/PopupHeader';
import { AboutPage } from './pages/AboutPage';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';

const history =  createBrowserHistory();

const PopupApp: React.FC = () => {
  const [isLoggedIn, setLoggedIn] = useState(Session.isLoggedIn);

  useEffect(() => {
    function startListeners() {
      EventDispatcher.subscribe(Events.LOGIN_SUCCESS, onLogin);
      EventDispatcher.subscribe(Events.LOGOUT_SUCCESS, onLogout);
    }

    function stopListeners() {
      EventDispatcher.unsubscribe(Events.LOGIN_SUCCESS, onLogin);
      EventDispatcher.unsubscribe(Events.LOGOUT_SUCCESS, onLogout);
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
      <Box className="popup-container">
        <Box className="popup-container--overlay-image"/>
        <Box className="popup-container--overlay-color"/>
        <Box className="popup-container--content">
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
};

export { PopupApp };