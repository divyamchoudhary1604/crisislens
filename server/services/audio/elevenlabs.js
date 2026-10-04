/**
 * ElevenLabs Audio Service — Emergency Voice Narration
 * 
 * Qualifies for Hacktoberfest Prize: "Best Use of ElevenLabs"
 * Generates clear, authoritative emergency voice broadcasts for crisis briefs.
 */

import config from '../../config/index.js';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || '';
const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM'; // Rachel (Clear, calm broadcaster)

export async function generateEmergencyAudio(text) {
  if (!ELEVENLABS_API_KEY) {
    return {
      success: false,
      message: 'ELEVENLABS_API_KEY not configured. Falling back to browser Web Speech API.',
      audioUrl: null,
    };
  }

  try {
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.75,
          similarity_boost: 0.85,
          style: 0.0,
          use_speaker_boost: true,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`ElevenLabs error (${response.status}): ${errText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Audio = buffer.toString('base64');

    return {
      success: true,
      audioUrl: `data:audio/mpeg;base64,${base64Audio}`,
      provider: 'elevenlabs',
    };
  } catch (error) {
    console.error('ElevenLabs synthesis error:', error.message);
    return {
      success: false,
      error: error.message,
      audioUrl: null,
    };
  }
}

export default {
  generateEmergencyAudio,
};
