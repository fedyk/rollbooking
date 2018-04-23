const path = require('path');
const views = require('koa-views');
const nunjucks = require('nunjucks')
const env = new nunjucks.Environment(
  new nunjucks.FileSystemLoader(path.join(__dirname, './../views'))
);

// env.addFilter('shorten', (str, count) => {
//   return str.slice(0, count || 5)
// })

module.exports = views(path.join(__dirname, './../views'), {
  options: {
    nunjucksEnv: env,
    cache: false,
  },
  map: {
    html: 'nunjucks'
  }
});
