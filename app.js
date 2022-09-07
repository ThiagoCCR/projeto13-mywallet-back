import express from "express";
import cors from "cors";
import { MongoClient, MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import joi from "joi";
import bcrypt from "bcrypt";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;
mongoClient.connect().then(() => {
  db = mongoClient.db("MyWallet_API");
});

//validação JOI

//SIGN-IN

//SIGN-UP

//GET LOGS

//POST LOG

app.listen(5000, () => {
  console.log("Listening on Port 5000");
});
