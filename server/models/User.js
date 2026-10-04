import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  label: { type: String, default: '' },
  type: { 
    type: String, 
    enum: ['home', 'college', 'work', 'other'],
    required: true 
  },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, default: '' },
  preferredLanguage: { type: String, default: 'en' },
  locations: [locationSchema],
  route: {
    from: { type: String, default: '' },
    to: { type: String, default: '' },
    waypoints: [{
      lat: Number,
      lng: Number,
    }],
  },
  emergencyContacts: [{
    name: String,
    phone: String,
  }],
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
export { userSchema, locationSchema };
