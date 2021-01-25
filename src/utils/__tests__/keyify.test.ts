import keyify from '../keyify';

test('return correct path string when object is given', () => {
  expect(
    keyify({
      key1: 'key1',
      key2: {
        key3: 'key3',
        key4: { key5: { key6: 'key6' } },
        key7: 'key7',
        key8: 'key8',
      },
    })
  ).toEqual([
    'key1',
    'key2.key3',
    'key2.key4.key5.key6',
    'key2.key7',
    'key2.key8',
  ]);

  expect(
    keyify({
      key1: 'key1',
      key2: {
        key3: [{ key10: 'key10' }],
        key4: { key5: { key6: 'key6' } },
      },
      key8: null,
      key9: undefined,
    })
  ).toEqual(['key1', 'key2.key4.key5.key6', 'key8', 'key9']);
});
