import { Router } from 'express';
import { startDemo, getDemoState, resetDemo, isDemoActive } from '../services/demo/demoService.js';
import { getAnalyzer } from '../services/ai/index.js';

const router = Router();

// GET /api/demo/scenarios — List available simulation scenarios
router.get('/scenarios', (req, res) => {
  res.json({
    success: true,
    scenarios: [
      {
        id: 'mohali',
        name: 'Mohali Monsoon Floods',
        badge: 'Flooding',
        region: 'Mohali, Punjab',
        friend: 'Arjun (Student)',
        summary: 'Waterlogging, stalled traffic, and Airport Road closure',
      },
      {
        id: 'delhi',
        name: 'Delhi Toxic Smog & AQI 480+',
        badge: 'Air Quality / Health',
        region: 'Delhi-NCR',
        friend: 'Priya (Asthma Patient)',
        summary: 'Near-zero visibility, GRAP-IV curbs, and highway truck diversions',
      },
      {
        id: 'uttarakhand',
        name: 'Mountain Cloudburst & Landslide',
        badge: 'Landslide',
        region: 'Chamoli, Uttarakhand',
        friend: 'Vikram (Traveller)',
        summary: 'NH-7 Badrinath highway blocked at Pagal Nala with 400+ vehicles stranded',
      },
    ],
  });
});

// POST /api/demo/start — Load demo scenario and run AI pipeline
router.post('/start', async (req, res) => {
  try {
    const scenarioId = req.body?.scenarioId || req.query?.scenario || 'mohali';
    const state = await startDemo(scenarioId);
    res.json({
      success: true,
      message: `Demo scenario [${state.scenario.name}] loaded and analyzed`,
      data: {
        scenarioId: state.scenarioId,
        scenario: {
          name: state.scenario.name,
          region: state.scenario.region,
          description: state.scenario.description,
        },
        incidentCount: state.incidents.length,
        sourceCount: state.sources.length,
        timelineEventCount: state.timeline.length,
        hasPersonalization: !!state.personalization,
      },
    });
  } catch (error) {
    console.error('Demo start error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to start demo scenario',
      message: error.message,
    });
  }
});

// GET /api/demo/status — Check if demo is active
router.get('/status', (req, res) => {
  const state = getDemoState();
  res.json({
    active: state.active,
    scenario: state.scenario ? {
      name: state.scenario.name,
      region: state.scenario.region,
    } : null,
  });
});

// POST /api/demo/reset — Clear demo data
router.post('/reset', async (req, res) => {
  try {
    const result = await resetDemo();
    res.json(result);
  } catch (error) {
    console.error('Demo reset error:', error);
    res.status(500).json({ success: false, error: 'Failed to reset demo' });
  }
});

export default router;
