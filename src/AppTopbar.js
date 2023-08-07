import React, { useContext, useEffect, useRef, useState } from 'react';
import { classNames } from 'primereact/utils';
import { MegaMenu } from 'primereact/megamenu';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { CSSTransition } from 'react-transition-group';
import { RTLContext } from './App';
import { Route, Routes, useLocation } from 'react-router-dom';
import AppInlineMenu from './AppInlineMenu';
import AppMenu from './AppMenu';
import AppConfig from './AppConfig';

import PrimeReact from 'primereact/api';
import { Tooltip } from 'primereact/tooltip';
const handleLogout = () => {
    localStorage.removeItem('nombrecap');
    localStorage.removeItem('apellidocap');
    localStorage.removeItem('emailcap');
    const keycloakConfig = JSON.parse(localStorage.getItem('keycloakConfig'));
    window.location.href = keycloakConfig.url + 'realms/' + keycloakConfig.realm + '/protocol/openid-connect/logout?redirect_uri=' + encodeURIComponent(window.location.origin);
};

const AppTopbar = (props) => {

    const navigate = useNavigate();
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
    const topbarRef1 = useRef(null);
    const topbarRef2 = useRef(null);
    const topbarRef3 = useRef(null);
    const topbarRef4 = useRef(null);

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

    const [showAppConfig, setShowAppConfig] = useState(false);

    const toggleAppConfig = () => {
        console.log("conn");
        setShowAppConfig((prevShow) => !prevShow);
        console.log(setShowAppConfig);
    };
    const botonEstilo = {
        fontSize: '24px',
    };
    return (
        <div className="layout-topbar shadow-4">
            <div className="layout-topbar-left">
                <button type="button" style={{ cursor: 'pointer' }} className="layout-topbar-logo p-link" onClick={() => navigate('/')}>
                    <img id="app-logo" src="assets/layout/images/web_logo_header.png" alt="ultima-layout" style={{ height: '3.30rem' }} />
                </button>
                <button type="button" className="layout-menu-button shadow-6 p-link" style={{ background: '#004a9b' }} onClick={props.onMenuButtonClick}>
                    <i className="pi pi-chevron-right"></i>
                </button>
                <button type="button" className="layout-topbar-mobile-button p-link">
                    <i className="pi pi-ellipsis-v fs-large" onClick={props.onMobileTopbarButtonClick}></i>
                </button>
            </div>

            <div className={classNames('layout-topbar-right', { 'layout-topbar-mobile-active': props.mobileTopbarActive })}>
                <div className="layout-topbar-actions-left">

                </div>
                <div className="layout-topbar-actions-right">
                    <ul className="layout-topbar-items">
                        <li className="layout-topbar-item notifications">

                            <Button
                                className="pi pi-cog p-button-icon p-link"
                                onClick={toggleAppConfig} style={botonEstilo}
                            ></Button>
                        </li>
                    </ul>
                    <AppConfig active={showAppConfig} onHide={() => setShowAppConfig(false)}
                inputStyle={inputStyle}
                onInputStyleChange={onInputStyleChange}
                rippleEffect={ripple}
                onRippleEffect={onRipple}
                menuMode={menuMode}
                onMenuModeChange={onMenuModeChange}
                inlineMenuPosition={inlineMenuPosition}
                onInlineMenuPositionChange={onInlineMenuPositionChange}
                colorMode={colorMode}
                onColorModeChange={onColorModeChange}
                menuTheme={menuTheme}
                onMenuThemeChange={onMenuThemeChange}
                topbarTheme={topbarTheme}
                onTopbarThemeChange={onTopbarThemeChange}
                theme={theme}
                onThemeChange={onThemeChange}
                isRTL={isRTL}
                onRTLChange={onRTLChange} />
                </div>
            </div>
           
        </div>

    );
};

export default AppTopbar;
