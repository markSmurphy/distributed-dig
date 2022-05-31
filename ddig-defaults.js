// Default DNS resolvers obtained from https://public-dns.info/

const defaultConfig = {
  'options': {
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
  },
  'resolvers': [
    {
      'nameServer': '208.67.222.222',
      'provider': 'OpenDNS (Primary)'
    },
    {
      'nameServer': '208.67.220.220',
      'provider': 'OpenDNS (Secondary)'
    },
    {
      'nameServer': '1.1.1.1',
      'provider': 'Cloudflare (Primary)'
    },
    {
      'nameServer': '1.0.0.1',
      'provider': 'Cloudflare (Secondary)'
    },
    {
      'nameServer': '8.8.8.8',
      'provider': 'Google Public DNS (Primary)'
    },
    {
      'nameServer': '8.8.4.4',
      'provider': 'Google Public DNS (Secondary)'
    },
    {
      'nameServer': '199.85.126.10',
      'provider': 'Norton ConnectSafe (Primary)'
    },
    {
      'nameServer': '199.85.127.10',
      'provider': 'Norton ConnectSafe (Secondary)'
    },
    {
      'nameServer': '8.26.56.26',
      'provider': 'Comodo Secure DNS (Primary)'
    },
    {
      'nameServer': '8.20.247.20',
      'provider': 'Comodo Secure DNS (Secondary)'
    },
    {
      'nameServer': '9.9.9.9',
      'provider': 'Quad9 (Primary)'
    },
    {
      'nameServer': '149.112.112.112',
      'provider': 'Quad9 (Secondary)'
    },
    {
      'nameServer': '64.6.64.6',
      'provider': 'Verisign DNS (Primary)'
    },
    {
      'nameServer': '64.6.65.6',
      'provider': 'Verisign DNS (Secondary)'
    },
    {
      'nameServer': '202.21.158.41',
      'provider': 'Singapore'
    },
    {
      'nameServer': '62.219.45.200',
      'provider': 'Israel'
    },
    {
      'nameServer': '159.134.248.17',
      'provider': 'Ireland'
    },
    {
      'nameServer': '87.213.68.130',
      'provider': 'Netherlands'
    },
    {
      'nameServer': '217.199.173.113',
      'provider': 'United Kingdom'
    },
    {
      'nameServer': '216.98.109.133',
      'provider': 'United States'
    },
    {
      'nameServer': '221.138.17.154',
      'provider': 'South Korea'
    },
    {
      'nameServer': '103.224.162.37',
      'provider': 'Australia'
    },
    {
      'nameServer': '190.220.8.141',
      'provider': 'Argentina'
    },
    {
      'nameServer': '201.147.98.2',
      'provider': 'Mexico'
    }
  ]
};

function printDefaultConfig() {
  console.dir(defaultConfig);
}

module.exports = { printDefaultConfig };