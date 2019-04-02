import session from 'express-session';
import connectSessionKnex from 'connect-session-knex';
import db from '../data/dbConfig';

const KnexSessionStore = connectSessionKnex(session);

export const sessionConfig = {
  name: 'Karl',
  secret: '/ABCDEFGHIJKLMNOPQRSTUVWXYZ/',
  cookie: {
    maxAge: 1000 * 60 * 10,
    secure: false,
    httpOnly: true
  },
  resave: false,
  saveUninitialized: false,
  store: new KnexSessionStore({
    knex: db,
    tablename: 'sessions',
    sidfieldname: 'sid',
    createtable: true,
    clearInterval: 1000 * 60 * 30
  })
};
