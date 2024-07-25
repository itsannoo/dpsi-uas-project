const express = require('express');
const { main, getDb } = require('./models/index'); // Adjust the path as needed
const dokterRoutes = require('./routes/dokter');
const antreanRoutes = require('./routes/antrean');
const konsultasiRoutes = require('./routes/konsultasi');
const pasienRoutes = require('./routes/pasien');
const poliklinikRoutes = require('./routes/poliklinik');
const authRoutes = require('./routes/auth');

const app = express();

// Middleware untuk parsing JSON
app.use(express.json());

// Start the server after MongoDB connection is established
async function startServer() {
    try {
        await main(); // Connect to MongoDB
        const db = getDb();

        // Pass the db reference to routes
        app.use((req, res, next) => {
            req.db = db;
            next();
        });

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
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1); // Exit the process if the connection fails
    }
}

startServer();

module.exports = app;
