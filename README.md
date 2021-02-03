# FINALDELILAH
Proyecto Delilah Risto.

## Tabla de contenido.
* [Base de datos](#base-de-datos)
* [Paquetes NPM](#paquetes-npm)
* [Intalar el programa](#instalar-el-programa)

## Base de datos

### Diagrama entidad - relación

![](./BD.png)

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

1. DIEGO@YOPMAIL.COM : SECRETO_ENCRIPTADO (admin)
2. diana@yopmail.com : SECRETO
3. KATA@YOPMAIL.COM: SECRETO_YINGYANGYO (admin)
4. Lunita@dulce.wau: PERFECCION
5. tati@yopmail.com: DESILUSION

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
4. ejecute el comando: **node index.js**
5. Recibirá un mensaje: Servidor iniciado.
6. Para verificar el funcionamiento de la API ingrese a http://localhost:3000/api-docs/ Será dirigido a la documentación de la API en donde puede probar las funcionalidades de esta.
7. Para probar la API necesita un token. Puede usar el siguiente que tiene una vida de 8 días:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImRpZWdvIiwicGFzc3dvcmQiOjEyMzQ1NiwiaWF0IjoxNjEyMzEzMjk3LCJleHAiOjE2MTMwMDQ0OTd9.InfYyBpD17PG-dOwkZnfAXKIsx46eKF0XljblS_KDio . 
**O puede crear un usuario desde el endpoint /usuario** tal como lo indica la documentación. Para esto necesitará POSTMAN o cURL.
8. En el EndPoint /api-docs encontrarás toda la información necesaria para utilizar la API.

### ¿Cómo registrar un usuario?

1. Inicia el servidor. (Siguiendo las instrucciones de instalación del programa)
2. Abre Postman y configura un objeto JSON en el body del request. Puedes ingresar a http://localhost:3000/api-docs/#/usuario/createUser para ensayar en endpoint. El objeto tiene las siguiente propiedades:
  {
    "id_usuario": 1,
    "nombres": "diego hernando",
    "apellidos": "guzman siera",
    "email": "usuario@yopmail.com",
    "direccion_envio": "carrera 3 # 8 - 25 apartamento 12 torre 5",
    "telefono": "+57 123456789",
    "password": "1d5sa4f6s8r4fg",
    "admin": 1,
    "token": ""
  }
3. Envía la solicitud y si el usuario es creado exitosamente recibirás un códido 201.
4. Si no entonces puedes recibir un: 406, 409, 415, o un 500. Dependiendo del error deberás ajustar o el tipo de dato o nombre de la propiedad que envías. En la documentación aparecen los campos que son obligatorios.

### ¿Cómo crear un pedido?

1. Inicia el servidor. (Siguiendo las instrucciones de instalación del programa)
2. Ingresa al sistema con un email y contraseña válidos. (/ingresar)
3. Si las credenciales son correctas recibirás un OK de un status 200.
4. Debes hacer un post al endpoint **/pedido**. En el body request debes enviar el objeto que se documenta en el endpoint /api-docs, específicamente en http://localhost:3000/api-docs/#/pedido/createPedido. El objeto debe tener las siguientes propiedades:

  {
    "id_foreign_estado_pedidos": 2,
    "id_foreign_forma_de_pago": 0,
    "id_foreign_user": 0,
    "lista_productos_pedido": [1,2,3,4,5,6,7]
  }
  
La propiedad "lista_productos_pedido" es un array con elementos tipo integer que corresponden a los ID de cada uno de los productos. El programa se encarga de crear la orden en la base de datos que puedes consultar en los endpoint **pedido/:id_pedido** o en **/historial** si es un pedido de su propia cuenta. Solo los administradores pueden ingresar a los pedidos de los demás usuarios.

### A cerca de estado de los pedidos y formas de pago

Estos campos se crearon como enumerables en la base de datos. Por tanto pueden ingresar un número o el string. Aquí las equivalencias:

* Formas de pago:
  1 - EFECTIVO | 2 - TARJETACREDITO | 3 - TARJETADEBITO | 4 - CRYPTOMONEDA | 5 - CONSIGNACION | 6 - PSE.
* Estado del pedido:
  1 - NUEVO | 2 - CONFIRMADO | 3 - PREPARANDO | 4 - ENVIANDO | 5 - ENTREGADO | 6 - CANCELADO.
  
El endpoint para cambiar el estado del pedido es **/pedido/:id_pedido** o **/pedido/:id_pedido/:id_usuario**. Solo el administrador puede actualizar el estado de los pedidos.
