import mongoose from "mongoose";
import dotnenv from "dotenv";
dotnenv.config({ path: "./.env" });

// mongodb connection with mongoose
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("mongodb connection is successful"))
  .catch((err) => console.error(err));
