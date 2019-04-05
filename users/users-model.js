import db from '../data/dbConfig';

export function addUser(user) {
  return db('users')
    .insert(user)
    .then(newUserId => getUserById(newUserId[0]));
}

export function getAllUsers() {
  return db('users').select();
}

export function getUserById(id) {
  return db('users')
    .select()
    .where('id', id)
    .first();
}

export function getUserByFilter(filter) {
  return db('users')
    .select()
    .where(filter);
}
