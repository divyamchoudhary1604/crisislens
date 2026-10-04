import mongoose from 'mongoose';

const sourceReferenceSchema = new mongoose.Schema({
  sourceId: { type: String },
  name: { type: String },
}, { _id: false });

const confirmedFactSchema = new mongoose.Schema({
  fact: { type: String, required: true },
  sources: [String],
  lastUpdated: { type: Date, default: Date.now },
}, { _id: false });

const reportedInfoSchema = new mongoose.Schema({
  claim: { type: String, required: true },
  source: { type: String },
  reportedAt: { type: Date, default: Date.now },
}, { _id: false });

const uncertaintySchema = new mongoose.Schema({
  item: { type: String, required: true },
  reason: { type: String, default: '' },
}, { _id: false });

const conflictSchema = new mongoose.Schema({
  claim: { type: String, required: true },
  sourceA: {
    sourceId: String,
    says: String,
    time: Date,
  },
  sourceB: {
    sourceId: String,
    says: String,
    time: Date,
  },
  note: { type: String, default: '' },
}, { _id: false });

const actionSchema = new mongoose.Schema({
  action: { type: String, required: true },
  basis: { type: String, default: '' },
  urgency: { 
    type: String, 
    enum: ['LOW', 'MODERATE', 'HIGH'],
    default: 'MODERATE' 
  },
}, { _id: false });

const incidentLocationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  latitude: { type: Number, default: null },
  longitude: { type: Number, default: null },
  radius: { type: String, default: null },
}, { _id: false });

const incidentSchema = new mongoose.Schema({
  demoId: { type: String, default: null },  // Maps demo string IDs (e.g. 'demo-incident-1') to this document
  title: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['flooding', 'storm', 'earthquake', 'fire', 'traffic', 'infrastructure', 'health', 'security', 'other'],
    default: 'other' 
  },
  severity: { 
    type: String, 
    enum: ['LOW', 'MODERATE', 'HIGH', 'CRITICAL'],
    default: 'MODERATE' 
  },
  severityFactors: [String],
  status: { 
    type: String, 
    enum: ['ACTIVE', 'MONITORING', 'RESOLVED', 'UNKNOWN'],
    default: 'ACTIVE' 
  },
  locations: [incidentLocationSchema],
  affectedUserLocations: [String],
  summary: { type: String, default: '' },
  confirmedFacts: [confirmedFactSchema],
  reportedInformation: [reportedInfoSchema],
  uncertainties: [uncertaintySchema],
  conflictingReports: [conflictSchema],
  recommendedActions: [actionSchema],
  sourceIds: [String],
  isDemo: { type: Boolean, default: false },
}, { timestamps: true });

// Index for geo queries and filtering
incidentSchema.index({ status: 1, severity: 1 });
incidentSchema.index({ 'locations.latitude': 1, 'locations.longitude': 1 });
incidentSchema.index({ isDemo: 1 });
incidentSchema.index({ demoId: 1 }, { sparse: true });

const Incident = mongoose.models.Incident || mongoose.model('Incident', incidentSchema);

export default Incident;
