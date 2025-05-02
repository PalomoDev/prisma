// lib/utils/prisma-serializer.ts

export function prismaToJson<T>(data: T): T {
  return JSON.parse(JSON.stringify(data, (_, value) =>
    typeof value === 'bigint' ? value.toString() : value));
}