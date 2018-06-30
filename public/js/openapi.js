
/**
 * RollBooking Open API
 */
var RollBooking = (window.RollBooking || {})

/**
 * @typedef {object} RollBookingConfig
 * @property {string} protocol
 * @property {string} host
 */

/**
 * @type {RollBookingConfig}
 */
RollBooking.config = RollBooking.config || {
  protocol: 'https',
  host: 'rollbooking.com',
}


RollBooking.Widgets = setupWidgets();

function setupWidgets() {

  /**
   * @typedef {Object} Widget
   * @property {function} size
   * @property {function} position
   * @property {function} maximize
   * @property {function} minimize
   * @property {function} on
   * @property {function} off
   * @property {function} destroy
   */

   /**
   * @typedef {Object} WidgetOptions
   * @property {boolean} maximized
   * @property {string} position "left" | "right"
   */

  /**
   * Create reservation widget
   * @param {string} widgetKey "reservation/01201"
   * @param {WidgetOptions} widgetOptions 
   * @return {Widget}
   */
  function Widget(widgetKey, widgetOptions) {
    var widgetId = genKey();
    var iframe;
    var widgetContainer;
    var widgetUrl;
    var that;
    var widgetIsMaximized;
    var widgetPosition;
    var config = RollBooking.config;

    widgetOptions = widgetOptions || {};

    assertWidgetKey(widgetKey);
    assertWidgetOptions(widgetOptions);

    widgetContainer = createWidgetContainer(widgetKey);
    widgetUrl = getWidgetUrl(widgetKey, widgetOptions);
    iframe = createWidgetIFrame(widgetUrl, widgetId, widgetOptions);

    setupIFrameRCP(iframe);
    appendWidgetContainer(widgetContainer);
    appendWidgetIframe(widgetContainer, iframe);

    widgetOptions.maximized ? maximize() : minimize();
    position(widgetOptions.position);

    that = {
      size: size,
      position: position,
      maximize: maximize,
      minimize: minimize,
    }

    /**
     * Assert id param
     * @param {string} id
     * @throws {Error}
     */
    function assertWidgetKey(widgetKey) {
      assert(widgetKey, 'widget key is required');
      assert(typeof widgetKey === 'string', 'widget key should be a string');

      var params = widgetKey.split('/');

      assert(params[0], 'missed widget type')
      assert(params[1], 'missed widget id')
    }

    /**
     * @param {widgetOptions} widgetOptions
     * @throws {Error}
     */
    function assertWidgetOptions(widgetOptions) {
      assert(widgetOptions, 'widget options are required')
      assert(typeof widgetOptions === 'object', 'widget options should be an object')
    }

    /**
     * 
     */
    function createWidgetContainer(widgetKey) {
      var container = document.createElement('div');

      container.setAttribute('data-rollbooking-widget', widgetKey);

      assign(container.style, {
        position: 'fixed',
        zIndex: '10000',
        margin: 0,
        padding: 0,
        background: 'none',
      })

      return container;
    }

    function getWidgetUrl(widgetKey, widgetOptions) {
      return config.protocol + '://' + config.host + '/widgets/' + widgetKey + '?' + queryParams(widgetOptions)
    }

    function createWidgetIFrame(widgetUrl, widgetId, widgetOptions) {
      var iframe = document.createElement('iframe');

      assign(iframe, {
        name: widgetId,
        frameBorder: '0',
        src: widgetUrl,
        scrolling: 'no',
        width: (widgetOptions.width || 50),
        height: (widgetOptions.height || 50),
      })

      assert(iframe.style, {
        overflow: 'hidden',
        boxShadow: 'none',
      })

      return iframe;
    }

    /**
     * @param {HTMLIFrameElement} iframe
     */
    function setupIFrameRCP() {
      window.addEventListener('message', onPostMessage)
    }

    /**
     * 
     * @param {HTMLIFrameElement} iframe 
     * @param {string} method 
     * @param {any} args 
     */
    function sendRCP(iframe, method, args) {
      var message = JSON.stringify({
        method: method,
        args: args
      });
      var targetOrigin = config.protocol + '://' + config.host;

      iframe.contentWindow.postMessage(message, targetOrigin);
    }

    /**
     * 
     */
    function appendWidgetContainer(widgetContainer) {
      document.body.appendChild(widgetContainer);
    }

    /**
     * 
     */
    function appendWidgetIframe(widgetContainer, iframe) {
      widgetContainer.appendChild(iframe);
    }

    /**
     * @param {number} width
     * @param {number} height
     */
    function size(width, height) {
      assign(container.style, {
        width: width + 'px',
        height: height + 'px',
      })

      assign(iframe, {
        width: width,
        height: height
      })

      return that;
    }

    /**
     * 
     */
    function position(newPosition) {
      var style = newPosition === 'left' ? {
        left: isMaximized ? '0' : '24px',
        bottom: isMaximized ? '0' : '24px',
      } : {
        right: isMaximized ? '0' : '24px',
        bottom: isMaximized ? '0' : '24px',
      }

      widgetPosition = newPosition === 'left' ? 'left' : 'right';

      return assign(widgetContainer.style, style), that
    }

    /**
     * 
     */
    function maximize() {
      return isMaximized = true, position(widgetPosition), that
    }

    /**
     * 
     */
    function minimize() {
      return isMaximized = false, position(widgetPosition), that
    }

    /**
     * 
     * @param {*} event 
     */
    function onPostMessage(event) {
      var data = event.data;

      if (event.origin !== config.protocol + '://' + config.host) {
        return false;
      }

      if (!data) {
        return false;
      }

      if (typeof data !== 'string' && !(data instanceof String)) {
        return false;
      }
      
      try {
        data = JSON.parse(data);
      } catch(e) {
        throw Error('invalid data')
      }

      var action = data.action || ''
      var args = data.args;

      if (data.widgetId === widgetId && that[action]) {
        that[action].call(that, args);
      }
    }


    return that;
  }

  /**
   * Create reservation widget
   * @param {number} id 
   * @param {WidgetOptions} options
   */
  function factoryReservationWidget(id, options) {
    return new Widget('reservation/' + id, options);
  }

  /**
   * Serialize object to http query string
   * @param {object} params
   * @returns {string} 
   */
  function queryParams(params) {
    var query = [];

    for(var i in params) {
      query.push(encodeURIComponent(i) + '=' + encodeURIComponent( params[i] == null ? "" : params[i] ))
    }

    return query.join('&');
  }

  /**
   * @returns {string}
   */
  function genKey() {
    var key = '';

    for (var i = 0; i < 8; i++) {
      key += Math.ceil(Math.random() * 15).toString(16);
    }

    return key;
  }

  /**
   * Assert util
   */
  function assert(value, message) {
    if (!value) {
      throw new Error(message);
    }
  }

  /**
   * Mutate target object
   * @param {object} target 
   * @param {object} source 
   */
  function assign(obj1, obj2) {
    for (var i in obj2) {
      if (obj1[i] && typeof(obj1[i]) === 'object') {
        extend(obj1[i], obj2[i])
      } else {
        obj1[i] = obj2[i];
      }
    }
  }

  return {
    Reservation: factoryReservationWidget
  }
}
