const passport = require("passport");

exports.sanitizeUser = (data) => {
  return { id: data.id };
};
exports.cookieExtractor = function (req) {
  var token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }
  return token;
};
exports.isAuth = () => {
  return passport.authenticate("jwt");
};
