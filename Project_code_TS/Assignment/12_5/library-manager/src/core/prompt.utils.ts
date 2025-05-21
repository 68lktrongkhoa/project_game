import readlineSync from 'readline-sync';

export function getStringInput(promptMessage: string): string {
  return readlineSync.question(promptMessage).trim();
}

export function getNumericInput(promptMessage: string): number | null {
  const input = getStringInput(promptMessage);
  if (input === '') {
    console.warn('⚠️  Đầu vào không được để trống.'); 
    return null;
  }
  const numericValue = parseInt(input, 10);
  if (isNaN(numericValue)) {
    console.error('❌ Lỗi: Đầu vào không phải là một số hợp lệ. Vui lòng nhập lại.');
    return null;
  }
  return numericValue;
}