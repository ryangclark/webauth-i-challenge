import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import authRoutes from './routes/authRoutes';

const server = express();

// Middleware
server.use(cors());
server.use(express.json());
server.use(helmet());

// Routing
server.use('/api/encantado', authRoutes);

export default server;