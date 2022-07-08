// Cloudant instance creation (lowercase c for instance)
import Cloudant from '@cloudant/cloudant';
import dotenv from 'dotenv';

dotenv.config();

const cloudant = Cloudant({ url: process.env.CLOUDANT_URL, plugins: { iamauth: { iamApiKey: process.env.CLOUDANT_API_KEY } } });

export const db = cloudant.use('planet-patrol-db');
