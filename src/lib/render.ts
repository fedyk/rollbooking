import { join } from "path";
import { configure, render } from "nunjucks";
import debugFactory from "debug";

const viewPath = join(__dirname, "../../views");
const debug = debugFactory("lib:renderer");

const env = configure(viewPath, {
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

export function middleware_DEPRECATED() {
  debug('create a new middleware')

  return function(ctx, next) {
    ctx.render = (path, locals) => {
      debug(`start render ${path}`)

      const body = render(path, locals)

      debug(`end render ${path}`)

      ctx.body = body
    }

    ctx.json = (body) => {
      ctx.body = JSON.stringify(body)
    }

    return next()
  }
}

export function renderer_DEPRECATED(path, locals = {}) {
  return new Promise((resolve, reject) => {
    render(path, locals, (err, resp) => err ? reject(err) : resolve(resp))
  })
}

export function json_DEPRECATED(data: any): string {
  return JSON.stringify(data);
}

export function addFilter_DEPRECATED(name, func, async = false) {
  return env.addFilter(name, func, async)
}
