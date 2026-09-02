import { parseOrigins } from './origins';

describe('parseOrigins', () => {
  it('splits comma-separated origins and strips trailing slashes', () => {
    expect(
      parseOrigins('https://app.vercel.app/, https://app.vercel.app'),
    ).toEqual(['https://app.vercel.app']);
  });

  it('returns an empty list for blank input', () => {
    expect(parseOrigins(undefined)).toEqual([]);
    expect(parseOrigins('')).toEqual([]);
  });
});
