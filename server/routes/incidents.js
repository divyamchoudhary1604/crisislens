import { Router } from 'express';
import mongoose from 'mongoose';
import { getDemoState } from '../services/demo/demoService.js';
import { isMongoConnected } from '../config/database.js';
import Incident from '../models/Incident.js';
import Source from '../models/Source.js';
import IncidentEvent from '../models/IncidentEvent.js';

const router = Router();

// GET /api/incidents — List all active incidents
router.get('/', async (req, res) => {
  try {
    const demoState = getDemoState();

    // In-memory demo state takes priority if active
    if (demoState.active) {
      return res.json({
        success: true,
        isDemo: true,
        data: demoState.incidents,
        personalization: demoState.personalization,
      });
    }

    // Query MongoDB if connected
    if (isMongoConnected()) {
      try {
        const docs = await Incident.find().sort({ updatedAt: -1 }).lean();
        if (docs.length > 0) {
          const incidents = docs.map(doc => ({
            ...doc,
            id: doc.demoId || doc._id.toString(),
          }));

          return res.json({
            success: true,
            isDemo: incidents.some(i => i.isDemo),
            data: incidents,
            personalization: null,
          });
        }
      } catch (dbError) {
        console.error('MongoDB incidents query error:', dbError.message);
      }
    }

    res.json({
      success: true,
      isDemo: false,
      data: [],
      message: 'No active incidents. Start demo mode or configure data sources.',
    });
  } catch (error) {
    console.error('Incidents fetch error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch incidents' });
  }
});

// GET /api/incidents/:id — Get full incident detail
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const demoState = getDemoState();

    // Check in-memory demo state first
    if (demoState.active) {
      const incident = demoState.incidents.find(i => i.id === id);
      if (incident) {
        const sources = demoState.sources.filter(s =>
          incident.sourceIds?.includes(s.id)
        );

        return res.json({
          success: true,
          isDemo: true,
          data: incident,
          sources,
          personalization: demoState.personalization,
        });
      }
    }

    // Query MongoDB if connected
    if (isMongoConnected()) {
      try {
        let query = { demoId: id };
        if (mongoose.Types.ObjectId.isValid(id)) {
          query = { $or: [{ demoId: id }, { _id: id }] };
        }

        const incidentDoc = await Incident.findOne(query).lean();
        if (incidentDoc) {
          const formattedIncident = {
            ...incidentDoc,
            id: incidentDoc.demoId || incidentDoc._id.toString(),
          };

          // Fetch associated sources
          let sources = [];
          if (formattedIncident.sourceIds && formattedIncident.sourceIds.length > 0) {
            const orConditions = [{ demoId: { $in: formattedIncident.sourceIds } }];
            const validObjectIds = formattedIncident.sourceIds.filter(sId => mongoose.Types.ObjectId.isValid(sId));
            if (validObjectIds.length > 0) {
              orConditions.push({ _id: { $in: validObjectIds } });
            }

            const sourceDocs = await Source.find({ $or: orConditions }).lean();
            sources = sourceDocs.map(s => ({
              ...s,
              id: s.demoId || s._id.toString(),
            }));
          }

          return res.json({
            success: true,
            isDemo: formattedIncident.isDemo || false,
            data: formattedIncident,
            sources,
            personalization: null,
          });
        }
      } catch (dbError) {
        console.error('MongoDB incident detail query error:', dbError.message);
      }
    }

    res.status(404).json({ success: false, error: 'Incident not found' });
  } catch (error) {
    console.error('Incident detail error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch incident' });
  }
});

// GET /api/incidents/:id/timeline — Get timeline for an incident
router.get('/:id/timeline', async (req, res) => {
  try {
    const { id } = req.params;
    const demoState = getDemoState();

    // Check in-memory demo state first
    if (demoState.active) {
      const events = demoState.timeline
        .filter(e => e.incidentId === id)
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

      if (events.length > 0) {
        return res.json({
          success: true,
          isDemo: true,
          data: events,
        });
      }
    }

    // Query MongoDB if connected
    if (isMongoConnected()) {
      try {
        let query = { incidentId: id };
        if (mongoose.Types.ObjectId.isValid(id)) {
          query = {
            $or: [
              { incidentId: id },
              { incidentId: new mongoose.Types.ObjectId(id) }
            ]
          };
        }

        const eventDocs = await IncidentEvent.find(query).sort({ timestamp: 1 }).lean();
        if (eventDocs.length > 0) {
          const events = eventDocs.map(e => ({
            ...e,
            id: e._id.toString(),
          }));

          return res.json({
            success: true,
            isDemo: events.some(e => e.isDemo),
            data: events,
          });
        }
      } catch (dbError) {
        console.error('MongoDB timeline query error:', dbError.message);
      }
    }

    res.json({ success: true, data: [] });
  } catch (error) {
    console.error('Timeline error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch timeline' });
  }
});

export default router;
