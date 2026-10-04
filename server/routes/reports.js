import { Router } from 'express';
import { isMongoConnected } from '../config/database.js';
import Report from '../models/Report.js';

const router = Router();

// In-memory reports store for demo mode fallback
let memoryReports = [
  {
    id: 'demo-rep-1',
    type: 'flooding',
    location: {
      name: 'Sector 70, Main Market',
      latitude: 30.7046,
      longitude: 76.7179,
    },
    description: 'Water level reached approx 2 feet near market entrance. Light vehicles stranded.',
    status: 'UNVERIFIED',
    isDemo: true,
    createdAt: new Date('2026-10-02T10:05:00+05:30'),
  }
];

// GET /api/reports — List recent community reports
router.get('/', async (req, res) => {
  try {
    if (isMongoConnected()) {
      const reports = await Report.find().sort({ createdAt: -1 }).limit(50).lean();
      return res.json({
        success: true,
        data: reports.map(r => ({
          ...r,
          id: r._id.toString(),
        })),
      });
    }

    res.json({
      success: true,
      data: memoryReports,
    });
  } catch (error) {
    console.error('Reports fetch error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch community reports' });
  }
});

// POST /api/reports — Submit a new citizen report
router.post('/', async (req, res) => {
  try {
    const { type, location, description, imageUrl } = req.body;

    if (!description || !location?.name) {
      return res.status(400).json({
        success: false,
        error: 'Description and location name are required',
      });
    }

    const reportData = {
      type: type || 'other',
      location: {
        name: location.name,
        latitude: location.latitude ? Number(location.latitude) : null,
        longitude: location.longitude ? Number(location.longitude) : null,
      },
      description,
      imageUrl: imageUrl || null,
      status: 'UNVERIFIED',
      isDemo: false,
      createdAt: new Date(),
    };

    if (isMongoConnected()) {
      const created = await Report.create(reportData);
      return res.status(201).json({
        success: true,
        message: 'Community report submitted successfully',
        data: {
          ...created.toObject(),
          id: created._id.toString(),
        },
      });
    }

    // In-memory fallback
    const memoryRecord = {
      ...reportData,
      id: `rep-${Date.now()}`,
    };
    memoryReports.unshift(memoryRecord);

    res.status(201).json({
      success: true,
      message: 'Community report recorded (in-memory mode)',
      data: memoryRecord,
    });
  } catch (error) {
    console.error('Report submission error:', error);
    res.status(500).json({ success: false, error: 'Failed to submit report' });
  }
});

export default router;
