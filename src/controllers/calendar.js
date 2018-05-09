async function calendar(ctx) {
  await ctx.render('calendar/index', {
    user: ctx.state.user
  });
}

module.exports = calendar;
