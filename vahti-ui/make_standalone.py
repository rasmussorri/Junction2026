"""Builds vahti.html: the whole UI in one file (CSS, font, data, reports, JS) for opening without a server."""
import base64, glob, json, os

os.chdir(os.path.dirname(os.path.abspath(__file__)))
css = open('static/styles.css', encoding='utf-8').read()
font = base64.b64encode(open('static/fonts/dm-sans.woff2', 'rb').read()).decode()
css = css.replace('url("fonts/dm-sans.woff2")', f'url(data:font/woff2;base64,{font})')
data = open('static/data.json', encoding='utf-8').read()
reports = {os.path.basename(p)[:-5]: json.load(open(p, encoding='utf-8')) for p in glob.glob('reports/*.json')}
html = open('static/index.html', encoding='utf-8').read()
html = html.replace('<link rel="stylesheet" href="styles.css">', '<style>\n' + css + '\n</style>')
html = html.replace('<script src="app.js"></script>',
                    '<script>window.__DATA__=' + data + ';window.__REPORTS__=' + json.dumps(reports, ensure_ascii=False) + ';</script>\n'
                    '<script>\n' + open('static/app.js', encoding='utf-8').read() + '\n</script>')
open('vahti.html', 'w', encoding='utf-8').write(html)
print(f'vahti.html {len(html) // 1000} kB')
