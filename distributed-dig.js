#!/usr/bin/env node

var debug = require('debug')('ddig');
debug('[%s] started: %O', __filename, process.argv);

// command line options parser
var argv = require('yargs')
.help(false)
.argv;

// Use 'moment' to do time difference calculations
const moment = require('moment');
const startTime = moment();

const dns = require('dns');
// eslint-disable-next-line no-unused-vars
const colours = require('colors');

// Check for 'help' command line parameters, or no parameters at all
if ((process.argv.length === 2) || (argv.help)) {
  // Show help screen
  const help = require('./help');
  help.helpScreen();
} else {

  // Main code goes here
}

