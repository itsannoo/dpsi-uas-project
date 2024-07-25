const express = require('express');
const app = express();
const dokterRoutes = require('./routes/dokter');
const antreanRoutes = require('./routes/antrean');
const konsultasiRoutes = require('./routes/konsultasi');
const pasienRoutes = require('./routes/pasien');
const poliklinikRoutes = require('./routes/poliklinik');
const authRoutes = require('./routes/auth');

// Middleware untuk parsing JSON
app.use(express.json());


// Route untuk root URL
app.get('/', (req, res) => {
    res.send('Selamat datang di API Anna Maulina');
});

// Menggunakan routes
app.use('/dokter', dokterRoutes);
app.use('/antrean', antreanRoutes);
app.use('/konsultasi', konsultasiRoutes);
app.use('/pasien', pasienRoutes);
app.use('/poliklinik', poliklinikRoutes);
app.use('/auth', authRoutes);

// Menjalankan server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
