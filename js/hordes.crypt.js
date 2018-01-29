/***
* genKey()
*
*/
var genKey = function(n){
  var saltBits    = sjcl.random.randomWords(n);
  var salt        = sjcl.codec.hex.fromBits(saltBits);
  var returnSalt  = sjcl.codec.hex.toBits(salt);
  var p           = $('#sjclPass').val();
  var derivedKey  = sjcl.misc.pbkdf2(p, saltBits, 1000, 256);
  var key         = sjcl.codec.hex.fromBits(derivedKey);
  console.log(key)
};

/***
* xEncrypt()
* encrypt a string
*/
var xEncrypt = function(m,k){
  var ciphertext  = CryptoJS.AES.encrypt(m, k);
  return String(ciphertext);
};

/***
* xDecrypt()
* decrypt a string
*/
var xDecrypt = function(m,k){
  var bytes       = CryptoJS.AES.decrypt(m.toString(), k);
  var plaintext   = bytes.toString(CryptoJS.enc.Utf8);
  return plaintext;
};

/***
* objEncrypt()
* encrypt an object
*/
var objEncrypt = function(data,k){
  var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), k);
  return ciphertext;
};

/***
* objDecrypt()
* decrypt an object
*/
var objDecrypt = function(data,k){
  var bytes  = CryptoJS.AES.decrypt(data.toString(), k);
  var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  return decryptedData;
};
