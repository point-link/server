import app from "./app.ts";
import output from "./util/output.ts";

const port = 80;

app.listen({ port });
output.info(`Listening on port ${port}...`);
