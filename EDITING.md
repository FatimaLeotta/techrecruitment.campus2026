# Cómo editar el contenido del campus

`index.html` es un archivo **bundleado** (compilado). El contenido real del
campus —metadatos, lecciones, videos, encuentros en vivo, recursos— vive en
un único bloque de lógica dentro de ese archivo.

Para editarlo de forma segura hay un helper: **`campus_build.py`**.

## Flujo de edición

```bash
python3 campus_build.py extract     # saca el contenido a campus_content.js
# ... editar campus_content.js ...
python3 campus_build.py inject      # reconstruye index.html
git add -A && git commit -m "..."   # commit
git push                            # Vercel redeploya solo
```

`campus_content.js` es la **fuente de verdad** editable. `index.html` es el
resultado compilado. Nunca se edita `index.html` a mano.

## Verificar integridad

```bash
python3 campus_build.py roundtrip-test
```

Debe imprimir `PASS`: garantiza que extraer + inyectar deja el bundle intacto.

## Dónde está cada cosa en campus_content.js

- `meta` — datos del curso (inicio, fin, duración, etc.)
- `funciona` — cómo funciona el campus (bullets)
- `weeks` — las 7 semanas (Bienvenida, Lección 1–5, Bonus)
- `groups` → `rows` — la tabla de progreso: lecciones (con sus videos) y
  encuentros en vivo. Cada video puede ser un string o
  `{ text, href, unlockAt }`. Los `href` de Drive/Meet van acá.
- `recursos` — WhatsApp, certificado, grabaciones (footer de recursos)
