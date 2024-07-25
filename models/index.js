const { MongoClient } = require('mongodb');

// URL koneksi MongoDB. Jika MongoDB berjalan di mesin lokal pada port default, gunakan URL berikut
const url = 'mongodb+srv://IlhamZul:ALST3vUl6e0QkPua@cluster0.lptggxk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

// Nama database yang ingin Anda gunakan
const dbName = 'dpsi_project';

// Buat instans MongoClient
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

async function main() {
    try {
        // Hubungkan ke server MongoDB
        await client.connect();
        console.log('Terhubung ke server MongoDB');

        // Dapatkan referensi ke database
        const db = client.db(dbName);

        // Tambahkan logika Anda di sini
        const collection = db.collection('documents');

        // Contoh operasi: Insert satu dokumen
        const insertResult = await collection.insertOne({ name: 'Alice', age: 25 });
        console.log('Insert Result:', insertResult);

        // Contoh operasi: Cari dokumen
        const findResult = await collection.find({}).toArray();
        console.log('Find Result:', findResult);
    } catch (err) {
        console.error(err);
    } finally {
        // Tutup koneksi
        await client.close();
    }
}

main().catch(console.error);
