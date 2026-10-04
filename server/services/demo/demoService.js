/**
 * Demo Service — Manages the demo scenario lifecycle.
 * 
 * Supports multiple crisis scenarios:
 * 1. 'mohali' (Default): Heavy Rainfall & Localized Flooding (Arjun)
 * 2. 'delhi': Severe Toxic Smog & AQI 480+ Emergency (Priya)
 * 3. 'uttarakhand': Cloudburst & Mountain Highway Landslide (Vikram)
 */

import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getAnalyzer } from '../ai/index.js';
import { isMongoConnected } from '../../config/database.js';
import Incident from '../../models/Incident.js';
import Source from '../../models/Source.js';
import IncidentEvent from '../../models/IncidentEvent.js';
import User from '../../models/User.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DEMO_DIR = join(__dirname, '../../../demo');

let currentScenarioId = 'mohali';

// In-memory store for demo data (always populated — serves as fallback)
let demoState = {
  active: false,
  scenarioId: 'mohali',
  scenario: null,
  sources: [],
  incidents: [],
  timeline: [],
  analysis: null,
  personalization: null,
  user: null,
};

export async function loadScenario(scenarioId = 'mohali') {
  let filename = 'scenario.json';
  if (scenarioId === 'delhi') filename = 'scenario-delhi.json';
  if (scenarioId === 'uttarakhand') filename = 'scenario-uttarakhand.json';

  const scenarioPath = join(DEMO_DIR, filename);
  const raw = await readFile(scenarioPath, 'utf-8');
  return JSON.parse(raw);
}

export async function loadDemoSources(scenario) {
  if (scenario.sources && scenario.sources[0]?.rawContent) {
    return scenario.sources.map(s => ({
      ...s,
      cleanedContent: s.rawContent,
    }));
  }

  const sourceFiles = [
    'imd_warning.json',
    'local_news.json',
    'community_report.json',
    'traffic_advisory.json',
  ];

  const sources = [];
  for (const file of sourceFiles) {
    const filePath = join(DEMO_DIR, 'sources', file);
    const raw = await readFile(filePath, 'utf-8');
    const source = JSON.parse(raw);
    source.cleanedContent = source.rawContent;
    sources.push(source);
  }

  return sources;
}

/**
 * Persist demo data to MongoDB when connected.
 */
async function persistDemoToMongo(demoState) {
  if (!isMongoConnected()) return;

  try {
    // Clean previous demo data first
    await Promise.all([
      Incident.deleteMany({ isDemo: true }),
      Source.deleteMany({ isDemo: true }),
      IncidentEvent.deleteMany({ isDemo: true }),
      User.deleteMany({ name: demoState.user?.name }),
    ]);

    // Persist sources
    const sourceDocPromises = demoState.sources.map(s =>
      Source.create({
        demoId: s.id,
        title: s.title,
        type: s.type,
        publisher: s.publisher,
        url: s.url || '',
        rawContent: s.rawContent || '',
        cleanedContent: s.cleanedContent || '',
        publishedAt: s.publishedAt ? new Date(s.publishedAt) : new Date(),
        retrievedAt: new Date(),
        isDemo: true,
      })
    );
    await Promise.all(sourceDocPromises);

    // Persist incident
    const incident = demoState.incidents[0];
    if (incident) {
      await Incident.create({
        demoId: incident.id,
        title: incident.title,
        type: incident.type,
        severity: incident.severity,
        severityFactors: incident.severityFactors || [],
        status: incident.status,
        locations: incident.locations || [],
        summary: incident.summary || '',
        confirmedFacts: incident.confirmedFacts || [],
        reportedInformation: incident.reportedInformation || [],
        uncertainties: incident.uncertainties || [],
        conflictingReports: incident.conflictingReports || [],
        recommendedActions: incident.recommendedActions || [],
        sourceIds: incident.sourceIds || [],
        isDemo: true,
        createdAt: incident.createdAt,
        updatedAt: incident.updatedAt,
      });

      // Persist timeline events
      const eventPromises = demoState.timeline.map(t =>
        IncidentEvent.create({
          incidentId: incident.id,
          type: t.type,
          description: t.description,
          sourceId: t.sourceId || null,
          isDemo: true,
          timestamp: t.timestamp,
        })
      );
      await Promise.all(eventPromises);
    }

    // Persist user
    if (demoState.user) {
      await User.create({
        name: demoState.user.name,
        preferredLanguage: demoState.user.preferredLanguage || 'en',
        locations: demoState.user.locations || [],
        route: demoState.user.route || {},
        emergencyContacts: [],
      });
    }

    console.log(`✅ Demo scenario [${demoState.scenarioId}] persisted to MongoDB`);
  } catch (error) {
    console.error('⚠️  Failed to persist demo data to MongoDB:', error.message);
  }
}

