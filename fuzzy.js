const FuzzySearch = require('fuzzy-search');

const cliSwitches = [
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

const searcher = new FuzzySearch(cliSwitches, ['option'],{
  caseSensitive: false,
});

// Get cli parameter
const param = process.argv.slice(2);

const result = searcher.search(param);

console.log ('%s is not recognised', param);
if (result.length > 0) {
  console.log ('Did you mean: ');
  //console.log(result);
  result.forEach(function(value){
    //var suggestedOption = JSON.parse(value);
    var suggestedOption = value.option;
    console.log(suggestedOption);
  });
}
