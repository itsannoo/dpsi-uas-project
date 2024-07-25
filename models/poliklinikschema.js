const mongoose = require('mongoose');

const poliklinikSchema = new mongoose.Schema({
    id_poliklinik: { type: Number, required: true, unique: true },
    nama: { type: String, required: true },
    jam_buka: { type: String, required: true }
});

const Poliklinik = mongoose.model('Poliklinik', poliklinikSchema);
module.exports = Poliklinik;
