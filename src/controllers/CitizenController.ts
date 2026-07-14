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

  public search = async (
    request: Request,
    response: Response,
  ): Promise<Response> => {
    const citizens = await this.citizenService.search(
      request.query.query,
    );

    if (citizens.length === 0) {
      return response.status(404).json({
        message: "Cidadão não encontrado",
      });
    }

    return response.status(200).json({
      citizens: citizens.map((citizen) => ({
        id: citizen.id,
        fullName: citizen.fullName,
        cpf: citizen.cpf,
      })),
    });
  };
}
