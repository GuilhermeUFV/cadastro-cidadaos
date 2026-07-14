import { describe, expect, it } from "vitest";
import { CpfValidator } from "../../src/validators/CpfValidator.js";

describe("CpfValidator", () => {
  describe("normalize", () => {
    it("deve remover pontos e traço do CPF", () => {
      const result = CpfValidator.normalize("529.982.247-25");

      expect(result).toBe("52998224725");
    });
  });

  describe("isValid", () => {
    it("deve aceitar um CPF válido sem formatação", () => {
      expect(CpfValidator.isValid("52998224725")).toBe(true);
    });

    it("deve aceitar um CPF válido com formatação", () => {
      expect(CpfValidator.isValid("529.982.247-25")).toBe(true);
    });

    it("deve rejeitar um CPF com dígitos verificadores inválidos", () => {
      expect(CpfValidator.isValid("529.982.247-24")).toBe(false);
    });

    it("deve rejeitar um CPF com menos de 11 dígitos", () => {
      expect(CpfValidator.isValid("123456789")).toBe(false);
    });

    it("deve rejeitar um CPF com todos os dígitos iguais", () => {
      expect(CpfValidator.isValid("111.111.111-11")).toBe(false);
    });

    it("deve rejeitar uma string vazia", () => {
      expect(CpfValidator.isValid("")).toBe(false);
    });
  });
});
