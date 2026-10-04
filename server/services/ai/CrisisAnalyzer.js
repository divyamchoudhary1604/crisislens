/**
 * CrisisAnalyzer — The core AI analysis pipeline.
 * 
 * Orchestrates all 10 AI processing tasks:
 * 1. Incident extraction
 * 2. Location/entity extraction
 * 3. Event classification
 * 4. Deduplication
 * 5. Contradiction detection
 * 6. Uncertainty extraction
 * 7. Severity assessment
 * 8. Situation synthesis
 * 9. Personalization
 * 10. Action generation
 */

import { PROMPTS } from './prompts.js';

export class CrisisAnalyzer {
  constructor(aiProvider) {
    this.ai = aiProvider;
  }

  /**
   * Full analysis pipeline: takes raw sources, produces structured incident.
   */
  async analyzeSources(sources, userLocations = null, existingIncident = null) {
    const results = {
      extraction: null,
      synthesis: null,
      contradictions: null,
      personalization: null,
      errors: [],
      processingSteps: [],
    };

    try {
      // Step 1-2: Extract incidents from each source
      results.processingSteps.push({ step: 'extraction', status: 'started', time: new Date() });
      const extractions = [];
      
      for (const source of sources) {
        try {
          const extracted = await this.extractIncidents(source);
          extractions.push({ source, extracted });
          results.processingSteps.push({ 
            step: 'extraction', 
            status: 'completed', 
            source: source.title,
            time: new Date() 
          });
        } catch (err) {
          results.errors.push({ step: 'extraction', source: source.title, error: err.message });
          results.processingSteps.push({ 
            step: 'extraction', 
            status: 'error', 
            source: source.title,
            error: err.message,
            time: new Date() 
          });
        }
      }
      results.extraction = extractions;

      // Step 5: Detect contradictions across sources
      results.processingSteps.push({ step: 'contradiction_detection', status: 'started', time: new Date() });
      try {
        results.contradictions = await this.detectContradictions(sources);
        results.processingSteps.push({ step: 'contradiction_detection', status: 'completed', time: new Date() });
      } catch (err) {
        results.errors.push({ step: 'contradiction_detection', error: err.message });
        results.contradictions = { contradictions: [], noContradictions: true };
      }

      // Step 7-8: Synthesize all sources into situation brief
      results.processingSteps.push({ step: 'synthesis', status: 'started', time: new Date() });
      try {
        results.synthesis = await this.synthesizeSituation(sources, existingIncident);
        results.processingSteps.push({ step: 'synthesis', status: 'completed', time: new Date() });
      } catch (err) {
        results.errors.push({ step: 'synthesis', error: err.message });
        // Fallback: create basic synthesis from extractions
        results.synthesis = this.fallbackSynthesis(sources, extractions);
      }

      // Merge contradiction data into synthesis
      if (results.contradictions?.contradictions?.length > 0 && results.synthesis) {
        results.synthesis.conflictingReports = [
          ...(results.synthesis.conflictingReports || []),
          ...results.contradictions.contradictions.map(c => ({
            claim: c.claim,
            sourceA: { 
              sourceId: sources[c.sourceA?.sourceIndex]?.id || c.sourceA?.sourceId || 'Unknown', 
              says: c.sourceA?.says || '', 
              time: c.sourceA?.time || null 
            },
            sourceB: { 
              sourceId: sources[c.sourceB?.sourceIndex]?.id || c.sourceB?.sourceId || 'Unknown', 
              says: c.sourceB?.says || '', 
              time: c.sourceB?.time || null 
            },
            note: c.note || '',
          })),
        ];
      }

      // Step 9: Personalize for user
      if (userLocations && results.synthesis) {
        results.processingSteps.push({ step: 'personalization', status: 'started', time: new Date() });
        try {
          results.personalization = await this.personalizeContext(results.synthesis, userLocations);
          results.processingSteps.push({ step: 'personalization', status: 'completed', time: new Date() });
        } catch (err) {
          results.errors.push({ step: 'personalization', error: err.message });
          results.personalization = this.fallbackPersonalization(results.synthesis, userLocations);
        }
      }

    } catch (error) {
      results.errors.push({ step: 'pipeline', error: error.message });
    }

    return results;
  }

  /**
   * Task 1-2: Extract incidents and entities from a single source.
   */
  async extractIncidents(source) {
    const content = source.cleanedContent || source.rawContent;
    const result = await this.ai.extractJSON(
      PROMPTS.extractIncidents.system,
      PROMPTS.extractIncidents.user(content, source.type, source.publisher)
    );

    if (!result.success) {
      throw new Error(`Failed to extract incidents: ${result.error}`);
    }

    return result.data;
  }

  /**
   * Task 3: Classify an event.
   */
  async classifyEvent(title, claims, locations) {
    const result = await this.ai.extractJSON(
      PROMPTS.classifyEvent.system,
      PROMPTS.classifyEvent.user(title, claims, locations)
    );
    return result.success ? result.data : null;
  }

