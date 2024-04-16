class JSGloss {
  constructor(root) {
    this.root = root;
  }

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

  addGlossary(dict) {
    this.dict = this.sortDictionary(dict);
    this.elem = this.setupElement();
    this.markGlossaryTerms(this.root);
  }

  getRegEx(term){
    return new RegExp(`\\b${term}\\b`,'gi');
  }

  setupElement(){
    let elem = document.createElement('mark');
    elem.setAttribute('data-jsgloss', 'true');
    elem.setAttribute('role', 'tooltip');
    return elem
  }

  sortDictionary(dict){
    return dict.sort((a, b) => a.term.length - b.term.length);
  }

  markGlossaryTerms(){
    this.dict.forEach(function(entry){
      this.walkDOM(this.root, entry);
    }, this)
  }

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

  walkDOM(node,entry) {
    this.findGlossaryTermInTextNode(node, entry);
    node = node.firstChild;
    while(node) {
      this.walkDOM(node, entry);
      node = node.nextSibling;
    }
  }

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
