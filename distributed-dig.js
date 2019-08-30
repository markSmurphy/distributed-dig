#!/usr/bin/env node

var debug = require('debug')('ddig');
debug('[%s] started: %O', __filename, process.argv);

// Default resolvers config file
const configFilename = 'ddig.json';

// command line options parser
var argv = require('yargs')
.help(false)
.argv;

// eslint-disable-next-line no-unused-vars
const colours = require('colors');

function getConfig() {
    try {
        const fs = require('fs');
        let rawJSON = fs.readFileSync(configFilename);
        let config = JSON.parse(rawJSON);
        debug('getConfig() read the configuration file [%s]: %O',configFilename, config);
        return(config);
    } catch (e) {
        debug('An error occurred reading the config file [%s]: %O', configFilename, e);
        return(false);
    }
}

function getResolvers() {
    // Get the list of resolvers from the config file
    let config = getConfig();
    if (config) {
        let resolvers = config.resolvers;
        debug('%s resolvers: %O', resolvers.length, resolvers);
        return(resolvers);
    } else{
        debug('getResolvers() could not retrieve a list of resolvers from [%s]', configFilename);
        return(false);
    }
}

function getOptions() {
    // Get the options object from the config file
    let config = getConfig();
    if (config) {
        let options = config.options;
        debug('options: %O', options);
        return(options);
    } else{
        debug('getOptions() could not retrieve any options because getConfig() returned false.  Using default values', configFilename);
        // Default Options
        const default_options = {
            'request': {
                'port': 53,
                'type': 'udp',
                'timeout': 2500,
                'try_edns': false,
                'cache': false
            },
            'question': {
                'type': 'A'
            }
        };
        return(default_options);
    }
}

// Check for 'help' command line parameters, or no parameters at all
if ((process.argv.length === 2) || (argv.help)) {
    // Show help screen
    const help = require('./help');
    help.helpScreen();
} else if (argv.listResolvers) {
    // Get list of resolvers
    const resolvers = getResolvers();
    console.log('%s'.green.underline, configFilename);
    const columnify = require('columnify');
    const columns = columnify(resolvers);
    console.log(columns);

} else if (argv.listOptions) {
    // Get the options
    const options = getOptions();
    console.log('%s'.green.underline, configFilename);
    const columnify = require('columnify');
    console.log('request'.yellow);
    var columns = columnify(options.request);
    console.log(columns);
    console.log('question'.yellow);
    columns = columnify(options.question);
    console.log(columns);

} else {
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
        debug('%s domains: %O', domains.length, domains);

        // Get list of resolvers
        const resolvers = getResolvers();
        // Get options
        const options = getOptions();

        // Pass the domains and resolvers object to ddig.resolve()
        const ddig = require('./ddig');
        ddig.resolveBulk(domains, resolvers, options, function(response) {
            debug('Response object from ddig.resolve(): %O', response);
            const columnify = require('columnify');
            const columns = columnify(response.lookups);
            console.log(columns);
            console.log('Completed in %s milliseconds', response.duration);
        });
    } catch(err) {
        console.error('An error occurred: %O'.red, err);
    }
}
