import express from "express";
import path from "node:path";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import { citizenRoutes } from "./routes/citizenRoutes.js";

export class App {
  public readonly express = express();

  constructor() {
    this.configureApplication();
    this.configureMiddlewares();
    this.configureRoutes();
    this.configureErrorHandling();
  }

  private configureApplication(): void {
    this.express.disable("x-powered-by");
  }

  private configureMiddlewares(): void {
    this.express.use(express.json());

    this.express.use(
      express.static(path.join(process.cwd(), "public")),
    );
  }

  private configureRoutes(): void {
    this.express.get("/health", (_request, response) => {
      response.status(200).json({
        status: "ok",
        message: "Servidor funcionando",
      });
    });

    this.express.use("/api/citizens", citizenRoutes);
  }

  private configureErrorHandling(): void {
    this.express.use(notFoundHandler);
    this.express.use(errorHandler);
  }
}
