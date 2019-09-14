# distributed-dig

![Version](https://img.shields.io/npm/v/distributed-dig.svg?style=plastic)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/47a2084dfb3146a58e7711d6444324a7)](https://www.codacy.com?utm_source=bitbucket.org&amp;utm_medium=referral&amp;utm_content=MarkSMurphy/distributed-dig&amp;utm_campaign=Badge_Grade)
![Libraries.io dependency status for latest release](https://img.shields.io/librariesio/release/npm/distributed-dig.svg?style=plastic)
![Downloads](https://img.shields.io/npm/dm/distributed-dig.svg?style=plastic)
![Licence](https://img.shields.io/npm/l/distributed-dig.svg?style=plastic)

## Quick Start

## Overview

Issues multiple DNS lookup requests across a multitude of DNS resolvers.  Useful for checking if a DNS record has been fully propagated, or for querying the origins behind an [AWS Route 53](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/dns-failover-types.html) / [Azure Traffic Manager](https://azure.microsoft.com/en-gb/services/traffic-manager/) record (*or any other DNS-based load balancing solution*).

## To Do

* Add the option `--config` to specify alternative config file via command line.
  * Use `findup-sync` to find config file if not in current directory.
* Add the option `--unique` to display only the first occurrence of each unique IP address.
* Add a **SoundEx** pattern match against invalid domains and CLI switches to allow *Did you mean ...* alongside the *Warning: Ignoring ...*.
* Add `--certs` switch which instructs `ddig-core.js.resolve()` to extract an x.505 cert from each endpoint, using [get-ssl-certificate](https://www.npmjs.com/package/get-ssl-certificate) and add the details to the `lookupResult` response object.

    ```javascript
    var sslCertificate = require('get-ssl-certificate');

    sslCertificate.get('www.asos.com').then(function (certificate) {
        //console.log(certificate);
        console.log('Common Name: ' + certificate.subject.CN);
        console.log('Subject Alt Name: ' + certificate.subjectaltname);
        console.log('Valid To: ' + certificate.valid_to);
    });
    ```

* Allow for `--certs` *and* `--verbose` to display more x.509 properties.
* Update `README.md` sections:
  * ~~Badges~~
  * Quick Start
  * Overview
  * Description
  * Installation
  * Usage
  * Examples
  * Features
  * Configuration File(s)
  * Debugging
  * Restrictions
* ~~Add CLI switches to modify default request options:~~
  * ~~`port` : **53**~~
  * ~~`type` : **udp**~~
  * ~~`timeout` : **2500**~~
  * ~~`try_edns` : **false**~~
  * `cache` : **false**
* ~~Add a column to indicate the first of each unique IP address.~~
* ~~Add a warning when terminal width is narrow and using --verbose switch.~~
* ~~Allow for the `--verbose` option displaying the full DNS recursion.~~
* ~~ Add a `--verbose` switch which displays more columns.~~
* ~~Allow for a combination of `--list-options` and `--verbose` to pretty print `options` section raw json.~~
* ~~Allow for a combination of `--list-resolvers` and `--verbose` to pretty print `resolvers` section raw json.~~
* ~~Move **Default Options** json from `distributed-dig.js` into its own file/function for easier maintainability.~~
* ~~Move all options to `distributed-dig.json`.~~
* ~~Output config file being used to avoid confusion.~~
* ~~Refactor to async with closures.~~
* ~~Format output into columns~~
* ~~Update DNS resolvers list.~~

## Description

## Installation

## Usage

## Examples

## Features

### Configuration File(s)

## Debugging

## Restrictions
