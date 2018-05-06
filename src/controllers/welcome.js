async function welcome(ctx) {
  await ctx.render('welcome');
}

module.exports = welcome;