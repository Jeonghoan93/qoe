import express from 'express';

import { createTelemetry } from '../controllers/telemetry.js';

const router = express.Router();

router.get('/', createTelemetry);

export default router;