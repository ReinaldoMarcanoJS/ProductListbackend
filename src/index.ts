import express from "express";
import productosRouter from "./routes/products.routes";
import usersRouter from "./routes/users.routes"
import bodyParser from "body-parser";
import cors from "cors"
const app = express();
const port = 3001;

app.use(bodyParser.json())
app.use(cors())
app.use("/api/products", productosRouter);
app.use("/api/auth", usersRouter);

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
