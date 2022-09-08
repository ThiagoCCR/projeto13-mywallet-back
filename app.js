import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import joi from "joi";
import { v4 as uuid } from "uuid";
import dayjs from "dayjs";
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

app.post("/sign-up", async (req, res) => {
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
    console.log(error);
    res.sendStatus(500);
  }
});

app.post("/sign-in", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db.collection("users").findOne({ email: email });

    if (user && bcrypt.compareSync(password, user.password)) {
      const token = uuid();
      await db.collection("sessions").insertOne({
        userId: user._id,
        token,
      });
      res.status(200).send(token);
    } else {
      return res.status(404).send("Senha ou e-mail incorretos");
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get("/logs", async (req, res) => {
  const authorization = req.headers.authorization;
  const token = authorization?.replace("Bearer ", "");

  if (!token) return res.status(401).send("Acesso não autorizado");

  try {
    const session = await db.collection("sessions").findOne({ token });

    if (!session) return res.status(409).send("Sessão não encontrada");

    const user = await db.collection("users").findOne({
      _id: session.userId,
    });

    if (!user) return res.status(404).send("Usuário não encontrado");

    const logs = await db
      .collection("logs")
      .find({ name: user.name })
      .toArray();

    res.status(200).send(logs);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }

});

//postar logs COM DATA

app.listen(5000, () => {
  console.log("Listening on Port 5000");
});

db.logs.find({ name: "Thiago" }).toArray().pretty();
