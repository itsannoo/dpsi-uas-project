const { MongoClient } = require('mongodb');

// URL koneksi MongoDB Atlas
const url = 'mongodb+srv://IlhamZul:ALST3vUl6e0QkPua@cluster0.lptggxk.mongodb.net/anna?retryWrites=true&w=majority&appName=Cluster0';

// Nama database yang ingin Anda gunakan
const dbName = 'dpsi_project';

// Buat instans MongoClient
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

let db;

async function main() {
    try {
        // Hubungkan ke server MongoDB
        await client.connect();
        console.log('Terhubung ke server MongoDB');

        // Dapatkan referensi ke database
        db = client.db(dbName);
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
        throw err; // Ensure the error is thrown if connection fails
    }
}

const getDb = () => db;

module.exports = { main, getDb };
