const {
    convertirRutaAbsoluta,
    existingPath,
    isFile,
    getMarkdown,
    readFile,
    getLinks,
    validateLinks
} = require('./funciones.js');


const mdLinks = (path, options) => {
    return new Promise((resolve, reject) => {
        const absoluteRoute = convertirRutaAbsoluta(path);
        existingPath(absoluteRoute)
            .then((absolutePath) => {
                if (!absolutePath) {
                    reject(new Error('No existe la ruta'));
                    return;
                }    
                return isFile(absoluteRoute);
            })
            .then((isFile) => {
                if (isFile) {
                    return getMarkdown(absoluteRoute).then((isMd) => {
                        if (isMd) {
                            return readFile(absoluteRoute);
                        }
                    });
                } else {
                    resolve([]);
                }
             })
            .then((data) => {
                const resultLinks = getLinks(data, absoluteRoute);
                if (options && options.validate) {
                    return validateLinks(resultLinks)
                        .then((validatedLinks) => { 
                            return validatedLinks;
                        }) 
                        .catch((error) => {
                            console.error('Error en la validación: ', error);
                            return resultLinks;
                        });
                } else {
                    return resultLinks;
                }
            })
            .then((resultLinks) => {
                resolve(resultLinks);
            })
            .catch((error) => {
                reject('Algo está mal: ' + error);
            });
     });

};

mdLinks('C:\\Users\\Otros\\Desktop\\MD-LINKS\\DEV006-md-links\\prueba\\README.md', { validate: true }).then((resultLinks) => {
    console.log(resultLinks);
  });

module.exports = mdLinks;