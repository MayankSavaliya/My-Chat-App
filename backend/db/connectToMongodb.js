import mongoose from 'mongoose';
export default async function connectToMongodb(){
  try{
    await mongoose.connect(process.env.MONGO_DB_URI);
    console.log("Mongodb connection successful");
  }catch(err){
    console.log("Error connecting to mongodb");
  }
}
