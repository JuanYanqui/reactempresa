import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import AppWrapper from './AppWrapper';
import reportWebVitals from './reportWebVitals';
import Keycloak from 'keycloak-js';
import UsuarioService from './service/UsuarioService';

const keycloakConfig = {
  realm: "prueba",
  url: "http://127.0.0.1:8080/auth/",
  clientId: "restcli",
  port: 0,
  onLoad: 'login-required',
};

const initKeycloak = () => {
  const keycloak = new Keycloak(keycloakConfig);
  return new Promise((resolve, reject) => {
    keycloak.init({ onLoad: 'login-required' })
      .then((authenticated) => {
        if (authenticated) {
          localStorage.setItem('keycloakConfig', JSON.stringify(keycloakConfig));
          resolve(keycloak);
        } else {
          reject(new Error('User not authenticated'));
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const updateTokenAndLogin = (keycloak) => {
  return new Promise((resolve, reject) => {
    keycloak.updateToken(5) // 5 seconds before the token expires
      .then((refreshed) => {
        if (refreshed) {
          // Token refreshed successfully
          console.log('Token refreshed:', keycloak.token);
          resolve();
        } else {
          // Token could not be refreshed, user needs to log in again
          console.log('Token not refreshed, user needs to log in again.');
          reject(new Error('Token not refreshed'));
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

initKeycloak()
  .then((keycloak) => {
    // Save user info in local storage
    const usuario = keycloak.idTokenParsed.preferred_username;
    const firstName = keycloak.idTokenParsed.given_name;
    const lastName = keycloak.idTokenParsed.family_name;
    const email = keycloak.idTokenParsed.email;

    localStorage.setItem('usernamecap', usuario);
    localStorage.setItem('nombrecap', firstName);
    localStorage.setItem('apellidocap', lastName);
    localStorage.setItem('emailcap', email);

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
      <React.StrictMode>
        <HashRouter>
          <AppWrapper />
        </HashRouter>
      </React.StrictMode>
    );

    // Periodically update the token to keep the user session active
    setInterval(() => {
      updateTokenAndLogin(keycloak)
        .catch((error) => {
          console.error('Error refreshing token:', error);
        });
    }, 60000); // Refresh token every 60 seconds (adjust the interval as needed)

    reportWebVitals();
  })
  .catch((error) => {
    console.error('Error initializing Keycloak:', error);
  });
