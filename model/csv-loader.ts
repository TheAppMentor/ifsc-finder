/*
var Trie = require('mnemonist/trie');
var _ = require('lodash')

var fs = require('fs')
var Papa = require('papaparse')
var TreeModel = require('tree-model')
    const tree = new TreeModel()
    const root = tree.parse({name: 'a', children: [{name: 'b'}]})

//console.log(root.all())

let file = "../data/ifsc_codes_all_clean.csv"
var content = fs.readFileSync(file, "utf8");

let config = {
	delimiter: "|",	// auto-detect
	newline: "",	// auto-detect
	quoteChar: '"',
	escapeChar: '"',
	header: true,
	trimHeaders: false,
	dynamicTyping: false,
	preview: 0,
	encoding: "",
	worker: false,
	comments: false,
	step: undefined,
	complete: undefined,
	error: undefined,
	download: false,
	skipEmptyLines: false,
	chunk: undefined,
	fastMode: undefined,
	beforeFirstChunk: undefined,
	withCredentials: undefined,
	transform: undefined
}

// Parse local CSV file
let results = Papa.parse(content, config)

		//console.log("Finished:", results.data);
		console.log("Meta Data:", results.meta);
		console.log("Error:", results.errors);

var allBankNames = Array<string>()

for (var eachBank of results.data){
    allBankNames.push(eachBank["BANK"])
}

let uniqueBankNames = _.uniq(allBankNames) 

// Let's create a trie from our words
var trie = Trie.from(uniqueBankNames);

// Now let's query our trie
var wordsWithMatchingPrefix = trie.find("I");

console.log(wordsWithMatchingPrefix)




/*
const SymbolTree = require('symbol-tree');
const tree = new SymbolTree();

let parentNode = {};

let a = {};
let b = {};
let c = {};
 
tree.prependChild(parentNode, a); // insert a as the first child
tree.appendChild(parentNode,c ); // insert c as the last child
tree.insertAfter(a, b); // insert b after a, it now has the same parentNode as a

console.log(tree)
//console.log(tree.lastChild())
console.log(tree.firstChild(parentNode === a));
//console.log(tree.nextSibling(tree.firstChild(parentNode)) === b);
//console.log(tree.lastChild(parentNode) === c);
 
let grandparentNode = {};
tree.prependChild(grandparentNode, parentNode);
console.log(tree.firstChild(tree.firstChild(grandparentNode)) === a);
*/

