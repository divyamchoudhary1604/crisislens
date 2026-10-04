import { Router } from 'express';
import { getDemoState } from '../services/demo/demoService.js';
import { isMongoConnected } from '../config/database.js';
import User from '../models/User.js';

const router = Router();

const DEFAULT_FRIEND_PROFILE = {
  name: 'Arjun',
  preferredLanguage: 'en',
  locations: [
    {
      name: 'Home',
      label: 'Mohali Sector 70',
      type: 'home',
      latitude: 30.7046,
      longitude: 76.7179,
    },
    {
      name: 'College',
      label: 'Chandigarh University',
      type: 'college',
      latitude: 30.7714,
      longitude: 76.5785,
    },
  ],
  route: {
    from: 'home',
    to: 'college',
    waypoints: [
      { lat: 30.7046, lng: 76.7179 },
      { lat: 30.7131, lng: 76.6956 },
      { lat: 30.7285, lng: 76.6512 },
      { lat: 30.7714, lng: 76.5785 },
    ],
  },
  emergencyContacts: [],
};

// GET /api/user — Get current user/friend profile
router.get('/', async (req, res) => {
  try {
    const demoState = getDemoState();

    if (demoState.active && demoState.user) {
      return res.json({
        success: true,
        isDemo: true,
        data: demoState.user,
      });
    }

    // Check MongoDB if connected
    if (isMongoConnected()) {
      try {
        const userDoc = await User.findOne().sort({ updatedAt: -1 }).lean();
        if (userDoc) {
          return res.json({
            success: true,
            isDemo: false,
            data: userDoc,
          });
        }
      } catch (dbError) {
        console.error('MongoDB user query error:', dbError.message);
      }
    }

    // Default friend profile (always available fallback)
    res.json({
      success: true,
      isDemo: true,
      data: DEFAULT_FRIEND_PROFILE,
    });
  } catch (error) {
    console.error('User fetch error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch user profile' });
  }
});

// PUT /api/user — Update user profile
router.put('/', async (req, res) => {
  try {
    const updates = req.body;
    let savedData = updates;

    // Persist to MongoDB if connected
    if (isMongoConnected()) {
      try {
        const existingUser = await User.findOne();
        if (existingUser) {
          savedData = await User.findByIdAndUpdate(
            existingUser._id,
            { $set: updates },
            { new: true, runValidators: true }
          ).lean();
        } else {
          savedData = await User.create(updates);
        }
      } catch (dbError) {
        console.error('MongoDB user update error:', dbError.message);
      }
    }

    // Also update in-memory demo state if active
    const demoState = getDemoState();
    if (demoState.active && demoState.user) {
      demoState.user = {
        ...demoState.user,
        ...updates,
      };
    }

    res.json({
      success: true,
      message: 'Profile updated',
      data: savedData,
    });
  } catch (error) {
    console.error('User update error:', error);
    res.status(500).json({ success: false, error: 'Failed to update profile' });
  }
});

export default router;
