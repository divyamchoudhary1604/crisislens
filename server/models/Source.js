import mongoose from 'mongoose';

const sourceSchema = new mongoose.Schema({
  demoId: { type: String, default: null },  // Maps demo string IDs (e.g. 'demo-src-1') to this document
  title: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['OFFICIAL', 'NEWS', 'COMMUNITY', 'WEATHER_SERVICE', 'SOCIAL'],
    default: 'NEWS' 
  },
  publisher: { type: String, default: '' },
  url: { type: String, default: '' },
  rawContent: { type: String, default: '' },
  cleanedContent: { type: String, default: '' },
  embedding: { type: [Number], default: [] },
  incidentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Incident', default: null },
  publishedAt: { type: Date, default: Date.now },
  retrievedAt: { type: Date, default: Date.now },
  isDemo: { type: Boolean, default: false },
  metadata: {
    searchQuery: { type: String, default: '' },
    serpApiResultIndex: { type: Number, default: null },
  },
}, { timestamps: true });

sourceSchema.index({ incidentId: 1 });
sourceSchema.index({ type: 1 });
sourceSchema.index({ isDemo: 1 });
sourceSchema.index({ demoId: 1 }, { sparse: true });

const Source = mongoose.models.Source || mongoose.model('Source', sourceSchema);

export default Source;
