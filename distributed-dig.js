#!/usr/bin/env node

var debug = require('debug')('ddig');
debug('[%s] started: %O', __filename, process.argv);

// command line options parser
var argv = require('yargs')
.help(false)
.argv;

// eslint-disable-next-line no-unused-vars
const colours = require('colors');

// Check for 'help' command line parameters, or no parameters at all
if ((process.argv.length === 2) || (argv.help)) {
    // Show help screen
    const help = require('./help');
    help.helpScreen();
} else {
    // Main work happens here
    try {
        // Get list of domains to lookup from the command line
        var domains = [];
        // Loop through command line parameters.  Expecting 'distributed-dig.js domain [domain [domain] ... ]'
        var i = 2;
        for (i = 2; i < process.argv.length; i++) {
            debug('Extracted "%s" from the command line', process.argv[i]);
            // Add domain into the array
            domains.push(process.argv[i]);
        }
        debug('domains array: %O', domains);

        // Get the list of resolvers from the json file
        const fs = require('fs');
        const resolvers = JSON.parse(fs.readFileSync('dnsResolvers.json'));
        debug('resolvers object: %O', resolvers);

        // Pass the domains and resolvers object to ddig.resolve()
        const ddig = require('./ddig');
        ddig.resolve(domains, resolvers, function(response) {
            debug('Response object from ddig.resolve(): %O', response);
            var columnify = require('columnify');
            var columns = columnify(response.lookups);
            console.log(columns);
            console.log('Completed in %s milliseconds', response.duration);
        });
    } catch(err) {
        console.error('An error occurred: %O'.red, err);
    }
}
