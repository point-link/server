import { oak } from "../deps.ts";
import accountDao from "../db/dao/account.ts";
import { generateSaltedPassword } from "../util/auth.ts";

const router = new oak.Router();

router.get("/", async (ctx) => {
  const { saltedPassword, salt } = await generateSaltedPassword(
    "this-is-a-password",
  );
  accountDao.insertOne({
    username: "test_user",
    password: saltedPassword,
    salt,
  });
  ctx.response.body = "ok";
});

export default router;
