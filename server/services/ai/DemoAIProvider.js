/**
 * DemoAIProvider — Pre-computed AI responses for demo mode.
 * 
 * This allows CrisisLens to demonstrate its full pipeline WITHOUT
 * any external API keys. The demo mode clearly marks all content
 * as simulated.
 */

import { AIProvider } from './AIProvider.js';

export class DemoAIProvider extends AIProvider {
  constructor() {
    super('demo');
  }

  async complete(systemPrompt, userPrompt, options = {}) {
    // The demo provider returns pre-computed structured JSON
    // based on keyword detection in the prompt
    
    if (userPrompt.includes('Synthesize') || userPrompt.includes('synthesize')) {
      return JSON.stringify(this.getDemoSynthesis());
    }

    if (userPrompt.includes('personalize') || userPrompt.includes('Personalize') || userPrompt.includes('affect')) {
      return JSON.stringify(this.getDemoPersonalization());
    }

    if (userPrompt.includes('CONTRADICTORY') || userPrompt.includes('contradictory')) {
      return JSON.stringify(this.getDemoContradictions());
    }

    if (userPrompt.includes('uncertain') || userPrompt.includes('Uncertain')) {
      return JSON.stringify(this.getDemoUncertainties());
    }

    if (userPrompt.includes('SAME underlying incident') || userPrompt.includes('duplicate')) {
      return JSON.stringify(this.getDemoDuplicateCheck());
    }

    if (userPrompt.includes('QUESTION:') || userPrompt.includes('Answer this question')) {
      return JSON.stringify(this.getDemoQueryResponse(userPrompt));
    }

    // Default: extraction
    return JSON.stringify(this.getDemoExtraction(userPrompt));
  }

