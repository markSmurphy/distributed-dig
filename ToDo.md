# To Do

- [ ] Better handle domains which have multiple `A` records [moteefe.com] or [fuse.fuseuniversal.com].
  - [ ] `ddig fuse.fuseuniversal.com --verbose` the IP address picked for the leftmost column appears to be the last one in the rightmost column's list.

```text

• fuse.fuseuniversal.com 52.30.90.176    Verisign DNS (Primary)         49ms    fuse.fuseuniversal.com --> 34.247.233.174
                                         64.6.64.6                              fuse.fuseuniversal.com --> 52.30.90.176
• fuse.fuseuniversal.com 34.247.233.174  Comodo Secure DNS (Secondary)  68ms    fuse.fuseuniversal.com --> 52.30.90.176
                                         8.20.247.20                            fuse.fuseuniversal.com --> 34.247.233.174
```

- [X] Include TTL in output.
- [X] Include record type in output.
- [ ] Increase the recommended `--verbose` console width in line with new `TTL` and `record` columns.
- [ ] Use `dns.GetServers()` to save current resolvers and highlight those in output if they're called.
- [ ] Look into **whois** and **geo-location** support | (`node-whois`, `node-xwhois`, [`ip-geolocate`](https://www.npmjs.com/package/ip-geolocate) [ipstack.com](https://ipstack.com/)).
- [ ] Look into short command-line switches.
- [ ] Use `findup-sync` to find config file if not in current directory.
- [ ] Add support for new version notification via [update-notifier](https://www.npmjs.com/package/update-notifier).
- [ ] Add a `--file` option to take domain names from a flat text file.
- [ ] Add the option `--unique` to display only the first occurrence of each unique IP address.
- [ ] Add `--bare` option (or `--short`) which just shows resolver output rather than which resolver it came from.
- [ ] Add a **SoundEx** pattern match against invalid domains and CLI switches to allow *Did you mean ...* alongside the *Warning: Ignoring ...*.
  - [ ] [fuzzy-search](https://www.npmjs.com/package/fuzzy-search) ... `npm install fuzzy-search --save`
- [ ] Add `--certs` switch which instructs `distributed-dig.js` to extract an x.505 certificate from each unique IP address, and add the details to the `lookupResult` response object using:

    ```javascript
    const https = require('https');

    https.get('https://92.122.153.27', {
        headers : { host : 'www.asos.com' },
        //servername : 'www.asos.com'
    }, res => {
        //console.log(res);
        var cert = res.socket.getPeerCertificate();
        console.log(cert);
        console.log(cert.subject);
    }).on('error', e => {
        console.log('Error: ', e.message);
    });
    ```

- [ ] Add option to make HTTPS request to endpoints (to each uniquely resolved IP address and insert `host` header) and list all or specified response headers.
- [ ] Allow for `--certs` *and* `--verbose` to display more x.509 properties.
- [ ] Look to add [fuzzy search](https://www.npmjs.com/package/fuzzy) for unknown (mistyped) CLI options
- [ ] Replace moment.js with native code as per [You-Don't-Need-Moment.js](https://github.com/you-dont-need/You-Dont-Need-Momentjs#difference)
- [ ] Allow URLs to be supplied and parse them for the hostname.
- [ ] Show warning on invalid domain.
