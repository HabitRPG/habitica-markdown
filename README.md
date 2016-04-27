# habitica-markdown
A markdown-it module pre-configured for use in Habitica

## Usage

```bash
npm install habitica-markdown --save
bower install habitica-markdown --save
```

In Node with browserify/webpack/etc:

```js
var md = require('habitica-markdowm');
md.render('_markdown_ is **awesome**');
```

In a browser with script tag

```js
var md = window.habiticaMarkdown;
md.render('_markdown_ is **awesome**');
```

## Pre-configured Settings and Plugins

Habitica Markdown comes pre-configured with

* Raw urls get converted to links with the [linkify setting set to true](https://github.com/markdown-it/markdown-it/#linkify)
* Links open in new windows with [markdown-it-link-target](https://www.npmjs.com/package/markdown-it-link-target)
* Images automatically turn into links with [markdown-it-linkify-images](https://www.npmjs.com/package/markdown-it-linkify-images)
* Markdown parsed by [markdown-it-emoji](https://github.com/markdown-it/markdown-it-emoji)

## Notes

### Emoji

The emoji come pre-styled with:

```css
.habitica-emoji {
  height: 1.5em;
  width: 1.5em;
}
```

If you'd like to override these values, you may need to apply the `!important` keyword to your `css`.

```css
.habitica-emoji {
  height: 100px !important;
}
```
