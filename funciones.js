const path = require('path');
const fs = require('fs');

// funcion para saber si es absoluta
function isAbsoluteRoute(route) {
    const currentPath = path.isAbsolute(route);
    return currentPath;
}
console.log(isAbsoluteRoute('test\prueba\READMEcopy.md'));

// funcion para transformar ruta relativa a absoluta/ si es absoluta la dejará igual y remplazará los '/'
function toAbsolute(currentPath) {
    let absolutePath = '';

    if (path.isAbsolute(currentPath)) {
        console.log('Absolute');
        absolutePath = currentPath.replace(/\\/g, '/');
    } else {
        console.log('relative');
        absolutePath = path.resolve(__dirname, currentPath).replace(/\\/g, '/');
    }

    return absolutePath + ' absolute path';
}
console.log(toAbsolute('test\\prueba\\READMEcopy.md'))

  // funcion para validar que la ruta existe
  function existingPath(absolutePath){
    try{
      if(!fs.existsSync(absolutePath)){
        console.log('The path does not exist.')
        return false;
      }
      return true;
    } catch (error){
      console.error(`error: ${error}`);
      return false;
    }
  }
  console.log(existingPath('C:\\Users\\Otros\\Desktop\\MD-LINKS\\DEV006-md-links\\test\\prueba\\READMEcopy.md'));
  //console.log(existingPath('C:\Users\Otros\Desktop\MD-LINKS\DEV006-md-links\test\prueba\READMEcopy.md'));

// funcion para comprobar si es un archivo o directorio
function isDirectoryOrFile(path){
    try{
        if(fs.statSync(path).isFile()){
          console.log('Is a file')
        }
        return true;
    } catch (error){
        console.error(`error: ${error}`);
        return false;
    }
} 
console.log(isDirectoryOrFile('C:\\Users\\Otros\\Desktop\\MD-LINKS\\DEV006-md-links\\test\\prueba\\READMEcopy.md'))

module.exports = {
    isAbsoluteRoute,
    toAbsolute,
    existingPath,
    isDirectoryOrFile
}