  getDemoExtraction(prompt) {
    // Detect which source is being analyzed
    if (prompt.includes('IMD') || prompt.includes('Meteorological')) {
      return {
        incidents: [{
          type: 'flooding',
          title: 'Heavy Rainfall Warning for Punjab including Mohali',
          locations: [
            { name: 'SAS Nagar (Mohali)', latitude: 30.7046, longitude: 76.7179 },
            { name: 'Rupnagar', latitude: null, longitude: null },
            { name: 'Patiala', latitude: null, longitude: null },
          ],
          severity: 'HIGH',
          claims: [
            { claim: 'Heavy to very heavy rainfall (64.5-115.5mm) expected over Mohali district', status: 'CONFIRMED', reasoning: 'Official IMD warning' },
            { claim: 'Waterlogging expected in low-lying areas', status: 'CONFIRMED', reasoning: 'Part of official forecast impact assessment' },
            { claim: 'Possible road traffic disruption', status: 'REPORTED', reasoning: 'Listed as potential impact, not yet observed' },
          ],
          entities: ['IMD', 'Punjab', 'SAS Nagar', 'Mohali', 'Chandigarh'],
          timeReferences: ['02 October 2026', '0600 IST to 03 October 0600 IST'],
        }],
        sourceReliability: 'HIGH',
        sourceReliabilityReason: 'Official India Meteorological Department bulletin',
      };
    }

    if (prompt.includes('waterlogging') || prompt.includes('Punjab News')) {
      return {
        incidents: [{
          type: 'flooding',
          title: 'Waterlogging in Multiple Mohali Sectors',
          locations: [
            { name: 'Mohali Sector 70', latitude: 30.7046, longitude: 76.7179 },
            { name: 'Mohali Sector 71', latitude: 30.702, longitude: 76.715 },
            { name: 'Phase 7 Market Area', latitude: 30.713, longitude: 76.695 },
            { name: 'Airport Road, Mohali', latitude: 30.676, longitude: 76.788 },
          ],
          severity: 'HIGH',
          claims: [
            { claim: 'Knee-deep waterlogging in low-lying stretches of Sectors 70, 71', status: 'REPORTED', reasoning: 'Based on resident accounts cited by news' },
            { claim: 'Airport Road has significant water accumulation', status: 'REPORTED', reasoning: 'News report based on commuter accounts' },
            { claim: 'Vehicles getting stuck on Airport Road', status: 'REPORTED', reasoning: 'Commuter reports cited in news' },
            { claim: 'Municipal pumping operations initiated', status: 'REPORTED', reasoning: 'Attributed to MC officials by news' },
          ],
          entities: ['Mohali Municipal Corporation', 'Airport Road', 'Sector 70', 'Sector 71', 'Phase 7'],
          timeReferences: ['Early morning', 'Since morning'],
        }],
        sourceReliability: 'MODERATE',
        sourceReliabilityReason: 'Local news report based on resident and official accounts',
      };
    }

    if (prompt.includes('Community') || prompt.includes('community') || prompt.includes('2 feet deep')) {
      return {
        incidents: [{
          type: 'flooding',
          title: 'Community Report: Flooding Near Sector 70',
          locations: [
            { name: 'Mohali Sector 70, main road', latitude: 30.7046, longitude: 76.7179 },
            { name: 'Phase 7 area', latitude: 30.713, longitude: 76.695 },
          ],
          severity: 'HIGH',
          claims: [
            { claim: 'Water about 2 feet deep on main road near Sector 70', status: 'REPORTED', reasoning: 'First-hand observation by community member' },
            { claim: 'Two cars stuck on the road', status: 'REPORTED', reasoning: 'Visual observation by reporter' },
            { claim: 'Airport Road is still open but barely passable', status: 'UNVERIFIED', reasoning: 'Secondhand report from neighbor, not directly observed' },
            { claim: 'Nallah near Sector 71 overflowing, water entering ground floors', status: 'UNVERIFIED', reasoning: 'Reporter explicitly states this is unverified hearsay from WhatsApp group' },
          ],
          entities: ['Sector 70', 'Phase 7', 'Airport Road', 'Sector 71'],
          timeReferences: ['Around 10:00 AM', '30 minutes ago'],
        }],
        sourceReliability: 'LOW',
        sourceReliabilityReason: 'Unverified community report with mix of first-hand and secondhand information',
      };
    }

    if (prompt.includes('TRAFFIC ADVISORY') || prompt.includes('District Administration')) {
      return {
        incidents: [{
          type: 'traffic',
          title: 'Official Traffic Advisory for Mohali Due to Waterlogging',
          locations: [
            { name: 'Airport Road, Mohali', latitude: 30.676, longitude: 76.788 },
            { name: 'Sector 70-71, Mohali', latitude: 30.7046, longitude: 76.7179 },
            { name: 'Phase 7 Market Area', latitude: 30.713, longitude: 76.695 },
            { name: 'Mohali-Kharar Road', latitude: 30.74, longitude: 76.65 },
          ],
          severity: 'HIGH',
          claims: [
            { claim: 'Airport Road CLOSED for light vehicles due to severe waterlogging', status: 'CONFIRMED', reasoning: 'Official district administration order' },
            { claim: 'Significant waterlogging in Sector 70-71 internal roads', status: 'CONFIRMED', reasoning: 'Acknowledged in official advisory' },
            { claim: 'Phase 7 Market Area has partial waterlogging', status: 'CONFIRMED', reasoning: 'Part of official assessment' },
            { claim: 'Mohali-Kharar Road open but slow-moving traffic', status: 'CONFIRMED', reasoning: 'Official status update' },
            { claim: 'Alternative route: Kharar bypass road for Chandigarh University', status: 'CONFIRMED', reasoning: 'Official recommendation' },
          ],
          entities: ['District Administration SAS Nagar', 'Airport Road', 'Sector 70', 'Sector 71', 'Phase 7', 'Kharar', 'Zirakpur', 'Chandigarh University'],
          timeReferences: ['10:42 AM IST', '02 October 2026'],
        }],
        sourceReliability: 'HIGH',
        sourceReliabilityReason: 'Official district administration traffic advisory',
      };
    }

    // Generic fallback extraction
    return {
      incidents: [{
        type: 'other',
        title: 'Unclassified Report',
        locations: [],
        severity: 'MODERATE',
        claims: [{ claim: 'Source content detected', status: 'UNVERIFIED', reasoning: 'Automated extraction' }],
        entities: [],
        timeReferences: [],
      }],
      sourceReliability: 'LOW',
      sourceReliabilityReason: 'Unable to classify source type',
    };
  }

