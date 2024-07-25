const mongoose = require('mongoose');

const antreanSchema = new mongoose.Schema({
    id_antrean: { type: Number, required: true, unique: true },
    id_pasien: { type: Number, required: true, ref: 'Pasien' },
    id_poliklinik: { type: Number, required: true, ref: 'Poliklinik' },
    tanggal_pemeriksaan: { type: Date, required: true },
    nomor_antrean: { type: Number, required: true },
    perkiraan_waktu_tunggu: { type: String, required: true }
});

const Antrean = mongoose.model('Antrean', antreanSchema);
module.exports = Antrean;
