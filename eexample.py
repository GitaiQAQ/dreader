from ebooklib import epub
from ebooklib.plugins import standard

book = epub.EpubBook()

# add basic metadata
book.set_identifier('sample123456')
book.set_title('Sample book')
book.set_language('en')

book.add_author('Aleksandar Erkalovic')
book.add_author('Danko Bananko', 
                 file_as='Gospodin Danko Bananko', 
                 role='ill', 
                 uid='coauthor')

# define style for content
style = '''BODY { text-align: justify;}'''
default_css = epub.EpubItem(uid="style_default", 
                            file_name="style/default.css", 
                            media_type="text/css", 
                            content=style)

# intro chapter
c1 = epub.EpubHtml(title='Introduction', 
                   file_name='intro.xhtml')
c1.content=u'<h1>Introduction</h1><p>Introduction paragraph.</p>'

# set language just for this chapter
c1.set_language('hr')

# set properties for this file
c1.properties.append('rendition:layout-pre-paginated rendition:orientation-landscape')

# this chapter should also include this css file
c1.add_item(default_css)

book.add_item(c1)

# create table of contents
book.toc = (epub.Link('intro.xhtml', 'Introduction', 'intro'),
            (epub.Section('Languages'),
              (c1, ))
            )

# style for navigation file
style = 'BODY { color: black; }'
nav_css = epub.EpubItem(uid="style_nav", 
                        file_name="style/nav.css", 
                        media_type="text/css", 
                        content=style)

# add navigation files
book.add_item(epub.EpubNcx())

nav = epub.EpubNav()
nav.add_item(nav_css)
book.add_item(nav)

# add css files
book.add_item(default_css)
book.add_item(nav_css)

# create spine
book.spine = ['nav', c1]


# create epub file
epub.write_epub('example.epub', book, {'plugins': [standard.SyntaxPlugin()]})
