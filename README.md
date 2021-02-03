# FINALDELILAH
Proyecto Delilah Risto.

## Tabla de contenido.
* [Base de datos](#base-de-datos)
* [Paquetes NPM](#paquetes-npm)
* [Intalar el programa](#instalar-el-programa)

## Base de datos

### Diagrama entidad - relación



### Creación de la base de datos.

* Tipo: Relacional.
* Programa: MYSQL.
* Script de creación: En el directorio BD encontrará el archivo SCRIPTBD.txt en el que se encuentran contenidas todas las sentencias SQL para crear la base de datos y su estructura (tablas y comandos INSERT para cargar la base de datos).
* Instalación manual: 
  1. Cree una base de datos de nombre **acamica**.
  2. Ejecute la instrucción: USE acamica. Para seleccionar la base de datos.
  3. Abra el archivo SCRIPTBD.txt.
  4. Ejecute las instrucciones del archivo en la consola de MYSQL.
  
De este modo tendrá una base de datos cargada con un total de 6 usuarios con su respectivo historial de pedidos. También cargará los productos. Puede usar estos usuarios para registrarse en el servidor y probar la API.

1. diego : SECRETO_ENCRIPTADO
2. diana : SECRETO
3. katalina: SECRETO_YINGYANGYO
4. lunita: PERFECCION
5. tati: DESILUSION

### Paquetes NPM y programas.

* Node JS y NPM. Ingrese a https://nodejs.org/en/download/ y descargue el instalador que corresponda a su sistema operativo.
* Open API. Ingrese a https://www.postman.com/downloads/ y descargue el instalador que corresponda a su sistema operativo.
* Paquetes: os fs express body-parser cookie-parser pug jsonwebtoken cors sequelize mysql2 bcrypt events process dotenv swagger-jsdoc swagger-ui-express
* Instalación de paquetes: Si acaso llegases a necesitar instalar manualmente los paquetes abra la consola y ubíquese en la carpeta donde tiene el proyecto y se encuentra el archivo **indes.js**, ejecute desde la consola de windows o, la terminal de mac o linux, el siguiente comando:
npm install os fs express body-parser cookie-parser pug jsonwebtoken cors sequelize mysql2 bcrypt events process dotenv swagger-jsdoc swagger-ui-express

### Instalación del programa.

1. Descargue el proyecto desde el repositorio https://github.com/dh19ob87/FINALDELILAH.git.
2. Abra la consola de windows, o la terminal de mac o de linux.
3. Navegue hasta la carpeta en donde se encuentra el proyecto y esté el archivo index.js
4. ejecute el comando: node index.js.
5. Recibirá un mensaje: Servidor iniciado.
6. Para verificar el funcionamiento de la API ingrese a http://localhost:3000/api-docs/ Será dirigido a la documentación de la API en donde puede probar las funcionalidades de esta.
7. Para probar la API necesita un token. Puede usar el siguiente que tiene una vida de 8 días: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImRpZWdvIiwicGFzc3dvcmQiOjEyMzQ1NiwiaWF0IjoxNjEyMzEzMjk3LCJleHAiOjE2MTMwMDQ0OTd9.InfYyBpD17PG-dOwkZnfAXKIsx46eKF0XljblS_KDio . **O puede crear un usuario desde el endpoint /usuario** tal como lo indica la documentación. Para esto necesitará POSTMAN o cURL.
8. En el EndPoint /api-docs encontrará toda la información necesaria para utilizar la API.
