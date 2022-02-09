const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  let token = req.header('Authorization');
  if (!token)
    return res.__sendFail(401, {
      message: 'Access denied. No token provided.',
    });

  // token sample: Authorization: Bearer {{token}}
  token = token.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.jwtPrivateKey);
    req.auth = decoded;
    next();
  } catch (ex) {
    res.__sendFail(401, { message: 'Invalid token.' });
  }
};
