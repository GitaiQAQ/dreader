import sys
import json
from io import StringIO
from ebooklib import epub
import requests
import base64

if __name__ == '__main__':
  fileName = sys.argv[1] if len(sys.argv) > 1 else 'decoded.json'
  jsonStr = open(fileName).read()
  jsonObj = json.loads(jsonStr)


  book = epub.EpubBook()
  
  css = epub.EpubItem(uid="style", file_name="style.css", media_type="text/css", content='''
  h2
  {
    margin-bottom: 5em;
  }
  p
  {
    font-size: 1em;
    text-indent: 2em;
    margin-bottom: 0.5em;
  }
  .p_bold
  {
    font-weight: bold;
  }
  .p_quote
  {
    text-decoration: underline;
  }
  .t_indent
  {
    text-indent: 0;
  }
  .p_align_center, .p_align_right
  {
    text-indent: 0;
  }
  .p_align_center
  {
    text-align: center;
  }
  .p_align_right
  {
    text-align: right;
  }
  .regular_script
  {
    font-style: italic;
  }
  .footnote
  {
    vertical-align: super;
    font-size: 50%;
  }
  .emphasize
  {
    font-weight: bold;
    font-style: italic;
  }

  .illus
  {
    width: 100%;
    height: auto;
  }

  ''')
  book.add_item(css)

  # set metadata
  book.set_identifier('lol')
  book.set_title('biubiu')
  book.set_language('cn')

  book.add_author(jsonObj['authorId'])

  chapters = []
  toc = ()

  classes = set()
  for index, post in enumerate(jsonObj['posts']):
    c1 = epub.EpubHtml(title=post['title'], file_name='post%d.html' % (index), lang='cn')
    c1.add_item(css)
    contentIO = StringIO()

    contentIO.write('<link ref="stylesheet" type="text/css" href="style.css" />')
    contentIO.write('<h1>%s</h1>' % (post['title']))
    if 'subtitle' in post and len(post['subtitle']) > 0:
      contentIO.write('<h2>%s</h2>' % (post['subtitle']))

    heads = []
    for content in post['contents']:
      markup = None
      if content['type'] == 'paragraph':
        markup = 'p'
      elif content['type'] == 'headline':
        markup = 'h3'
      elif content['type'] == 'pagebreak':
        contentIO.write('<div style=”page-break-before:always;”></div>')
        continue
      elif content['type'] == 'illus':
        print(content);
        contentIO.write('<p><img class="illus" alt="" src="data:')

        url = max([imgInfo for imgInfo in content['data']['size'].values()], key=lambda info: info['width'])['src']
        print('downloading', url)
        r = requests.get(url)
        contentIO.write(r.headers['content-type'])
        contentIO.write(';base64,')
        contentIO.write(str(base64.b64encode(r.content), encoding='UTF-8'))
        print(str(base64.b64encode(r.content), encoding='UTF-8'))
        contentIO.write('" />')
        print('done.')
        continue
      else:
        print('wtf...', content['type'])
        continue

      contentIO.write('<%s class="' % (markup))
      for format, value in content['data']['format'].items():
        if format == 'p_align':
          if value != 'left':
            contentIO.write('p_align_%s ' % (value))
            classes.add('p_align_%s' % (value))
        else:
          if value:
            contentIO.write(format + ' ')
            classes.add(format)


      isPlainText = isinstance(content['data']['text'], str)
      if markup == 'h3':#add id for anchor
        contentIO.write('" id="%d' % (content['id']))
        heads.append((content['id'], content['data']['text'] if isPlainText else
          ''.join(text['content'] for text in content['data']['text'] if text['kind'] == 'plaintext')))
      contentIO.write('">')

      if isPlainText:
        contentIO.write(content['data']['text'])
      else:
        for text in content['data']['text']:
          contentIO.write('<span class="%s">' % (text['kind']))
          classes.add(text['kind'])

          contentIO.write(text['content'])
          contentIO.write('</span>')
          

      contentIO.write('</%s>' % (markup))

    c1.content = contentIO.getvalue()

    book.add_item(c1)

    chapters.append(c1)

    toc += (c1,)
    for id, text in heads:
      toc += (epub.Link('%s#%d' % (c1.file_name, id), '\t' + text, text),)


  # define Table Of Contents
  
  book.toc = toc
  print(classes)
  
  # add default NCX and Nav file
  book.add_item(epub.EpubNcx())
  book.add_item(epub.EpubNav())

  # define CSS style
  


  # basic spine
  book.spine = chapters

  # write to the file
  epub.write_epub('test.epub', book, {})

