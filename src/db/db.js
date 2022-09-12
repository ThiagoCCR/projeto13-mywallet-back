import { MongoClient } from "mongodb";
import { MONGO_URI } from "../configs/constants.js";

// import * as dotenv from "dotenv";
// dotenv.config();
//const mongoClient = new MongoClient(process.env.MONGO_URI);

const mongoClient = new MongoClient(MONGO_URI);

export default async function mongo() {
  let connect;

  try {
    connect = await mongoClient.db("MyWallet_API");
    return connect;
  } catch (error) {
    console.error(error);
    return error;
  }
}
