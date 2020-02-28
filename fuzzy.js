// Import fuzzy-search module
const FuzzySearch = require('fuzzy-search');

// Flag whether the parameter is valid, or whether we need to provide suggested alternatives
var parameterIsValid = false;

// Create an array of valid cli options
const validOptions = [
  {option: 'port'},
  {option: 'protocol'},
  {option: 'timeout'},
  {option: 'edns'},
  {option: 'config'},
  {option: 'list-resolvers'},
  {option: 'list-options'},
  {option: 'list-defaults'},
  {option: 'verbose'},
  {option: 'no-color'},
  {option: 'version'},
  {option: 'help'}
];

// Invoke Fuzzy Search and pass it the list of valid options
const searcher = new FuzzySearch(validOptions,
  ['option'], {          // Specify the key to search within
  caseSensitive: false,  // Pass through options
});

// Parse command line arguments for the parameter we're searching for
const param = process.argv[2];

// Check if the parameter is a valid one
for (var i = 0; i < validOptions.length; i++) {
  if (validOptions[i].option.toLowerCase() === param.toLowerCase()) {
    parameterIsValid = true;
    break;
  }
}

if (parameterIsValid===false) {

  // Perform a fuzzy search for the acquired parameter
  const result = searcher.search(param);

  console.log ('%s is not recognised', param);
  if (result.length >= 1) {  // Fuzzy search yielded at least one result
    console.log ('Did you mean: ');

    // Serialise the fuzzy search results
    result.forEach(function(value){
      var suggestedOption = value.option;
      console.log(suggestedOption);
    });
  }
}
