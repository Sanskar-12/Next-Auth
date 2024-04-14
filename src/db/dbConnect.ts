import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const { connection } = await mongoose.connect(
      String(process.env.MONGO_URI)
    );
    console.log(`MongoDb connected to ${connection.host}`);
  } catch (error) {
    console.log(error);
  }
};

export default connectDb;
