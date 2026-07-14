import type {
  NextFunction,
  Request,
  Response,
} from "express";
import { AppError } from "../errors/AppError.js";

function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  );
}

export function errorHandler(
  error: unknown,
  _request: Request,
  response: Response,
  _next: NextFunction,
): Response {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      message: error.message,
    });
  }

  if (isUniqueConstraintError(error)) {
    return response.status(409).json({
      message: "CPF já cadastrado.",
    });
  }

  console.error(error);

  return response.status(500).json({
    message: "Ocorreu um erro interno no servidor.",
  });
}
