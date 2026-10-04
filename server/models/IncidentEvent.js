import mongoose from 'mongoose';

const incidentEventSchema = new mongoose.Schema({
  incidentId: { type: mongoose.Schema.Types.Mixed, required: true },  // ObjectId or demo string ID
  type: { 
    type: String, 
    enum: [
      'SOURCE_ADDED', 
      'STATUS_CHANGED', 
      'SEVERITY_CHANGED', 
      'REPORTS_MERGED', 
      'CONTRADICTION_DETECTED', 
      'ANALYSIS_UPDATED',
      'COMMUNITY_REPORT',
      'CREATED'
    ],
    required: true 
  },
  description: { type: String, required: true },
  sourceId: { type: String, default: null },
  isDemo: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
});

incidentEventSchema.index({ incidentId: 1, timestamp: -1 });

const IncidentEvent = mongoose.models.IncidentEvent || mongoose.model('IncidentEvent', incidentEventSchema);

export default IncidentEvent;
