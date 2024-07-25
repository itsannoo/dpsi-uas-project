const mongoose = require('mongoose');

const pasienSchema = new mongoose.Schema({
    id_pasien: { type: Number, required: true, unique: true },
    nama_pasien: { type: String, required: true },
    alamat: { type: String, required: true },
    nomor_telepon: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    id_bank: { type: Number, required: true }
});

const Pasien = mongoose.model('Pasien', pasienSchema);
module.exports = Pasien;
