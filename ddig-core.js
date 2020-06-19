// Exports a public function, resolve(), which accepts multiple domains and multiple resolvers.
// The other local functions handle the nested iteration to resolve each domain against each resolver.
const debug = require('debug')('ddig');
debug('Entry: [%s]', __filename);

// Import IP validation library
const isIp = require('is-ip');

// Import DNS library
const dns = require('native-dns-multisocket');

// Platform agnostic new line character
const EOL =  require('os').EOL;

const path = require('path');
var configFilePath = path.resolve(__dirname);

module.exports = {
    resolve(domain, resolver, options, callback) {
        const startTime = Date.now();
        debug('resolve() called for domain [%s] via resolver [%s (%s)] with options: %O', domain, resolver.nameServer, resolver.provider ,options);
        // Initialise lookup result object
        var lookupResult = {
            'domain': domain,
            'ipAddress': null,
            'recursion': null,
            'answer': null,
            'nameServer': resolver.nameServer,
            'provider': resolver.provider,
            'msg': '',
            'success': false,
            'duration': 0,
            'error': '',
            'recordType': null,
            'ttl': 0
        };

        // Validate the resolver IP address is valid
        if (isIp(resolver.nameServer) === false) {
            debug('resolve() skipping the resolver [%s] because it is not a valid IP address', resolver.nameServer);
            // Populate lookup results object
            lookupResult.success=false;
            lookupResult.duration = Math.ceil((Date.now() - startTime));
            lookupResult.msg = 'Invalid resolver IP address';

        } else {
            // Create DNS Question object
            var question = dns.Question({
                name: domain,
                type: options.question.type,
            });

            // Create DNS Request object to "ask" the Question
            var req = dns.Request({
                question: question,
                server: {
                    address: resolver.nameServer,
                    port: options.request.port,
                    type: options.request.type
                },
                timeout: options.request.timeout,
                cache: options.request.cache,
                try_edns: options.request.try_edns
            });

            debug('resolve() is issuing the dns.request: %O', req);

            // Issue DNS request.  The response is handled by event handlers below
            req.send();

            // Handle a DNS timeout event
            req.on('timeout', function () {
                debug('The %sms timeout elapsed before %s [%s] responded', options.request.timeout, resolver.nameServer, resolver.provider);
                // Populate lookup result object
                lookupResult.msg = 'Timeout';
                lookupResult.success = false;
                lookupResult.duration = Math.ceil((Date.now() - startTime));

                // Return the result
                callback(lookupResult);
            });

            // Handle DNS message event; i.e process the `answer` response
            req.on('message', function (err, answer) {
                if (err) {
                    debug('Error received: %O', err);
                    lookupResult.msg = 'An error occurred';
                    lookupResult.error = JSON.stringify(err);
                    lookupResult.success = false;
                    lookupResult.duration = Math.ceil((Date.now() - startTime));

                    // Return the result
                    callback(lookupResult);

                } else{
                    // Check that the answer is a populated array
                    if (Array.isArray(answer.answer) && answer.answer.length) {
                        debug('The resolver [%s] provided the answer: %O', resolver.nameServer, answer);

                        // Populate lookup result object
                        lookupResult.answer = JSON.stringify(answer.answer);
                        lookupResult.ipAddress = module.exports.parseAnswer(answer.answer, {getIpAddress: true});
                        lookupResult.recursion = module.exports.parseAnswer(answer.answer, {getRecursion: true});
                        lookupResult.recordType = module.exports.parseAnswer(answer.answer, {getRecordType: true});
                        lookupResult.ttl = module.exports.parseAnswer(answer.answer, {getTTL: true});

                        lookupResult.msg = 'Success';
                        lookupResult.success = true;
                        let endTime = Date.now();
                        let duration = Math.ceil((endTime - startTime));
                        lookupResult.duration = duration;
                    } else{
                        debug('The resolver [%s] provided an empty answer: %O', resolver.nameServer, answer);

                        lookupResult.msg = 'Non-Existent Domain';
                        lookupResult.error = 'NXDomain';
                        lookupResult.success = false;
                        lookupResult.duration = Math.ceil((Date.now() - startTime));
                    }

                    // Return the result
                    callback(lookupResult);
                }
            });
        }
    },

    parseAnswer(answer, options) {
        debug('parseAnswer() called with ---> [options]: %O ---> [answer]: %O', options, answer);
        // Validate the answer object has something to parse
        if (answer === []) {
            // No IP addresses, `answer` is an empty array
            return('no_address');
        }

        try {
            var response = '';
            // Extract IP Address
            if ((options===null) || (options.getIpAddress)) {
                // Just get the IP address; i.e. the A record at the end.
                for (let i = 0; i < answer.length; i++) {
                    if (Object.prototype.hasOwnProperty.call(answer[i], 'address')) {
                        response = answer[i].address;
                    }
                }
            } else if (options.getRecursion) {
                // Get the whole nested recursion
                for (let i = 0; i < answer.length; i++){
                    // Check if the answer element has a "data" property (which a CNAME record will have)
                    if(Object.prototype.hasOwnProperty.call(answer[i], 'data')){
                        response = response.concat(answer[i].name, ' --> ', answer[i].data, EOL);
                    // Check if the answer element has an "address" property (which an A record will have)
                    } else if (Object.prototype.hasOwnProperty.call(answer[i], 'address')) {
                        response = response.concat(answer[i].name, ' --> ', answer[i].address, EOL);
                    } else {
                       debug('Warning: There is an unhandled element [%s] in answer array: %O', i, answer[i]);
                    }
                }
            } else if (options.getRecordType) {
                // Get the Resource Record type (CNAME, A, AAA, etc)
                var rrtype =module.exports.ResourceRecordType(answer[0].type);
                // Add record type to the response object
                response = rrtype;
                debug('Resource Record Type: %s', rrtype);
            } else if (options.getTTL) {
                // Get the record's time-to-live value
                response = answer[0].ttl
                debug('TTL: %s', answer[0].ttl);
            }

            debug('parseAnswer() returning: %s', response);
            return(response);

        } catch (error) {
            debug('parseAnswer() caught an exception: %O', error);
            return('error parsing answer');
        }
    },

    isAddressUnique(ipAddress) {
        debug('isAddressUnique(): Checking if %s has been seen before', ipAddress);
        try {
            // Loop through previously seen addresses
            for (let i = 0; i < module.exports.isAddressUnique.addresses.length; i++) {
                debug('Checking against: %s', module.exports.isAddressUnique.addresses[i]);
                if (ipAddress === module.exports.isAddressUnique.addresses[i]) {
                    debug('A match has been found. Returning "False" as %s is not unique', ipAddress);
                    // IP Address found on the list, so it's not unique; return false
                    return(false);
                }
            }
            debug('%s was not found on the list, so adding it...', ipAddress);
            // We've gone through the whole list without finding the IP address, so add it to the list
            module.exports.isAddressUnique.addresses.push(ipAddress);
            // Return true as the address is unique
            debug('Returning "True"');
            return(true);
        } catch (error) {
            debug('isAddressUnique() caught an exception: %O', error);
            return(false);
        }
    },

    formatBytes(bytes, decimals = 2) {
        if (bytes === 0) {
            return '0 Bytes';
        }
        try {
            const k = 1024;
            const dm = decimals < 0 ? 0 : decimals;
            const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

            const i = Math.floor(Math.log(bytes) / Math.log(k));

            return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
        } catch (error) {
            debug('formatBytes() caught an exception: %O', error);
            return('%d Bytes', bytes);
        }

    },

    secondsToHms(seconds) {
        try {
            if (seconds) {
                seconds = Number(seconds);

                var h = Math.floor(seconds / 3600);
                var m = Math.floor(seconds % 3600 / 60);
                var s = Math.floor(seconds % 3600 % 60);

                return ('0' + h).slice(-2) + ' hours, ' + ('0' + m).slice(-2) + ' minutes, ' + ('0' + s).slice(-2) + ' seconds';
            } else {
                return('<invalid>');
            }
        } catch (error) {
                debug('secondsToHms() caught an exception: %O', error);
                // an unexpected error occurred; return the original value
                return('%d seconds', seconds);
        }
    },

    getColourLevelDesc(level) {
        const colourLevel = ['Colours Disabled', '16 Colours (Basic)', '256 Colours', '16 Million Colours (True Colour)'];
        try {

            if ((level > 3 || level < 0) || (typeof level === 'undefined')) {
                // The level passed isn't in our range so detect it
                const chalk = require('chalk');
                level = chalk.supportsColor.level;
                if (typeof level === 'undefined') {
                    level = 0;
                }
            }

            return (colourLevel[level]);

        } catch (error) {
            debug('getColourLevelDesc() caught an exception: %O', error);
            return('Unknown');
        }
    },

    ResourceRecordType(value) { // Takes the integer value returned in an answer and returns the corresponding record name
        const DNSResourceRecordsDatabase = configFilePath +'/' + 'DNSResourceRecords.json';
        try {
            debug('ResourceRecordType() called with value: %s', value);
            // Read in Resource Record database
            const fs = require('fs');
            debug('Reading in DNS Resource Records data from [%s]', DNSResourceRecordsDatabase);
            let rawData = fs.readFileSync(DNSResourceRecordsDatabase);
            let DNSRecords = JSON.parse(rawData);

            DNSRecords.RecordTypes.forEach(element => {
                debug('Evaluating resource record database value [%s] against [%s]', element.value, value);
                if (element.value === value) {
                    debug('Returning: %s', element.type);
                    return(element.type);
                }
                // *** TO DO *** This is inefficient as the forEach loop continues even after finding a match
            });

            // We're going to return 'Unknown' by default unless we find something
            var returnValue = 'Unknown';
            for (let i = 0; i < DNSRecords.RecordTypes.length; i++) {
                debug('Evaluating resource record database value [%s] against [%s]', DNSRecords.RecordTypes[i].value, value);
                if (DNSRecords.RecordTypes[i].value === value) {
                    debug('Returning: %s', DNSRecords.RecordTypes[i].type);
                    // Set new return value of the record type found
                    returnValue = DNSRecords.RecordTypes[i].type;
                    // Stop processing the rest of the loop by skipping the array index forward to the end
                    i = DNSRecords.RecordTypes.length
                }
            }

            // Return the Record Type
            return (returnValue);

        } catch (error) {
            debug('An error occurred in "ResourceRecordType(): %O"', error);
            return ('----');
        }
    }
};

// Initialise address list array; stored as a property of the function object so it's values persist between function calls
module.exports.isAddressUnique.addresses = new Array();
