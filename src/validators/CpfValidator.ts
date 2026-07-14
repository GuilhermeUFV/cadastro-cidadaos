export class CpfValidator {
  public static normalize(cpf: string): string {
    return cpf.replace(/\D/g, "");
  }

  public static isValid(cpf: string): boolean {
    const normalizedCpf = this.normalize(cpf);

    if (normalizedCpf.length !== 11) {
      return false;
    }

    if (/^(\d)\1{10}$/.test(normalizedCpf)) {
      return false;
    }

    const digits = normalizedCpf.split("").map(Number);

    const firstVerifierDigit = this.calculateVerifierDigit(
      digits.slice(0, 9),
      10,
    );

    if (firstVerifierDigit !== digits[9]) {
      return false;
    }

    const secondVerifierDigit = this.calculateVerifierDigit(
      digits.slice(0, 10),
      11,
    );

    return secondVerifierDigit === digits[10];
  }

  private static calculateVerifierDigit(
    digits: number[],
    initialWeight: number,
  ): number {
    const sum = digits.reduce((total, digit, index) => {
      const weight = initialWeight - index;
      return total + digit * weight;
    }, 0);

    const remainder = sum % 11;

    return remainder < 2 ? 0 : 11 - remainder;
  }
}