  getDemoSynthesis() {
    return {
      title: 'Heavy Rainfall and Localized Flooding in Mohali',
      type: 'flooding',
      severity: 'HIGH',
      severityFactors: [
        'Official IMD heavy rainfall warning active',
        '4 independent sources reporting',
        'Official road closure confirmed (Airport Road)',
        'Affects residential areas (Sectors 70, 71)',
        'Ongoing — conditions not yet resolved',
      ],
      status: 'ACTIVE',
      summary: 'Heavy rainfall has caused significant waterlogging across multiple sectors of Mohali, particularly Sectors 70-71 and the Phase 7 area. Airport Road has been officially closed for light vehicles. The IMD warning indicates continued heavy rainfall for the next 12-18 hours. District administration has issued traffic advisories with alternative routes.',
      confirmedFacts: [
        {
          fact: 'IMD has issued heavy rainfall warning for SAS Nagar (Mohali) — 64.5 to 115.5mm expected in 24 hours',
          sources: ['IMD Regional Meteorological Centre'],
          lastUpdated: '2026-10-02T09:00:00+05:30',
        },
        {
          fact: 'Airport Road is CLOSED for light vehicles due to severe waterlogging',
          sources: ['District Administration SAS Nagar'],
          lastUpdated: '2026-10-02T10:42:00+05:30',
        },
        {
          fact: 'Waterlogging confirmed in Sector 70-71 internal roads',
          sources: ['District Administration SAS Nagar', 'Punjab News Express'],
          lastUpdated: '2026-10-02T10:42:00+05:30',
        },
        {
          fact: 'Alternative route via Kharar bypass recommended for Chandigarh University commuters',
          sources: ['District Administration SAS Nagar'],
          lastUpdated: '2026-10-02T10:42:00+05:30',
        },
      ],
      reportedInformation: [
        {
          claim: 'Water approximately 2 feet (knee-deep) on main road near Sector 70',
          source: 'Community Report',
          reportedAt: '2026-10-02T10:05:00+05:30',
        },
        {
          claim: 'Two vehicles stuck on road near Sector 70',
          source: 'Community Report',
          reportedAt: '2026-10-02T10:05:00+05:30',
        },
        {
          claim: 'Municipal pumping operations initiated in worst-affected areas',
          source: 'Punjab News Express',
          reportedAt: '2026-10-02T09:30:00+05:30',
        },
      ],
      uncertainties: [
        {
          item: 'Exact water depth varies across reports — "knee-deep" vs "2 feet" vs "significant accumulation"',
          reason: 'Different observers at different locations/times',
        },
        {
          item: 'Whether nallah (drain) near Sector 71 is actually overflowing',
          reason: 'Only mentioned as unverified hearsay in one community report from a WhatsApp group',
        },
        {
          item: 'Whether water is entering ground floors of houses in Sector 71',
          reason: 'Single unverified community report, no official confirmation',
        },
        {
          item: 'Duration of rainfall — IMD says 12-18 hours but conditions may change',
          reason: 'Weather forecasts are inherently uncertain',
        },
      ],
      conflictingReports: [
        {
          claim: 'Status of Airport Road',
          sourceA: {
            sourceId: 'Community Report',
            says: 'Airport Road is still open but barely passable (neighbor drove through ~30 min before report)',
            time: '2026-10-02T10:05:00+05:30',
          },
          sourceB: {
            sourceId: 'District Administration SAS Nagar',
            says: 'Airport Road CLOSED for light vehicles until further notice',
            time: '2026-10-02T10:42:00+05:30',
          },
          note: 'The official advisory (10:42 AM) is more recent than the community report (10:05 AM). The road may have been passable earlier but was officially closed afterward. The official source is authoritative.',
        },
      ],
      recommendedActions: [
        {
          action: 'Avoid Airport Road — it is officially closed for light vehicles',
          basis: 'District Administration official advisory',
          urgency: 'HIGH',
        },
        {
          action: 'Use Kharar bypass road if traveling towards Chandigarh University',
          basis: 'Official alternative route recommendation',
          urgency: 'HIGH',
        },
        {
          action: 'Avoid non-essential travel in Sectors 70-71 area',
          basis: 'Multiple reports of significant waterlogging',
          urgency: 'HIGH',
        },
        {
          action: 'Check for updates from District Administration SAS Nagar',
          basis: 'Situation is ongoing and conditions may change',
          urgency: 'MODERATE',
        },
        {
          action: 'Keep emergency supplies ready and phone charged',
          basis: 'IMD warning: continued heavy rainfall expected for 12-18 hours',
          urgency: 'MODERATE',
        },
        {
          action: 'Do not cross flooded roads or walk through deep water',
          basis: 'Standard flood safety — IMD advisory',
          urgency: 'HIGH',
        },
      ],
      locations: [
        { name: 'Mohali Sector 70', latitude: 30.7046, longitude: 76.7179 },
        { name: 'Mohali Sector 71', latitude: 30.702, longitude: 76.715 },
        { name: 'Phase 7 Market Area, Mohali', latitude: 30.713, longitude: 76.695 },
        { name: 'Airport Road, Mohali', latitude: 30.676, longitude: 76.788 },
        { name: 'Mohali-Kharar Road', latitude: 30.74, longitude: 76.65 },
      ],
    };
  }

  getDemoContradictions() {
    return {
      contradictions: [
        {
          claim: 'Status of Airport Road',
          sourceA: {
            sourceIndex: 2,
            says: 'Airport Road is still open but barely passable',
            time: '10:05 AM (based on neighbor\'s experience ~30 min earlier)',
          },
          sourceB: {
            sourceIndex: 3,
            says: 'Airport Road CLOSED for light vehicles until further notice',
            time: '10:42 AM',
          },
          note: 'Source B (District Administration) is both more recent and more authoritative. The road status likely changed between the two reports. The community report was secondhand information from a neighbor.',
        },
      ],
      noContradictions: false,
    };
  }

