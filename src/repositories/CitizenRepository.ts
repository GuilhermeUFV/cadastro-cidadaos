import { prisma } from "../database/prisma.js";

export interface CreateCitizenData {
  fullName: string;
  cpf: string;
}

export class CitizenRepository {
  public async create(data: CreateCitizenData) {
    return prisma.citizen.create({
      data,
    });
  }

  public async findByCpf(cpf: string) {
    return prisma.citizen.findUnique({
      where: {
        cpf,
      },
    });
  }
}
