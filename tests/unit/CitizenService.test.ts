import { beforeEach, describe, expect, it } from "vitest";
import { CitizenService } from "../../src/services/CitizenService.js";
import { FakeCitizenRepository } from "../fakes/FakeCitizenRepository.js";

describe("CitizenService", () => {
  let repository: FakeCitizenRepository;
  let service: CitizenService;

  beforeEach(() => {
    repository = new FakeCitizenRepository();
    service = new CitizenService(repository);
  });

  describe("create", () => {
    it("deve cadastrar um cidadão com dados normalizados", async () => {
      const citizen = await service.create({
        fullName: "  Maria   da Silva  ",
        cpf: "529.982.247-25",
      });

      expect(citizen).toMatchObject({
        id: 1,
        fullName: "Maria da Silva",
        cpf: "52998224725",
      });
    });

    it("deve rejeitar um nome inválido", async () => {
      await expect(
        service.create({
          fullName: "A",
          cpf: "529.982.247-25",
        }),
      ).rejects.toMatchObject({
        message: "Informe um nome completo válido.",
        statusCode: 400,
      });
    });

    it("deve rejeitar um CPF inválido", async () => {
      await expect(
        service.create({
          fullName: "Maria da Silva",
          cpf: "111.111.111-11",
        }),
      ).rejects.toMatchObject({
        message: "Informe um CPF válido.",
        statusCode: 400,
      });
    });

    it("deve impedir o cadastro de um CPF duplicado", async () => {
      await service.create({
        fullName: "Primeira Pessoa",
        cpf: "529.982.247-25",
      });

      await expect(
        service.create({
          fullName: "Segunda Pessoa",
          cpf: "529.982.247-25",
        }),
      ).rejects.toMatchObject({
        message: "CPF já cadastrado.",
        statusCode: 409,
      });
    });
  });

  describe("search", () => {
    it("deve pesquisar um cidadão pelo CPF formatado", async () => {
      await service.create({
        fullName: "Maria da Silva",
        cpf: "529.982.247-25",
      });

      const citizens = await service.search("529.982.247-25");

      expect(citizens).toHaveLength(1);
      expect(citizens[0]).toMatchObject({
        fullName: "Maria da Silva",
        cpf: "52998224725",
      });
    });

    it("deve pesquisar cidadãos por parte do nome", async () => {
      await service.create({
        fullName: "Maria da Silva",
        cpf: "529.982.247-25",
      });

      await service.create({
        fullName: "Maria Pereira",
        cpf: "168.995.350-09",
      });

      const citizens = await service.search("maria");

      expect(citizens).toHaveLength(2);
    });

    it("deve retornar uma lista vazia quando não encontrar", async () => {
      const citizens = await service.search("Pessoa Inexistente");

      expect(citizens).toEqual([]);
    });

    it("deve rejeitar uma pesquisa vazia", async () => {
      await expect(service.search("   ")).rejects.toMatchObject({
        message: "Informe um CPF ou nome para pesquisar.",
        statusCode: 400,
      });
    });

    it("deve rejeitar uma pesquisa numérica com tamanho inválido", async () => {
      await expect(service.search("123456")).rejects.toMatchObject({
        message: "Informe um CPF com 11 dígitos.",
        statusCode: 400,
      });
    });
  });
});
