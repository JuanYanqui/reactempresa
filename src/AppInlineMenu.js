import { CSSTransition } from 'react-transition-group';
import { classNames } from 'primereact/utils';
import { useContext, useRef } from 'react';
import { RTLContext } from './App';
import { Tooltip } from 'primereact/tooltip';
import { useQuery } from 'react-query'; 
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const handleLogout = () => {
    localStorage.removeItem('usernamecap');
   localStorage.removeItem('nombrecap');
   localStorage.removeItem('apellidocap');
   localStorage.removeItem('emailcap');

    const keycloakConfig = JSON.parse(localStorage.getItem('keycloakConfig'));
    window.location.href = keycloakConfig.url + 'realms/' + keycloakConfig.realm + '/protocol/openid-connect/logout?redirect_uri=' + encodeURIComponent(window.location.origin);
};
const AppInlineMenu = (props) => {
    const inlineMenuRef = useRef(null);
    const isRTL = useContext(RTLContext);
    const menuKey = props.menuKey || 'inline-menu';

    const inlineMenuClassName = classNames(
        'layout-inline-menu',
        {
            'layout-inline-menu-active': props.inlineMenuActive[props.menuKey]
        },
        props.className
    );

    const isSlim = () => {
        return props.menuMode === 'slim';
    };

    const [usuario, setUsuario] = useState(localStorage.getItem('usernamecap'));

    useEffect(() => {
      const handleStorageUpdate = () => {
        setUsuario(localStorage.getItem('usernamecap'));
      };
  
      window.addEventListener('storageUpdated', handleStorageUpdate);
  
      return () => {
        window.removeEventListener('storageUpdated', handleStorageUpdate);
      };
    }, []);


};

export default AppInlineMenu;

