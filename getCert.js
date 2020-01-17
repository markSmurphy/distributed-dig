// var sslCertificate = require('get-ssl-certificate');

// sslCertificate.get('www.asos.com').then(function (certificate) {
//     //console.log(certificate);
//     console.log('Common Name: ' + certificate.subject.CN);
//     console.log('Subject Alt Name: ' + certificate.subjectaltname);
//     console.log('Valid To: ' + certificate.valid_to);
// });

const https = require('https');

https.get('https://92.122.153.27', {
    headers : { host : 'www.asos.com' },
    //servername : 'www.asos.com'
}, (res) => {
    //console.log(res);
    var cert = res.socket.getPeerCertificate();
    console.log(cert);
    console.log(cert.subject);
}).on('error', (e) => {
    console.log('Error: ', e.message);
});
