import { oak } from "../deps.ts";
import accountRouter from "./account.ts";
import friendRouter from "./friend.ts";
import friendRequestRouter from "./friend_request.ts";

const router = new oak.Router();

router.use(
  "/account",
  accountRouter.routes(),
  accountRouter.allowedMethods(),
);

router.use(
  "/friend",
  friendRouter.routes(),
  friendRouter.allowedMethods(),
);

router.use(
  "/friend_request",
  friendRequestRouter.routes(),
  friendRequestRouter.allowedMethods(),
);

export default router;
