const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CheckLogsSchema = new Schema({
  passId: {
    type: Schema.Types.ObjectId,
    ref: 'Pass',
    required: true,
  },
  securityId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  checkInTime: {
    type: Date,
    default: null,
  },
  checkOutTime: {
    type: Date,
    default: null,
  }
}, { timestamps: true });

module.exports = mongoose.model('CheckLogs', CheckLogsSchema);