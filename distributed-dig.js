#!/usr/bin/env node

var debug = require('debug')('ddig');
debug('[%s] started: %O', __filename, process.argv);

// Platform agnostic new line character
const EOL =  require('os').EOL;

// Default config file & location
const DefaultConfigFileName = 'distributed-dig.json';
var configFileName = DefaultConfigFileName;
const path = require('path');
var configFilePath = path.resolve(__dirname);
const homedir = require('os').homedir();

// Holds the config json
var config = {};

// Initialise empty array of domains
var domains = [];
// Global variables to hold column widths
var domainColumnWidth = 0;
var nameServerColumnWidth = 0;
var providerColumnWidth = 0;

// Core ddig functions
const ddig = require('./ddig-core');

// Console output formatting for columns and colours
const columnify = require('columnify');
// eslint-disable-next-line no-unused-vars
const colours = require('colors');

// Import IP validation library
const isIp = require('is-ip');

// command line options parser
var argv = require('yargs')
.help(false)
.argv;

function getNameServerColumnWidth(resolvers) {
    try {
        debug('parsing %s resolvers for the column width of "nameServer"', resolvers.length);
        // Get maximum column widths
        var columnWidth = 0;
        for (let i = 0; i < resolvers.length; i++) {
            // Maximum resolver length
            if ((resolvers[i].nameServer.length > columnWidth) && (isIp(resolvers[i].nameServer))) {
                columnWidth = resolvers[i].nameServer.length;
                debug('setting getNameServerColumnWidth to: %s', resolvers[i].nameServer.length);
            }
        }
        return(columnWidth);
    } catch (error) {
        debug('Exception caught in getNameServerColumnWidth(): %O', error);
        return(15);
    }
}

function getProviderColumnWidth(resolvers) {
    try {
        debug('parsing %s resolvers for the column width of "provider"', resolvers.length);
        // Get maximum column width
        var columnWidth = 0;
        for (let i = 0; i < resolvers.length; i++) {
            // Maximum resolver length
            if ((resolvers[i].provider.length > columnWidth) && (isIp(resolvers[i].nameServer))) {
                columnWidth = resolvers[i].provider.length;
                debug('Setting getProviderColumnWidth to: %s', resolvers[i].provider.length);
            }
        }
        return(columnWidth);
    } catch (error) {
        debug('Exception caught in getProviderColumnWidth(): %O', error);
        // Return a default column width of 30
        return(30);
    }
}

function getConfig() {
    debug('getConfig() Entry');
    const fs = require('fs');
    try {
        // Check if the custom config file argument was used
        if (argv.config) {
            debug('"--config" argument detected');
            // Check that a string was passed along with "--config"
            if (typeof(argv.config) === 'string') {
                debug('The --config parameter [%s] is of type "string"', argv.config);
                // Check that the file exists
                if (fs.existsSync(argv.config)) {
                    debug('The specified config file exists.');
                    // Split the string into it file & path components
                    configFilePath = path.dirname(argv.config);
                    debug('Path: %s', configFilePath);
                    configFileName = path.basename(argv.config);
                    debug('Name: %s', configFileName);
                } else {
                    // the --config parameter doesn't contain a file that exists
                    debug('[%s] does not exist', argv.config);
                    console.log('Error: '.red + 'The specified config file [' + argv.config.blue + '] does not exist');
                    return(false);
                }
            } else {
                // No filename was passed with --config
                console.log('Warning: '.yellow + 'ignoring ' + '--config'.blue + '.  You must specify a valid filename');
                return(false);
            }
        } else {
            // Use default configuration file
            var cwd = process.cwd();
            debug('Looking for [%s] in [%s] ...', configFileName, cwd);
            // Check if the config file exists in current directory
            if (fs.existsSync(configFileName)) {
                // Config file found in current directory so remember the path
                debug('[%s] found in [%s]', configFileName, cwd);
                configFilePath = cwd;

            } else {
                debug('Looking for [%s] in [%s] ...', configFileName, homedir);
                // Check for the config file in the "home" directory
                if (fs.existsSync(homedir + '//' + configFileName)) {
                    debug('[%s] found in [%s]', configFileName, homedir);
                    // Config file found in homedir so remember the path
                    configFilePath = homedir;
                } else {
                    // Check for the config file in the application's root directory
                    if (fs.existsSync(configFilePath + '//' + configFileName)) {
                        // Config file found in application root directory
                        debug('[%s] found in [%s]', configFileName, configFilePath);
                    } else {
                        console.log('Error:'.red + ' The config file ' + configFileName.yellow + ' could not be found in:');
                        console.log('current dir: '.grey + cwd);
                        console.log('home dir:    '.grey + homedir);
                        console.log('ddig root:   '.grey + configFilePath);
                        return(false);
                    }
                }
            }
        }
    } catch (error) {
        debug('getConfig() caught an exception whilst determining where the configuration file is: %O', error);
        return(false);
    }

    // Read the configuration file
    try {
        debug('Reading config file: %s', configFilePath + '//' + configFileName);
        let rawJSON = fs.readFileSync(configFilePath + '//' + configFileName);
        let config = JSON.parse(rawJSON);
        debug('getConfig() read the configuration file [%s]: %O',configFileName, config);

        // Parse list of Resolvers to acquire column widths
        nameServerColumnWidth = getNameServerColumnWidth(config.resolvers);
        providerColumnWidth = getProviderColumnWidth(config.resolvers);

        //Check for arguments which override config file settings
        // Verbose mode
        if (argv.verbose) {
            config.options.verbose = true;
            debug('[verbose] set to true');
        }

        // DNS Port
        if (argv.port) {
            config.options.request.port = argv.port;
            debug('[port] set to: %s', config.options.request.port);
        }

        // DNS Protocol
        if (argv.protocol) {
            config.options.request.type = String.prototype.toLowerCase(argv.protocol);
            debug('[type (protocol)] set to: %s', config.options.request.type);
        }

        // DNS Timeout
        if (argv.timeout) {
            if(typeof argv.timeout === 'number'){
                config.options.request.timeout = argv.timeout;
                debug('[timeout] set to: %s', config.options.request.timeout);
            } else {
                console.log('Ignoring '.grey + '--timeout'.blue + ' as its value is not a number'.grey);
            }
        }

        // EDNS(0)
        if (argv.edns) {
            config.options.request.try_edns = argv.edns;
            debug('[try_edns] set to: %s', config.options.request.try_edns);
        }

        return(config);
    } catch (e) {
        debug('An error occurred reading the config file [%s]: %O', configFileName, e);
        return(false);
    }
}

