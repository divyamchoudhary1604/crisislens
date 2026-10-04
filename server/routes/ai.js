import { Router } from 'express';
import { getAnalyzer } from '../services/ai/index.js';
import { getDemoState } from '../services/demo/demoService.js';

const router = Router();

// POST /api/ai/query — RAG-style question answering
router.post('/query', async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || question.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Question is required' });
    }

    const analyzer = getAnalyzer();
    const demoState = getDemoState();

    // Build context from available sources
    let contextChunks = [];
    if (demoState.active) {
      contextChunks = demoState.sources.map(s => ({
        content: s.cleanedContent || s.rawContent,
        sourceType: s.type,
        publishedAt: s.publishedAt,
        publisher: s.publisher,
      }));
    }

    if (contextChunks.length === 0) {
      return res.json({
        success: true,
        data: {
          answer: 'No crisis information is currently available to answer your question.',
          confidence: 'LOW',
          sourcesUsed: [],
          caveats: ['No data sources loaded'],
          unanswerable: true,
        },
      });
    }

    const result = await analyzer.answerQuery(question, contextChunks);

    res.json({
      success: true,
      isDemo: demoState.active,
      data: result,
    });
  } catch (error) {
    console.error('AI query error:', error);
    res.status(500).json({
      success: false,
      error: 'AI query failed',
      message: 'Unable to process your question at the moment.',
    });
  }
});

export default router;
