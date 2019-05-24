#!/usr/bin/env node

const debug = require('debug')('dig');
debug('staging.js Entry: %O', process.argv);

const dns = require('dns');

const endOfLine = require('os').EOL; // Platform independent end-of-line character
const colours = require('colors');
const package = require('./package.json');

// Check for 'help' command line parameters, or no parameters at all
if ((process.argv.length == 2) || (process.argv[2].toLowerCase() == "-h") || (process.argv[2].toLowerCase() == "--help")) {
  //display help screen
  console.log('\u2726 [distributed-dig]'.cyan);
  console.log('Read the docs: '.green + 'https://github.com/MarkSMurphy/distributed-dig#readme');
  console.log('Support & bugs: '.magenta + 'https://github.com/MarkSMurphy/distributed-dig/issues');
  console.log(endOfLine);
  console.log('Sends DNS lookup requests across multiple DNS servers.'.italic);
  console.log(endOfLine);
  console.log('VERSION:'.grey);
  console.log('   ' + package.version.bold);
  console.log(endOfLine);
  console.log('USAGE:'.grey);
  console.log('   ' + 'distributed-dig domain [domain [domain] ...]'.bold);
  console.log(endOfLine);
  console.log('EXAMPLE:'.grey);
  console.log('   distributed-dig www.asos.com');
} else {

}