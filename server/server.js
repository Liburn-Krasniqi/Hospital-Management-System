import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import logger from './middleware/logger.js';
import errorHandler from './middleware/error.js';
import posts from  './routes/posts.js'
import notFound from './middleware/notFound.js';

const port = process.env.PORT || 8080;

// GET the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const products = require('./data/products.json')

const app = express(); //this can be reduced/merged into one thing.

// Logger middleware
app.use(logger);

//setup static folder
app.use(express.static(path.join(__dirname, 'public')));

//Body parser middleware
app.use(express.json());
app.use(express.urlencoded({extended: false})); 

// Routes
app.use('/api/posts', posts);

// Use Error handler AFTER routes to avoid potential conflicts
app.use(notFound);
app.use(errorHandler);

// Server
app.listen(
    port,
    () => console.log(`its alive on http://localhost:${port}`)
); 