import mongoose from "mongoose";
// lib/mongoose.js
const { MONGO_URI } = process.env

const connection = {};

async function connectToDatabase() {
  if (connection.isConnected) {
    // Koneksi sudah ada, gunakan yang sudah ada
    return console.log('Has connected to database')
  }

  // Menghubungkan ke MongoDB
  const db = await mongoose.connect(MONGO_URI);

  connection.isConnected = db.connections[0].readyState;
  console.log('connected to database')
}

export default connectToDatabase;
