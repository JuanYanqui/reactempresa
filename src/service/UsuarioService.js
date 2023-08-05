import React, { useEffect, useState } from 'react';
import App from '../App';

const UsuarioService = () => {

      const [userData, setUserData] = useState(null);
  
      const [userData2, setUserData2] = useState(null);
  
      ////////RECUPERA EL USUAERIO DEL LOCAL STORAGE PARA MANDAERLE A ACTUALIZAR////

      const [usuario, setUsuario] = useState(localStorage.getItem('nombrecap'));
  
      ///////////ACTUALIZA LO QUE ESTA GUARDADO EN EL LOCALSTORAGE/////////
      useEffect(() => {
        const handleStorageUpdate = () => {
          setUsuario(localStorage.getItem('nombrecap'));
        };
    
        window.addEventListener('storageUpdated', handleStorageUpdate);
    
        return () => {
          window.removeEventListener('storageUpdated', handleStorageUpdate);
        };
      }, []);
  
      ///////////////MANDA A EJECUTAR EL METODO FECH CON EL USUARIO OBTENIDO////////
      useEffect(() => {
        fetchUserData(usuario);
      }, []);
  
      useEffect(() => {
        fetchUserData2(usuario);
      }, []);
    

      ///////////PETICION GET//////////////////////
      const fetchUserData = (usuario) => {
        const url = `http://wsgo.gerardoortiz.com/ApiJavadb/menuUsuario/menuAllUser?userId=${usuario}&app=APP`;
    
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url);
    
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              const response = JSON.parse(xhr.responseText);
              setUserData(response);
            } else {
              console.error('Error al obtener datos del usuario');
            }
          }
        };
    
        xhr.send();
      };
  

      //////////PETICION POST//////////////////////
      const fetchUserData2 = (usuario) => {
        const url = 'http://192.168.200.24:8080/javaws/ws/usuarios/getUsuario';
        const body = {
          object: JSON.stringify({
            usuario: usuario
          }),
          rowCount: 0
        };
    
        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        })
          .then(response => response.json())
          .then(data => {
            setUserData2(data);
            console.log(data);
          })
          .catch(error => {
            console.error('Error al obtener datos del usuario', error);
          });
      };
  
      //////MANDA EL OBJETO A LA SIGUIENTE VENTANA JS ////////////
      return (
        <>
          {userData && <App userData={userData} />},
        </>
      );
  
    }

export default UsuarioService;
