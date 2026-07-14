import type { Request, Response } from "express";
import { CitizenService } from "../services/CitizenService.js";

export class CitizenController {
  constructor(
    private readonly citizenService = new CitizenService(),
  ) {}

  public create = async (
    request: Request,
    response: Response,
  ): Promise<Response> => {
    const citizen = await this.citizenService.create({
      fullName: request.body.fullName,
      cpf: request.body.cpf,
    });

    return response.status(201).json({
      message: "Cidadão cadastrado com sucesso.",
      citizen: {
        id: citizen.id,
        fullName: citizen.fullName,
        cpf: citizen.cpf,
      },
    });
  };
}
