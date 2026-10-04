import { Router } from 'express';
import { generateEmergencyAudio } from '../services/audio/elevenlabs.js';
import { searchLiveCrisisNews } from '../services/search/serpApi.js';

const router = Router();

// POST /api/integrations/audio/broadcast — Generate ElevenLabs narration
router.post('/audio/broadcast', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ success: false, error: 'Text is required for audio broadcast' });
    }

    const result = await generateEmergencyAudio(text);
    res.json(result);
  } catch (error) {
    console.error('Audio broadcast route error:', error);
    res.status(500).json({ success: false, error: 'Failed to generate audio' });
  }
});

// POST /api/integrations/search/live — Search real-time news with SerpApi
router.post('/search/live', async (req, res) => {
  try {
    const { query, location } = req.body;
    if (!query) {
      return res.status(400).json({ success: false, error: 'Query is required for live search' });
    }

    const result = await searchLiveCrisisNews(query, location);
    res.json(result);
  } catch (error) {
    console.error('Live search route error:', error);
    res.status(500).json({ success: false, error: 'Failed to perform live search' });
  }
});

export default router;
