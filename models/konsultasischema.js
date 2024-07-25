const mongoose = require('mongoose');

const konsultasiSchema = new mongoose.Schema({
    id_konsultasi: { type: Number, required: true, unique: true },
    id_pasien: { type: Number, required: true, ref: 'Pasien' },
    id_dokter: { type: Number, required: true, ref: 'Dokter' },
    tanggal_konsultasi: { type: Date, required: true },
    jam_konsultasi: { type: String, required: true },
    diagnosis: { type: String, required: true },
    resep: { type: String, required: true }
});

const Konsultasi = mongoose.model('Konsultasi', konsultasiSchema);
module.exports = Konsultasi;
