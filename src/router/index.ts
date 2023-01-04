import { oak } from "../deps.ts";
import accountRouter from "./account.ts";

const router = new oak.Router();

router.use(
  "/account",
  accountRouter.routes(),
  accountRouter.allowedMethods(),
);

export default router;