  /**
   * Task 4: Check if two incidents are duplicates.
   */
  async checkDuplicate(incidentA, incidentB) {
    const result = await this.ai.extractJSON(
      PROMPTS.detectDuplicates.system,
      PROMPTS.detectDuplicates.user(incidentA, incidentB)
    );
    return result.success ? result.data : { isDuplicate: false, confidence: 'LOW' };
  }

  /**
   * Task 5: Detect contradictions across multiple sources.
   */
  async detectContradictions(sources) {
    const result = await this.ai.extractJSON(
      PROMPTS.detectContradictions.system,
      PROMPTS.detectContradictions.user(sources)
    );
    return result.success ? result.data : { contradictions: [], noContradictions: true };
  }

  /**
   * Task 6: Extract uncertainty markers from text.
   */
  async extractUncertainty(text) {
    const result = await this.ai.extractJSON(
      PROMPTS.extractUncertainty.system,
      PROMPTS.extractUncertainty.user(text)
    );
    return result.success ? result.data : { uncertainItems: [] };
  }

  /**
   * Task 7-8: Full situation synthesis.
   */
  async synthesizeSituation(sources, existingIncident = null) {
    const result = await this.ai.extractJSON(
      PROMPTS.synthesizeSituation.system,
      PROMPTS.synthesizeSituation.user(sources, existingIncident),
      { maxTokens: 3000 }
    );

    if (!result.success) {
      throw new Error(`Synthesis failed: ${result.error}`);
    }

    return result.data;
  }

  /**
   * Task 9: Personalize for user's locations.
   */
  async personalizeContext(incident, userLocations) {
    const result = await this.ai.extractJSON(
      PROMPTS.personalizeContext.system,
      PROMPTS.personalizeContext.user(incident, userLocations)
    );
    return result.success ? result.data : this.fallbackPersonalization(incident, userLocations);
  }

  /**
   * Task 10: RAG query answering.
   */
  async answerQuery(question, contextChunks) {
    const result = await this.ai.extractJSON(
      PROMPTS.ragQuery.system,
      PROMPTS.ragQuery.user(question, contextChunks)
    );
    return result.success ? result.data : { 
      answer: 'Unable to analyze this query at the moment.', 
      confidence: 'LOW',
      unanswerable: true 
    };
  }

  /**
   * Fallback synthesis when AI fails — returns raw source data without AI interpretation.
   */
  fallbackSynthesis(sources, extractions) {
    return {
      title: 'Crisis Report (AI analysis unavailable)',
      type: 'other',
      severity: 'UNKNOWN',
      severityFactors: ['AI analysis was unavailable — showing raw source information'],
      status: 'UNKNOWN',
      summary: `${sources.length} source(s) collected. AI synthesis is temporarily unavailable. Source information is shown below without AI processing.`,
      confirmedFacts: [],
      reportedInformation: sources.map(s => ({
        claim: s.title,
        source: s.publisher || s.type,
        reportedAt: s.publishedAt,
      })),
      uncertainties: [{
        item: 'AI analysis unavailable',
        reason: 'Source information has not been verified or synthesized by the AI system.',
      }],
      conflictingReports: [],
      recommendedActions: [{
        action: 'Review source information directly and follow official guidance',
        basis: 'AI synthesis unavailable',
        urgency: 'MODERATE',
      }],
      locations: [],
    };
  }

  /**
   * Fallback personalization when AI fails — simple location matching.
   */
  fallbackPersonalization(incident, userLocations) {
    const affected = [];
    const incidentLocationNames = (incident.locations || [])
      .map(l => l.name?.toLowerCase() || '');

    for (const loc of userLocations) {
      const locName = loc.label?.toLowerCase() || loc.name?.toLowerCase() || '';
      const isAffected = incidentLocationNames.some(iLoc => 
        iLoc.includes(locName) || locName.includes(iLoc) ||
        iLoc.split(/[\s,]+/).some(word => locName.includes(word) && word.length > 3)
      );
      
      affected.push({
        locationType: loc.type,
        locationName: loc.label || loc.name,
        impactLevel: isAffected ? 'MODERATE' : 'UNKNOWN',
        explanation: isAffected 
          ? `This location may be affected based on proximity to reported incident areas.`
          : 'Unable to determine impact — AI personalization is unavailable.',
        icon: loc.type === 'home' ? '🏠' : loc.type === 'college' ? '🎓' : loc.type === 'work' ? '💼' : '📍',
      });
    }

    return {
      affectedLocations: affected,
      personalSummary: 'Personalized analysis is limited — AI processing unavailable.',
      urgentActions: [{
        action: 'Check official local sources directly',
        reason: 'AI personalization is temporarily unavailable',
      }],
    };
  }
}

export default CrisisAnalyzer;
