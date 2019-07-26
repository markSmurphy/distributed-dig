var debug = require('debug')('ddig');
debug('Entry: [%s]', __filename);

const isIp = require('is-ip');

module.exports = {
    resolve(domains, resolvers, callback) {
        // Use 'moment' to do time difference calculations
        const moment = require('moment');
        const startTime = moment();

        debug('resolve() received the domains: %O', domains);
        debug('resolve() received the resolvers: %O', resolvers);

        // Import DNS library
        const dns = require('dns');
        const dnsSync = require('dns-sync');

        // Initialise response object
        var response = {
            'duration' : 'unknown',
            'lookups' : []
        };

        debug('Default DNS Resolvers: %O', dns.getServers());
        // Perform iterative lookups
        domains.forEach((domain) => {
            resolvers.forEach((resolver) => {
                debug('resolving %s using %s (%s)', domain, resolver.resolver, resolver.provider);

                // Verify the `resolver.resolver` value is a valid IP address
                if (isIp(resolver.resolver) === false){
                    debug('Skipping the resolver [%s] because it is not a valid IP address', resolver.resolver);
                } else {
                    // Set the DNS resolver server
                    dns.setServers([resolver.resolver]);

                    // *** Use native 'dns' here instead of dns-sync

                    // Perform synchronous DNS resolution as we can't call .setServers() while a lookup is being performed
                    var ipAddress = dnsSync.resolve(domain);

                    debug('dnsSync.resolve() returned a value of type [%s] with a value of [%O]', typeof(ipAddress), ipAddress);

                    // Initialise lookup result object
                    var lookupResult = {
                        'domain' : domain,
                        'ipAddress' : ipAddress,
                        'resolver' : resolver.resolver,
                        'provider' : resolver.provider
                    };

                    response.lookups.push(lookupResult);
                }

            });
        });

        // Record the timestamp and difference with the starting timestamp
        const endTime = moment();
        response.duration = moment(endTime).diff(startTime);

        // Pass response object to callback function
        debug ('resolve() return object: %O', response);
        callback(response);
    }
};
