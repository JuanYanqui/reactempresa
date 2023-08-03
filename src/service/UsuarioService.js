import React, { useEffect, useState } from 'react';
import fetch from 'cross-fetch';
import axios from 'axios';
const UsuarioService = () => {
/*const [menuData, setMenuData] = useState([]);

useEffect(() => {
    const usuario = localStorage.getItem('usernamecap');
    const apiUrl = 'http://wsgo.gerardoortiz.com/ApiJavadb/menuUsuario/menuAllUser?userId=ETAPIA&app=APP';
  
    axios.get(apiUrl)
      .then(response => {
        setMenuData(response.data.object);
      })
      .catch(error => {

        console.error('Error al obtener los datos:', error);
        if (error.response) {
          console.error('Error response:', error.response);
        }
      });
  }, []);*/
  const [menuData, setMenuData] = useState([]);

  useEffect(() => {
    axios('http://wsgo.gerardoortiz.com/ApiJavadb/menuUsuario/menuAllUser?userId=ETAPIA&app=APP', {
      method: "GET",
    })
      .then((response) => {
        // Axios handles non-2xx status codes automatically, so no need to check response.ok
        return response.data;
      })
      .then((data) => setMenuData(data.object))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);
}

export default UsuarioService;
