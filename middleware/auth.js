const jwt = require('jsonwebtoken');

const authMiddleware = (roles = []) => {
  return async (resolve, parent, args, context, info) => {
    const token = context.req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).send('Access Denied');

    try {
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      console.log('verfied',verified)
      if (roles.length && !roles.includes(verified.role)) {
        return res.status(403).send('Forbidden');
      }
      context.user = verified;

      // Proceed to the actual resolver
      return resolve(parent, args, context, info);
    } catch (err) {
      return res.status(400).send('Invalid Token');
    }
  };
};

module.exports = authMiddleware;
