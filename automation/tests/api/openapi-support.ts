import { APIRequestContext, APIResponse, expect } from '@playwright/test';
import { apiAuthHeaders } from '../../src/env';

/** Минимальный валидный JPEG 1x1. Не секрет и не пользовательский файл. */
export const TINY_JPEG = Buffer.from(
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxAQEBAQEA8PEA8QDw8PDw8PDw8PFREWFhURFRUYHSggGBolGxUVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGhAQGy0lHyUtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAAEAAQMBIgACEQEDEQH/xAAbAAABBQEBAAAAAAAAAAAAAAADAAIEBQcBB//EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIQAxAAAAGX/8QAHBAAAgICAwAAAAAAAAAAAAAAAREAAgMSIUFR/9oACAEBAAEFAqh1j1n2n//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQMBAT8Bf//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQIBAT8Bf//EABYQAAMAAAAAAAAAAAAAAAAAABARIP/aAAgBAQAGPwJ//8QAGBABAQEBAQAAAAAAAAAAAAAAAQARITFB/9oACAEBAAE/IXaQ0n//2Q==',
  'base64',
);

export function jsonHeaders(): Record<string, string> {
  return { ...apiAuthHeaders(), 'Content-Type': 'application/json' };
}

export async function expectStatus(response: APIResponse, status: number): Promise<void> {
  expect(response.status(), await response.text()).toBe(status);
}

/** Читает тело один раз: status и JSON нельзя проверять двумя вызовами response.json(). */
export async function readJson<T = unknown>(response: APIResponse, status: number): Promise<T> {
  const text = await response.text();
  expect(response.status(), text.slice(0, 800)).toBe(status);
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

/** Минимальный PDF. Используется только как свой файл ReplaceFile, не как чужой документ. */
export const TINY_PDF = Buffer.from(
  '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>endobj\n3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 3 3]>>endobj\ntrailer<</Root 1 0 R>>\n%%EOF',
  'utf8',
);

export function listOf(body: unknown): unknown[] {
  if (Array.isArray(body)) return body;
  if (!body || typeof body !== 'object') return [];
  const record = body as Record<string, unknown>;
  for (const key of ['assets', 'items', 'results', 'data', 'values']) {
    if (Array.isArray(record[key])) return record[key] as unknown[];
  }
  return [];
}

export function numericId(value: unknown, keys = ['id', 'assetId', 'categoryId', 'linkTypeId']): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (!value || typeof value !== 'object') return undefined;
  const record = value as Record<string, unknown>;
  for (const key of keys) {
    if (typeof record[key] === 'number') return record[key] as number;
  }
  return undefined;
}

export function assetIds(body: unknown): number[] {
  return listOf(body)
    .map((item) => numericId(item, ['id', 'assetId']))
    .filter((id): id is number => id !== undefined);
}

/** Имя процесса создания берётся из поля name, как в OpenAPI CreationProcesses. */
export async function creationProcessName(request: APIRequestContext): Promise<string | undefined> {
  const response = await request.get('/SystemSettings/CreationProcesses', { headers: apiAuthHeaders() });
  await expectStatus(response, 200);
  const body = await response.json();
  const first = listOf(body)[0] ?? body?.[0];
  if (typeof first === 'string' && first.trim()) return first;
  if (first && typeof first === 'object') {
    const record = first as Record<string, unknown>;
    for (const key of ['name', 'processName']) {
      if (typeof record[key] === 'string' && record[key].trim()) return record[key] as string;
    }
  }
  return undefined;
}

export async function uploadOwnAsset(request: APIRequestContext, fileName: string): Promise<number> {
  const processName = await creationProcessName(request);
  const multipart: Record<string, unknown> = {
    file: { name: fileName, mimeType: 'image/jpeg', buffer: TINY_JPEG },
  };
  if (processName) multipart.processName = processName;

  const response = await request.post('/Asset', {
    headers: apiAuthHeaders(),
    multipart,
  });
  await expectStatus(response, 200);
  const assetId = await response.json();
  expect(typeof assetId, 'POST /Asset должен вернуть int64').toBe('number');
  return assetId as number;
}

export async function deleteOwnAsset(request: APIRequestContext, assetId: number | undefined): Promise<void> {
  if (!assetId) return;
  const response = await request.delete(`/Asset/${assetId}`, { headers: apiAuthHeaders() });
  expect([204, 404], `cleanup DELETE /Asset/${assetId}: ${response.status()} ${await response.text()}`).toContain(
    response.status(),
  );
}
