import mongoose from "mongoose";
import _config from "./secrets";

export const connectDb = () => mongoose.connect(_config.mongo_url!)
  .then(() => console.log('Connected to MongoDB', ))
  .catch(err => console.error('MongoDB connection error: ', err, _config.mongo_url));
  