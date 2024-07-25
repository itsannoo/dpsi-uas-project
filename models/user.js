const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id_user: { type: Number, required: true, unique: true },
    nama: { type: String, required: true },
    alamat: { type: String, required: true },
    nomor_telepon: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    id_bank: { type: Number, required: true },
    role: { type: String, required: true, enum: ['admin', 'staff', 'dokter'] }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
