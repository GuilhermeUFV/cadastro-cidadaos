import type {
  CitizenRecord,
  CitizenRepositoryContract,
  CreateCitizenData,
} from "../../src/repositories/CitizenRepository.js";

export class FakeCitizenRepository
  implements CitizenRepositoryContract
{
  private readonly citizens: CitizenRecord[] = [];

  public async create(
    data: CreateCitizenData,
  ): Promise<CitizenRecord> {
    const now = new Date();

    const citizen: CitizenRecord = {
      id: this.citizens.length + 1,
      fullName: data.fullName,
      cpf: data.cpf,
      createdAt: now,
      updatedAt: now,
    };

    this.citizens.push(citizen);

    return citizen;
  }

  public async findByCpf(
    cpf: string,
  ): Promise<CitizenRecord | null> {
    return (
      this.citizens.find((citizen) => citizen.cpf === cpf) ??
      null
    );
  }

  public async findByName(
    name: string,
  ): Promise<CitizenRecord[]> {
    const normalizedName = name.toLocaleLowerCase("pt-BR");

    return this.citizens
      .filter((citizen) =>
        citizen.fullName
          .toLocaleLowerCase("pt-BR")
          .includes(normalizedName),
      )
      .sort((first, second) =>
        first.fullName.localeCompare(second.fullName, "pt-BR"),
      );
  }
}
