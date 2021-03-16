import deleteEmptyValuesFromObject from '../deleteEmptyValuesFromObject';

test('deletes properties from object when they have empty value', () => {
  const testValues = [
    {
      param: {},
      expected: {},
    },
    {
      param: { test1: '', test2: 'asd' },
      expected: { test2: 'asd' },
    },
    {
      param: {
        test1: [],
        test2: '',
        test3: null,
        test4: undefined,
        test5: ['asd', 'osd'],
        test6: 'moi',
      },
      expected: {
        test5: ['asd', 'osd'],
        test6: 'moi',
      },
    },
  ];

  testValues.forEach((t) => {
    expect(deleteEmptyValuesFromObject(t.param)).toEqual(t.expected);
  });
});
