async function onboarding(ctx) {
  const { user } = ctx.state;

  await ctx.render('onboarding/index', {
    user
  });
}

module.exports = onboarding;
