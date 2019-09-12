#!/usr/bin/env node

var debug = require('debug')('ddig');
debug('[%s] started: %O', __filename, process.argv);

// Default config file
const DefaultConfigFilename = 'distributed-dig.json';
var configFilename = DefaultConfigFilename;

// Default DNS TCP options
// eslint-disable-next-line no-unused-vars
const defaultOptions = {
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

// Holds the config json
var config = {};

// Initialise empty array of domains
var domains = [];
// Global variables to hold column widths
var domainColumnWidth = 0;
var resolverColumnWidth = 0;
var providerColumnWidth = 0;

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

function parseResolvers() {
    try {
        debug('%s resolvers: %O', config.resolvers.length, config.resolvers);

        // Get maximum column widths
        for (let i = 0; i < config.resolvers.length; i++) {

            // Maximum resolver length
            if (config.resolvers[i].nameServer.length > resolverColumnWidth) {
                resolverColumnWidth = config.resolvers[i].nameServer.length;
            }

            // Maximum provider length
            if (config.resolvers[i].provider.length > providerColumnWidth) {
                providerColumnWidth = config.resolvers[i].provider.length;
            }
        }
    } catch (error) {
        debug('Exception caught in parseResolvers(): %O', error);
    }
}

function getConfig() {
    try {
        const fs = require('fs');
        let rawJSON = fs.readFileSync(configFilename);
        let config = JSON.parse(rawJSON);
        debug('getConfig() read the configuration file [%s]: %O',configFilename, config);

        // Parse list of Resolvers
        parseResolvers();

        //Check for CLI switches which override config file settings
        // Verbose mode
        if (argv.verbose) {
            config.options.verbose = true;
        }

        // DNS Port
        if (argv.port) {
            config.options.request.port = argv.port;
        }

        // DNS Protocol
        if (argv.protocol) {
            config.options.request.type = argv.protocol;
        }

        // DNS Timeout
        if (argv.timeout) {
            config.options.request.timeout = argv.timeout;
        }

        // EDNS(0)
        if (argv.try_edns) {
            config.options.request.try_edns = argv.edns;
        }

        return(config);
    } catch (e) {
        debug('An error occurred reading the config file [%s]: %O', configFilename, e);
        return(false);
    }
}

// Initialise configuration
config = getConfig();

// Check for 'help' command line parameters, or no parameters at all
if ((process.argv.length === 2) || (argv.help)) {
    // Show help screen
    const help = require('./help');
    help.helpScreen();
} else if (argv.listResolvers) {
    // Get list of resolvers
    console.log('%s'.yellow, configFilename);
    if (config.options.verbose) {
    // Raw JSON output
        const prettyjson = require('prettyjson');
        console.log('{resolvers}'.yellow);
        console.log(prettyjson.render(config.resolvers));
    } else {
        const columnify = require('columnify');
        const columns = columnify(config.resolvers, {
            config: {
                'nameServer': {
                    headingTransform: function() {
                      return 'Resolver IP Address'.underline;
                    }
                },
                'provider': {
                    headingTransform: function() {
                      return 'DNS Provider'.underline;
                    }
                }
            }
        });
        console.log(columns);
    }
} else if (argv.listOptions) {
    // Get the options
    console.log('%s'.yellow, configFilename);
    if (config.options.verbose) {
        // Raw JSON output
        const prettyjson = require('prettyjson');
        console.log('{options}'.yellow);
        console.log(prettyjson.render(config.options));
    } else {
        const columnify = require('columnify');
        console.log('{request}'.yellow);
        var columns = columnify(config.options.request, {columns: ['Option', 'Value']});
        console.log(columns);
        console.log('{question}'.yellow);
        columns = columnify(config.options.question, {columns: ['Option', 'Value']});
        console.log(columns);
    }

} else {
    try {
        // Loop through command line parameters to extract domains.  Expecting 'distributed-dig.js domain [domain [domain] ... ]'
        var i = 2;
        const isValidDomain = require('is-valid-domain');

        for (i = 2; i < process.argv.length; i++) {
            debug('Extracted "%s" from the command line', process.argv[i]);
            // Check that's a valid domain
            if (isValidDomain(process.argv[i])){
                // Add domain into the array
                domains.push(process.argv[i]);
                // Set domain column width
                if (process.argv[i].length > domainColumnWidth) {
                    domainColumnWidth = process.argv[i].length;
                }
            } else {
                debug('"%s" looks like a command line switch, not a hostname.  Ignoring it.');
                console.log('Warning: '.yellow + 'ignoring ' + process.argv[i].blue + ' as it\'s not a valid domain name');
            }
        }
        debug('%s domains: %O', domains.length, domains);

        // Display which configuration file is being used
        if (domains.length>0) {
            console.log('Using configuration file: '.grey + configFilename.yellow);
        }

        // Iterate through the list of domains
        domains.forEach((domain) => {
            // Iterate through each resolver
            config.resolvers.forEach((resolver) => {
                // Perform a lookup for the current domain via the current resolver
                ddig.resolve(domain, resolver, config.options, (response) => {
                    debug('Looking up %s against %s (%s) returned: %O', domain, resolver.nameServer, resolver.provider, response);
                    var result = {};
                    if (response.success) {
                        // The lookup succeeded.  Extract the properties needed from the response
                        result = [{
                            'domain': response.domain,
                            'IPAddress': response.ipAddress.green,
                            'provider': response.provider.grey
                        }];
                    } else {
                        // The lookup failed
                        result = [{
                            'domain': response.domain,
                            'IPAddress': response.msg.red,
                            'provider': response.provider.grey
                        }];
                    }

                    // Display the result
                    let columns = columnify(result,
                        {showHeaders: false,
                            config: {
                                domain: {minWidth: domainColumnWidth},
                                IPAddress: {minWidth: 15},
                                provider: providerColumnWidth
                              }
                        }
                    );
                    console.log(columns);
                });
            });
        });
    } catch(err) {
        console.error('An error occurred: %O'.red, err);
    }
}
