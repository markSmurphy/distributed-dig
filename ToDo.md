# To Do

* Pretty Print json output for `--list-defaults`
* Better handle domains which have multiple `A` records [moteefe.com] or [fuse.fuseuniversal.com].
  * `ddig fuse.fuseuniversal.com --verbose` the IP address picked for the leftmost column appears to be the last one in the rightmost column's list.

```text

• fuse.fuseuniversal.com 52.30.90.176    Verisign DNS (Primary)         49ms    fuse.fuseuniversal.com --> 34.247.233.174
                                         64.6.64.6                              fuse.fuseuniversal.com --> 52.30.90.176
• fuse.fuseuniversal.com 34.247.233.174  Comodo Secure DNS (Secondary)  68ms    fuse.fuseuniversal.com --> 52.30.90.176
                                         8.20.247.20                            fuse.fuseuniversal.com --> 34.247.233.174
```

* Include TTL in `--verbose` output (*increase recommended console width accordingly*).
* Look into **whois** and **geo-location** support | (`node-whois`, `node-xwhois`, [`ip-geolocate`](https://www.npmjs.com/package/ip-geolocate) [ipstack.com](https://ipstack.com/)).
* Look into short command-line switches.
* Use `findup-sync` to find config file if not in current directory.
* Add a `--file` option to take domain names from a flat text file.
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
