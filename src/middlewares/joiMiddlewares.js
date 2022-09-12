import joi from "joi";
import bcrypt from "bcrypt";
import dayjs from "dayjs";

const userSchema = joi.object({
  name: joi.string().required().trim(),
  email: joi.string().email().required().trim(),
  password: joi.string().required(),
});

const logSchema = joi.object({
  description: joi.string().required().trim(),
  user: joi.string().required().trim(),
  value: joi.number().greater(0),
  type: joi.string().required().trim(),
  date: joi.string().required(),
});

async function validateUserSchema(req, res, next) {
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

  res.locals.user = user;
  next();
}

async function validateLogSchema(req, res, next) {
  const { description, value, type } = req.body;
  const user = res.locals.user;
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
  res.locals.log = newLog;
  next();
}

export { validateUserSchema, validateLogSchema };
