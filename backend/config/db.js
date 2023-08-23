//mongoose is object modeling (object data mapper) for node.js
import mongoose from "mongoose"

//asyncronous because it's gonna return a promise
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch ( error) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
 };

 export default connectDB;