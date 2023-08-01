import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import keycloak from './Keycloak';
import App from './App';
import Login from './pages/Login';
import Error from './pages/Error';
import NotFound from './pages/NotFound';
import Access from './pages/Access';
import Landing from './pages/Landing';

const AppWrapper = (props) => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    keycloak.init({ onLoad: 'check-sso', promiseType: 'native' })
      .then((authenticated) => {
        setAuthenticated(authenticated);
      })
      .catch((error) => {
        console.error('Error initializing Keycloak: ', error);
      });
  }, []);

  let location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  if (!authenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" />;
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/error" element={<Error />} />
      <Route path="/notfound" element={<NotFound />} />
      <Route path="/access" element={<Access />} />
      <Route path="/landing" element={<Landing />} />
      <Route path="*" element={<App />} />
    </Routes>
  );
};

export default AppWrapper;
