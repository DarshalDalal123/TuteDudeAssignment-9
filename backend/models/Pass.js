const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PassSchema = new Schema({
  appointmentId: {
    type: Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true,
  },
  qrCodeData: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'cancelled'],
    default: 'active',
  },
  validFrom: {
    type: Date,
    required: true,
  },
  validTo: {
    type: Date,
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Pass', PassSchema);