// **** main() **** //

// Initialise configuration
config = getConfig();

if (config) {

    // Check for 'help' command line parameters, or no parameters at all
    if ((process.argv.length === 2) || (argv.help)) {
        // Show help screen
        const help = require('./help');
        help.helpScreen();
    } else if (argv.listResolvers) {
        // Get list of resolvers
        console.log('Using configuration file: '.grey + configFileName.yellow + ' ['.grey + configFilePath.grey + ']'.grey );
        if (config.options.verbose) {
        // Raw JSON output
            const prettyjson = require('prettyjson');
            console.log('Resolvers'.yellow);
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
        console.log('Using configuration file: '.grey + configFileName.yellow + ' ['.grey + configFilePath.grey + ']'.grey );
        if (config.options.verbose) {
            // Raw JSON output
            const prettyjson = require('prettyjson');
            console.log('Options'.yellow);
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
    } else if (argv.listDefaults) {
        //
        const defaults = require('./ddig-defaults');
        defaults.printDefaultConfig();
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
                    debug('"%s" is not a valid hostname.  Excluding it from the domains[] array', process.argv[i]);
                    // Check for arguments that are missing the double dash prefix
                    if ((process.argv[i].substring(0, 1) === '-') && (process.argv[i].substring(0, 2) !== '--')) {
                        console.log('Warning: '.yellow + 'ignoring ' + process.argv[i].blue + ' as it\'s not a valid argument');
                    }
                }
            }
            debug('%s domains: %O', domains.length, domains);

            // If we've got some domains to lookup, display some useful extra information
            if (domains.length > 0) {
                // Display which configuration file is being used
                console.log('Using configuration file: '.grey + configFileName.yellow + ' ['.grey + configFilePath.grey + ']'.grey );
                // If we're going to be outputting verbose columns, check the terminal width is sufficient
                if ((config.options.verbose) && (process.stdout.columns < 130)) {
                    console.log('When using the --verbose switch you might want to consider increasing your console width to at least 130 (it\'s currently %s)'.cyan, process.stdout.columns);
                }
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
                                'unique': '',
                                'domain': response.domain,
                                'IPAddress': response.ipAddress.green,
                                'provider': response.provider.grey,
                            }];
                            if (ddig.isAddressUnique(response.ipAddress)) {
                                // If this is first time we've seen this IP address mark the 'unique' column
                                result[0].unique = '•';
                            }

                            // Add additional 'success' columns if `verbose` is switched on
                            if (config.options.verbose) {
                                //result[0].nameServer = response.nameServer.grey;
                                result[0].provider += EOL + response.nameServer.grey;
                                result[0].duration = response.duration + 'ms';
                                result[0].recursion = response.recursion;
                            }
                        } else {
                            // The lookup failed
                            result = [{
                                'unique': '',
                                'domain': response.domain,
                                'IPAddress': response.msg.red,
                                'provider': response.provider.grey
                            }];
                            // Add additional 'failed' columns if `verbose` is switched on
                            if (config.options.verbose) {
                                //result[0].nameServer = response.nameServer.grey;
                                result[0].provider += EOL + response.nameServer.grey;
                                result[0].duration = response.duration + 'ms';
                            }
                        }
                        // Display the result
                        let columns = columnify(result, {
                            showHeaders: false,
                            preserveNewLines: true,
                            config: {
                                unique: {minWidth:1, maxWidth: 1},
                                domain: {minWidth: domainColumnWidth},
                                IPAddress: {minWidth: 15},
                                provider: {minWidth: providerColumnWidth},
                                nameServer: {minWidth: nameServerColumnWidth},
                                duration: {minWidth: 7}
                            }
                        });
                        console.log(columns);
                    });
                });
            });
        } catch(err) {
            console.error('An error occurred: %O'.red, err);
        }
    }
}
