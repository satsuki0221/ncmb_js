"use strict";

var CryptoJS = require("crypto-js");
var Url     = require("url");

module.exports.create = create;

function create(url, method, query, timestamp,
                signatureMethod, signatureVersion, fqdn,
                apikey, clientkey)
{
  var parsedUrl = Url.parse(url);

  if(method === "DEL") method = "DELETE";

  var data = {
    "SignatureMethod":        signatureMethod || this.signatureMethod,
    "SignatureVersion":       signatureVersion || this.signatureVersion,
    "X-NCMB-Application-Key": apikey || this.apikey,
    "X-NCMB-Timestamp":       (timestamp || new Date().toISOString())
  };
  Object.keys(query).forEach(function(key){
    var q = query[key];
    if(typeof q === "object") q = JSON.stringify(q);
    data[key] = encodeURIComponent(q);
  });

  var sigStr = [
    method,
    fqdn || this.fqdn,
    parsedUrl.path,
    Object.keys(data).sort().map(function(key){
      return [key, data[key]].join("=");
    }).join("&")
  ].join("\n");

  var sig = CryptoJS.SHA256(clientkey || this.clientkey);
  sig = CryptoJS.enc.Base64.stringifysig(sig);
  return sig;
};
