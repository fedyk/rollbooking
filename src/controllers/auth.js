async function login(ctx) {
  await ctx.render('auth/login.html');
}

async function logout(ctx) {
  await ctx.redirect('/');
}

module.exports.login = login;
module.exports.logout = logout;