export async function startDemo(scenarioId = 'mohali') {
  currentScenarioId = scenarioId;
  const scenario = await loadScenario(scenarioId);
  const sources = await loadDemoSources(scenario);
  const analyzer = getAnalyzer();

  // Set up demo user
  const user = {
    name: scenario.friend.name,
    preferredLanguage: scenario.friend.preferredLanguage,
    locations: [scenario.friend.home, scenario.friend.college],
    route: scenario.friend.route,
  };

  let synthesis;
  let personalization;
  let analysis;

  if (scenario.synthesis && scenario.personalization) {
    synthesis = scenario.synthesis;
    personalization = scenario.personalization;
    analysis = {
      synthesis,
      personalization,
      contradictions: synthesis.conflictingReports || [],
    };
  } else {
    // Run AI analysis pipeline for default scenario
    analysis = await analyzer.analyzeSources(
      sources,
      user.locations,
      null
    );
    synthesis = analysis.synthesis;
    personalization = analysis.personalization;
  }

  // Build the incident from synthesis
  const incident = {
    id: `demo-incident-${scenarioId}`,
    title: synthesis.title,
    type: synthesis.type,
    severity: synthesis.severity,
    severityFactors: synthesis.severityFactors,
    status: synthesis.status,
    locations: synthesis.locations || [],
    summary: synthesis.summary,
    confirmedFacts: synthesis.confirmedFacts || [],
    reportedInformation: synthesis.reportedInformation || [],
    uncertainties: synthesis.uncertainties || [],
    conflictingReports: synthesis.conflictingReports || [],
    recommendedActions: synthesis.recommendedActions || [],
    sourceIds: sources.map(s => s.id),
    isDemo: true,
    createdAt: new Date('2026-10-02T09:00:00+05:30'),
    updatedAt: new Date('2026-10-02T10:42:00+05:30'),
  };

  // Build timeline
  const timeline = [
    ...scenario.timeline.map(t => ({
      incidentId: incident.id,
      type: 'SOURCE_ADDED',
      description: t.event,
      sourceId: t.sourceId,
      timestamp: new Date(`2026-10-02T${t.time}:00+05:30`),
      isDemo: true,
    })),
    {
      incidentId: incident.id,
      type: 'REPORTS_MERGED',
      description: `AI merged ${sources.length} sources into consolidated brief`,
      sourceId: null,
      timestamp: new Date('2026-10-02T10:43:00+05:30'),
      isDemo: true,
    },
    {
      incidentId: incident.id,
      type: 'CONTRADICTION_DETECTED',
      description: 'Timestamp-aware contradiction analysis completed',
      sourceId: null,
      timestamp: new Date('2026-10-02T10:43:30+05:30'),
      isDemo: true,
    },
    {
      incidentId: incident.id,
      type: 'ANALYSIS_UPDATED',
      description: 'Personalized situation brief generated for ' + user.name,
      sourceId: null,
      timestamp: new Date('2026-10-02T10:44:00+05:30'),
      isDemo: true,
    },
  ];

  // Store demo state in memory
  demoState = {
    active: true,
    scenarioId,
    scenario,
    sources,
    incidents: [incident],
    timeline,
    analysis,
    personalization,
    user,
  };

  // Persist to MongoDB if connected
  await persistDemoToMongo(demoState);

  return demoState;
}

export function getDemoState() {
  return demoState;
}

export function isDemoActive() {
  return demoState.active;
}

export async function resetDemo() {
  demoState = {
    active: false,
    scenarioId: 'mohali',
    scenario: null,
    sources: [],
    incidents: [],
    timeline: [],
    analysis: null,
    personalization: null,
    user: null,
  };

  if (isMongoConnected()) {
    try {
      await Promise.all([
        Incident.deleteMany({ isDemo: true }),
        Source.deleteMany({ isDemo: true }),
        IncidentEvent.deleteMany({ isDemo: true }),
      ]);
      console.log('✅ Demo data cleared from MongoDB');
    } catch (error) {
      console.error('⚠️  Failed to clear demo data from MongoDB:', error.message);
    }
  }

  return { success: true, message: 'Demo data cleared' };
}

export default {
  loadScenario,
  loadDemoSources,
  startDemo,
  getDemoState,
  isDemoActive,
  resetDemo,
};
