import React, { useEffect, useRef, useState } from 'react';
import { classNames } from 'primereact/utils';
import { Route, Routes, useLocation } from 'react-router-dom';

import AppTopbar from './AppTopbar';
import AppInlineMenu from './AppInlineMenu';
import AppMenu from './AppMenu';
import AppConfig from './AppConfig';


import PrimeReact from 'primereact/api';
import { Tooltip } from 'primereact/tooltip';

import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import './App.scss';
import { useNavigate } from 'react-router-dom';
export const RTLContext = React.createContext()

const App = ({ userData }) => {
    const [theme, setTheme] = useState('indigo');
    const [menuMode, setMenuMode] = useState('static');
    const [inlineMenuPosition, setInlineMenuPosition] = useState('bottom');
    const [desktopMenuActive, setDesktopMenuActive] = useState(true);
    const [mobileMenuActive, setMobileMenuActive] = useState(false);
    const [activeTopbarItem, setActiveTopbarItem] = useState(null);
    const [colorMode, setColorMode] = useState('dark');
    const [rightMenuActive, setRightMenuActive] = useState(false);
    const [menuActive, setMenuActive] = useState(false);
    const [inputStyle, setInputStyle] = useState('filled');
    const [isRTL, setRTL] = useState(false);
    const [ripple, setRipple] = useState(true);
    const [mobileTopbarActive, setMobileTopbarActive] = useState(false);
    const [menuTheme, setMenuTheme] = useState('light');
    const [topbarTheme, setTopbarTheme] = useState('blue');
    const [isInputBackgroundChanged, setIsInputBackgroundChanged] = useState(false);
    const [inlineMenuActive, setInlineMenuActive] = useState({});
    const [newThemeLoaded, setNewThemeLoaded] = useState(false);
    const [searchActive, setSearchActive] = useState(false);
    const copyTooltipRef = useRef();
    let currentInlineMenuKey = useRef(null);
    const location = useLocation();

    PrimeReact.ripple = true;
 

    let searchClick;
    let topbarItemClick;
    let menuClick;
    let inlineMenuClick;
    const navigate = useNavigate();
    const redirectToExternalUrl = (url) => {
        if (url) {
            if (url.startsWith('http://') || url.startsWith('https://')) {
                console.log('External URL:', url);
                window.location.replace(url);
            } else {
                console.log('Internal URL:', url);
                navigate(url);
            }
        }
    };

    const generateMenuFromUserData = (userData) => {
        if (!userData || !userData.object) {
            return [];
        }

        return userData.object.map((item) => ({
            key: item.menId,
            label: item.nombre,
            icon: item.icono,
            to: item.url,
            items: item.hijos && item.hijos.map((hijo) => ({
                key: hijo.menId,
                label: hijo.nombre,
                to: hijo.url

            }))
        }));
    };


    const generateRoutesFromUserData = (userData) => {
        if (!userData || !userData.object) {
            return [];
        }

        return userData.object.map((item) => {
            if (item.external) {
                return {
                    path: item.url,
                    element: (
                        <a onClick={() => redirectToExternalUrl(item.url)}>{item.nombre}</a>
                    ),
                };
            } else {
                return {
                    path: item.url,
                    element: <h1>{item.nombre}</h1>,
                };
            }
        });


    }


    const menu = generateMenuFromUserData(userData);
    const routes = generateRoutesFromUserData(userData);


    const onMenuItemClick = (event, item) => {
        if (!item.items) {
            // Aquí puedes manejar la lógica al hacer clic en un elemento del menú que no tiene submenús
            console.log('Clicked menu item:', item.to);
            hideOverlayMenu();
        } else {
            // Si el elemento tiene submenús, el estado del menú activo ya se manejará en el componente AppMenu
            event.preventDefault();
        }

        if (item.to) {
            const url = item.to;
            console.log('URL:', url);
            redirectToExternalUrl(url);
        }
    };


    useEffect(() => {
        copyTooltipRef && copyTooltipRef.current && copyTooltipRef.current.updateTargetEvents();
    }, [location]);

    useEffect(() => {
        if (menuMode === 'overlay') {
            hideOverlayMenu();
        }
        if (menuMode === 'static') {
            setDesktopMenuActive(true);
        }
    }, [menuMode]);

    useEffect(() => {
        onColorModeChange(colorMode);
    }, []);
    const onMenuThemeChange = (theme) => {
        setMenuTheme(theme);
    };

    const onTopbarThemeChange = (theme) => {
        setTopbarTheme(theme);
    };

    useEffect(() => {
        const appLogoLink = document.getElementById('app-logo');

        if (topbarTheme === 'white' || topbarTheme === 'yellow' || topbarTheme === 'amber' || topbarTheme === 'orange' || topbarTheme === 'lime') {
            appLogoLink.src = 'assets/layout/images/logo-dark.svg';
        } else {
            appLogoLink.src = 'assets/layout/images/logo-light.svg';
        }
    }, [topbarTheme]);

    const onThemeChange = (theme) => {
        setTheme(theme);
        const themeLink = document.getElementById('theme-css');
        const themeHref = 'assets/theme/' + theme + '/theme-' + colorMode + '.css';
        replaceLink(themeLink, themeHref);
    };

    const onColorModeChange = (mode) => {
        setColorMode(mode);
        setIsInputBackgroundChanged(true);

        if (isInputBackgroundChanged) {
            if (mode === 'dark') {
                setInputStyle('filled');
            } else {
                setInputStyle('outlined');
            }
        }

        if (mode === 'dark') {
            setMenuTheme('dark');
            setTopbarTheme('dark');
        } else {
            setMenuTheme('light');
            setTopbarTheme('blue');
        }

        const layoutLink = document.getElementById('layout-css');
        const layoutHref = 'assets/layout/css/layout-' + mode + '.css';
        replaceLink(layoutLink, layoutHref);

        const themeLink = document.getElementById('theme-css');
        const urlTokens = themeLink.getAttribute('href').split('/');
        urlTokens[urlTokens.length - 1] = 'theme-' + mode + '.css';
        const newURL = urlTokens.join('/');

        replaceLink(themeLink, newURL, () => {
            setNewThemeLoaded(true);
        });
    };


    const replaceLink = (linkElement, href, callback) => {
        if (isIE()) {
            linkElement.setAttribute('href', href);

            if (callback) {
                callback();
            }
        } else {
            const id = linkElement.getAttribute('id');
            const cloneLinkElement = linkElement.cloneNode(true);

            cloneLinkElement.setAttribute('href', href);
            cloneLinkElement.setAttribute('id', id + '-clone');

            linkElement.parentNode.insertBefore(cloneLinkElement, linkElement.nextSibling);

            cloneLinkElement.addEventListener('load', () => {
                linkElement.remove();
                const _linkElement = document.getElementById(id);
                _linkElement && _linkElement.remove();
                cloneLinkElement.setAttribute('id', id);

                if (callback) {
                    callback();
                }
            });
        }
    };


    const onInputStyleChange = (inputStyle) => {
        setInputStyle(inputStyle);
    };

    const onRipple = (e) => {
        PrimeReact.ripple = e.value;
        setRipple(e.value);
    };

    const onInlineMenuPositionChange = (mode) => {
        setInlineMenuPosition(mode);
    };

    const onMenuModeChange = (mode) => {
        setMenuMode(mode);
    };

    const onRTLChange = () => {
        setRTL((prevState) => !prevState);
    };

    const onMenuClick = (event) => {
        menuClick = true;
    };

    const onMenuButtonClick = (event) => {
        menuClick = true;

        if (isDesktop()) setDesktopMenuActive((prevState) => !prevState);
        else setMobileMenuActive((prevState) => !prevState);

        event.preventDefault();
    };

    const onTopbarItemClick = (event) => {
        topbarItemClick = true;
        if (activeTopbarItem === event.item) setActiveTopbarItem(null);
        else {
            setActiveTopbarItem(event.item);
        }

        event.originalEvent.preventDefault();
    };

    const onSearch = (event) => {
        if (event) {
            searchClick = true;
            setSearchActive(event);
        }
    };


    const onRootMenuItemClick = (event) => {
        setMenuActive((prevState) => !prevState);
    };

    const onRightMenuButtonClick = () => {
        setRightMenuActive((prevState) => !prevState);
    };

    const onMobileTopbarButtonClick = (event) => {
        setMobileTopbarActive((prevState) => !prevState);
        event.preventDefault();
    };

    const onDocumentClick = (event) => {
        if (!searchClick && event.target.localName !== 'input') {
            setSearchActive(false);
        }

        if (!topbarItemClick) {
            setActiveTopbarItem(null);
        }

        if (!menuClick && (menuMode === 'overlay' || !isDesktop())) {
            if (isHorizontal() || isSlim()) {
                setMenuActive(false);
            }
            hideOverlayMenu();
        }

        if (inlineMenuActive[currentInlineMenuKey.current] && !inlineMenuClick) {
            let menuKeys = { ...inlineMenuActive };
            menuKeys[currentInlineMenuKey.current] = false;
            setInlineMenuActive(menuKeys);
        }

        if (!menuClick && (isSlim() || isHorizontal())) {
            setMenuActive(false);
        }

        searchClick = false;
        topbarItemClick = false;
        inlineMenuClick = false;
        menuClick = false;
    };

    const hideOverlayMenu = () => {
        setMobileMenuActive(false);
        setDesktopMenuActive(false);
    };

    const isDesktop = () => {
        return window.innerWidth > 1024;
    };

    const isHorizontal = () => {
        return menuMode === 'horizontal';
    };

    const isSlim = () => {
        return menuMode === 'slim';
    };

    const isIE = () => {
        return /(MSIE|Trident\/|Edge\/)/i.test(window.navigator.userAgent);
    };

    const onInlineMenuClick = (e, key) => {
        let menuKeys = { ...inlineMenuActive };
        if (key !== currentInlineMenuKey.current && currentInlineMenuKey.current) {
            menuKeys[currentInlineMenuKey.current] = false;
        }

        menuKeys[key] = !menuKeys[key];
        setInlineMenuActive(menuKeys);
        currentInlineMenuKey.current = key;
        inlineMenuClick = true;
    };
    const renderInlineMenu = () => {
        if (inlineMenuPosition === 'top') {
          return (
            <AppInlineMenu menuKey="top" inlineMenuActive={inlineMenuActive} onInlineMenuClick={onInlineMenuClick} horizontal={isHorizontal()} menuMode={menuMode} />
          );
        } else if (inlineMenuPosition === 'bottom') {
          return (
            <AppInlineMenu menuKey="bottom" inlineMenuActive={inlineMenuActive} onInlineMenuClick={onInlineMenuClick} horizontal={isHorizontal()} menuMode={menuMode} />
          );
        }
    
        return null;
      };
    const layoutContainerClassName = classNames('layout-wrapper ', 'layout-menu-' + menuTheme + ' layout-topbar-' + topbarTheme, {
        'layout-menu-static': menuMode === 'static',
        'layout-menu-overlay': menuMode === 'overlay',
        'layout-menu-slim': menuMode === 'slim',
        'layout-menu-horizontal': menuMode === 'horizontal',
        'layout-menu-active': desktopMenuActive,
        'layout-menu-mobile-active': mobileMenuActive,
        'layout-topbar-mobile-active': mobileTopbarActive,
        'layout-rightmenu-active': rightMenuActive,
        'p-input-filled': inputStyle === 'filled',
        'p-ripple-disabled': !ripple,
        'layout-rtl': isRTL
      });
      return (
        <RTLContext.Provider value={isRTL}>
          <div className={layoutContainerClassName} onClick={onDocumentClick}>
            <Tooltip ref={copyTooltipRef} target=".block-action-copy" position="bottom" content="Copied to clipboard" event="focus" />
    
            <AppTopbar
              horizontal={isHorizontal()}
              activeTopbarItem={activeTopbarItem}
              onMenuButtonClick={onMenuButtonClick}
              onTopbarItemClick={onTopbarItemClick}
              onRightMenuButtonClick={onRightMenuButtonClick}
              onMobileTopbarButtonClick={onMobileTopbarButtonClick}
              mobileTopbarActive={mobileTopbarActive}
              searchActive={searchActive}
              onSearch={onSearch}
            />
    
            <div className="menu-wrapper" onClick={onMenuClick}>
              <div className="layout-menu-container">
                {renderInlineMenu()}
                <AppMenu model={menu} onMenuItemClick={onMenuItemClick} onRootMenuItemClick={onRootMenuItemClick} menuMode={menuMode} active={menuActive} />
              </div>
            </div>
     
          </div>
        </RTLContext.Provider>
      );

};
export default App;