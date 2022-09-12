import mongo from "../db/db.js";
import { ObjectId } from "mongodb";

const db = await mongo();

const GetLogs = async (req, res) => {
  const user = res.locals.user;

  try {
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
  const newLog = res.locals.log;
  try {
    await db.collection("logs").insertOne(newLog);

    res.status(201).send(newLog);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

const DeleteLog = async (req, res) => {
  const id = req.params.id;

  if (!id) return res.status(401).send("Requisição inválida");

  try {
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
