import mongo from "../db/db";

async function hasUser(req, res, next) {
  const authorization = req.headers.authorization;
  const token = authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).send("Autorização enviada incorreta");

  try {
    let db = await mongo();

    const session = await db.collection("sessions").findOne({ token });
    if (!session) return res.status(409).send("Sessão não encontrada");

    const user = await db.collection("users").findOne({
      _id: session.userId,
    });
    if (!user) return res.status(404).send("Usuário não encontrado");

    res.locals.user = user;

    next();
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
}

export default hasUser;
