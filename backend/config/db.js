import mongoose from 'mongoose';

export default async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ Erro ao conectar no MongoDB: ${err.message}`);
    process.exit(1);
  }
}
