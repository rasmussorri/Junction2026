"""Extract report tables without executing embedded JavaScript. Python stdlib only."""
import sys, json, re
from html.parser import HTMLParser

class Tables(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tables, self.headings, self.group = [], {}, None
        self.skip, self.capture, self.text = 0, None, []
        self.table, self.row = None, None
    def handle_starttag(self, tag, attrs):
        if tag in ('script', 'style'):
            self.skip += 1
        if self.skip:
            return
        if re.fullmatch(r'h[1-6]', tag) or tag == 'strong':
            self.capture, self.text = tag, []
        elif tag == 'table':
            self.table = []
        elif tag == 'tr' and self.table is not None:
            self.row = []
        elif tag in ('td', 'th') and self.row is not None:
            self.capture, self.text = tag, []
        elif tag == 'br' and self.capture:
            self.text.append(' ')
    def handle_data(self, data):
        if not self.skip and self.capture:
            self.text.append(data)
    def handle_endtag(self, tag):
        if tag in ('script', 'style'):
            self.skip = max(0, self.skip - 1)
            return
        if self.skip:
            return
        if tag == self.capture:
            value = ' '.join(''.join(self.text).split())
            if re.fullmatch(r'h[1-6]', tag):
                level = int(tag[1])
                self.headings = {k: v for k, v in self.headings.items() if k < level}
                self.headings[level], self.group = value, None
            elif tag == 'strong' and value in ('Ikäryhmäseulonta', 'Riskiryhmäseulonta'):
                self.group = value
            elif tag in ('td', 'th') and self.row is not None:
                self.row.append(value)
            self.capture = None
        elif tag == 'tr' and self.row is not None:
            self.table.append(self.row)
            self.row = None
        elif tag == 'table' and self.table is not None:
            self.tables.append({'headings': list(self.headings.values()), 'group': self.group, 'rows': self.table})
            self.table = None

parser = Tables()
parser.feed(sys.stdin.read())
print(json.dumps(parser.tables, ensure_ascii=False))
