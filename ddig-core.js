// Exports a public function, resolve(), which accepts multiple domains and multiple resolvers.
// The other local functions handle the nested iteration to resolve each domain against each resolver.
const debug = require('debug')('ddig');
debug('Entry: [%s]', __filename);

// Import IP validation library
const isIp = require('is-ip');

// Import DNS library
const dns = require('native-dns-multisocket');

// Use 'moment' to do time difference calculations
const moment = require('moment');

// Platform agnostic new line character
const EOL =  require('os').EOL;

module.exports = {
    resolve(domain, resolver, options, callback) {
        const startTime = moment();
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
            'error': ''
        };

        // Validate the resolver IP address is valid
        if (isIp(resolver.nameServer) === false) {
            debug('resolve() skipping the resolver [%s] because it is not a valid IP address', resolver.nameServer);
            // Populate lookup results object
            lookupResult.success=false;
            lookupResult.duration = moment(moment()).diff(startTime);
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
                lookupResult.duration = moment(moment()).diff(startTime);

                // Return the result
                callback(lookupResult);
            });

            // Handle DNS message event; i.e process the `answer` response
            req.on('message', function (err, answer) {
                if (err) {
                    debug('Error received: %O', err);
                    lookupResult.msg = 'An error occurred';
                    lookupResult.error = JSON.stringify(err);
                    lookupResult.success=false;
                    lookupResult.duration=moment(moment()).diff(startTime);

                    // Return the result
                    callback(lookupResult);

                } else{
                    debug('The resolver [%s] provided the answer: %O', resolver.nameServer, answer);

                    // Populate lookup result object
                    lookupResult.answer = JSON.stringify(answer.answer);
                    lookupResult.ipAddress = module.exports.parseAnswer(answer.answer, {getIpAddress: true});
                    lookupResult.recursion = module.exports.parseAnswer(answer.answer, {getRecursion: true});
                    lookupResult.msg = 'Success';
                    lookupResult.success=true;
                    lookupResult.duration=moment(moment()).diff(startTime);

                    // Return the result
                    callback(lookupResult);
                }
            });
        }
    },

    parseAnswer(answer, options) {
        debug('parseAnswer() called with OPTIONS: %O ANSWER: %O', options, answer);
        var response = '';
        try {
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
            }

            debug('parseAnswer() returning: %s', response);
            return(response);

        } catch (error) {
            debug('parseAnswer() caught an exception: %O', error);
            return('error parsing answer');
        }
    },

    isAddressUnique(ipAddress) {
        try {
            debug('isAddressUnique(): Checking if %s has been seen before', ipAddress)
            for (let i = 0; i < module.exports.isAddressUnique.addresses.length; i++) {
                debug('Checking against: %s', module.exports.isAddressUnique.addresses[i]);
                if (ipAddress === module.exports.isAddressUnique.addresses[i]) {
                    debug('A match has been found. Returning False as %s is not unique', ipAddress)
                    // IP Address found on the list, so it's not unique; return false
                    return(false);
                }
            }
            debug('%s wasn\'t found on the list so adding it...');
            // We've gone through the whole list without finding the IP address, so add it to the list
            module.exports.isAddressUnique.addresses.push(ipAddress);
            // Return true as it is unique
            debug('Returning True');
            return(true);
        } catch (error) {
            debug('isAddressUnique() caught an exception: %O', error);
            return(false);
        }
    }
};

// Initialise address list array; stored as a property of the function object so it's values persist between function calls
module.exports.isAddressUnique.addresses = new Array();
