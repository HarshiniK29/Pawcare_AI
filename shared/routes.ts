import { z } from 'zod';
import { insertNgoSchema, ngos, insertRescueCaseSchema, rescueCases, insertPetSchema, pets, insertDiseaseScanSchema, diseaseScans } from './schema';

export const errorSchemas = {
  validation: z.object({ message: z.string(), field: z.string().optional() }),
  notFound: z.object({ message: z.string() }),
  internal: z.object({ message: z.string() }),
};

export const api = {
  ngos: {
    list: {
      method: 'GET' as const,
      path: '/api/ngos' as const,
      responses: { 200: z.array(z.custom<typeof ngos.$inferSelect>()) },
    },
    create: {
      method: 'POST' as const,
      path: '/api/ngos' as const,
      input: insertNgoSchema,
      responses: { 201: z.custom<typeof ngos.$inferSelect>(), 400: errorSchemas.validation },
    },
  },
  cases: {
    list: {
      method: 'GET' as const,
      path: '/api/cases' as const,
      responses: { 200: z.array(z.custom<typeof rescueCases.$inferSelect>()) },
    },
    create: {
      method: 'POST' as const,
      path: '/api/cases' as const,
      input: insertRescueCaseSchema,
      responses: { 201: z.custom<typeof rescueCases.$inferSelect>(), 400: errorSchemas.validation },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/cases/:id' as const,
      input: insertRescueCaseSchema.partial(),
      responses: { 200: z.custom<typeof rescueCases.$inferSelect>(), 400: errorSchemas.validation, 404: errorSchemas.notFound },
    }
  },
  pets: {
    list: {
      method: 'GET' as const,
      path: '/api/pets' as const,
      responses: { 200: z.array(z.custom<typeof pets.$inferSelect>()) },
    },
    create: {
      method: 'POST' as const,
      path: '/api/pets' as const,
      input: insertPetSchema,
      responses: { 201: z.custom<typeof pets.$inferSelect>(), 400: errorSchemas.validation },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/pets/:id' as const,
      input: insertPetSchema.partial(),
      responses: { 200: z.custom<typeof pets.$inferSelect>(), 400: errorSchemas.validation, 404: errorSchemas.notFound },
    }
  },
  scans: {
    list: {
      method: 'GET' as const,
      path: '/api/scans' as const,
      responses: { 200: z.array(z.custom<typeof diseaseScans.$inferSelect>()) },
    },
    create: {
      method: 'POST' as const,
      path: '/api/scans' as const,
      input: z.object({ imageUrl: z.string() }), // Frontend sends image info, backend mocks the result for MVP
      responses: { 201: z.custom<typeof diseaseScans.$inferSelect>(), 400: errorSchemas.validation },
    },
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}