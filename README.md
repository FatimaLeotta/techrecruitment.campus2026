# Campus del curso con progreso

Sitio estático de una sola página (archivo autocontenido: fuentes, imágenes y estilos incrustados).

## Deploy en Vercel

1. Importá este repositorio en Vercel (**Add New → Project → Import**).
2. Framework Preset: **Other**.
3. Dejá **Build Command** y **Output Directory** vacíos.

Vercel sirve el `index.html` de la raíz directamente. No requiere build ni dependencias.

## Local

Abrí `index.html` en el navegador, o serví la carpeta:

```bash
npx serve .
```
