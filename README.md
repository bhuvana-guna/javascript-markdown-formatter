# js-markdown-formatter

A **Customizable Markdown Library** for rendering Markdown in Adaptive Cards.

Custom markdown rules for your application is possible now without any regex learning. Just follow the simple guidelines shown bellow.   

**[Demo](#demo)**

## Getting started

To use, add the markdown-formatter.js to your html
```
<script src="https://unpkg.com/markdown-formatter/dist/markdown-formatter.js"></script>
```
Install the node module:

`$ yarn add js-markdown-formatter`

or with npm:

`$ npm install js-markdown-formatter`

Then see **[Usage](#Usage)** for futher details

## Runnning the example code

You can check the example in the 

example.html

customRegexExample.html

## Markdown Patterns Usage

### Default Configuration:

* '\_italic_' will result in '_italic_'.
* '\*\*bold**' will result in '**bold**'.
* '\[Title](link)' will result in [Title](link).
* '- bullet 1\r - bullet2\r - bulltet 3' will result in following way
   ```
    . bullet 1 
    . bullet2
    . bullet 3
    ```
* '1\. numbered 1\r 2. numbered2\n 3. numbered 3' will result in following way
    ```
    1. numbered 1 
    2. numbered2
    3. numbered 3
    ```

### Custom Configurations:
To replace or to be added with default config.
   
*       {
            type: 'italic',
    		styles: [],
    		pattern: ['-'],
    		patternType: 'symmetric',
    		groups:1,
        }
	
    The above pattern will render '\-italic-' in '_italic_'.

*       {
    		type: 'bullet',
    		styles: [],
    		pattern: ['\\$[\\s]+((.*?)[\\n|\\r](?=\\$[\\s]+)|(.*?)$)'],
    		patternType: 'custom',
    		groups: 1,
    	},

    The above pattern will convert 'bullet list $ Item 1.1\r$ Item -2.2-\r$ Item 3\r' in following way: 
    
    ```
    bullet list
    . Item 1.1
    . Item -2.2-
    . Item 3
    ```
    
*   One can create custom markdown based on project need and render it within text.

*   One can also send the whole regex itself with pattern type _custom_ to have complete control on markdown to apply regex on text and render it
     
## Usage

```
<script src="https://unpkg.com/markdown-formatter/dist/markdown-formatter.js"></script>

// use it in onProcessMarkdown of adaptivecard instance.
adaptiveCard.constructor.onProcessMarkdown = function(text, result) {
	result.outputHtml = MarkdownFormatter.render(text);
	result.didProcess = true;
}
```

**Extra Features**: User can also send their custom regex and styles also to apply on text.
```js
//[Optional] user's custom config to be added to default configs
MarkdownFormatter.setCustomMarkdownRegex([{
                type: 'bullet', // this will replace the default bullet config with user specified config.
                styles:{
                    start: "<ul>",
                    end: "</ul>"},
                pattern: ['$', '\\r|\\n'],
                patternType: 'start-end',
                groups: 1
            },
            {
                type: 'italic',
                styles:{
                    start: "<i>",
                    end: "</i>"},
                pattern: ['-'],
                patternType: 'symmetric',
                groups:1,
            }]);

```

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request
