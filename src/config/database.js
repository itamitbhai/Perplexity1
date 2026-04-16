import mongoose from "mongoose"

const connectDB = async () => {
    const mongo = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB is Connected : ${mongo.connection.host} `);
};

export default connectDB;