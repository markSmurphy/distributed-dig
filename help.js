module.exports = {
    helpScreen: function () {
        // Platform independent end-of-line character
        var endOfLine = require('os').EOL;
        // console colours
        // eslint-disable-next-line no-unused-vars
        const colours = require('colors');
        // parse package.json for the version number
        const package = require('./package.json');

        //display help screen
        console.log('%s [a.k.a %s]'.cyan, package.name, Object.keys(package.bin)[0]);
        console.log('Read the docs: '.green + package.homepage);
        console.log('Support & bugs: '.magenta + package.bugs.url);
        console.log(endOfLine);
        console.log('%s'.italic, package.description);
        //console.log(endOfLine);
        console.log('VERSION:'.grey);
        console.log('   ' + package.version);
        console.log(endOfLine);
        console.log('USAGE:'.grey);
        console.log('   ' + 'ddig domain [domain [domain] ...] [options]');
        console.log(endOfLine);
        console.log('OPTIONS:'.grey);
        console.log('   ' + 'domain [domain [domain] ...]     ' + 'Perform DNS lookups on one or more domains'.grey);
        console.log('   ' + '--port <number>                  ' + 'Specify the DNS port [53]'.grey);
        console.log('   ' + '--protocol <upd|tcp>             ' + 'Specify the DNS protocol [udp]'.grey);
        console.log('   ' + '--timeout <number>               ' + 'Specify the DNS timeout in milliseconds [2500]'.grey);
        console.log('   ' + '--edns <true|false>              ' + 'Enable or disable EDNS(0) [false]'.grey);
        console.log('   ' + '--list-resolvers                 ' + 'List resolvers configured in config file'.grey);
        console.log('   ' + '--list-options                   ' + 'List DNS request options configured in config file'.grey);
        console.log('   ' + '--verbose                        ' + 'Outputs more information'.grey);
        console.log('   ' + '--no-color                       ' + 'Switches off colour output'.grey);
        console.log('   ' + '--version                        ' + 'Display version number'.grey);
        console.log('   ' + '--help                           ' + 'Display this help'.grey);
        console.log(endOfLine);
        console.log('EXAMPLES:'.grey);
        console.log('   ddig www.asos.com');
        console.log('   ddig www.asos.com --verbose');
        console.log('   ddig www.asos.com secure.asos.com --timeout 5000');
    }
  };
