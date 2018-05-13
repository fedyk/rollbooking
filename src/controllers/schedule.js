async function schedule(ctx) {
  await ctx.render('schedule/index', {
    user: ctx.state.user
  });
}

module.exports = schedule;
