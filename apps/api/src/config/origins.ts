export function parseOrigins(value?: string) {
  return (value ?? '')
    .split(',')
    .map((origin) => origin.trim().replace(/\/$/, ''))
    .filter((origin, index, all) => origin && all.indexOf(origin) === index);
}
