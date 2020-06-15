import toPascalCase from '../toPascalCase';

describe('toPascalCase function', () => {
  it('convert snake case string to pascal case', () => {
    expect(toPascalCase('STRING_TO_PASCAL_CASE')).toBe('StringToPascalCase');
  });
});
