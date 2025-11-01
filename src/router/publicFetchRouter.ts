import express, { Router } from 'express';
import publicFetchController from '../controller/publicFetchController';
import Auth from '../middleware/auth';

const publicFetchRouter: Router = express.Router();

publicFetchRouter.get('/fetchGitRepo', Auth, publicFetchController.fetchGitRepo);
publicFetchRouter.get('/fetchGitRepoByUser/:userName', Auth, publicFetchController.fetchGitRepoByUser);
publicFetchRouter.get('/fetchNews', Auth, publicFetchController.fetchNews);

export default publicFetchRouter;

