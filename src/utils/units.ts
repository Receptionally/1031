export function formatUnit(unit: string, quantity: number = 1): string {
  switch (unit) {
    case 'cords':
      return quantity === 1 ? 'Cord' : 'Cords';
    case 'facecords':
      return quantity === 1 ? 'Face Cord' : 'Face Cords';
    case 'ricks':
      return quantity === 1 ? 'Rick' : 'Ricks';
    default:
      return unit;
  }
}