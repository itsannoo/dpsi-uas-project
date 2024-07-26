const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'dokter', 'pasien'],
    required: true
  }
}, {
  collection: 'users', // Nama koleksi di database
  timestamps: true
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
