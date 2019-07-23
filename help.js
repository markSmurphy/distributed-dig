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
        console.log('%s [a.k.a %s]'.cyan);
        console.log('Read the docs: '.green + package.homepage);
        console.log('Support & bugs: '.magenta + package.bugs.url);
        console.log(endOfLine);
        console.log('%s'.italic, package.description);
        console.log(endOfLine);
        console.log('VERSION:'.grey);
        console.log('   ' + package.version);
        console.log(endOfLine);
        console.log('USAGE:'.grey);
        console.log('   ' + 'ddig domain [domain [domain] ...]     ' + 'Perform multiple DNS lookups '.grey);
        console.log('   ' + 'ddig --version                        ' + 'Display version number.'.grey);
        console.log('   ' + 'ddig --help                           ' + 'Display this help.'.grey);
        console.log(endOfLine);
        console.log('EXAMPLE:'.grey);
        console.log('   ddig www.asos.com');
    }
  };
