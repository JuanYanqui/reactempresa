import React, { useEffect, useState } from 'react';
import App from '../App';

const Usuarioenco = () => {
    const [userData, setUserData] = useState(null);

    const [userData2, setUserData2] = useState(null);

    const [usuario, setUsuario] = useState(localStorage.getItem('nombrecap'));

    useEffect(() => {
      const handleStorageUpdate = () => {
        setUsuario(localStorage.getItem('nombrecap'));
      };
  
      window.addEventListener('storageUpdated', handleStorageUpdate);
  
      return () => {
        window.removeEventListener('storageUpdated', handleStorageUpdate);
      };
    }, []);

    useEffect(() => {
      fetchUserData(usuario);
    }, []);

    useEffect(() => {
      fetchUserData2(usuario);
    }, []);
  
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

    
    return (
      <>
        {userData && <App userData={userData} />},
      </>
    );

  }


export default Usuarioenco;