
function generarCodigoVersion() {
    const fecha = new Date();
    const year = fecha.getFullYear();
    const month = ('0' + (fecha.getMonth() + 1)).slice(-2); // Añadir un 0 al principio si es necesario
    const day = ('0' + fecha.getDate()).slice(-2); // Añadir un 0 al principio si es necesario
    const hours = ('0' + fecha.getHours()).slice(-2); // Añadir un 0 al principio si es necesario
    const minutes = ('0' + fecha.getMinutes()).slice(-2); // Añadir un 0 al principio si es necesario
    const seconds = ('0' + fecha.getSeconds()).slice(-2); // Añadir un 0 al principio si es necesario
    const miliseconds = fecha.getMilliseconds();

    const codigoVersion = `${year}${month}${day}${hours}${minutes}${seconds}${miliseconds}`;

    return codigoVersion;
}

 const html_error = () => {
  const htmlError= `<!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Manejo de Errores</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          color: #333;
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }
    
        .container {
          text-align: center;
        }
    
        h1 {
          font-size: 2rem;
          margin-bottom: 1rem;
        }
    
        p {
          font-size: 1rem;
        }
    
        .error-message {
          color: red;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Error Interno del Servidor</h1>
        <p class="error-message">Ocurrió un error</p>
      </div>
    </body>
    </html>
    `
    return htmlError;
}


module.exports = { generarCodigoVersion, html_error };