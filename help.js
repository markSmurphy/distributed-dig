function helpScreen(verbose) {
    // Platform independent end-of-line character
    const { EOL: endOfLine } = require('os');
    // console colours
    const chalk = require('chalk');
    // parse package.json for the version number
    const packageInfo = require('./package.json');

    // Display help screen
    console.log(chalk.blue('%s [a.k.a %s]'), packageInfo.name, Object.keys(packageInfo.bin)[0]);
    console.log(`${chalk.green('Read the docs: ')}${packageInfo.homepage}`);
    console.log(`${chalk.magenta('Support & bugs: ')}${packageInfo.bugs.url}`);
    console.log(endOfLine);
    console.log(chalk.grey('DESCRIPTION:'));
    console.log(chalk.italic('   %s'), packageInfo.description);
    console.log(endOfLine);
    console.log(chalk.grey('VERSION:'));
    console.log(`   ${packageInfo.version}`);
    console.log(endOfLine);
    console.log(chalk.grey('USAGE:'));
    console.log('   ddig domain [domain [domain] ...] [options]');
    console.log(endOfLine);
    console.log(chalk.grey('OPTIONS:'));
    console.log(`   domain [domain [domain] ...]     ${chalk.grey('Perform DNS lookups on one or more domains')}`);
    console.log(`   --port <number>                  ${chalk.grey('Specify the DNS port [53]')}`);
    console.log(`   --protocol <upd|tcp>             ${chalk.grey('Specify the DNS protocol [udp]')}`);
    console.log(`   --timeout <number>               ${chalk.grey('Specify the DNS timeout in milliseconds [2500]')}`);
    console.log(`   --edns <true|false>              ${chalk.grey('Enable or disable EDNS(0) [false]')}`);
    console.log(`   --config <filename>              ${chalk.grey('Specify an alternative configuration file')}`);
    console.log(`   --unique                         ${chalk.grey('Filter out duplicate IP addresses')}`);
    console.log(`   --list-resolvers                 ${chalk.grey('List resolvers configured in config file')}`);
    console.log(`   --list-options                   ${chalk.grey('List DNS request options configured in config file')}`);
    console.log(`   --list-defaults                  ${chalk.grey('Print json of default config file settings')}`);
    console.log(`   --verbose                        ${chalk.grey('Outputs more information')}`);
    console.log(`   --no-color                       ${chalk.grey('Switches off colour output')}`);
    console.log(`   --version                        ${chalk.grey('Display version number')}`);
    console.log(`   --help                           ${chalk.grey('Display this help')}`);
    console.log(endOfLine);
    console.log(chalk.grey('EXAMPLES:'));
    console.log('   ddig www.example.com');
    console.log('   ddig www.example.com --verbose');
    console.log('   ddig example.com www.example.com --timeout 5000');
    // Display more information if `verbose` is enabled
    if (verbose) {
        const os = require('os');
        const ddig = require('./ddig-core');
        console.log(endOfLine);
        console.log(chalk.grey('SYSTEM:'));
        console.log('   Hostname           ' + chalk.blue(os.hostname()));
        console.log('   Uptime             ' + chalk.blue(ddig.secondsToHms(os.uptime())));
        console.log('   Platform           ' + chalk.blue(os.platform()));
        console.log('   O/S                ' + chalk.blue(os.type()));
        console.log('   O/S release        ' + chalk.blue(os.release()));
        console.log('   CPU architecture   ' + chalk.blue(os.arch()));
        console.log('   CPU cores          ' + chalk.blue(os.cpus().length));
        console.log('   CPU model          ' + chalk.blue(os.cpus()[0].model));
        console.log('   Free memory        ' + chalk.blue(ddig.formatBytes(os.freemem())));
        console.log('   Total memory       ' + chalk.blue(ddig.formatBytes(os.totalmem())));
        console.log('   Home directory     ' + chalk.blue(os.homedir()));
        console.log('   Temp directory     ' + chalk.blue(os.tmpdir()));
        console.log('   Console width      ' + chalk.blue(process.stdout.columns));
        console.log('   Console height     ' + chalk.blue(process.stdout.rows));
        console.log('   Colour support     ' + chalk.blue(ddig.getColourLevelDesc()));
    }
}

module.exports = { helpScreen };