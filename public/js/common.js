/**
 * @see https://github.com/taylorhakes/promise-polyfill
 * @version 7.1.2
 */
!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?n():"function"==typeof define&&define.amd?define(n):n()}(0,function(){"use strict";function e(){}function n(e){if(!(this instanceof n))throw new TypeError("Promises must be constructed via new");if("function"!=typeof e)throw new TypeError("not a function");this._state=0,this._handled=!1,this._value=undefined,this._deferreds=[],f(e,this)}function t(e,t){for(;3===e._state;)e=e._value;0!==e._state?(e._handled=!0,n._immediateFn(function(){var n=1===e._state?t.onFulfilled:t.onRejected;if(null!==n){var i;try{i=n(e._value)}catch(f){return void r(t.promise,f)}o(t.promise,i)}else(1===e._state?o:r)(t.promise,e._value)})):e._deferreds.push(t)}function o(e,t){try{if(t===e)throw new TypeError("A promise cannot be resolved with itself.");if(t&&("object"==typeof t||"function"==typeof t)){var o=t.then;if(t instanceof n)return e._state=3,e._value=t,void i(e);if("function"==typeof o)return void f(function(e,n){return function(){e.apply(n,arguments)}}(o,t),e)}e._state=1,e._value=t,i(e)}catch(u){r(e,u)}}function r(e,n){e._state=2,e._value=n,i(e)}function i(e){2===e._state&&0===e._deferreds.length&&n._immediateFn(function(){e._handled||n._unhandledRejectionFn(e._value)});for(var o=0,r=e._deferreds.length;r>o;o++)t(e,e._deferreds[o]);e._deferreds=null}function f(e,n){var t=!1;try{e(function(e){t||(t=!0,o(n,e))},function(e){t||(t=!0,r(n,e))})}catch(i){if(t)return;t=!0,r(n,i)}}var u=function(e){var n=this.constructor;return this.then(function(t){return n.resolve(e()).then(function(){return t})},function(t){return n.resolve(e()).then(function(){return n.reject(t)})})},c=setTimeout;n.prototype["catch"]=function(e){return this.then(null,e)},n.prototype.then=function(n,o){var r=new this.constructor(e);return t(this,new function(e,n,t){this.onFulfilled="function"==typeof e?e:null,this.onRejected="function"==typeof n?n:null,this.promise=t}(n,o,r)),r},n.prototype["finally"]=u,n.all=function(e){return new n(function(n,t){function o(e,f){try{if(f&&("object"==typeof f||"function"==typeof f)){var u=f.then;if("function"==typeof u)return void u.call(f,function(n){o(e,n)},t)}r[e]=f,0==--i&&n(r)}catch(c){t(c)}}if(!e||"undefined"==typeof e.length)throw new TypeError("Promise.all accepts an array");var r=Array.prototype.slice.call(e);if(0===r.length)return n([]);for(var i=r.length,f=0;r.length>f;f++)o(f,r[f])})},n.resolve=function(e){return e&&"object"==typeof e&&e.constructor===n?e:new n(function(n){n(e)})},n.reject=function(e){return new n(function(n,t){t(e)})},n.race=function(e){return new n(function(n,t){for(var o=0,r=e.length;r>o;o++)e[o].then(n,t)})},n._immediateFn="function"==typeof setImmediate&&function(e){setImmediate(e)}||function(e){c(e,0)},n._unhandledRejectionFn=function(e){void 0!==console&&console&&console.warn("Possible Unhandled Promise Rejection:",e)};var l=function(){if("undefined"!=typeof self)return self;if("undefined"!=typeof window)return window;if("undefined"!=typeof global)return global;throw Error("unable to locate global object")}();l.Promise?l.Promise.prototype["finally"]||(l.Promise.prototype["finally"]=u):l.Promise=n});

/**
 * @see https://github.com/github/fetch
 * @version 2.0.4
 */
