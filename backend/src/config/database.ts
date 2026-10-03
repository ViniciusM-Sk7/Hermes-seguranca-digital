import mongoose from "mongoose";

export async function connectDatabase(): Promise<void> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI não foi definida no arquivo .env");
  }

  await mongoose.connect(uri);

  console.log("MongoDB conectado!");
}
