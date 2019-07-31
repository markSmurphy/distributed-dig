var debug = require('debug')('ddig');
debug('Entry: [%s]', __filename);

// Default Options
var options = {
    'request': {
        'port': 53,
        'type': 'udp',
        'timeout': 2500
    },
    'question': {
        'type': 'A'
    }
};

module.exports = {

    resolve(domains, resolvers, callback) {
        // Function to iterate through resolver name servers for each domain
        function processDomains() {
            // Import IP validation library
            const isIp = require('is-ip');

            // Import DNS library
            const dns = require('native-dns-multisocket');

            // Perform iterative lookups
            for (var domainsIndex = 0; domainsIndex < domains.length; domainsIndex++) {
            //domains.forEach((domain) => {
                resolvers.forEach((resolver) => {
                    debug('resolving %s using %s (%s)', domains[domainsIndex], resolver.nameServer, resolver.provider);

                    // Verify the `resolver.nameServer` value is a valid IP address
                    if (isIp(resolver.nameServer) === false){
                        debug('Skipping the resolver [%s] because it is not a valid IP address', resolver.nameServer);
                    } else {
                        // Create DNS Question
                        var question = dns.Question({
                            name: domains[domainsIndex],
                            type: options.question.type,
                        });

                        // Create DNS Request to ask the Question
                        var req = dns.Request({
                            question: question,
                            server: { address: resolver.nameServer, port: options.request.port, type: options.request.type },
                            timeout: options.request.timeout,
                        });

                        // Hook the timeout event
                        req.on('timeout', function () {
                            console.log('The %sms timeout elapsed before %s [%s] responded', options.request.timeout, resolver.nameServer, resolver.provider);
                        });


                        req.on('message', function (err, answer) {
                            if (err) {
                                debug('Error received: %O', err);
                            } else{
                                debug('The resolver [%s] provided the answer: %O', resolver.nameServer, answer.answer);
                                answer.answer.forEach(function (a) {
                                    debug(a.data);
                                });

                                // Create lookup result object
                                var lookupResult = {
                                    'domain' : domains[domainsIndex],
                                    'ipAddress' : [JSON.stringify(answer.answer)],
                                    'resolver' : resolver.nameServer,
                                    'provider' : resolver.provider
                                };

                                // Add the result to the response collection
                                response.lookups.push(lookupResult);
                            }
                        });

                        req.on('end', function () {
                            debug('Finished processing DNS request');
                        });

                        req.send();
                    }

                });
            }

        }

        // Use 'moment' to do time difference calculations
        const moment = require('moment');
        const startTime = moment();

        debug('resolve() received the following domains: %O .... and resolvers: %O', domains, resolvers);

        // Initialise response object
        var response = {
            'duration' : 'unknown',
            'lookups' : []
        };

        processDomains();

        // Record the timestamp and difference with the starting timestamp
        const endTime = moment();
        response.duration = moment(endTime).diff(startTime);

        // Pass response object to callback function
        debug ('resolve() return object: %O', response);
        callback(response);
    }
};
