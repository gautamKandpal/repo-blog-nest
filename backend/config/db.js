import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDb connected successfully: ${conn.connection.host}`);
  } catch (err) {
    console.log(`MongoDb error: ${err.message} `);
    process.exit(1);
  }
};
export default connectDB;
