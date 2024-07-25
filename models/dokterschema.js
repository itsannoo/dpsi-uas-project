const mongoose = require('mongoose');

const dokterSchema = new mongoose.Schema({
    id_dokter: { type: Number, required: true, unique: true },
    nama_dokter: { type: String, required: true },
    spesialisasi: { type: String, required: true },
    jam_konsultasi: { type: String, required: true },
    id_bank: { type: Number, required: true }
});

const Dokter = mongoose.model('Dokter', dokterSchema);
module.exports = Dokter;
