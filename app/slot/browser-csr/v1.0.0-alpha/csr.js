// Adapted from
// https://github.com/PeculiarVentures/PKI.js/blob/1bc0ed3/examples/PKCS%2310%20complex%20example/PKCS10_complex_example.html
// https://stackoverflow.com/questions/48419456/pki-js-v2-and-and-webcrypto-add-subject-alternative-name-with-csr-certificate/49896425#49896425
// https://getwww.me/V1-csrhelp-master.zip
// unibabel.js

// Dependencies
// <script src="https://coolaj86.com/assets/media/examples/pkijs.org/v1.3.33/org/pkijs/common.js"></script>
// <script src="https://coolaj86.com/assets/media/examples/pkijs.org/v1.3.33/org/pkijs/asn1.js"></script>
// <script src="https://coolaj86.com/assets/media/examples/pkijs.org/v1.3.33/org/pkijs/x509_schema.js"></script>
// <script src="https://coolaj86.com/assets/media/examples/pkijs.org/v1.3.33/org/pkijs/x509_simpl.js"></script>
(function (exports) {
'use strict';

var CSR = exports.CSR = {};

function formatPEM(pem_string) {
  var string_length = pem_string.length;
  var result_string = "";

  for (var i = 0, count = 0; i < string_length; i++, count++) {
    if (count > 63) {
        result_string = result_string + "\r\n";
        count = 0;
    }

    result_string = result_string + pem_string[i];
  }

  return result_string;
}

function arrayBufferToString(buffer) {
  var result_string = "";
  var view = new Uint8Array(buffer);

  for (var i = 0; i < view.length; i++) {
    result_string = result_string + String.fromCharCode(view[i]);
  }

  return result_string;
}

function createPkcs10Csr(domainKeypair, domains) {
  var certf = {};
  certf.algorithm = 'ECC';
  certf.keysize = 'secp256r1';
  certf.hostname = domains.shift();

  var context = {};

  // #region Get a "crypto" extension
  var crypto = org.pkijs.getCrypto();
  if (typeof crypto === "undefined") {
      context.content = '';
      return Promise.reject('No WebCrypto extension found');
  }
  // #endregion

  // #region Prepare P10
  context = context || {};
  var sequence = Promise.resolve();
  var pkcs10_simpl = new org.pkijs.simpl.PKCS10();
  var publicKey = domainKeypair.publicKey;
  var privateKey = domainKeypair.privateKey;
  var hash_algorithm;
  hash_algorithm = "sha-256";

  var signature_algorithm_name, keylength;
  switch (certf.algorithm) {
    case "RSA":
      signature_algorithm_name = "RSASSA-PKCS1-V1_5";
      keylength = parseInt(certf.keysize);
      break;
    case "ECC":
      signature_algorithm_name = "ECDSA";
      switch (certf.keysize) {
        case 'secp256r1':
          keylength = "P-256";
          break;
        case 'secp384r1':
          keylength = "P-384";
          break;
        case 'secp521r1':
          keylength = "P-521";
          break;
      }
      break;
    default:
      // do nothing
  }
  // #endregion

  // #region Put a static values
  pkcs10_simpl.version = 0;

  pkcs10_simpl.subject.types_and_values.push(new org.pkijs.simpl.ATTR_TYPE_AND_VALUE({
    type: "2.5.4.3",
    value: new org.pkijs.asn1.UTF8STRING({
      value: certf.hostname
    })
  }));

  pkcs10_simpl.attributes = [];
  // #endregion

  // #region Exporting public key into "subjectPublicKeyInfo" value of PKCS#10
  sequence = sequence.then(function() {
    return pkcs10_simpl.subjectPublicKeyInfo.importKey(publicKey);
  });
  // #endregion

  // #region SubjectKeyIdentifier
  sequence = sequence.then(function() {
    return crypto.digest({
      name: "SHA-256"
    }, pkcs10_simpl.subjectPublicKeyInfo.subjectPublicKey.value_block.value_hex);
  }).then(function(result) {

    var extensions = new org.pkijs.simpl.EXTENSIONS({
      extensions_array: [
        new org.pkijs.simpl.EXTENSION({
          extnID: "2.5.29.14",
          critical: false,
          extnValue: (new org.pkijs.asn1.OCTETSTRING({ value_hex: result })).toBER(false)
        })
      ]
    });

    function addSan() {
      var altNames = new org.pkijs.simpl.GENERAL_NAMES({
        names: [
          new org.pkijs.simpl.GENERAL_NAME({
            NameType: 2,
            Name: domains.join(', DNS:') //"domain1.com, DNS:domain2.com, DNS:domain3.com"
          })
        ]
      });

      extensions.extensions_array.push(new org.pkijs.simpl.EXTENSION({
        extnID: "2.5.29.17", // subjectAltName
        critical: false,
        extnValue: altNames.toSchema().toBER(false)
      }));

      var attribute = new org.pkijs.simpl.ATTRIBUTE({
        type: "1.2.840.113549.1.9.14", // pkcs-9-at-extensionRequest
        values: [extensions.toSchema()]
      });

      pkcs10_simpl.attributes.push(attribute);
    }

    if (domains.length) {
      addSan();
    }
  });
  // #endregion

  // #region Signing final PKCS#10 request
  sequence = sequence.then(function() {
    context.privateKey = pkcs10_simpl.sign(privateKey, hash_algorithm);
    return pkcs10_simpl.sign(privateKey, hash_algorithm);
  });
  // #endregion

  sequence = sequence.then(function(/*result*/) {
    var pkcs10_schema = pkcs10_simpl.toSchema();
    var pkcs10_encoded = pkcs10_schema.toBER(false);

    var pemder = window.btoa(arrayBufferToString(pkcs10_encoded));
    var result_string = "-----BEGIN CERTIFICATE REQUEST-----\r\n";
    result_string = result_string + formatPEM(pemder);
    result_string = result_string + "\r\n-----END CERTIFICATE REQUEST-----\r\n";
    context.content = result_string;

    //console.log('CSR as PEM:');
    //console.log(context.content);

    return pemder.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
  });

  return sequence;
}

CSR.formatPem = formatPEM;
CSR.generate = function (options) {
  return createPkcs10Csr(options.keypair, options.domains);
};

}(window));