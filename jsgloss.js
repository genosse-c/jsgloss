/*
 * JSGloss
 *
 * Copyright 2024 Conrad Noack
 *
 * Apr 10 2024
 */

class JSGloss {
  /**
  * Constructor for JSGloss
  *
  * @param  root root node or css selector for root node from which to search the document for glossary terms
  * @return      instantiated JSGloss object
  */
  constructor(root) {
    // Function to test if variable is a string
    if (typeof root === "string")
      root = document.querySelector(root);

    if (root && root instanceof HTMLElement)
      this.root = root;
    else
      throw "Invalid root element";
  }

  //list of elements that won't be searched
  excludedElements = [
    'SCRIPT',
    'STYLE',
    'HEAD',
    'HTML',
    'H1','H2','H3','H4', 'H5', 'H6',
    'META',
    'LINK',
    'SVG'
  ]

  /**
  * Main public method of JSGloss
  *
  * @param  dict an array of JS objects, each with the properties 'term' and 'definition'
  *              with term being the term to search in the page
  *              and definition being the tooltip shown for the searched word.
  */
  addGlossary(dict) {
    this.dict = this.sortDictionary(dict);
    this.elem = this.setupElement();
    this.markGlossaryTerms(this.root);
  }

  /**
  * Factory for the regex used to find the terms in the text content of the page
  *
  * @param  term search term to be turned into a regex
  * @return      regex for search term
  */
  getRegEx(term){
    return new RegExp(`\\b${term}\\b`,'gi');
  }

  /**
  * Creates the template for the element used to wrap the terms found in the page
  *
  * @return      MARK node with attributes
  */
  setupElement(){
    let elem = document.createElement('mark');
    elem.setAttribute('data-jsgloss', 'true');
    elem.setAttribute('role', 'tooltip');
    return elem
  }

 /**
  * Sorts the glossary / dictionary from smallest term to largest term
  * to avoid "overlapping" matches
  *
  * @param  dict unsorted array of search terms and definitions
  * @return      sorted array
  */
  sortDictionary(dict){
    return dict.sort((a, b) => a.term.length - b.term.length);
  }

  /**
  * Starts the search in the page
  * The search reads the text content of the page once for each search term
  */
  markGlossaryTerms(){
    this.dict.forEach(function(entry){
      this.walkDOM(this.root, entry);
    }, this)
  }

 /**
  * Walks the DOM starting from the root node, recursively calling itself
  *
  * @param  node starting node
  * @param entry one entry from the glossary consisting of an object with properties term and definition
  */
  walkDOM(node,entry) {
    this.findGlossaryTermInTextNode(node, entry);
    node = node.firstChild;
    while(node) {
      this.walkDOM(node, entry);
      node = node.nextSibling;
    }
  }

 /**
  * Searches for a match to the term in the entry if the node is a text node
  * and not a child of one of the excluded nodes
  *
  * @param  node node to inspect
  * @param entry one entry from the glossary consisting of an object with properties term and definition
  */
  findGlossaryTermInTextNode(node, entry){
    if (node.nodeType !== Node.TEXT_NODE ||
        node.parentElement.hasAttribute('data-jsgloss') ||
        this.excludedElements.includes(node.parentElement.tagName)
      )
      return;

    let regex = this.getRegEx(entry.term);

    let match = regex.exec(node.textContent);
    if (match !== null) {
      let start = match.index;
      let end = start + match[0].length;
      this.wrapRangeInTextNode(entry, node, start, end);
      //console.log(node);
    }
  }

 /**
  * Wraps a tooltip element around a found match
  * adding in the definition from the entry object
  * and optionally a css class to tag multiline tooltips
  *
  * @param entry one entry from the glossary consisting of an object with properties term and definition
  * @param node  text node containing a match
  * @param start starting position of match in text node
  * @param end   end position of match in text node
  */
  wrapRangeInTextNode(entry, node, start, end) {
    const range = document.createRange();
    range.setStart(node, start);
    range.setEnd(node, end);

    const elem = this.elem.cloneNode();
    elem.setAttribute('aria-label', entry.definition);
    if(entry.definition.length > 60)
      elem.classList.add('multiline');
    range.surroundContents(elem);
  }
}
