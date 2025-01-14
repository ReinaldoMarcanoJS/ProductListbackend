import express from "express";
import productosRouter from "./routes/products.routes";
import usersRouter from "./routes/users.routes"
const app = express();
const port = 3001;

app.use(express.json());
app.use("/api/products", productosRouter);
app.use("/api/users", usersRouter);

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
