import { Router } from 'express';
import { getDemoState } from '../services/demo/demoService.js';
import { isMongoConnected } from '../config/database.js';
import Incident from '../models/Incident.js';
import User from '../models/User.js';

const router = Router();

// GET /api/map/incidents — Get incidents with geo data for map display
router.get('/incidents', async (req, res) => {
  try {
    const demoState = getDemoState();

    if (demoState.active) {
      const mapIncidents = demoState.incidents.map(incident => ({
        id: incident.id,
        title: incident.title,
        type: incident.type,
        severity: incident.severity,
        status: incident.status,
        locations: (incident.locations || []).filter(l => l.latitude && l.longitude),
        sourceCount: incident.sourceIds?.length || 0,
        updatedAt: incident.updatedAt,
        isDemo: true,
      }));

      return res.json({
        success: true,
        isDemo: true,
        data: mapIncidents,
      });
    }

    // Query MongoDB if connected
    if (isMongoConnected()) {
      try {
        const docs = await Incident.find().lean();
        if (docs.length > 0) {
          const mapIncidents = docs.map(incident => ({
            id: incident.demoId || incident._id.toString(),
            title: incident.title,
            type: incident.type,
            severity: incident.severity,
            status: incident.status,
            locations: (incident.locations || []).filter(l => l.latitude && l.longitude),
            sourceCount: incident.sourceIds?.length || 0,
            updatedAt: incident.updatedAt,
            isDemo: incident.isDemo || false,
          }));

          return res.json({
            success: true,
            isDemo: mapIncidents.some(i => i.isDemo),
            data: mapIncidents,
          });
        }
      } catch (dbError) {
        console.error('MongoDB map incidents query error:', dbError.message);
      }
    }

    res.json({ success: true, data: [] });
  } catch (error) {
    console.error('Map incidents error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch map data' });
  }
});

// GET /api/map/user-locations — Get user's saved locations for map
router.get('/user-locations', async (req, res) => {
  try {
    const demoState = getDemoState();

    if (demoState.active && demoState.user) {
      return res.json({
        success: true,
        isDemo: true,
        data: {
          locations: demoState.user.locations,
          route: demoState.user.route,
        },
      });
    }

    // Query MongoDB if connected
    if (isMongoConnected()) {
      try {
        const userDoc = await User.findOne().sort({ updatedAt: -1 }).lean();
        if (userDoc && userDoc.locations && userDoc.locations.length > 0) {
          return res.json({
            success: true,
            isDemo: false,
            data: {
              locations: userDoc.locations,
              route: userDoc.route,
            },
          });
        }
      } catch (dbError) {
        console.error('MongoDB map user locations query error:', dbError.message);
      }
    }

    // Default locations
    res.json({
      success: true,
      data: {
        locations: [
          { name: 'Home', label: 'Mohali Sector 70', type: 'home', latitude: 30.7046, longitude: 76.7179 },
          { name: 'College', label: 'Chandigarh University', type: 'college', latitude: 30.7714, longitude: 76.5785 },
        ],
        route: {
          waypoints: [
            { lat: 30.7046, lng: 76.7179 },
            { lat: 30.7131, lng: 76.6956 },
            { lat: 30.7285, lng: 76.6512 },
            { lat: 30.7714, lng: 76.5785 },
          ],
        },
      },
    });
  } catch (error) {
    console.error('Map user locations error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch user locations' });
  }
});

export default router;
