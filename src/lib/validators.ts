
// Removes common characters from CPF/CNPJ
const clean = (value: string): string => {
  return value.replace(/[.\-/]/g, '');
};

export function validateCpf(cpf: string): boolean {
  cpf = clean(cpf);

  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false;
  }

  let sum = 0;
  let remainder: number;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpf.substring(i - 1, i), 10) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }
  if (remainder !== parseInt(cpf.substring(9, 10), 10)) {
    return false;
  }

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cpf.substring(i - 1, i), 10) * (12 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }
  if (remainder !== parseInt(cpf.substring(10, 11), 10)) {
    return false;
  }

  return true;
}

export function validateCnpj(cnpj: string): boolean {
  cnpj = clean(cnpj);

  if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) {
    return false;
  }

  // Calculation weights for verifier digits
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  
  // Validate first verifier digit
  let sum1 = 0;
  for (let i = 0; i < 12; i++) {
    sum1 += parseInt(cnpj.charAt(i), 10) * weights1[i];
  }
  let remainder1 = sum1 % 11;
  let digit1 = remainder1 < 2 ? 0 : 11 - remainder1;

  if (parseInt(cnpj.charAt(12), 10) !== digit1) {
    return false;
  }

  // Validate second verifier digit
  let sum2 = 0;
  for (let i = 0; i < 13; i++) {
    sum2 += parseInt(cnpj.charAt(i), 10) * weights2[i];
  }
  let remainder2 = sum2 % 11;
  let digit2 = remainder2 < 2 ? 0 : 11 - remainder2;
  
  if (parseInt(cnpj.charAt(13), 10) !== digit2) {
    return false;
  }

  return true;
}
