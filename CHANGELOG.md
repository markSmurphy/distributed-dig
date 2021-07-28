# Changelog

## [1.8.7] - July 28<sup>th</sup> 2021

### Changed

* Updated dependency `debug` to version `4.3.2`.
* Updated dependency `is-valid-domain` to version `0.1.2`.
* Increased default timeout to `10000` milliseconds.
* Updated DNS server IP addresses for **UK**, **Singapore** and **Mexico**.

---

## [1.8.6] - June 30<sup>th</sup> 2021

### Changed

* Updated dependency `pretty-error` to version `3.0.4` which addressed [CVE-2021-33587](https://nvd.nist.gov/vuln/detail/CVE-2021-33587).

---

## [1.8.5] - May 14<sup>th</sup> 2021

### Changed

* Increased default timeout to `3500` milliseconds.
  * Previously the default was `2500` which may have caused unnecessary timeouts when querying far away resolvers.
* Changed problematic resolver in Ireland to and new one sourced from [dnspropagation.net](https://dnspropagation.net/free-public-dns-servers/ie/).

---

## [1.8.4] - May 11<sup>th</sup> 2021

### Changed

* Updated dependencies to apply `lodash` fix which addressed [CVE-2021-23337](https://nvd.nist.gov/vuln/detail/CVE-2021-23337).
* Updated dependency `supports-color` to version `8.1.1`.
* Updated dependency `chalk` to version `4.1.1`.
* Updated dependency `is-valid-domain` to version `0.0.19`.
* Updated default Singapore DNS resolver.

---

## [1.8.3] - January 14<sup>th</sup> 2021

### Changed

* Updated dependency `pretty-error` to version `3.0.3`.
* Removed broken *Size* badge from `README.md`.
* Added *Required Node Version* ![node-current](https://img.shields.io/node/v/distributed-dig?style=social) and *Github Stars* ![GitHub Repo stars](https://img.shields.io/github/stars/markSmurphy/distributed-dig?style=social) badges to `README.md`.

---

## [1.8.2] - December 19<sup>th</sup> 2020

### Changed

* Updated dependencies (`yargs` & `supports-color`)

---

## [1.8.1] - 4<sup>th</sup> December 2020

### Changed

* Moved the change log notes into its own `CHANGELOG.md` from `README.md`.

### Added

* Added `supports-color` to supplement `debug`
* Added `engines` into `package.json` to specify node version >=10.0.0

---

## [1.8.0] - November 21<sup>st</sup> 2020

### Added

* New option `--unique` which filters out duplicate addresses (but not errors).

![`ddig [domain] --unique`](https://marksmurphy.github.io/img/ddig.single.domain.unique.gif)

### Changed

* Updated dependencies (`debug`).
* Improved colour scheme to aid output readability.

---

## [1.6.7] - November 18<sup>th</sup> 2020

### Changed

* Updated dependencies (`yargs`).
* Improved debug logging clarity in `parseAnswer()`.

---

## [1.6.6] - November 3<sup>rd</sup> 2020

### Changed

* Updated dependencies (`pretty-error` & `is-valid-domain`).
* Fixed empty array check in `ddig-core.js`.
* Fixed erroneous string substitution in `return()` function calls in `ddig-core.js`.
* Improved colour output for `CNAME` records and their IP addresses.

---

## [1.6.5] - October 16<sup>th</sup> 2020

### Changed

* Updated dependencies (`yargs` & `is-valid-domain`).

---

## [1.6.4] - September 25<sup>th</sup> 2020

### Added

* Added `pretty-error` formatting to TryCatch blocks' console output.

### Changed

* Updated dependency (`debug`).

---

## [1.6.3] - September 11<sup>th</sup> 2020

### Changed

* Updated dependencies (`yargs` & `is-valid-domain`).

---

## [1.6.2] - August 25<sup>th</sup> 2020

### Changed

* Fixed erroneous `warning` when parsing certain command line arguments.

---

## [1.6.1] - August 11<sup>th</sup> 2020

### Changed

* Fixed output formatting bugs in `--list-resolvers` and `--list-options`

---

## [1.6.0] - August 10<sup>th</sup> 2020

### Added

* Improved the standard (non-verbose) output for `CNAME` records to now include the first FQDN it resolves to along with the IP address.

### Changed

* Fixed an `undefined` reference when using `--list-defaults`.

---

## [1.5.4] - July 11<sup>th</sup> 2020

### Changed

* Updated dependencies.

---

## [1.5.2] - June 27<sup>th</sup> 2020

### Changed

* The message displaying the configuration file being used now only includes the full path if it differs from the current working directory.

---

## [1.5.1] - June 19<sup>th</sup> 2020

### Changed

* Improved the detection and reporting of invalid domains and switches

---

## [1.5.0] - June 19<sup>th</sup> 2020

### Added

* If you tried to lookup a domain that was invalid, according to the DNS RFC, it was ignored.  You'll now see a warning message when `ddig` ignores an input.
* Appended a unit suffix to the `TTL` value.

### Changed

* Removed `moment` as a dependency and refactored time difference calculations to be handled natively.
* Increased the recommended columns width to 140 when using the `--verbose` switch,  allowing for the new 'TTL' and `record type` columns.

---

## [1.4.2] - June 14<sup>th</sup> 2020

### Changed

* Fixed a bug causing the `Record Type` to be `Unknown` due to erroneously locating the json lookup file when install globally.

---

## [1.4.1] - June 14<sup>th</sup> 2020

### Added

* Added [Snyk](https://snyk.io/test/npm/distributed-dig) security checks, and badge to README.

### Changed

* Updated dependencies.
* Fixed a bug causing `Record Type` and `TTL` column values being `undefined`.
* Increased `TTL` column width and made it right-aligned.

---

## [1.4.0] - March 14<sup>th</sup> 2020

### Added

* Standard output now includes record type.

### Changed

* Updated dependencies.

---

## [1.3.1] - February 14<sup>th</sup> 2020

### Fixed

* Fixed a nested array bounds check which resulted in valid domains being reported as non-existent.

---

## [1.3.0] - February 14<sup>th</sup> 2020

### Changed

* Updated default DNS resolvers list.
* Updated dependencies.

### Fixed

* Better handling of `nxdomain`.  Non-existent domains aren't DNS errors, just an empty answer - so now handling those more sensibly.

---

## [1.2.2] - November 27<sup>th</sup> 2019

### Changed

* Fixed `npm-shrinkwrap.json` problem that prevented `npm update` succeeding.

---

## [1.2.0] - November 27<sup>th</sup> 2019

### Changed

* Switched to using `chalk` instead of `colors`.
* Updated dependencies.
* `--list-defaults` now pretty-prints the raw json output.

---

## [1.1.4] - November 20<sup>th</sup> 2019

### Changed

* Use * instead of unicode character • to signify unique IP address when `process.stdout.isTTY` is `false` [^1].
* Updated Dependencies.
* Shrink-wrapped `npm` dependencies.

[^1]: When `process.stdout.isTTY` is `false` it signifies that the output is being piped or redirected. There's no guarantee that the target of the pipe (e.g. `more` on Windows, for screen pagination) or the redirect (e.g. a text file) has unicode support so we refrain from outputting any unicode.

---

## [1.1.3] - November 13<sup>th</sup> 2019

### Changed

* Added `--verbose` support tp `--help` to display more information.
* Dabbled with using `chalk` instead of `colors` (on `--help` output).
* Updated dependency `yargs` to version 14.2.0
* Fixed a cross-platform file path separator bug.

---

## [1.1.2] - September 25<sup>th</sup> 2019

### Changed

* Removed unneeded dependency `valid-filename`.
* Updated dependency `colors` to version 1.4.0
* Improved reporting on configuration file location when directory is `.`.
* Improved `debug` logging.
* Improved reporting on an empty answer (i.e. *no error, but no IP address returned*).

---

## [1.1.1] - September 21<sup>st</sup> 2019

### Changed

* Fixed a problem when specifying a full path with the `--config` option.
* Fixed erroneous warnings when using `--config`.

---

## [1.1.0] - September 20<sup>th</sup> 2019

### Added

* New `--config` option to specify an alternative configuration file.
* New `--list-defaults` option which prints a default config json file to the console; useful as an initial custom configuration file.

### Changed

* Improved input validation for `--timeout` & `--protocol`.
* Improved the `Warning` logic for ignored domains to remove erroneous warnings with valid switches and options.

---

## [1.0.4] - September 17<sup>th</sup> 2019

* Fixed file system path separator problem when attempting to locate a config file on Linux systems.

---

## [1.0.0] - September 17<sup>th</sup> 2019

* Initial Release.

---
