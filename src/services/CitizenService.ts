import { AppError } from "../errors/AppError.js";
import { CitizenRepository } from "../repositories/CitizenRepository.js";
import { CpfValidator } from "../validators/CpfValidator.js";

export interface CreateCitizenInput {
  fullName: unknown;
  cpf: unknown;
}

export class CitizenService {
  constructor(
    private readonly citizenRepository = new CitizenRepository(),
  ) {}

  public async create(input: CreateCitizenInput) {
    const fullName = this.normalizeFullName(input.fullName);
    const cpf = this.validateAndNormalizeCpf(input.cpf);

    const citizenAlreadyExists =
      await this.citizenRepository.findByCpf(cpf);

    if (citizenAlreadyExists) {
      throw new AppError("CPF já cadastrado.", 409);
    }

    return this.citizenRepository.create({
      fullName,
      cpf,
    });
  }

  public async search(query: unknown) {
    if (typeof query !== "string" || query.trim() === "") {
      throw new AppError(
        "Informe um CPF ou nome para pesquisar.",
        400,
      );
    }

    const normalizedQuery = query.trim().replace(/\s+/g, " ");
    const looksLikeCpf = /^[\d.\-\s]+$/.test(normalizedQuery);

    if (looksLikeCpf) {
      const cpf = CpfValidator.normalize(normalizedQuery);

      if (cpf.length !== 11) {
        throw new AppError(
          "Informe um CPF com 11 dígitos.",
          400,
        );
      }

      const citizen = await this.citizenRepository.findByCpf(cpf);

      return citizen ? [citizen] : [];
    }

    return this.citizenRepository.findByName(normalizedQuery);
  }

  private normalizeFullName(value: unknown): string {
    if (typeof value !== "string") {
      throw new AppError("O nome completo é obrigatório.", 400);
    }

    const normalizedName = value.trim().replace(/\s+/g, " ");

    if (normalizedName.length < 3) {
      throw new AppError(
        "Informe um nome completo válido.",
        400,
      );
    }

    return normalizedName;
  }

  private validateAndNormalizeCpf(value: unknown): string {
    if (typeof value !== "string" || value.trim() === "") {
      throw new AppError("O CPF é obrigatório.", 400);
    }

    if (!CpfValidator.isValid(value)) {
      throw new AppError("Informe um CPF válido.", 400);
    }

    return CpfValidator.normalize(value);
  }
}
