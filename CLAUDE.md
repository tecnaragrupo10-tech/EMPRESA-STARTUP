# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Qué es este espacio de trabajo

Carpeta de trabajo de la startup **GolClip**: documentación y la web estática. No hay build, lint ni tests; la web se prueba abriendo `index.html` en el navegador. El usuario trabaja en español; responde y escribe en español.

Web (HTML + CSS + un JS): `index.html` es una página única con anclas (#inicio, #servicios, #proyectos, #equipo, #contacto); `equipo/<nombre>.html` son las fichas individuales, que enlazan con rutas `../`; `css/estilos.css` es la única hoja de estilos, compartida por todas las páginas, con los colores como variables en `:root`. La cabecera/menú, el `<link>` de la fuente Archivo y el pie están duplicados en cada página: si cambias uno, cámbialos todos.

Fichas del equipo: cabecera oscura `.ficha-hero` (dorsal, nombre con máscara, foto/iniciales, nombre de fondo en movimiento con `.palabra`), cita, esquema `.proceso` con los pasos de la persona marcados como `.paso--activo` (cada paso es una tarjeta que gira: `.paso__cara--frente` con la ilustración `img/paso-*.svg` y `.paso__cara--dorso` con el texto; gira solo al pulsarla (clic, toque o Intro/Espacio), añadiendo `.girada` desde `animaciones.js`), proyectos, `.etiquetas` y navegación a la siguiente ficha. Al añadir una persona: copia una ficha, cambia dorsal, datos y pasos activos, y enlázala desde la ficha anterior y desde `#equipo`.

Animaciones (index y fichas, con el mismo script): `js/animaciones.js` hace la entrada del inicio con Web Animations API, el giro 3D del campo ligado al scroll y la aparición de tarjetas con IntersectionObserver. Un script en el `<head>` pone la clase `pre` en `<html>` para ocultar el inicio hasta que arranca la entrada (con salida de seguridad a los 3 s). La escena es CSS 3D sobre `img/campo.svg` (`.escena__giro` = scroll, `.escena__camara` = entrada; están separadas para que sus transforms no se pisen) y `img/movil.svg` va encima en plano. Con `prefers-reduced-motion` no se anima nada: mantenlo al añadir animaciones.

- [brief-golclip.md](brief-golclip.md): brief de GolClip. Es la fuente de verdad sobre el producto, los servicios, los proyectos, el tono, los colores y el equipo. Consúltalo antes de escribir textos o diseñar piezas. No inventes datos que no estén ahí (cifras, clientes, datos de contacto): deja un marcador `[ ]` y avisa.

## Tono y marca

Para cualquier texto de GolClip usa la skill `voz-golclip` ([.claude/skills/voz - GolClip/SKILL.md](.claude/skills/voz%20-%20GolClip/SKILL.md)).

Profesional deportivo, tratando al lector de usted: serio y técnico, como un analista de rendimiento. Datos y resultados, sin exageraciones. Paleta: verde césped `#2E8B3A`, negro `#111111`, blanco `#FFFFFF`.

## Contexto técnico (para cuando haya código)

Según el brief, los productos previstos son una plataforma web para clubes (beta) y una PWA instalable para jugadores (en desarrollo). El desarrollador del equipo (Danny) trabaja sobre todo con HTML, CSS y JavaScript.
