import { prisma } from "../database/prisma.js";

export interface CitizenRecord {
  id: number;
  fullName: string;
  cpf: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCitizenData {
  fullName: string;
  cpf: string;
}

export interface CitizenRepositoryContract {
  create(data: CreateCitizenData): Promise<CitizenRecord>;
  findByCpf(cpf: string): Promise<CitizenRecord | null>;
  findByName(name: string): Promise<CitizenRecord[]>;
}

export class CitizenRepository
  implements CitizenRepositoryContract
{
  public async create(
    data: CreateCitizenData,
  ): Promise<CitizenRecord> {
    return prisma.citizen.create({
      data,
    });
  }

  public async findByCpf(
    cpf: string,
  ): Promise<CitizenRecord | null> {
    return prisma.citizen.findUnique({
      where: {
        cpf,
      },
    });
  }

  public async findByName(
    name: string,
  ): Promise<CitizenRecord[]> {
    return prisma.citizen.findMany({
      where: {
        fullName: {
          contains: name,
        },
      },
      orderBy: {
        fullName: "asc",
      },
    });
  }
}
