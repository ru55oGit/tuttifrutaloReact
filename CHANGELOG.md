# Changelog

Todos los cambios notables de este proyecto se documentan en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/).

## [Unreleased]
### Added
- Home: si se llega con `?from=boludeando` en la URL (viene del hub "Dejá de Boludear"), se muestra un botón de volver arriba a la izquierda (blanco, flecha roja, radius 8px) que lleva de vuelta al hub
- Diccionario (categoría "Cosa"): agregar `EXTRA_GENERIC_WORDS` con "wifi" y "kiwi" (no están en an-array-of-spanish-words), mismo criterio que letrisReact/viborealoReact/enganchadoReact
### Changed
- AdSense: sacar el script del `index.html` (se cargaba en todo el sitio) y cargarlo solo desde Home y Privacidad (componente `AdsenseScript`) — nunca en `/game`, que es una pantalla de juego sin texto. Mismo fix que en Enganchalo, que Google rechazó por "anuncios servidos por Google en pantallas sin contenido del editor"

### Fixed
- Header: tocar el título (para volver a Home) seleccionaba el texto en mobile y disparaba el popup de "Buscar en Google" del navegador — agregar `userSelect: none`
- Home: agregar emoji de momento del día al saludo (☀️/🌤️/🌙), mismo tratamiento que ya tenía Enganchalo

## [2026-07-26]
### Added
- SEO: agregar og:url y canonical (faltaban, el script de AdSense ya estaba)
- SEO: agregar robots.txt y sitemap.xml (faltaban)
### Changed
- Datos: ampliar Colores de 45 a 104 palabras

## [2026-07-24]
### Added
- Home: normalizar spacing título/tagline, box cuadrado, botón, y agregar "tiempo sin jugar"
- Home: agregar preview de ronda de ejemplo arriba del botón de jugar
- Datos: agregar Secretario y Niñero (faltaba el masculino junto a Secretaria/Niñera)
- Datos: agregar la forma femenina a las profesiones que la tenían solo en masculino
- Sumar bonus de puntaje por tiempo restante (proporcional, funciona igual con 60 o 90s)
- Datos: agregar Labrador a profesiones (Leñador ya existía)
- Datos: agregar Armadillo/Mulita/Peludo/Tatú y Anestesiólogo (faltaban, reportado en gameplay real)
### Fixed
- Fix: no dar bonus por tiempo si hay alguna respuesta inválida
- Fix: el botón BASTA quedaba tapado por el teclado virtual en mobile

## [2026-07-23]
### Added
- Datos: sumar profesiones y ampliar nombres desde el listado oficial de nombres permitidos
### Changed
- Mobile: evitar que el teclado nativo tape los campos de respuesta

## [2026-07-22]
### Changed
- Commit inicial: Tuttifrutalo, juego de Basta/Stop contrarreloj
