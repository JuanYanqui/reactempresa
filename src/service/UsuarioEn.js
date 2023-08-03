import React, { useEffect, useState } from 'react';

const Usuarioenco = () => {

    const [usuarioData, setUsuarioData] = useState(null);

    useEffect(() => {
      
      const nombreUsuario = 'ETAPIA'; 
      fetch('http://192.168.200.24:8080/javaws/ws/usuarios/getUsuario', {
        method: 'POST',
        headers: '*',
        mode: 'no-cors',
        body: JSON.stringify({
          usuario: nombreUsuario,
        })
      })
        .then((response) => response.json())
        .then((data) => setUsuarioData(JSON.parse(data.object))); 
    }, []);
  
  

  return (
    <div>
      {usuarioData ? (
        console.log(usuarioData)
      ) : (
        <p>Cargando datos del usuario...</p>
      )}
    </div>
  );
};

export default Usuarioenco;