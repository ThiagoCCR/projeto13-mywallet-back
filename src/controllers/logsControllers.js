import mongo from "../db/db.js";
import joi from "joi";
import dayjs from "dayjs";
import { ObjectId } from "mongodb";

const db = await mongo();

const logSchema = joi.object({
  description: joi.string().required().trim(),
  user: joi.string().required().trim(),
  value: joi.number().greater(0),
  type: joi.string().required().trim(),
  date: joi.string().required(),
});

const GetLogs = async (req, res) => {
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
      .find({ user: user.name })
      .toArray();

    res.status(200).send(logs);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

const CreateLog = async (req, res) => {
  const authorization = req.headers.authorization;
  const token = authorization?.replace("Bearer ", "");
  const { description, value, type } = req.body;

  if (!token) return res.status(401).send("Acesso não autorizado");

  try {
    const session = await db.collection("sessions").findOne({ token });
    if (!session) return res.status(409).send("Sessão não encontrada");

    const user = await db.collection("users").findOne({
      _id: session.userId,
    });
    if (!user) return res.status(404).send("Usuário não encontrado");

    const newLog = {
      description,
      value,
      user: user.name,
      type,
      date: dayjs().format("DD/MM"),
    };
    const validation = logSchema.validate(newLog, {
      abortEarly: false,
    });

    if (validation.error) {
      return res
        .status(422)
        .send(validation.error.details.map((res) => res.message));
    }

    await db.collection("logs").insertOne(newLog);

    res.status(201).send(newLog);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

const DeleteLog = async (req, res) => {
  const authorization = req.headers.authorization;
  const token = authorization?.replace("Bearer ", "");
  const id = req.params.id;

  if (!token) return res.status(401).send("Acesso não autorizado");
  if (!id) return res.status(401).send("Requisição inválida");

  try {
    const session = await db.collection("sessions").findOne({ token });
    if (!session) return res.status(409).send("Sessão não encontrada");

    const log = await db.collection("logs").findOne({ _id: ObjectId(id) });
    if (!log) return res.status(404).send("Log não encontrado");

    await db.collection("logs").deleteOne(log);

    res.status(200).send("Log deletado com sucesso!");
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

export { GetLogs, CreateLog, DeleteLog };
