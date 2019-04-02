export default function bouncer(req, res, next) {
  try {
    if (req && req.session && req.session.user) {
      console.log(req.session);
      next();
    } else {
      res.status(401).json({ message: 'Invalid Credentials' });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'The request could not be completed.', error: error });
  }
}
