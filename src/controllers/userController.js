import mongo from "../db/db.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

const db = await mongo();

const SignUp = async (req, res) => {
  const { name, email, password } = res.locals.user;

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

    await db.collection("users").insertOne({ name, email, password });

    res.status(201).send("Usuário Cadastrado com sucesso!");
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

const SignIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db.collection("users").findOne({ email: email });

    if (user && bcrypt.compareSync(password, user.password)) {
      const token = uuid();
      await db.collection("sessions").insertOne({
        userId: user._id,
        token,
      });
      const delivery = { token, name: user.name };
      res.status(200).send(delivery);
    } else {
      return res.status(404).send("Senha ou e-mail incorretos");
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

export { SignIn, SignUp };
