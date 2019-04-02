import express from 'express';

import {
  addUser,
  getAllUsers,
  // getUserById,
  getUserByFilter
} from './users-model';

const router = express.Router();

function handleServerError(res, error) {
  console.error(error);
  return res
    .status(500)
    .json({ message: 'The request could not be completed.', error: error });
}

/**
 * If the user is logged in, respond with an array of all the
 * users contained in the database. If the user is not logged
 * in, respond with the correct status code and the message:
 * 'You shall not pass!'.
 */
router.get('/', (req, res) => {
  getAllUsers()
    .then(users => res.status(200).json(users))
    .catch(error => handleServerError(res, error));
});

export default router;
