const path = require('path');
const fs = require('fs');
const axios = require('axios');

// funcion para saber si la ruta existe
function existingPath(route) {
  try {
    if (!fs.existsSync(route)) {
      console.log('The path does not exist.')
      return false;
    }
    return true;
  } catch (error) {
    console.error(`error: ${error}`);
    return false;
  }
}
//existingPath('C:\\Users\\Otros\\Desktop\\MD-LINKS\\DEV006-md-links\\prueba\\README.md');
//existingPath('prueba\README.md');

// funcion para transformar ruta relativa a absoluta/ si es absoluta la dejará igual
function convertirRutaAbsoluta(route) {
  return new Promise((resolve, reject) => {
    const rutaAbsoluta = path.resolve(route);
    if (!rutaAbsoluta) {
      const rutaConvertida = path.resolve(route);
      resolve(rutaConvertida);
    }
    resolve(route);
    console.log(rutaAbsoluta);
  });
}
//convertirRutaAbsoluta('prueba\\README.md');


// funcion para comprobar si es un archivo o directorio
function isDirectoryOrFile(route) {
  return new Promise((resolve, reject) => {
    fs.stat(route, (error, stats) => {
      if (error) {
        reject(error.message);
        return;
      }
      if (stats.isFile()) {
        resolve('archivo');
        console.info(route, 'archivo');
      } else if (stats.isDirectory()) {
        resolve('directorio');
        console.log(route, 'directorio');
      } else {
        reject('no es archivo/directorio')
      }
    })
  });

};
//isDirectoryOrFile('C:\\Users\\Otros\\Desktop\\MD-LINKS\\DEV006-md-links\\prueba\\README.md')
//isDirectoryOrFile('C:\\Users\\Otros\\Desktop\\MD-LINKS\\DEV006-md-links\\prueba')

// funcion creada para obtener la extensión del archivo
function getMarkdown(route) {
  return new Promise((resolve, reject) => {
    const extension = path.extname(route);
    if (extension === '.md') {
      resolve(extension);
      //console.log(extension)
    } else {
      reject('No existe la extensión .md')
    }
  });
};
//getMarkdown('C:\\Users\\Otros\\Desktop\\MD-LINKS\\DEV006-md-links\\prueba\\README.md')
// getMarkdown('C:\\Users\\Otros\\Desktop\\MD-LINKS\\DEV006-md-links\\prueba\\text.txt')
//   .then((extension) => {
//     console.log('Con extensión ',extension)
//   })
//   .catch(error =>{
//   console.error('Ha habido un error', error)
//   })


function readFile(route) {
  return new Promise((resolve, reject) => {
    fs.readFile(route, 'utf-8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

// readFile('C:\\Users\\Otros\\Desktop\\MD-LINKS\\DEV006-md-links\\prueba\\README.md')
//   .then((file) => {
//     console.log(file)
//   })
//   .catch(error => {
//     console.error('ha habido un error', error)
//   })

function getLinks(content, filePath) {
  const regex = /\[([^\]]+)\]\((http[s]?:\/\/[^\)]+)\)/g;
  const links = [];
  let match;

  while ((match = regex.exec(content)) !== null) {
    const text = match[1];
    const URL = match[2];
    links.push({ href: URL, text: text, file: filePath });
  }
  return links

}

const ruta = 'C:\\Users\\Otros\\Desktop\\MD-LINKS\\DEV006-md-links\\prueba\\README.md';
let links = [];

readFile(ruta).then((data) => {
  const links = getLinks(data, ruta)
  return validateLinks(links);
})
.then((validateLinks) => {
  console.log(validateLinks);
})
.catch((error) => {
  console.error('Ha habido un error ', error);
}); 

function validateLinks(links){
  const linksPromises = links.map((link) => {
    return axios.get(link.href)
    .then((response) => {
      if (response.status >= 200 && response.status < 300) {
        return{
          href: link.href,
          text: link.text,
          file: link.file,
          status: response.status,
          ok: 'ok',
        };
      } else {
        return {
          href: link.href,
          text: link.text,
          file: link.file,
          status: response.status,
          ok: 'fail',
        }
      }
    })
    .catch((error) => {
      return {
        href: link.href,
        text: link.text,
        file: link.file,
        status: error.response.status,
        ok: 'fail',
      };
    });
  });
  return Promise.all(linksPromises);
};


module.exports = {
  existingPath,
  convertirRutaAbsoluta,
  isDirectoryOrFile,
  getMarkdown,
  readFile,
  getLinks,
  validateLinks
}
