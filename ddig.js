var debug = require('debug')('ddig');
debug('Entry: [%s]', __filename);

// Import IP validation library
const isIp = require('is-ip');

// Import DNS library
const dns = require('native-dns-multisocket');

// Use 'moment' to do time difference calculations
const moment = require('moment');

// PLatform independent end-of-line
const EOL = require('os').EOL;

// Default Options
var options = {
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

module.exports = {
    // resolve() issues a single DNS lookup request
    resolve(domain, resolver, callback) {
        debug('resolve() triggered');
        // Initialise lookup result object
        var lookupResult = null;

        // Create DNS Question
        var question = dns.Question({
            name: domain,
            type: options.question.type,
        });

        // Create DNS Request to ask the Question
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
        debug('resolve() created dns.request: %O', req);

        // Issue DNS request
        req.send();
        // **** DNS resolution event hook functions ****
        // Handle a DNS timeout event
        req.on('timeout', function () {
            console.log('The %sms timeout elapsed before %s [%s] responded', options.request.timeout, resolver.nameServer, resolver.provider);
        });

        // Handle DNS message event; i.e process the `answer` response
        req.on('message', function (err, answer) {
            if (err) {
                debug('Error received: %O', err);
            } else{
                debug('The resolver [%s] provided the answer: %O', resolver.nameServer, answer);
                for (var i = 0; i < answer.answer.length; i++){
                    // Check if the answer hop has a data property (which a CNAME record will have)
                    if(Object.prototype.hasOwnProperty.call(answer.answer[i], 'data')){
                        console.log('%s --> %s', answer.answer[i].name, answer.answer[i].data);
                    // Check if the answer hop has an address property (which an A record will have)
                    } else if (Object.prototype.hasOwnProperty.call(answer.answer[i], 'address')) {
                        console.log('%s --> %s', answer.answer[i].name, answer.answer[i].address);
                    } else {
                        console.log('Could find either a data nor an address element in the answer\'s %s hop', i);
                    }

                }

                // Populate lookup result object
                lookupResult = {
                    'domain' : domain,
                    'ipAddress' : [JSON.stringify(answer.answer)],
                    'resolver' : resolver.nameServer,
                    'provider' : resolver.provider
                };
                // Return the result
                callback(lookupResult);
            }
        });

        // The `end` event fires at the end of each DNS request regardless of its success
        req.on('end', function () {
            //debug('Finished processing DNS request');
        });
    },

    // resolveDomain() iterates through the resolvers performing a lookup of a single domain
    // Returns json object
    resolveDomain(domain, resolvers, callback) {
        debug('resolveDomain() triggered for [%s]', domain);

        // Iterate through resolvers
        for (var index = 0; index < resolvers.length; index++) {
            debug('resolveDomain() resolving [%s] using %s (%s)', domain, resolvers[index].nameServer, resolvers[index].provider);

            // Verify the `nameServer` value is a valid IP address
            if (isIp(resolvers[index].nameServer) === false) {
                debug('resolveDomain() skipping the resolver [%s] because it is not a valid IP address', resolvers[index].nameServer);
            } else {
                debug('resolveDomain() calling resolve(%s, %s)', domain, resolvers[index]);
                module.exports.resolve(domain, resolvers[index], function(lookup){
                    debug('resolveDomain() received the DNS lookup answer: %O', lookup);
                    callback(lookup);
                });

            }
        }
    },

    // resolveBulk() performs a lookup of each domain against each resolver
    // Returns json object with results via callback()
    resolveBulk(domains, resolvers, callback) {
        const startTime = moment();
        debug('resolveBulk() triggered for %s domains and %s resolvers', domains.length, resolvers.length);

        // Initialise response object
        var response = {
            'duration' : 'unknown',
            'lookups' : []
        };

        for (var iDomain = 0; iDomain < domains.length; iDomain++) {
            debug('resolveBulk() calling resolveDomain(%s, resolvers)', domains[iDomain]);
            module.exports.resolveDomain(domains[iDomain], resolvers, function(result){
                debug('resolveBulk() received the result: %O', result);
                if (result) {
                    debug('resolveBulk() adding result to response object');
                    response.lookups.push(result);
                }
            });
            console.log('Resolvers: %s', resolvers.length);
            console.log('Responses: %s', response.lookups.length);
            console.log('Domain %s of %s', iDomain, domains.length);
            console.log('-----' + EOL);
            if (response.lookups.length === iDomain) {
                // Record the timestamp and difference with the starting timestamp
                const endTime = moment();
                response.duration = moment(endTime).diff(startTime);
                debug('resolveBulk() recorded an execution time of %s milliseconds', response.duration);
                // Pass response object to callback function
                debug ('resolveBulk() generated the response object: %O', response);
                callback(response);
            }
        }


    }
};
