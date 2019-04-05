import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import session from 'express-session';

import authRoutes from './auth/auth-router';
import userRoutes from './users/users-routes';

import { sessionConfig } from './auth/session-config';
import bouncer from './auth/bouncer-middleware';

const server = express();

// Middleware
server.use(cors());
server.use(express.json());
server.use(helmet());
server.use(session(sessionConfig));

// Routing
server.use('/api/encantado', authRoutes);
server.use('/api/users', bouncer, userRoutes);

export default server;
