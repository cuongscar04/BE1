const isAuthenticated = (req, res, next) => {

  console.log('Session ID:', req.sessionID);
  console.log('Session:', req.session);
  console.log('User:', req.session?.user);
  if (!req.session || !req.session.user) {
        return res.status(401).json({ message: 'Please login first' });
    }

    next();
};

module.exports = isAuthenticated;