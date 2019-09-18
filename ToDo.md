# To Do

* Add the option `--config` to specify alternative config file via command line.
  * Use `findup-sync` to find config file if not in current directory.
* Add a `--file` option to take domain names from a flat text file.
* Improve the warning about ignored domains so it doesn't warn against valid switches and options.
  * Warn when an argument starts with `-` but not `--`.
  * Warn when one of the domain array elements contains a `.` but doesn't pass domain validation.
* Add `--list-defaults` to print raw json for the default configuration to aid creation of a custom config.
* Add the option `--unique` to display only the first occurrence of each unique IP address.
* Add a **SoundEx** pattern match against invalid domains and CLI switches to allow *Did you mean ...* alongside the *Warning: Ignoring ...*.
* Add `--certs` switch which instructs `ddig-core.js.resolve()` to extract an x.505 cert from each endpoint, using either:
  * [get-ssl-certificate](https://www.npmjs.com/package/get-ssl-certificate) and add the details to the `lookupResult` response object.

    ```javascript
    var sslCertificate = require('get-ssl-certificate');

    sslCertificate.get('www.asos.com').then(function (certificate) {
        //console.log(certificate);
        console.log('Common Name: ' + certificate.subject.CN);
        console.log('Subject Alt Name: ' + certificate.subjectaltname);
        console.log('Valid To: ' + certificate.valid_to);
    });
    ```

  * [ssldecoder](https://www.npmjs.com/package/ssldecoder)
* Allow for `--certs` *and* `--verbose` to display more x.509 properties.
