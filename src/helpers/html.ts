/**
 * Based on https://github.com/pugjs/pug/tree/master/packages/pug-runtime
 * */

var has_own_property = Object.prototype.hasOwnProperty;


/**
 * Process array, object, or string as a string of classes delimited by a space.
 *
 * If `val` is an array, all members of it and its subarrays are counted as
 * classes. If `escaping` is an array, then whether or not the item in `val` is
 * escaped depends on the corresponding item in `escaping`. If `escaping` is
 * not an array, no escaping is done.
 *
 * If `val` is an object, all the keys whose value is truthy are counted as
 * classes. No escaping is done.
 *
 * If `val` is a string, it is counted as a class. No escaping is done.
 *
 * @param {(Array.<string>|Object.<string, boolean>|string)} val
 * @param {?Array.<string>} escaping
 * @return {String}
 */

function classes_array(val: any[], escaping) {
  var classString = '', className, padding = '', escapeEnabled = Array.isArray(escaping);
  for (var i = 0; i < val.length; i++) {
    className = classes(val[i]);
    if (!className) continue;
    escapeEnabled && escaping[i] && (className = escape_DEPRECATE(className));
    classString = classString + padding + className;
    padding = ' ';
  }
  return classString;
}

function classes_object(val: object) {
  var classString = '', padding = '';
  for (var key in val) {
    if (key && val[key] && has_own_property.call(val, key)) {
      classString = classString + padding + key;
      padding = ' ';
    }
  }
  return classString;
}

export function classes(val: string[] | Array<{string: boolean}> | string | object, escaping = false) {
  if (Array.isArray(val)) {
    return classes_array(val, escaping);
  } else if (val && typeof val === 'object') {
    return classes_object(val);
  } else {
    return val || '';
  }
}

/**
 * Convert object or string to a string of CSS styles delimited by a semicolon.
 *
 * @param {(Object.<string, string>|string)} val
 * @return {String}
 */


export function style(val) {
  if (!val) return '';
  if (typeof val === 'object') {
    var out = '';
    for (var style in val) {
      /* istanbul ignore else */
      if (has_own_property.call(val, style)) {
        out = out + style + ':' + val[style] + ';';
      }
    }
    return out;
  } else {
    return val + '';
  }
};

/**
 * Render the given attribute.
 *
 * @param {String} key
 * @param {String} val
 * @param {Boolean} escaped
 * @param {Boolean} terse
 * @return {String}
 */

function attr(key, val, escaped = false, terse = false) {
  if (val === false || val == null || !val && (key === 'class' || key === 'style')) {
    return '';
  }

  if (val === true) {
    return ' ' + (terse ? key : key + '="' + key + '"');
  }

  var type = typeof val;
  if ((type === 'object' || type === 'function') && typeof val.toJSON === 'function') {
    val = val.toJSON();
  }

  if (typeof val !== 'string') {
    val = JSON.stringify(val);
    if (!escaped && val.indexOf('"') !== -1) {
      return ' ' + key + '=\'' + val.replace(/'/g, '&#39;') + '\'';
    }
  }

  if (escaped) val = escape_DEPRECATE(val);
  return ' ' + key + '="' + val + '"';
};

/**
 * Render the given attributes object.
 *
 * @param {Object} obj
 * @param {Object} terse whether to use HTML5 terse boolean attributes
 * @return {String}
 */

export function attrs(obj: object, escaped = true, terse = false) {
  var attrs = '';

  for (var key in obj) {
    if (has_own_property.call(obj, key)) {
      var val = obj[key];

      if ('class' === key) {
        val = classes(val);
        attrs = attr(key, val, escaped, terse) + attrs;
        continue;
      }
      if ('style' === key) {
        val = style(val);
      }
      attrs += attr(key, val, escaped, terse);
    }
  }

  return attrs.trim();
};

/**
 * Escape the given string of `html`.
 *
 * @param {String} html
 * @return {String}
 * @api private
 */

var match_html = /["&<>]/;
export function escape_DEPRECATE(_html) {
  var html = '' + _html;
  var regexResult = match_html.exec(html);
  if (!regexResult) return _html;

  var result = '';
  var i, lastIndex, escape;
  for (i = regexResult.index, lastIndex = 0; i < html.length; i++) {
    switch (html.charCodeAt(i)) {
      case 34: escape = '&quot;'; break;
      case 38: escape = '&amp;'; break;
      case 60: escape = '&lt;'; break;
      case 62: escape = '&gt;'; break;
      default: continue;
    }
    if (lastIndex !== i) result += html.substring(lastIndex, i);
    lastIndex = i + 1;
    result += escape;
  }
  if (lastIndex !== i) return result + html.substring(lastIndex, i);
  else return result;
};


export function script(src: string, attributes: object = {}) {
  const a = Object.assign({
    src,
    type: 'text/javascript'
  }, attributes);

  return `<script ${attrs(a)}></script>`;
  
}

export function stylesheet(href: string, attributes: object = {}) {
  const a = Object.assign({
    href,
    rel: "stylesheet",
  }, attributes);

  return `<link ${attrs(a)}>`;
  
}