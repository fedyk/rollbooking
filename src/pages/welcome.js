/**
 * Welcome page
 */
module.exports = async function welcome(context) {
  await context.render('welcome.html');
}
