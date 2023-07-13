const {
  convertirRutaAbsoluta,
  existingPath,
  isFile,
  getMarkdown,
  readFile,
  getLinks,
  validateLinks
} = require('../src/funciones.js');


// Test para convertir ruta
describe('convertirRutaAbsoluta', () => {
  it('Convierte ruta relativva a absoluta', () => {
    const route = 'prueba\\README.md';
    const expectRoute = 'C:/Users/Otros/Desktop/MD-LINKS/DEV006-md-links/prueba/README.md'

    expect(convertirRutaAbsoluta(route)).toEqual(expectRoute);
  });

  it('Si la ruta es absoluta mantenerla', () => {
    const routeAbs = 'C:\\Users\\Otros\\Desktop\\MD-LINKS\\DEV006-md-links\\prueba\\README.md'
    const routeExpect = 'C:/Users/Otros/Desktop/MD-LINKS/DEV006-md-links/prueba/README.md'

    expect(convertirRutaAbsoluta(routeAbs)).toEqual(routeExpect);
  })

});

// Test para validar la exixtencia de una ruta
describe('existingPath', () => {
  it('Si la ruta existe la retorna', () => {
    const route = 'C:\\Users\\Otros\\Desktop\\MD-LINKS\\DEV006-md-links\\prueba\\README.md';

    expect(existingPath(route)).resolves.toBe(route);
  });

  it('Si la ruta no existe retorna reject', () => {
    const route = 'C:\\Users\\Otros\\Desktop\\MD-LINKS\\DEV006-md-links\\prueba\\noExiste.md';

    expect(existingPath(route)).rejects.toThrow('La ruta no existe');
  })

});

// Test para saber si es un archivo
describe('isFile', () => {
  it('si es un archivo lo resuelve', async () => {
    const route = 'C:\\Users\\Otros\\Desktop\\MD-LINKS\\DEV006-md-links\\prueba\\README.md';
    const expectedRoute = await isFile(route);
    const expectedResponse = true;

    expect(expectedRoute).toEqual(expectedResponse);
  });
  it('si no es un archivo retorna false', async () => {
    const route = 'C:\\Users\\Otros\\Desktop\\MD-LINKS\\DEV006-md-links\\prueba';
    const expectedRoute = await isFile(route);
    const expectedResponse = false;

    expect(expectedRoute).toEqual(expectedResponse);
  });

});

// Tesrt para obtener la extensión
describe('getMarkdowm', () => {
  it('Solo va a obtener la extención que sea igual a .md', () => {
    const route = 'C:\\Users\\Otros\\Desktop\\MD-LINKS\\DEV006-md-links\\prueba\\README.md';
    const result = true;

    expect(getMarkdown(route)).resolves.toBe(result);
  });
  it('Si no encuentra la extensión retorna reject', () => {
    const route = 'C:\\Users\\Otros\\Desktop\\MD-LINKS\\DEV006-md-links\\prueba\\text.txt';

    expect(getMarkdown(route)).rejects.toThrow('La extensión del archivo no es .md');
  })
});

// Test para leer un archivo
describe('readFile', () => {
  it('Debe leer todo el contenido que este dentro del archivo', () => {
    const route = 'C:\\Users\\Otros\\Desktop\\MD-LINKS\\DEV006-md-links\\prueba\\READMEcopy.md';
    const result = '[Markdown](https://es.wikipedia.org/wiki/Markdown) es un lenguaje de marcado ligero muy popular entre developers.';

    return readFile(route).then(data => {
      expect(data).toBe(result);
    });
  });

  it('Retorna reject si ocurre un problema', () => {
    const route = 'C:\\Users\\Otros\\Desktop\\MD-LINKS\\DEV006-md-links\\prueba\\READMEcopy.md';

    return readFile(route).catch(error => {
      expect(error).toMatch('error');
    });

  })
});

// Test para extraer los links
describe('getLinks', () => {
  it('Devuelve un array de objetos con los enlaces extraidos', () => {
     const content = '[ejemplo](https://www.example.com)'
     const filePath =  'C:\\Users\\Otros\\Desktop\\MD-LINKS\\DEV006-md-links\\prueba\\archivoPrueba.md';
     const result = [{
      href: 'https://www.example.com',
      text: 'ejemplo',
      file: 'C:\\Users\\Otros\\Desktop\\MD-LINKS\\DEV006-md-links\\prueba\\archivoPrueba.md'
     }];
     expect(getLinks(content, filePath)).toEqual(result);
  });
});

describe('validateLinks', () => {
  it('Devuelve un array de objetos con los enlaces validados', () => {
    const links = [
      {
      href: 'https://developer.mozilla.org/es/docs/Web/HTTP/Overview',
      text: 'Generalidades del protocolo HTTP - MDN',
      file: 'C:\\Users\\Otros\\Desktop\\MD-LINKS\\DEV006-md-links\\prueba\\archivoRoto.md'
    },
    {
      href: 'https://jestjs.i/es-ES/getting-started',
      text: 'Empezando con Jest - Documentación oficial',
      file: 'C:\\Users\\Otros\\Desktop\\MD-LINKS\\DEV006-md-links\\prueba\\archivoRoto.md'
    }
  ];

  const resultLinks = [
    {
      href: 'https://developer.mozilla.org/es/docs/Web/HTTP/Overview',
      text: 'Generalidades del protocolo HTTP - MDN',
      file: 'C:\\Users\\Otros\\Desktop\\MD-LINKS\\DEV006-md-links\\prueba\\archivoRoto.md',
      status: 200,
      ok: 'ok'
    },
    {
      href: 'https://jestjs.i/es-ES/getting-started',
      text: 'Empezando con Jest - Documentación oficial',
      file: 'C:\\Users\\Otros\\Desktop\\MD-LINKS\\DEV006-md-links\\prueba\\archivoRoto.md',
      status: null,
      ok: 'fail'
    }
  ];

    return validateLinks(links).then(result => {
      expect(result).toEqual(resultLinks);
    });
   
  });
});