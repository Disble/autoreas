# Autoreas

## Descripción y contexto
---

> **Nota:** Este es un fork del proyecto [automatizar-tareas](https://github.com/Disble/automatizar-tareas) con la intencón de extender el mismo con funcionalidades de [Svelte](https://svelte.dev) y librerias actualizadas.

Esta aplicación tiene como principio la sencillez y accesibilidad de uso, ayudando al usuario con un sistema de control rápido y seguro, o como el lema que precede a esta aplicación dice.

> Apoyando la vagancia desde tiempos inmemoriales.

Enfocada principalmente como un Sistema de Control de Capítulos (o SCC siglas que acabo de inventar) de animes vistos. Teniendo un ciclo completo (agregar, ver, editar, borrar) en su presente versión.

Como parte del programa, diseñado al comienzo del desarrollo se presentarán las siguientes funciones. De las cuales actualmente ya se tienen cumplidas las siguientes funciones (sujetos a posibles cambios).

### **Lista de Animes (enlazado a carpetas y web)**
- **Animes**
 - [x] Agregar
 - [x] Editar
 - [x] Ver
 - [x] Borrar (no permanente)
 - [x] Cambiar estado (finalizado, viendo, no me gusto, en pausa)
- **Estadísticas**
 - [x] Historial de Animes vistos (todos)
    - Datos por anime
    - Borrar (permanente)
    - Restaurar (regresa a la lista de Ver Animes)
    - Repetir
    - Buscador
    - Filtros para el buscador e historial
 - [x] Gráfica de capítulos vistos de todos los animes (viendo)
 - [x] Gráfica de las páginas de los animes (viendo)
 - [x] Gráfica de los capítulos restantes de los animes (viendo y con capítulos restantes asignado)

### **Lista de Pendientes (solo como lista)**
 - [x] Agregar
 - [x] Editar
 - [x] Ver
 - [x] Borrar
 - [x] Crear Anime a partir de Pendiente (fork)

### **Preferencias**
 - [x] Opciones
    - Días (cambiar de nombre)
    - Gestor de descargas (acceso directo)
    - Respaldos (importar y exportar)
    - Modo temporada
    - Modo oscuro

### Características escondidas por Función
- **Lista de Animes**
 - [x] Si se guarda como página la URL de la misma, se activa un link de redirección externo.
 - [x] No se necesita poner tildes, ni mayúsculas a los días de la semana.
 - [x] Cuando se finaliza un anime pero no se elimina, aparece un contador en el menú de días de Ver Animes.
 - [x] Cuando se posa el puntero encima de los capítulos vistos, muestra los capítulos restantes.
 - [x] Si se hace clic derecho en los botones `Cap -` y `Cap +` solo resta o aumenta 0.5 al número de capítulos respectivamente.
 - [x] Si esta configurado el Gestor de descargas aparecerá un icono a la derecha del título. 
 - [x] Clic derecho en el ícono de carpeta o link copiara la dirección al portapapeles.

## Guía de usuario
---
Explica los pasos básicos sobre cómo usar la herramienta digital. Es una buena sección para mostrar capturas de pantalla o gifs que ayuden a entender la herramienta digital.

## Guía de instalación
---
Primero, se necesita tener instalado [nodejs](https://nodejs.org/en/download/) y [git](https://git-scm.com/downloads) para utilizar esta aplicación (al menos en versiones pre-release), recomiendo instalarlos desde su página oficial pero también hay otras páginas que dan mayores facilidades dependiendo del sistema operativo, la instalación es relativamente sencilla.

Una vez instalados, abrir la terminal, ir al lugar donde planea guardar la aplicación y ejecutar los siguientes comandos.

```bash
git clone https://github.com/Disble/autoreas.git
cd autoreas
npm install
npm run dev
```


## Autor/es
---
Proyecto creado por @Disble

## Información adicional
---
Es fácil recordar una vez a la semana “Cierto hoy tengo que ver el nuevo capítulo de [agregue nombre de su anime favorito aquí]”, pero la situación cambia cuando se ven muchos animes por semana (yo he llegado a los 16 por semana), muchas veces, por día y a eso hay que sumarle que no siempre salen todos los animes en su página de descargas favorita y uno tiene que buscar en varias páginas para encontrar el capítulo deseado.

Es por esto y que me gusta apoyar a la vagancia (es el lema del proyecto) que he decidido hacer una aplicación que ayude a administrar todas estas variantes o como me gusta llamarlo Sistema de Control de Capítulos (o SCC) para enfocarse en lo que verdaderamente importa.

Ver anime.

## Versiones
---
Las versiones de esta aplicación fueron creadas basándose en [Versionado Semántico](http://semver.org/).

**Next Update: Tooltip Update**

## Licencia
---
Este proyecto está bajo la licencia [MIT](./LICENSE) que esta adjuntado en el mismo.
