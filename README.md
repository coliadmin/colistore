# coliburgers

> 📕 [github.com/colidevs/coliburgers](https://github.com/colidevs/coliburgers)
> 
> ‼️ Trabajar sobre la RAMA DEV, creen su rama en base a la dev, hacer pull request a la dev.

`coliburgers` es un proyecto tipo catálogo digital/e-commerce orientado a emprendimientos pequeños/medianos de hamburgueserías.

Funciona de forma `multi tenant` lo que quiere decir que gestionamos multiples clientes en paralelo con una sola aplicacion desplegada.

El cliente va a contar con un `template de google sheet` donde se sube toda la informacion necesaria para hacer funcionar la aplicación,

como los productos, informacion del local, etc.

> e.g: 🦄
> 
> 1.  Un usuario entra a: `cliente1.colidevs.com`
> 2.  La aplicacion busca en `Redis` si existe una key `coliburger:cliente1.colidevs.com`
>     1.  Si existe, **devuelve** la informacion requerida para el funcionamiento proyecto, como los **productos o informacion del local** (lo que se encuentra en el google sheet)
>     2.  Si no existe, busca la informacion a la `db` (google sheet) y la devuelve
>         1.  Guarda la informacion en `Redis` con la **key** conformada por `[proyecto]:[dominio]`, el **value** es un **json** encriptado con gzip (almacena un string en base64 para optimizar recursos)

Por nuestro lado, para habilitar a un nuevo cliente usamos Twenty, un CRM .

#### TODO:

- Preparar entorno qa de Twenty (hacer dump de Postgree y crear otra instancia de Twenty)
- Automatizar creacion de templates

### Tecnologías

- `NextJS 14.2.4`
- `React 18.3.1`
- `Tailwindcss 3.4.3`
- `Redis 4.7.0`
- `Googleapis 144.0.0`

### Requerimientos

- `nodejs` >=20 <21
- `pnpm` >= 9
- `template de hamburguesería en google sheets` (pedir una copia a fede)
- `docker` [Tutorial: Instalar Docker](https://www.youtube.com/watch?v=ZO4KWQfUBBc)
- `redis` (viene dentro de docker, no necesitan hacer nada)

---

### Levantar proyecto

> ‼️ Antes de empezar se debe gonfigurar los archivos `.env`
> 
> 1.  Crear un archivo `.env.local`
> 2.  Copiar el contenido de `.env.example`
> 3.  Settear valores a las variables (pedir a quien corresponda)

Para este proyecto es necesario tener levantado una instancia de `Redis`,

usamos `Docker` para facilitar la prueba en multiples entornos.

Para la el desarrollo del dia a dia vamos a usar el entorno local,

cuando tengamos un commit listo para llevar a la rama `dev` vamos a probar nuestra aplicacion en el entorno `Development`,

esto se repite de forma consecutiva y escalonada: `local > development(dev) > staging(stg) > production(prd-main)` .

#### Local:

Google Cloud Platform (GCP):

Necesitamos una cuenta de servicio, de momento vamos a usar este email:

```plaintext
colidevs-test-catalogos@colidevs-test-catalogos.iam.gserviceaccount.com
```

Google Sheets Template:

Necesitan una copia del template que usan las hamburgueserias(clientes)

Una vez con la copia hay que darle permisos de lectura a la cuenta de servicio de _gcp_

Copian el link y se lo asignan a la variable de entorno `API_DEV_STORAGE="your-dev-sheet-url"`

Discord Webhook:

Para el entorno de pruebas se preparó un canal en discord `#pruebas` y un webhook `colitester`, adjunto la url:

```plaintext
https://discord.com/api/webhooks/1322686042167443466/KRWxEv5_6-pr_zv70-oMeUquCPgVEWznfmVK__L9Sqa8VzVt-RrvfZwNXutc-LiwSrJZ
```

Twenty DEV:

#todo

Ya con esto podemos levantar el proyecto:

1.  Levantar redis → `pnpm start-redis`
2.  Levantar web → `pnpm dev`

> ⚠️ Si quieren detener el servicio de redis: `pnpm stop-redis`

Antes de ingresar a `http://localhost:3000` tenemos que configurar un archivo del SO,

no obtendremos ningun resultado valido si accedemos con ese dominio, necesitamos acceder mediante el dominio de un cliente.

Actualmente contamos con dos registros en la tabla de clientes con propositos de pruebas locales,

```
[{
  "name": "dev1",
  "domainName":"dev1.colidevs.com",
  "product":"dev",
  "features": null,
  "storage": {"primaryLinkLabel": "", "primaryLinkUrl": "", "secondaryLinks": []}
},
{
  "name": "dev2",
  "domainName":"dev2.colidevs.com",
  "product":"dev",
  "features": {"discount": true},
  "storage": {"primaryLinkLabel": "", "primaryLinkUrl": "", "secondaryLinks": []}
}]
```

Entonces vamos a usar alguno de estos users:

e.g:

Si decido probar el cliente fake `dev1`, tengo que ingresar a `dev1.colidevs.com`

Para hacer que esto funcione necesitamos crear un redireccionamiento,

desde `localhost` hacia `dev1.colidevs.com`

Para ello:

1.  Ejecutar como administrador `Sublime Text`
2.  Clickear en: File > Open file
3.  Vamos a la ruta: `C:\Windows\System32\drivers\etc`
4.  Seleccionar el archivo `hosts` y hacer click en abrir
5.  Agregar al final del archivo lo siguiente: (‼️**mucho cuidado** en este paso, **no borren ni modifiquen** nada, solo **agreguen al final del archivo**)
    
    ```plaintext
    # coliburgers
    127.0.0.1 dev1.colidevs.com
    ```
    

Con esto deberia bastar para hacer un redireccionamiento de `localhost` hacia `dev1.colidevs.com`

> `# coliburgers` es un comentario, los `#` indican comentarios.
> 
> `127.0.0.1` es lo mismo que `localhost`,
> 
> si quisieran agregar al segundo cliente solo tienen que agregarlo abajo de lo agregado con el mismo formato:  
> \[`ip] [dominio] => 127.0.0.1 dev2.colidevs.com`

6.  Guardar el archivo y cerrar `Sublime Text`
7.  Abrir el navegador e ingresar a `dev1.colidevs.com:3000` (si agregaron `dev2.colidevs.com` tambien va a funcionar)

#### Development:

> Compila una imagen de NextJS con las variables de entorno de `.env.development`
> 
> Se preparo un `compose.yaml` para levantar esta imagen y un servicio de `Redis`

1.  `pnpm start:dev`
2.  Ingresar a `[cliente].colidevs.com:3001`

> ⚠️ Para los siguiente entornos es necesario cambiar los valores de las variables de entorno

#### Staging:

> Compila una imagen de NextJS con las variables de entorno de `.env.staging`
> 
> Se preparo un `compose.yaml` para levantar esta imagen y un servicio de `Redis`

1.  `pnpm start:stg`
2.  Ingresar a `[cliente].colidevs.com:3002`

#### Production:

> Compila una imagen de NextJS con las variables de entorno de `.env.production`
> 
> Se preparo un `compose.yaml` para levantar esta imagen y un servicio de `Redis`

1.  `pnpm start:prd`
2.  Ingresar a `[cliente].colidevs.com:3003`

---

### Endpoints

Todos los endpoints estan bajo el prefijo `api`, de ahora en adelante las siguientes rutas dan por hecho el prefijo

`/company/[domain]`

POST:

Sirve para revalidar la informacion en redis.

e.g:

cliente: dev1

propósito: el cliente actualizo sus productos y quiere actualizar su web con estos nuevos productos

1.  El cliente manda la siguiente peticion: `/company/dev1.colidevs.com`
2.  El backend recibe la peticion, toma el `[domain]` y settea una flag en `Redis`
3.  El cliente ingresa a su web `dev1.colidevs.com`
4.  El frontend pregunta si el `[domain]` tiene una flag en `Redis`
    1.  Si existe la flag va a buscar la informacion a la `storage` (google sheet)
    2.  Si no existe la flag recupera la informacion de `Redis`
