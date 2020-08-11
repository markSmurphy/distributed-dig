# distributed-dig

![Version](https://img.shields.io/npm/v/distributed-dig.svg?style=plastic)
![npm bundle size](https://img.shields.io/bundlephobia/min/distributed-dig?style=plastic)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/47a2084dfb3146a58e7711d6444324a7)](https://www.codacy.com?utm_source=bitbucket.org&amp;utm_medium=referral&amp;utm_content=MarkSMurphy/distributed-dig&amp;utm_campaign=Badge_Grade)
![GitHub issues](https://img.shields.io/github/issues/markSmurphy/distributed-dig?style=plastic)
[![Known Vulnerabilities](https://snyk.io/test/npm/distributed-dig/badge.svg)](https://snyk.io/test/npm/distributed-dig)
![Libraries.io dependency status for latest release](https://img.shields.io/librariesio/release/npm/distributed-dig.svg?style=plastic)
![Downloads](https://img.shields.io/npm/dm/distributed-dig.svg?style=plastic)
![Licence](https://img.shields.io/npm/l/distributed-dig.svg?style=plastic)

## Quick Start

### Installation

**Install globally**:

```text
npm install -g distributed-dig
```

### Usage

**Lookup a single domain**:

```text
ddig domain
```

![`ddig [domain]`](https://marksmurphy.github.io/img/ddig.single.domains.gif)

---

## Overview

A utility which makes DNS lookup requests across multiple DNS resolvers and collates the results.

Useful for checking if a DNS record has been fully propagated, or for querying the origins behind an [AWS Route 53](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/dns-failover-types.html) / [Azure Traffic Manager](https://azure.microsoft.com/en-gb/services/traffic-manager/) record (*or any other DNS-based load balancing solution*).

---

## Installation

Installing globally is recommended:

```text
npm install -g distributed-dig
```

---

## Usage

```text
ddig domain [domain [domain] ...] [options]
```

---

## Options

The following options are available:

```text
--port <number>                  Specify the DNS port [53]
--protocol <upd|tcp>             Specify the DNS protocol [udp]
--timeout <number>               Specify the DNS timeout in milliseconds [2500]
--edns <true|false>              Enable or disable EDNS(0) [false]
--config <filename>              Specify an alternative configuration file
--list-resolvers                 List resolvers configured in config file
--list-options                   List DNS request options configured in config file
--list-defaults                  Print json of default config file settings
--verbose                        Outputs more information
--no-color                       Switches off colour output
--version                        Display version number
--help                           Display this help
```

### port

Specify the TCP/UDP port tro use when connecting to the DNS resolver.
Default: `53`

### protocol

Specify whether to use UDP or TCP when connecting to the DNS resolver.
Default: `udp`

### timeout

Specifies the timeout in milliseconds to wait for a response from each DNS resolver.
Default: `2500` (*2.5 seconds*)

### edns

Enables [EDNS(0)](https://en.wikipedia.org/wiki/Extension_mechanisms_for_DNS)
Default: `false` (*disabled*)

With EDNS(0) enabled, if an upstream resolver doesn't support it then the standard DNS will be used as a fallback.
*Even though EDNS is support by ~90% of resolvers on the internet [^1], it is disabled by default in `ddig` as it may cause the resolver to return the IP address it considers closest to you, which is counter-productive to the purpose of querying many geographically distributed DNS resolvers.*

[^1]: [Internet Systems Consortium - Partial EDNS Compliance Hampers Deployment of New DNS Features](https://www.isc.org/blogs/partial-edns-compliance-hampers-deployment-of-new-dns-features/)

### config

Specifies an alternative configuration file.

To create a custom config you can:

1. pipe **--list-defaults** to a new file: `ddig --list-defaults > custom.json`
2. Edit `custom.json`
3. Use the new configuration file: `ddig --config [path]custom.json example.com`

### list-resolvers

Lists the resolvers configured in the `distributed-dig.json` config file:

![ddig --list-resolvers](https://marksmurphy.github.io/img/ddig.list-resolvers.gif)

### list-options

Lists the options configured in the `distributed-dig.json` config file:

![ddig --list-options](https://marksmurphy.github.io/img/ddig.list-options.gif)

### list-defaults

Prints out a sample default config file in raw json.  Pipe it to a file for an initial customised configuration file.

### verbose

Switches on verbose mode which outputs the following additional fields:

* Full recursive answer (i.e. nested `cname` records)
* Resolver IP Address
* Response time

![ddig www.asos.com --verbose](https://marksmurphy.github.io/img/ddig.single.domain.www.asos.com.verbose.gif)

`--verbose` also modifies the `--list-resolvers` and `--list-options` switches.

### no-color

If your terminal has problems rendering the colour output then you can switch it off by using `--no-color`.

### version

Prints out `distributed-dig`'s version number.

### help

Displays the help screen:

![`ddig --help`](https://marksmurphy.github.io/img/ddig.help.gif)

---

## Examples

### Lookup a single domain

* List the IP address returned for `www.asos.com` from each of the configured resolver:

```text
ddig www.asos.com
```

![ddig www.asos.com](https://marksmurphy.github.io/img/ddig.example.01.png)

### Lookup a single domain with verbose enabled

* List the IP address and full recursive path returned for `www.asos.com` from each of the configured resolver:

```text
ddig www.asos.com --verbose
```

![ddig www.asos.com --verbose](https://marksmurphy.github.io/img/ddig.example.02.png)

### Lookup multiple domains with an increased timeout

* List the IP addresses returned for both `www.asos.com` & `secure.asos.com` from each of the configured resolver with a 5 second timeout:

```text
ddig www.asos.com my.asos.com secure.asos.com --timeout 5000
```

![ddig www.asos.com my.asos.com secure.asos.com](https://marksmurphy.github.io/img/ddig.example.03.png)

---

## Features

### Unique IP Address Identifier

The first occurrence of each unique IP address is marked by a bullet point:

![ddig unique IP Address Identifier](https://marksmurphy.github.io/img/ddig.unique.png)

#### Unicode Support

The bullet point character used is `U+2022 • BULLET (HTML &#8226;)`.  If it is detected that the output is being piped (to a file or to `more` | `cat`) then the ascii character `42 * Asterisk (HTML &ast;)`

### Column Width Warning

If you use the `--verbose` switch and have a terminal window that's narrower than 130 columns you'll see a warning:

![ddig column width warning](https://marksmurphy.github.io/img/ddig.width.warning.png)

---

## Configuration File

All Options and Resolvers are configured in `distributed-dig.json` file.  This file can exist in any of the following locations:

* The current working directory - `node -p process.cwd()`
* The home directory - `node -p require('os').homedir()`
* The application's root directory (i.e. the same directory as `distributed-dig.js`)

### Request Options

The default options are:

```json
"options": {
    "request": {
      "port": 53,
      "type": "udp",
      "timeout": 2500,
      "try_edns": false,
      "cache": false
    },
    "question": {
      "type": "A"
    }
}
```

### DNS Resolvers

Resolvers are configured in an array with each resolver having a `nameServer` element which should be the IPv4 or IPv6 address, and a `provider` element which is just a free-form text label:

```json
"resolvers": [
    {
      "nameServer": "208.67.222.222",
      "provider": "OpenDNS (Primary)"
    },
    {
      "nameServer": "208.67.220.220",
      "provider": "OpenDNS (Secondary)"
    },
    {
      "nameServer": "217.199.173.113",
      "provider": "United Kingdom"
    }
]
```

You can find a list of public DNS servers [here](https://public-dns.info/) and tailor the configured list for your own requirements.

---

## Debugging

`distributed-dig` uses the npm package [debug](https://www.npmjs.com/package/debug "www.npmjs.com").  If you set the environment variable `debug` to `ddig` you'll see full debug output.

### Windows

```text
set debug=ddig
```

### Linux

```text
DEBUG=ddig
```

### Powershell

```text
$env:debug="ddig"
```

---

## Changelog

### [1.6.1] - TBA <sup>th</sup> 2020

#### Changed

* Fixed output formatting bugs in `--list-resolvers` and `--list-options`

---

### [1.6.0] - August 10<sup>th</sup> 2020

#### Added

* Improved the standard (non-verbose) output for `CNAME` records to now include the first FQDN it resolves to along with the IP address.

#### Changed

* Fixed an `undefined` reference when using `--list-defaults`.

---

### [1.5.4] - July 11<sup>th</sup> 2020

#### Changed

* Updated dependencies.

---

### [1.5.2] - June 27<sup>th</sup> 2020

#### Changed

* The message displaying the configuration file being used now only includes the full path if it differs from the current working directory.

---

### [1.5.1] - June 19<sup>th</sup> 2020

#### Changed

* Improved the detection and reporting of invalid domains and switches

---

### [1.5.0] - June 19<sup>th</sup> 2020

#### Added

* If you tried to lookup a domain that was invalid, according to the DNS RFC, it was ignored.  You'll now see a warning message when `ddig` ignores an input.
* Appended a unit suffix to the `TTL` value.

#### Changed

* Removed `moment` as a dependency and refactored time difference calculations to be handled natively.
* Increased the recommended columns width to 140 when using the `--verbose` switch,  allowing for the new 'TTL' and `record type` columns.

---

### [1.4.2] - June 14<sup>th</sup> 2020

#### Changed

* Fixed a bug causing the `Record Type` to be `Unknown` due to erroneously locating the json lookup file when install globally.

---

### [1.4.1] - June 14<sup>th</sup> 2020

#### Added

* Added [Snyk](https://snyk.io/test/npm/distributed-dig) security checks, and badge to README.

#### Changed

* Updated dependencies.
* Fixed a bug causing `Record Type` and `TTL` column values being `undefined`.
* Increased `TTL` column width and made it right-aligned.

---

### [1.4.0] - March 14<sup>th</sup> 2020

#### Added

* Standard output now includes record type.

#### Changed

* Updated dependencies.

---

### [1.3.1] - February 14<sup>th</sup> 2020

#### Fixed

* Fixed a nested array bounds check which resulted in valid domains being reported as non-existent.

---

### [1.3.0] - February 14<sup>th</sup> 2020

#### Changed

* Updated default DNS resolvers list.
* Updated dependencies.

#### Fixed

* Better handling of `nxdomain`.  Non-existent domains aren't DNS errors, just an empty answer - so now handling those more sensibly.

---

### [1.2.2] - November 27<sup>th</sup> 2019

#### Changed

* Fixed `npm-shrinkwrap.json` problem that prevented `npm update` succeeding.

---

### [1.2.0] - November 27<sup>th</sup> 2019

#### Changed

* Switched to using `chalk` instead of `colors`.
* Updated dependencies.
* `--list-defaults` now pretty-prints the raw json output.

---

### [1.1.4] - November 20<sup>th</sup> 2019

#### Changed

* Use * instead of unicode character • to signify unique IP address when `process.stdout.isTTY` is `false` [^1].
* Updated Dependencies.
* Shrink-wrapped `npm` dependencies.

[^1]: `process.stdout.isTTY` is `false` when the output is being piped or redirected.  There's no guarantee that the target of the pipe (e.g. `more` on Windows) or the redirect (e.g. a text file) has unicode support.

---

### [1.1.3] - November 13<sup>th</sup> 2019

#### Changed

* Added `--verbose` support tp `--help` to display more information.
* Dabbled with using `chalk` instead of `colors` (on `--help` output).
* Updated dependency `yargs` to version 14.2.0
* Fixed a cross-platform file path separator bug.

---

### [1.1.2] - September 25<sup>th</sup> 2019

#### Changed

* Removed unneeded dependency `valid-filename`.
* Updated dependency `colors` to version 1.4.0
* Improved reporting on configuration file location when directory is `.`.
* Improved `debug` logging.
* Improved reporting on an empty answer (i.e. *no error, but no IP address returned*).

---

### [1.1.1] - September 21<sup>st</sup> 2019

#### Changed

* Fixed a problem when specifying a full path with the `--config` option.
* Fixed erroneous warnings when using `--config`.

---

### [1.1.0] - September 20<sup>th</sup> 2019

#### Added

* New `--config` option to specify an alternative configuration file.
* New `--list-defaults` option which prints a default config json file to the console; useful as an initial custom configuration file.

#### Changed

* Improved input validation for `--timeout` & `--protocol`.
* Improved the `Warning` logic for ignored domains to remove erroneous warnings with valid switches and options.

---

### [1.0.4] - September 17<sup>th</sup> 2019

* Fixed file system path separator problem when attempting to locate a config file on Linux systems.

---

### [1.0.0] - September 17<sup>th</sup> 2019

* Initial Release.

## FAQ

**Question:** What terminal/console are you using in the screen shots?

**Answer:** A pre-release of Microsoft's new tabbed [Windows Terminal](https://github.com/microsoft/terminal) which has many excellent features, and the ability to [configure a background image](https://www.howtogeek.com/426346/how-to-customize-the-new-windows-terminal-app/).
