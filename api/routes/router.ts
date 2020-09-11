import express from 'express';
const router = express.Router();

import { Token } from '../auth/oauth2';

import categories from './categories';
import pages from './pages';
import posts from './posts';
import settings from './settings';
import users from './users';

router.use('/api/token', Token);

router.use('/api/categories', categories);
router.use('/api/pages', pages);
router.use('/api/posts', posts);
router.use('/api/settings', settings);
router.use('/api/users', users);

export default router;
