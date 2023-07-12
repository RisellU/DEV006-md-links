const path = require('path');
const fs = require('fs');
const axios = require('axios');
const { error } = require('console');

// funcion para transformar ruta relativa a absoluta/ si es absoluta la dejará igual
function convertirRutaAbsoluta(route) {
  let absoluteRoute = "";
  if (path.isAbsolute(route)) {
    absoluteRoute = route.replace(/\\/g, '/');
  } else  {
    absoluteRoute = path.resolve(route).replace(/\\/g, '/');
  }
  return absoluteRoute;
}


// funcion para saber si la ruta existe
function existingPath(route) {
  return new Promise((resolve, reject) => {
    const pathExist = fs.existsSync(route);
    if (pathExist) {
      resolve(route);
      //console.log(route + ' Si existe la ruta')
    } else {
      reject(new Error('La ruta no existe'));
    }
  });  
}


// funcion para comprobar si es un archivo o directorio
function isFile(route) {
  return new Promise((resolve, reject) => {
    fs.stat(route, (error, stats) => {
      if (error) {
        reject(error.message, 'No es un archivo');
      } else {
        resolve(stats.isFile());
      }   
    })
  });

};


// funcion creada para obtener la extensión dsel archivo
function getMarkdown(route) {
  return new Promise((resolve, reject) => {
    const extension = path.extname(route);
    if (extension.toLocaleLowerCase() === '.md') {
      resolve(true);
    } else {
      reject(new Error('La extensión del archivo no es .md'));  
    }
  });
};


function readFile(route) {
  return new Promise((resolve, reject) => {
    fs.readFile(route, 'utf-8', (error, data) => {
      if (error) {
        reject(error);

      } else {
        resolve(data);
      }
    });
  });
};

function getLinks(content, filePath) {
  const regex = /\[([^\]]+)\]\((http[s]?:\/\/[^\)]+)\)/g;
  const links = [];
  let match;

  while ((match = regex.exec(content)) !== null) {
    const text = match[1];
    const URL = match[2];
    links.push({ href: URL, text: text, file: filePath });
  }
  return links;

}
 

function validateLinks(links){
  const linksPromises = links.map((link) => {
    return axios
    .get(link.href)
    .then(response => {
      return {
          href: link.href,
          text: link.text,
          file: link.file,
          status: response.status,
          ok: 'ok',
        }; 
    })
    .catch(error => {
      return {
        href: link.href,
        text: link.text,
        file: link.file,
        status: error.response ? error.response.status: null,
        ok: 'fail',
      };
    });
  }); 
  return Promise.all(linksPromises);
};


module.exports = {
  existingPath,
  convertirRutaAbsoluta,
  isFile,
  getMarkdown,
  readFile,
  getLinks,
  validateLinks
}
