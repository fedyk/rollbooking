const path = require('path');
const nunjucks = require('nunjucks')
const viewPath = path.join(__dirname, '../../views')
const debug = require('debug')('lib:renderer');

const env = nunjucks.configure(viewPath, {
  autoescape: true,
  noCache: true
})

/**
 * Now we can do `<code>{{ getVars() | dump }}</code>`
 * @see https://github.com/mozilla/nunjucks/issues/833
 */
env.addGlobal('getVariables', function() {
  return this.getVariables();
})

/**
 * Dummy localization function
 */
env.addGlobal('__', function(text) {
  return text;
})

module.exports = middleware;
module.exports.addFilter = addFilter;

function middleware() {
  debug('create a new middleware')

  return function(ctx, next) {
    const render = (path, locals) => {
      debug(`start render ${path}`)

      const body = nunjucks.render(path, locals)

      debug(`end render ${path}`)

      ctx.body = body
    }

    const json = (body) => {
      ctx.body = JSON.stringify(body)
    }

    return ctx.render = render, ctx.json = json, next()
  }
}

function addFilter(name, func, async = false) {
  return env.addFilter(name, func, async)
}
