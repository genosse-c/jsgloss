# jsgloss

## Usage
Download js and css file and include in the pages requiring a glossary
1. Instantiate the JSGloss class with a valid CSS selector defining the root element:<br/>
`let jsgloss = new JSGloss(<selector>)`
2. Call addGlossary() on the instance with the glossary as argument:<br/>
`jsgloss.addGlossary(<glossary>)`
3. The **glossary** is a plain javascript array, with each element consisting of an object
with two properties:
    - term
    - definition 

This is the glossary object used in the demo page: 
```javascript
var glossary = [
    {term: 'lorem', definition: 'ipsum'},
    {term: 'sed', definition: 'aber'},
    {term: 'JSGloss', definition: 'for pages requiring a glossary'},
    {term: 'voluptua', definition: 'Lorem ipsum dolor sit āmet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, nò sea takimata sanctus est Lorem ipsum dolor sit amet.'}
]
```
You can view the demo page at https://genosse-c.github.io/jsgloss/

## Customizations
Currently this little library does not take any options. But you might want to customize which elements
should not contain glossary entries. Look for the class property `excludedElements` and add or remove 
element names.

The maximum number of characters permitted on one line in the tooltip (this also dictates the maximum width of the tooltip) 
is currently set at `60`. You can change this in the method `wrapRangeInTextNode`.

CSS can be customized as well. The easiest way would be to define some CSS variable:

Microtip, on which the css in this project is based, uses **css variables**, which allows you to customize the behavior of the tooltip as per your needs.


| Variable                         | Description                                        | Default Value |
|----------------------------------|----------------------------------------------------|---------------|
| `--microtip-transition-duration` | Specifies the duration of the tootltip transition  | `.18s`        |
| `--microtip-transition-delay`    | The delay on hover before showing the tooltip      | `0s`          |
| `--microtip-transition-easing`   | The easing applied while transitioning the tooltip | `ease-in-out` |
| `--microtip-font-size`           | Sets the font size of the text in tooltip          | `13px`        |
| `--microtip-font-weight`         | The font weight of the text in tooltip             | `normal`      |
| `--microtip-text-transform`      | Controls the casing of the text                    | `none`        |

&nbsp;

Example:
```css
:root {
 --microtip-transition-duration: 0.5s;
 --microtip-transition-delay: 1s;
 --microtip-transition-easing: ease-out;
 --microtip-font-size: 13px;
 --microtip-font-weight: bold;
 --microtip-text-transform: uppercase;
}
```

## Acknowledgements
The CSS used in this project is more or less completely lifted 
from the MIT-licensed [microtip](https://github.com/ghosh/microtip) project.
