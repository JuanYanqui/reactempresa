import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import AppWrapper from './AppWrapper';
import reportWebVitals from './reportWebVitals';
import Keycloak from 'keycloak-js';
import { useState } from 'react';
import axios from 'axios';
import Usuarioenco from './service/UsuarioEn';
import UsuarioService from './service/UsuarioService'; 


const keycloakConfig = {
    realm: "prueba",
    url: "http://127.0.0.1:8080/auth/",
    clientId: "restcli",
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
  
  initKeycloak()
  .then((keycloak) => {
    const usuario = keycloak.idTokenParsed.preferred_username;
    const firstName = keycloak.idTokenParsed.given_name;
    const lastName = keycloak.idTokenParsed.family_name;
    const email = keycloak.idTokenParsed.email;
    

    console.log('username:', usuario);
    localStorage.setItem('usernamecap', usuario);
    console.log('Nombres:', firstName);
    localStorage.setItem('nombrecap', firstName);
    console.log('Apellidos:', lastName);
    localStorage.setItem('apellidocap', lastName);
    console.log('Email:', email);
    localStorage.setItem('emailcap', email);


    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
      <React.StrictMode>
        <HashRouter>
          <AppWrapper />
          <UsuarioService/>
        </HashRouter>
      </React.StrictMode>
    );

    reportWebVitals();
  })
  .catch((error) => {
    console.error('Error initializing Keycloak:', error);
  });
