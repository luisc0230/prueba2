# [Server-Webview-NodeJS]
##  Índice
* [1. Introducción](#1-introducción)
* [2. Requisitos previos](#2-requisitos-previos)
* [3. Configuración](#3-configuracion)
* [4. Datos de conexión](#4-datos-de-conexión)
* [5. Ejecutar proyecto](#5-ejecutar-proyecto)
* [6. Subirlo al servidor web](#6-subirlo-al-servidor-web)
* [7. Configurar la URL de notificacion al final del pago](#7--configurar-la-url-de-notificaci%C3%B3n-al-final-del-pago)
## 1. Introducción
En este manual podrás encontrar una guía paso a paso para configurar un servidor de **[NodeJS]** para generar un link de redirección. Te proporcionaremos instrucciones detalladas y credenciales de prueba para la instalación y configuración del proyecto, permitiéndote trabajar y experimentar de manera segura en tu propio entorno local.
Este manual está diseñado para ayudarte a comprender el flujo de la integración de la pasarela para ayudarte a aprovechar al máximo tu proyecto y facilitar tu experiencia de desarrollo.

<p align="center">
  <img src="https://i.postimg.cc/cHZ6KrSp/portada.png" alt="Portada" width="850"/>
</p>

<a name="Requisitos_Previos"></a>
 
## 2. Requisitos previos
* Comprender el flujo de comunicación de la pasarela. [Información Aquí](https://secure.micuentaweb.pe/doc/es-PE/rest/V4.0/javascript/guide/start.html)
* Extraer credenciales del Back Office Vendedor. [Guía Aquí](https://github.com/izipay-pe/obtener-credenciales-de-conexion)
  
> [!NOTE]
> Tener en cuenta que, para que el desarrollo de tu proyecto, eres libre de emplear tus herramientas preferidas.

## 3. Configuracion
### Instalar módulos:
```sh
npm install
```

### Clonar el proyecto:
  ```sh
  git clone [https://github.com/izipay-pe/Server-Webview-NodeJS.git]
  ```

## 4. Datos de conexión 

**Nota**: Reemplace los datos con sus credenciales de `API formulario V1, V2 y WP SOAP` extraídas desde el Back Office Vendedor, ver [Requisitos Previos](#Requisitos_Previos).

* Editar en `keys/keys.js` :
<p align="center">
  <img src="https://i.postimg.cc/NfLF233j/keys.png" alt="Credentials"/>
</p>

## 5. Ejecutar proyecto
```bash
npm start
```

## 6. Subirlo al servidor web

Para este ejemplo se utilizó reenvío de puertos en Visual Studio Code, siga los siguientes pasos.

  * Paso 1: Dirigirse a la pestaña de PORTS.
  * Paso 2: Iniciar sesión en GitHub en caso no ha iniciado sesión anteriormente.
  * Paso 3: Añadir el puerto de conexión que se desea sea accesible, en este caso el 3000.  
  * Paso 4: Cambiar la visibilidad a Públic, para permitir conexiones sin inicio de sesión. 

    <p align="center">
  <img src="https://i.postimg.cc/xC0TfhGY/puerto.png" />
</p>

## 7. Probar el servidor desde POSTMAN

* Colocar la URL con el metodo POST a la ruta `/url` y enviar la consulta.
  
 ```bash
https://w2hs6ll5-3000.brs.devtunnels.ms/url
```

* Datos a enviar en formato JSON raw:
 ```bash
{
    "email": "example12@gmail.com",
    "amount": "100",
    "currency": "604", //Soles
    "mode": "TEST",
    "language": "es",
    "orderId": "test-12"
}
```
