import bcrypt from 'bcryptjs';
import express from 'express';

import {
  addUser,
  getAllUsers,
  // getUserById,
  getUserByFilter
} from '../data/models/users-model';

const router = express.Router();

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
router.post('/login', bouncer, (req, res) => {
  return res
    .status(200)
    .json({ message: `User '${req.headers.username}' has logged in!` });
});

/**
 * If the user is logged in, respond with an array of all the
 * users contained in the database. If the user is not logged
 * in, respond with the correct status code and the message:
 * 'You shall not pass!'.
 */
router.get('/users', bouncer, (req, res) => {
  getAllUsers()
    .then(users => res.status(200).json(users))
    .catch(error => handleServerError(res, error));
});

function bouncer(req, res, next) {
  const { username, password } = req.headers;

  // check for credentials in request header
  if (!username || !password) {
    return res.status(401).json({ message: 'Please provide credentials' });
  }
  // verify credentials
  getUserByFilter({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        next();
      } else {
        res.status(401).json({ message: 'You shall not pass!' });
      }
    })
    .catch(error => handleServerError(res, error));
}

export default router;