  getDemoPersonalization() {
    return {
      affectedLocations: [
        {
          locationType: 'home',
          locationName: 'Mohali Sector 70',
          impactLevel: 'HIGH',
          explanation: 'Your home area (Sector 70) has confirmed waterlogging with reports of knee-deep water on the main road. Two vehicles have been reported stuck. The district administration has advised avoiding non-essential travel in this area.',
          icon: '🏠',
        },
        {
          locationType: 'college',
          locationName: 'Chandigarh University',
          impactLevel: 'MODERATE',
          explanation: 'Your normal route to college via Airport Road is currently closed. The district administration recommends using the Kharar bypass road instead. Chandigarh University itself has not been reported as directly affected.',
          icon: '🎓',
        },
        {
          locationType: 'route',
          locationName: 'Home → College route',
          impactLevel: 'HIGH',
          explanation: 'Your daily route is significantly disrupted. Airport Road (your likely route) is officially closed for light vehicles. If you must travel to college today, use the Kharar bypass road as recommended by district administration.',
          icon: '🛣️',
        },
      ],
      personalSummary: 'Your home area in Sector 70 has significant waterlogging, and your usual route to Chandigarh University via Airport Road is officially closed. If you need to travel to college, use the Kharar bypass road. Avoid non-essential travel until conditions improve.',
      urgentActions: [
        {
          action: 'Do NOT use Airport Road today — use Kharar bypass if going to college',
          reason: 'Airport Road officially closed; alternative route recommended by district administration',
        },
        {
          action: 'Check with your college if classes are running as normal',
          reason: 'Significant disruptions in the Mohali area may affect college operations',
        },
        {
          action: 'Avoid going out in Sector 70 unless necessary',
          reason: 'Multiple reports of deep waterlogging on your home area roads',
        },
      ],
    };
  }

  getDemoUncertainties() {
    return {
      uncertainItems: [
        {
          item: 'Nallah near Sector 71 overflowing and water entering houses',
          reason: 'This is secondhand information from a WhatsApp group, explicitly described as unverified by the person who reported it',
        },
        {
          item: 'Exact duration of continued rainfall',
          reason: 'IMD says 12-18 hours but weather forecasts carry inherent uncertainty',
        },
      ],
    };
  }

  getDemoDuplicateCheck() {
    return {
      isDuplicate: true,
      confidence: 'HIGH',
      reasoning: 'Both reports describe flooding/waterlogging in the same area (Mohali Sectors 70-71) during the same time period. They share location entities (Sector 70, Airport Road, Phase 7) and describe the same type of event (waterlogging from heavy rainfall).',
      sharedElements: ['Mohali Sector 70', 'Airport Road', 'waterlogging', 'Phase 7'],
    };
  }

  getDemoQueryResponse(prompt) {
    if (prompt.toLowerCase().includes('college') || prompt.toLowerCase().includes('university')) {
      return {
        answer: 'Based on the available sources, Chandigarh University itself has not been directly reported as affected. However, the main route from Mohali (Airport Road) to the university area is officially closed for light vehicles as of 10:42 AM. The district administration has recommended using the Kharar bypass road as an alternative route. There are no reports of waterlogging at or near the university campus itself.',
        sourcesUsed: [3, 4],
        confidence: 'MODERATE',
        caveats: [
          'No direct reports from the university area available — absence of reports does not confirm absence of impact',
          'Road conditions on alternative routes have not been independently verified',
        ],
        unanswerable: false,
      };
    }

    if (prompt.toLowerCase().includes('home') || prompt.toLowerCase().includes('sector 70')) {
      return {
        answer: 'Your home area in Sector 70 is significantly affected. A community member reported approximately 2 feet of water on the main road near Sector 70 as of around 10:00 AM. The district administration has confirmed waterlogging in Sector 70-71 internal roads. Two vehicles were reported stuck. Municipal pumping operations have been initiated but continued rainfall is hampering drainage efforts.',
        sourcesUsed: [2, 3, 4],
        confidence: 'HIGH',
        caveats: [
          'Water depth reports vary between sources and may have changed since last reports',
        ],
        unanswerable: false,
      };
    }

    return {
      answer: 'Based on the available crisis information, the Mohali area is experiencing significant waterlogging due to heavy rainfall. Airport Road is closed for light vehicles. Sectors 70-71 have confirmed waterlogging. Please refer to the situation brief for full details.',
      sourcesUsed: [1, 2, 3, 4],
      confidence: 'MODERATE',
      caveats: ['This is a general answer — ask about specific locations for more targeted information'],
      unanswerable: false,
    };
  }
}

export default DemoAIProvider;
