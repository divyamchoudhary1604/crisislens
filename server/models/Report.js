import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  type: { 
    type: String, 
    enum: ['flooding', 'storm', 'earthquake', 'fire', 'traffic', 'infrastructure', 'health', 'security', 'other'],
    default: 'other' 
  },
  location: {
    name: { type: String, required: true },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
  },
  description: { type: String, required: true },
  imageUrl: { type: String, default: null },
  status: { 
    type: String, 
    enum: ['UNVERIFIED', 'REVIEWING', 'LINKED', 'DISMISSED'],
    default: 'UNVERIFIED' 
  },
  linkedIncidentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Incident', default: null },
  isDemo: { type: Boolean, default: false },
}, { timestamps: true });

reportSchema.index({ status: 1 });
reportSchema.index({ isDemo: 1 });

const Report = mongoose.models.Report || mongoose.model('Report', reportSchema);

export default Report;
