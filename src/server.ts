import { App } from "./app.js";

const port = Number(process.env.PORT) || 3000;
const app = new App();

app.express.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
