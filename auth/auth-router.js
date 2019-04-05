import bcrypt from 'bcryptjs';
import { Router } from 'express';

import {
  addUser,
  getAllUsers,
  // getUserById,
  getUserByFilter
} from '../users/users-model';

const router = Router();

function handleServerError(res, error) {
  console.error(error);
  return res
    .status(500)
    .json({ message: 'The request could not be completed.', error: error });
}

/**
 * Creates a user using the information sent
 * inside the body of the request.
 * Hash the password before saving the user to the database.
 */
router.post('/register', (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({
      message: 'Please provide both `username` and `password` properties.'
    });
  }
  let newUser = req.body;
  // hass password
  const hash = bcrypt.hashSync(newUser.password);
  newUser.password = hash;

  addUser(newUser)
    .then(savedUser => res.status(201).json(savedUser))
    .catch(error => handleServerError(res, error));
});

/**
 * Use the credentials sent inside the body to authenticate
 * the user. On successful login, create a new session for
 * the user and send back a 'Logged in' message and a cookie
 * that contains the user id. If login fails, respond with
 * the correct status code and the message: 'You shall not pass!'
 */
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // check for credentials in request header
  if (!username || !password) {
    return res.status(401).json({ message: 'Please provide credentials' });
  }
  // verify credentials
  getUserByFilter({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        // set user in session
        req.session.user = user;

        res.status(200).json({ message: `Welcome, ${user.username}!` });
      } else {
        res.status(401).json({ message: 'You shall not pass!' });
      }
    })
    .catch(error => handleServerError(res, error));
});

router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        return handleServerError(res, err);
      } else {
        return res.status(200).json({ message: 'Good Day.' });
      }
    });
  } else {
    res.status(200).json({ message: 'Good Day.' });
  }
});

export default router;