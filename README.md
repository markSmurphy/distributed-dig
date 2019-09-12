# distributed-dig

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/47a2084dfb3146a58e7711d6444324a7)](https://www.codacy.com?utm_source=bitbucket.org&amp;utm_medium=referral&amp;utm_content=MarkSMurphy/distributed-dig&amp;utm_campaign=Badge_Grade)

## Quick Start

## Overview

Issues DNS lookup requests across multiple DNS servers.

## To Do

* Add option `--config` to specify alternative config file via command line.
* Use `findup-sync` to use alternative config file (`ddig.json`) in parent folder hierarchy (if `--config` isn't specified).
* Allow for a `--verbose` option which displays the full DNS recursion.
* Add `--certs` / `--certificates` which extracts x.505 cert from each endpoint, using [get-ssl-certificate](https://www.npmjs.com/package/get-ssl-certificate) and displays details.

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
  * Badges
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
  * ~~`port` : __53__~~
  * ~~`type` : __udp__~~
  * ~~`timeout` : __2500__~~
  * ~~`try_edns` : __false__~~
  * `cache` : __false__
* ~~Allow for a combination of `--list-options` and `--verbose` to pretty print `options` section raw json.~~
* ~~Allow for a combination of `--list-resolvers` and `--verbose` to pretty print `resolvers` section raw json.~~
* ~~Move **Default Options** json from `distributed-dig.js` into its own file/function for easier maintainability.~~
* ~~Move all options to `distributed-dig.json`.~~
* ~~Output config file being used to avoid confusion.~~
* ~~Refactor to async with closures.~~
* ~~Format output into columns~~

## Description

## Installation

## Usage

## Examples

## Features

### Configuration File(s)

## Debugging

## Restrictions
