#!/usr/bin/env python3
"""
Herramienta de edición para el campus (index.html bundleado).

El contenido real del campus vive en un bloque <script type="text/x-dc">
dentro de un <script type="__bundler/template"> (JSON) dentro de index.html.

Este helper permite:
  - extract : sacar ese bloque de lógica/contenido a un archivo limpio
              (campus_content.js) para editarlo cómodo.
  - inject  : volver a meter campus_content.js dentro de index.html,
              re-serializando SOLO el template (no toca fuentes/imágenes).

Uso:
  python3 campus_build.py extract
  python3 campus_build.py inject
  python3 campus_build.py roundtrip-test   # verifica integridad
"""
import re, json, sys, html as htmllib

INDEX = "index.html"
CONTENT = "campus_content.js"

TEMPLATE_RE = re.compile(
    r'(<script type="__bundler/template">)(.*?)(</script>)', re.DOTALL)
XDC_RE = re.compile(
    r'(<script type="text/x-dc"[^>]*>)(.*?)(</script>)', re.DOTALL)


def read_index():
    with open(INDEX, "r", encoding="utf-8") as f:
        return f.read()


def get_template(index_html):
    m = TEMPLATE_RE.search(index_html)
    if not m:
        raise RuntimeError("No encontré el <script __bundler/template>")
    return m, json.loads(m.group(2))


def get_body(template_str):
    m = XDC_RE.search(template_str)
    if not m:
        raise RuntimeError("No encontré el <script text/x-dc> en el template")
    return m, m.group(2)


def extract():
    index_html = read_index()
    _, template = get_template(index_html)
    _, body = get_body(template)
    with open(CONTENT, "w", encoding="utf-8") as f:
        f.write(body)
    print(f"[extract] OK -> {CONTENT} ({len(body)} chars)")


def inject():
    index_html = read_index()
    tmpl_match, template = get_template(index_html)
    xdc_match, _ = get_body(template)
    with open(CONTENT, "r", encoding="utf-8") as f:
        new_body = f.read()
    # Reemplazar el cuerpo del x-dc dentro del template string
    new_template = (template[:xdc_match.start(2)] + new_body +
                    template[xdc_match.end(2):])
    # Re-serializar SOLO el template (json), dejar todo lo demás igual.
    # El bundler original escapa la secuencia "</" como "<\u002F" para que
    # los tags de cierre internos no rompan el <script>. Replicamos eso.
    new_template_json = json.dumps(new_template, ensure_ascii=False)
    new_template_json = new_template_json.replace("</", "<\\u002F")
    # Preservar el espaciado (saltos de línea) que rodea al JSON original,
    # para que el diff en GitHub muestre solo cambios reales de contenido.
    orig_block = tmpl_match.group(2)
    lead = orig_block[:len(orig_block) - len(orig_block.lstrip())]
    trail = orig_block[len(orig_block.rstrip()):]
    new_index = (index_html[:tmpl_match.start(2)] + lead + new_template_json +
                 trail + index_html[tmpl_match.end(2):])
    with open(INDEX, "w", encoding="utf-8") as f:
        f.write(new_index)
    print(f"[inject] OK. index.html reescrito ({len(new_index)} chars).")


def roundtrip_test():
    """extract -> inject sin cambios debe preservar el template exacto."""
    index_html = read_index()
    _, template_before = get_template(index_html)
    extract()
    inject()
    index_html2 = read_index()
    _, template_after = get_template(index_html2)
    if template_before == template_after:
        print("[roundtrip-test] PASS: template idéntico tras extract+inject.")
    else:
        print("[roundtrip-test] FAIL: el template cambió.")
        sys.exit(1)


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "extract"
    {"extract": extract, "inject": inject,
     "roundtrip-test": roundtrip_test}[cmd]()
