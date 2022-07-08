import express from 'express';
import path from 'path';
import dotenv from 'dotenv';

// Google Auth Library client creation
import { OAuth2Client } from 'google-auth-library';

import {
  ticList,
  submitDispositionRequest,
  fetchTicList,
  fetchFolderList,
  generateCSVRequest,
  getTicFilesRequest,
  getTicDataRequest,
  getUserAnsweredTicsRequest,
} from './planetpatrol';
import { db } from './dbHandler';

const client = new OAuth2Client(process.env.CLIENT_ID);

const app = express();

const port = process.env.PORT || 3001;

// load environment variables from .env if not in production
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

// Express Middleware
app.use(express.json());

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

var session = require('cookie-session');

// Express session settings
let sess = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
  },
};

app.set('trust proxy', 1); // Trust first proxy

if (process.env.NODE_ENV !== 'production') {
  sess.cookie.secure = false;
}

app.use(session(sess));

// Middleware to automatically set req.user property if the user already logged in
app.use(async (req: any, _res: any, next: Function) => {
  if (req.session.userId) {
    try {
      req.user = await db.get(req.session.userId);
    } catch {}
  }

  next();
});

// Get user data
app.post('/api/auth/google', async (req: any, res: any) => {
  const { token } = req.body;

  if (!token) {
    res.status(400).send('No token provided.');
    return;
  }

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload) {
    res.status(400).send('Invalid token.');
    return;
  }

  const { email, name } = payload;

  let userId = 'user:' + email;

  let user: any;

  try {
    // Try to find the existing user
    user = await db.get(userId);
  } catch {
    // User not found, create the user
    user = { _id: userId, name: name };
    db.insert(user);
  }

  // Save userId for later API calls
  req.session.userId = userId;

  res.status(200);
  res.json(user);
});

// Logout
app.delete('/api/auth/logout', async (req: any, res: any) => {
  req.session = null; // Destroy saved userId

  res.status(200);
  res.json({
    message: 'Logged out successfully.',
  });
});

app.get('/api/me', async (req: any, res: any) => {
  if (req.user) {
    res.status(200);
  } else {
    res.status(404);
  }

  res.json(req.user);
});

// User submits or updates disposition

app.get('/api/all-tics', async (req: any, res: any) => {
  try {
    res.json(ticList);
    res.status(200);
  } catch {
    res.status(500);
    res.json({ message: 'An error occurred.' });
  }
});

app.post('/api/submit/:ticId', submitDispositionRequest);
app.get('/api/answered-tics', getUserAnsweredTicsRequest);
app.get('/api/tic/:ticId', getTicDataRequest);
app.get('/api/files/:ticId', getTicFilesRequest);
app.get(['/api/csv', '/api/csv/all'], generateCSVRequest);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
  fetchTicList();
  fetchFolderList();

  setInterval(() => {
    console.log('Updating TIC & folder lists...');
    fetchTicList();
    fetchFolderList();
  }, 1000 * 60 * 5 /* 5 minutes */);
});
