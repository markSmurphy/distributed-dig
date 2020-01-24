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
const result = searcher.search('por');
console.log(result);