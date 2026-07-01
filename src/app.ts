import express from "express";

export class App {
  public readonly express = express();

  constructor() {
    this.configureMiddlewares();
    this.configureRoutes();
  }

  private configureMiddlewares(): void {
    this.express.use(express.json());
  }

  private configureRoutes(): void {
    this.express.get("/health", (_request, response) => {
      response.status(200).json({
        status: "ok",
        message: "Servidor funcionando",
      });
    });
  }
}