(function(e){function l(a){"string"!==typeof a&&(a=String(a));if(/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(a))throw new TypeError("Invalid character in header field name");return a.toLowerCase()}function q(a){"string"!==typeof a&&(a=String(a));return a}function n(a){var b={next:function(){var b=a.shift();return{done:void 0===b,value:b}}};g.iterable&&(b[Symbol.iterator]=function(){return b});return b}function d(a){this.map={};a instanceof d?a.forEach(function(a,c){this.append(c,a)},this):Array.isArray(a)?
a.forEach(function(a){this.append(a[0],a[1])},this):a&&Object.getOwnPropertyNames(a).forEach(function(b){this.append(b,a[b])},this)}function p(a){if(a.bodyUsed)return Promise.reject(new TypeError("Already read"));a.bodyUsed=!0}function r(a){return new Promise(function(b,c){a.onload=function(){b(a.result)};a.onerror=function(){c(a.error)}})}function w(a){var b=new FileReader,c=r(b);b.readAsArrayBuffer(a);return c}function x(a){a=new Uint8Array(a);for(var b=Array(a.length),c=0;c<a.length;c++)b[c]=String.fromCharCode(a[c]);
return b.join("")}function t(a){if(a.slice)return a.slice(0);var b=new Uint8Array(a.byteLength);b.set(new Uint8Array(a));return b.buffer}function u(){this.bodyUsed=!1;this._initBody=function(a){if(this._bodyInit=a)if("string"===typeof a)this._bodyText=a;else if(g.blob&&Blob.prototype.isPrototypeOf(a))this._bodyBlob=a;else if(g.formData&&FormData.prototype.isPrototypeOf(a))this._bodyFormData=a;else if(g.searchParams&&URLSearchParams.prototype.isPrototypeOf(a))this._bodyText=a.toString();else if(g.arrayBuffer&&
g.blob&&a&&DataView.prototype.isPrototypeOf(a))this._bodyArrayBuffer=t(a.buffer),this._bodyInit=new Blob([this._bodyArrayBuffer]);else if(g.arrayBuffer&&(ArrayBuffer.prototype.isPrototypeOf(a)||y(a)))this._bodyArrayBuffer=t(a);else throw Error("unsupported BodyInit type");else this._bodyText="";this.headers.get("content-type")||("string"===typeof a?this.headers.set("content-type","text/plain;charset=UTF-8"):this._bodyBlob&&this._bodyBlob.type?this.headers.set("content-type",this._bodyBlob.type):g.searchParams&&
URLSearchParams.prototype.isPrototypeOf(a)&&this.headers.set("content-type","application/x-www-form-urlencoded;charset=UTF-8"))};g.blob&&(this.blob=function(){var a=p(this);if(a)return a;if(this._bodyBlob)return Promise.resolve(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve(new Blob([this._bodyArrayBuffer]));if(this._bodyFormData)throw Error("could not read FormData body as blob");return Promise.resolve(new Blob([this._bodyText]))},this.arrayBuffer=function(){return this._bodyArrayBuffer?
p(this)||Promise.resolve(this._bodyArrayBuffer):this.blob().then(w)});this.text=function(){var a=p(this);if(a)return a;if(this._bodyBlob){a=this._bodyBlob;var b=new FileReader,c=r(b);b.readAsText(a);return c}if(this._bodyArrayBuffer)return Promise.resolve(x(this._bodyArrayBuffer));if(this._bodyFormData)throw Error("could not read FormData body as text");return Promise.resolve(this._bodyText)};g.formData&&(this.formData=function(){return this.text().then(z)});this.json=function(){return this.text().then(JSON.parse)};
return this}function k(a,b){b=b||{};var c=b.body;if(a instanceof k){if(a.bodyUsed)throw new TypeError("Already read");this.url=a.url;this.credentials=a.credentials;b.headers||(this.headers=new d(a.headers));this.method=a.method;this.mode=a.mode;c||null==a._bodyInit||(c=a._bodyInit,a.bodyUsed=!0)}else this.url=String(a);this.credentials=b.credentials||this.credentials||"omit";if(b.headers||!this.headers)this.headers=new d(b.headers);var v=b.method||this.method||"GET",g=v.toUpperCase();this.method=
-1<A.indexOf(g)?g:v;this.mode=b.mode||this.mode||null;this.referrer=null;if(("GET"===this.method||"HEAD"===this.method)&&c)throw new TypeError("Body not allowed for GET or HEAD requests");this._initBody(c)}function z(a){var b=new FormData;a.trim().split("&").forEach(function(a){if(a){var c=a.split("=");a=c.shift().replace(/\+/g," ");c=c.join("=").replace(/\+/g," ");b.append(decodeURIComponent(a),decodeURIComponent(c))}});return b}function B(a){var b=new d;a.replace(/\r?\n[\t ]+/g," ").split(/\r?\n/).forEach(function(a){var c=
a.split(":");if(a=c.shift().trim())c=c.join(":").trim(),b.append(a,c)});return b}function h(a,b){b||(b={});this.type="default";this.status=void 0===b.status?200:b.status;this.ok=200<=this.status&&300>this.status;this.statusText="statusText"in b?b.statusText:"OK";this.headers=new d(b.headers);this.url=b.url||"";this._initBody(a)}if(!e.fetch){var C="Symbol"in e&&"iterator"in Symbol,m;if(m="FileReader"in e&&"Blob"in e)try{new Blob,m=!0}catch(a){m=!1}var g={searchParams:"URLSearchParams"in e,iterable:C,
blob:m,formData:"FormData"in e,arrayBuffer:"ArrayBuffer"in e};if(g.arrayBuffer)var D="[object Int8Array];[object Uint8Array];[object Uint8ClampedArray];[object Int16Array];[object Uint16Array];[object Int32Array];[object Uint32Array];[object Float32Array];[object Float64Array]".split(";"),y=ArrayBuffer.isView||function(a){return a&&-1<D.indexOf(Object.prototype.toString.call(a))};d.prototype.append=function(a,b){a=l(a);b=q(b);var c=this.map[a];this.map[a]=c?c+","+b:b};d.prototype["delete"]=function(a){delete this.map[l(a)]};
d.prototype.get=function(a){a=l(a);return this.has(a)?this.map[a]:null};d.prototype.has=function(a){return this.map.hasOwnProperty(l(a))};d.prototype.set=function(a,b){this.map[l(a)]=q(b)};d.prototype.forEach=function(a,b){for(var c in this.map)this.map.hasOwnProperty(c)&&a.call(b,this.map[c],c,this)};d.prototype.keys=function(){var a=[];this.forEach(function(b,c){a.push(c)});return n(a)};d.prototype.values=function(){var a=[];this.forEach(function(b){a.push(b)});return n(a)};d.prototype.entries=
function(){var a=[];this.forEach(function(b,c){a.push([c,b])});return n(a)};g.iterable&&(d.prototype[Symbol.iterator]=d.prototype.entries);var A="DELETE GET HEAD OPTIONS POST PUT".split(" ");k.prototype.clone=function(){return new k(this,{body:this._bodyInit})};u.call(k.prototype);u.call(h.prototype);h.prototype.clone=function(){return new h(this._bodyInit,{status:this.status,statusText:this.statusText,headers:new d(this.headers),url:this.url})};h.error=function(){var a=new h(null,{status:0,statusText:""});
a.type="error";return a};var E=[301,302,303,307,308];h.redirect=function(a,b){if(-1===E.indexOf(b))throw new RangeError("Invalid status code");return new h(null,{status:b,headers:{location:a}})};e.Headers=d;e.Request=k;e.Response=h;e.fetch=function(a,b){return new Promise(function(c,d){var e=new k(a,b),f=new XMLHttpRequest;f.onload=function(){var a={status:f.status,statusText:f.statusText,headers:B(f.getAllResponseHeaders()||"")};a.url="responseURL"in f?f.responseURL:a.headers.get("X-Request-URL");
c(new h("response"in f?f.response:f.responseText,a))};f.onerror=function(){d(new TypeError("Network request failed"))};f.ontimeout=function(){d(new TypeError("Network request failed"))};f.open(e.method,e.url,!0);"include"===e.credentials?f.withCredentials=!0:"omit"===e.credentials&&(f.withCredentials=!1);"responseType"in f&&g.blob&&(f.responseType="blob");e.headers.forEach(function(a,b){f.setRequestHeader(b,a)});f.send("undefined"===typeof e._bodyInit?null:e._bodyInit)})};e.fetch.polyfill=!0}})("undefined"!==
typeof self?self:this);

/**
 * Fetch Utils: check response status
 * @param {FetchResponse} response 
 */
function fetchCheckStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    var error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

/**
 * Parse response meta data
 * @param {FetchResponse} response
 * @returns {Promise}
 */
function fetchParseJSONMeta(response) {
  return response.text().then(parseJSONMeta)

  function parseJSONMeta(text) {
    var prefix = 'json::';
    var hasMeta = text.substr(0, prefix.length) === prefix;
    var meta, body = text;

    if (hasMeta) {
      try{
        meta = JSON.parse(text.substr(prefix.length, text.indexOf('\n') - prefix.length));
      }
      catch(e) {}

      // remove meta data from body
      body = text.substr(text.indexOf('\n'));
    }

    return {
      meta: meta,
      body: body,
    }
  }
};

function fetchParseJSON(response) {
  return response.json()
};


/**
 * @see http://youmightnotneedjquery.com/
 * @param {Function} fn
 */
function ready(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    document.attachEvent('onreadystatechange', function() {
      if (document.readyState != 'loading')
        fn();
    });
  }
}

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
