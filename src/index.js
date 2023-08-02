import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import AppWrapper from './AppWrapper';
import reportWebVitals from './reportWebVitals';
import Keycloak from 'keycloak-js';
const _kc = new Keycloak('/keycloak.json');

const keycloakConfig = {
    realm: "react-keyclock",
    url: "http://127.0.0.1:8080/auth/",
    clientId: "restcli",
    clientSecret: "7da19512-f77d-45de-898f-de276c643875",
    beareronly: true,
    onLoad: 'login-required',
  };
  


const initKeycloak = () => {
    const keycloak = new Keycloak(keycloakConfig);
    return new Promise((resolve, reject) => {
      keycloak.init({ onLoad: 'login-required' })
        .then((authenticated) => {
          if (authenticated) {
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
  
  initKeycloak()
    .then((keycloak) => {
      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(
        <React.StrictMode>
          <HashRouter>
            <AppWrapper />
          </HashRouter>
        </React.StrictMode>
      );
      
      reportWebVitals();
    })
    .catch((error) => {
      console.error('Error initializing Keycloak:', error);
      
    });