import codecs
import urllib

from BeautifulSoup import BeautifulSoup

url = "http://stats.grok.se/en/top"
soup = BeautifulSoup(urllib.urlopen(url).read(),
                     convertEntities=BeautifulSoup.HTML_ENTITIES)
rows = soup.find("table").findAll('tr')[1:]
names = [row.findAll('td')[1].getText() for row in rows]

def check_name(name):
    disallowed_prefixes = ['File:', 'List of', 'Special:',
                           'Wikipedia:', 'Main Page', 'w/', 'Portal:']
    return not any(name.startswith(prefix) for prefix in disallowed_prefixes)

new_lines = set(name+"\n" for name in names if check_name(name))
old_lines = set(codecs.open('article_names.txt', encoding="UTF-16"))

with open('article_names.txt', 'w') as f:
    f.write("".join(new_lines | old_lines).encode("UTF-16"))
