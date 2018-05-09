async function welcome(ctx) {
  if (ctx.isAuthenticated()) {
    return ctx.redirect('/calendar')
  }

  await ctx.render('welcome');
}

module.exports = welcome;