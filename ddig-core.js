// Exports one public function, resolve(), which accepts multiple domains and multiple resolvers.
// The other local functions handle the nested iteration to resolve each domain against each resolver.
const debug = require('debug')('ddig');
debug('Entry: [%s]', __filename);

// Import IP validation library
const isIp = require('is-ip');

// Import DNS library
const dns = require('native-dns-multisocket');

// Use 'moment' to do time difference calculations
const moment = require('moment');

module.exports = {
    resolve(domain, resolver, options, callback) {
        const startTime = moment();
        debug('resolve() called for domain [%s] via resolver [%s (%s)] with options: %O', domain, resolver.nameServer, resolver.provider ,options);
        // Initialise lookup result object
        var lookupResult = {
            'domain': domain,
            'ipAddress': null,
            'resolver': resolver.nameServer,
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
                    lookupResult.ipAddress = [JSON.stringify(answer.answer)];
                    lookupResult.msg = 'Success';
                    lookupResult.success=true;
                    lookupResult.duration=moment(moment()).diff(startTime);

                    // Return the result
                    callback(lookupResult);
                }
            });
        }
    }
};
