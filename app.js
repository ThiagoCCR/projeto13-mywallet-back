import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import joi from "joi";
import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

//mongodb
const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;
mongoClient.connect().then(() => {
  db = mongoClient.db("MyWallet_API");
});

//joi
const userSchema = joi.object({
  name: joi.string().required().trim(),
  email: joi.string().email().required().trim(),
  password: joi.string().required(),
});

app.post("/cadastro", async (req, res) => {
  const { name, email, password } = req.body;
  const hashPassword = bcrypt.hashSync(password, 10);
  const user = { name, email, password: hashPassword };

  const validation = userSchema.validate(user, {
    abortEarly: false,
  });

  if (validation.error) {
    return res
      .status(422)
      .send(validation.error.details.map((res) => res.message));
  }

  try {
    const registeredName = await db.collection("users").findOne({ name: name });
    const registeredEmail = await db
      .collection("users")
      .findOne({ email: email });

    if (registeredEmail) {
      return res
        .status(409)
        .send("Já existe um usuário registrado com esse e-mail!");
    }
    if (registeredName) {
      return res
        .status(409)
        .send("Já existe um usuário registrado com esse nome!");
    }

    await db.collection("users").insertOne(user);

    res.status(201).send("Usuário Cadastrado com sucesso!");
  } catch (error) {
    res.sendStatus(500);
  }
});

app.post("/cadastro", async (req, res) => {});


app.listen(5000, () => {
  console.log("Listening on Port 5000");
});
