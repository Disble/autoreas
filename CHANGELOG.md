# Change Log
Todos los cambios importantes de Autoreas van a ser documentados en este archivo.

## [2.2.0]
### Novedades
- Ahora cuando hagas clic derecho en el ícono de carpeta o link se copiará la dirección directamente en el portapapeles.

### Corrección de errores
- Hemos hecho pequeñas mejoras en el tema oscuro.

## [2.1.1]
### Corrección de errores
- Solucionado: Por alguna razón no era posible abrir la carpeta desde la sección `Ver animes`, esto ya esta solucionado y nos disculpamos por los problemas que esto pudo haber causado.

## [2.1.0]
### Novedades
- Hemos estado trabajando duro para integrar un nuevo **modo oscuro** que se podrá habilitar desde Opciones. \(^o^)/ Si eso de tener que hacer elecciones no es lo tuyo puedes dejar que el SO lo haga por ti (por defecto elige el SO).
- Lo sabemos, esto sucede una vez cada varios meses, pero era necesario, hemos agregado un **modo temporada** que te permitirá mostrar directamente la lista de los animes de estreno que vayas agregando.
- Si, por alguna razón, cuando regresabas de ver la *info* de algún anime te regresaba al principio del historial, sabemos lo tedioso que volverlo a buscar, así que hemos cambiado este comportamiento y prometemos que no volverá a suceder.
- En ***Editar*** y ***Agregar*** animes ahora se puede ver directamente en que día y orden se muestran cada anime.
- El título de cada repetición de anime era muy difícil de entender, lo hemos replanteado y ahora esperamos que sea más natural.
- En las nuevas instalaciones de **Autoreas** se mostrará en los archivos del sistema y accesos directos como **Autoreas** (con mayúscula la primera letra).

### Corrección de errores
- Solucionado: Si te pasaba que ahora salían menos animes en `Capítulos vistos`, no te preocupes, ya lo hemos corregido.
- Solucionado: La imagen de portada de anime en `Ver animes` no se conectaba con `Info`, ya las hemos conectado de nuevo.

## [2.0.3]
### Corrección de errores
- Solucionado: Por alguna motivo el icono de la aplicación se distorsionaba en la barra de tareas de Windows, sabemos que no eran las mejores vistas por lo que lo hemos cambiado, esperemos mejores vistas desde ahora.
- Solucionado: Al agregar una carpeta a un anime, esta se agregaba con todo el contenido o simplemente no se agregaba, este no debería ser el comportamiento adecuado, lo hemos hablado seriamente y ha prometido que no volverá a suceder.
- Solucionado: La nueva opción de importar o exportar, no funcionaba, esta vez si lo hemos corregido (o eso esperamos).
- Solucionado: En la información del anime en Historial en lugar de mostrarse en la gráfica los capítulos vistos y los restantes se mostraban los vistos y el total, entendemos que esta vista no era muy útil así que la hemos cambiado por una más útil.
- Solucionado: Algunas pequeñas cositas sin importancia.

## [2.0.2]
### Corrección de errores
- Por algún extraña razón el orden de los animes se volvía completamente aleatorio, ¿por qué?, ¡Vaya uno a saber! Pero, al menos ya lo hemos arreglado.

## [2.0.0]
### Novedades incompatibles
- La estructura de los datos internos ha cambiado completamente, pero no te preocupes, la misma aplicación se encarga de actualizar tus datos antiguos a los nuevos. \(^o^)/
- Lo hemos pensado mucho, pero creemos que es lo mejor; desde ahora ya no se pueden agregar ni quitar días de la semana desde `Opciones`, lo sentimos. :(

### Novedades
- Antes estabas obligado a programar solo una día de la semana por anime, sabemos que quieres verlo más de un día a la semana, así que desde ahora ya puedes programar varios días de la semana para cualquier anime.
- Ahora puedes recordar más cosas de tus animes favoritos, como el género, origen, duración por capítulo o cuando se publico. Todo esto se puede modificar en `Editar Animes` y es perfectamente visible en los detalles del anime en `Historial`.
- Sabemos que no quieres perder los valiosos registros de tu historia por el anime, no te preocupes, hemos agregado una opción de `exportar` e `importar`, para que nunca más te preocupes por ello.
- Hemos agregado una nueva opción de ver las `Notas de Versión`, para que siempre estés actualizado con los detalles de la última actualización.
- Hemos actualizado la vista de `Ver Animes`, hemos hecho muchos cambios estéticos, pero todas las antiguas funciones siguen allí, incluso hemos agregado una hermosa imagen a un costado (puedes cambiarla).
- Ahora ya puedes recordar que programa enlazaste al icono del cohete sin salir de la página.
- Hemos cambiado la forma en ves los detalles de un anime en `Historial`, ahora se abren en una nueva página y son muchos más detallados.
- Hemos agregado un nueva función para que puedas `repetir` el anime que quieras, se encuentra dentro de los detalles del anime en `Historial` (tienes que terminar de verlo primero... ¬¬).
- Hemos cambiado "ligeramente" nuestra paleta de colores, esperemos no se note tanto.
- Si es la primera vez que usas la aplicación es posible que no tengas datos que mostrar en pantalla, hemos agregado unas bonitas imágenes para hacer más ameno estos primeros momentos.
- Hemos cambiado el icono de nuestra app para que este más en línea con los colores de la misma.
- Hemos actualizado el motor de la app de electron 3 a 7, si de casualidad ves la barra del menú de color negro, es porque ahora se adapta al tema del sistema operativo.
- Hemos retocado ligeramente el orden de las opciones de la barra de menú, sabemos que será confuso al principio, pero es por un bien mayor.


### Corrección de errores
- Antes había ocasiones que al crear un anime desde Pendientes creaba dos animes en lugar de uno. Si te paso esto y te quedaste con la duda de si habías pulsado dos veces el botón, no eras tu éramos nosotros. Ya esta solucionado.
- Si veías que al abrir la aplicación el título cambiaba de minúsculas a mayúsculas sin razón aparente, no era una ilusión, en realidad pasaba. Ya no volverá a suceder.


## [1.1.0]
### Novedades
- Se cambiaron los nombres de los títulos de cada sección, y sección de menú.
- Se simplifico la forma de agregar nuevos animes. Ahora es mucho más intuitiva.
- Ahora se puede pegar texto en un campo de varias maneras: arrastrando el texto, con clic derecho, `ctrl + v`.

## Corrección de errores
- Por alguna razón los filtros del buscador no coincidían con las otras secciones. Esto ya esta solucionado y no debería haber más confusiones.

## [1.0.1]
## Corrección de errores
- Anteriormente en el menú de Opciones al seleccionar repetidamente días, este agregaba una nueva Zona de peligro aunque ya estuviera una creada, ahora ya no pasara esto.

## [1.0.0]
### Novedades
- Primera versión instalable de Autoreas.

## Corrección de errores
- Cuando los nombres de los gráficos estadísticos eran muy grandes, el gráfico se hacia muy pequeño. Ahora cuando el nombre sea excesivamente largo se cortara para que el gráfico no se haga muy pequeño.
