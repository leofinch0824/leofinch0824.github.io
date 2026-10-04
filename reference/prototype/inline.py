#!/usr/bin/env python3
"""内联模板：把 base.css 与 webp 图片以 data URI 注入，产出单文件 HTML。

模板占位符:
  %%STYLE%%         -> build/base.css 内容
  %%IMG:<name>%%    -> shots/img/<name>.webp 的 data URI
"""
import base64, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
BUILD = ROOT / "build"
IMGDIR = ROOT / "shots" / "img"

CSS = (BUILD / "base.css").read_text(encoding="utf-8")

_cache: dict[str, str] = {}


def data_uri(name: str) -> str:
    if name in _cache:
        return _cache[name]
    path = IMGDIR / f"{name}.webp"
    if not path.exists():
        sys.exit(f"missing image: {path}")
    b64 = base64.b64encode(path.read_bytes()).decode("ascii")
    uri = f"data:image/webp;base64,{b64}"
    _cache[name] = uri
    return uri


TOKEN = re.compile(r"%%IMG:([a-z0-9_]+)%%")


def build(tpl_name: str, out_name: str) -> None:
    html = (BUILD / tpl_name).read_text(encoding="utf-8")
    html = html.replace("%%STYLE%%", CSS.strip())
    html = TOKEN.sub(lambda m: data_uri(m.group(1)), html)
    if "%%" in html:
        leftovers = re.findall(r"%%[^%]+%%", html)
        sys.exit(f"{tpl_name}: unresolved tokens {leftovers[:5]}")
    out = ROOT / out_name
    out.write_text(html, encoding="utf-8")
    print(f"{out_name:16} {out.stat().st_size/1024:8.1f} KB")


if __name__ == "__main__":
    build("home.tpl.html", "index.html")
    build("archive.tpl.html", "archive.html")
    build("post.tpl.html", "post.html")
    build("about.tpl.html", "about.html")
