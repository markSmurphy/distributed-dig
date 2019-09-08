#!/usr/bin/env node

var debug = require('debug')('ddig');
debug('[%s] started: %O', __filename, process.argv);

// Default config file
const DefaultConfigFilename = 'distributed-dig.json';
var configFilename = DefaultConfigFilename;

// Default DNS TCP options
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

// Core ddig functions
const ddig = require('./ddig-core');

// Console output formatting for columns and colours
const columnify = require('columnify');
// eslint-disable-next-line no-unused-vars
const colours = require('colors');

// command line options parser
var argv = require('yargs')
.help(false)
.argv;

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
    console.log('%s[resolvers]'.green.underline, configFilename);
    const columnify = require('columnify');
    const columns = columnify(resolvers);
    console.log(columns);

} else if (argv.listOptions) {
    // Get the options
    const options = getOptions();
    console.log('%s[options]'.green.underline, configFilename);
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

        // Display which configuration file is being used
        console.log('Using configuration file: '.grey + configFilename.yellow);

        // Get list of resolvers
        const resolvers = getResolvers();
        // Get options
        const options = getOptions();

        // Iterate through the list of domains
        domains.forEach((domain) => {
            // Iterate through each resolver
            resolvers.forEach((resolver) => {
                // Perform a lookup for the current domain via the current resolver
                ddig.resolve(domain, resolver, options, (response) => {
                    console.log('Looking up %s against %s (%s) returned: %O', domain, resolver.nameServer, resolver.provider, response);
                    let columns = columnify(response);
                    console.log(columns);
                    console.log('Completed in %s milliseconds', response.duration);
                });
            });
        });
    } catch(err) {
        console.error('An error occurred: %O'.red, err);
    }
}
