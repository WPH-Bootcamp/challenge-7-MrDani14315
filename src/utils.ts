// TODO: Implementasikan type guards di sini
// Hint: Type guard berguna untuk memastikan tipe data saat runtime

// TODO: Buat fungsi untuk memvalidasi apakah suatu objek adalah To-Do yang valid

// TODO: Buat fungsi helper untuk menampilkan tanggal/waktu dengan format yang bagus

// TODO: Buat fungsi untuk memastikan input dari user adalah string yang valid

// utils.ts — Type guards dan helper functions

import { Todo, TodoStatus } from './types';

/**
 * Memeriksa apakah nilai adalah TodoStatus yang valid.
 */
function isTodoStatus(value: unknown): value is TodoStatus {
  return value === 'active' || value === 'done';
}

/**
 * Type guard: memastikan suatu nilai adalah objek Todo yang valid.
 * Digunakan saat membaca data dari JSON agar type-safe.
 */
export function isTodo(value: unknown): value is Todo {
  if (typeof value !== 'object' || value === null) return false;

  const obj = value as Record<string, unknown>;

  return (
    typeof obj['id'] === 'number' &&
    typeof obj['title'] === 'string' &&
    obj['title'].trim().length > 0 &&
    isTodoStatus(obj['status']) &&
    typeof obj['createdAt'] === 'string' &&
    (obj['completedAt'] === undefined || typeof obj['completedAt'] === 'string')
  );
}

/**
 * Type guard: memastikan suatu nilai adalah array of Todo yang valid.
 * Digunakan saat membaca file JSON berisi daftar To-Do.
 */
export function isTodoArray(value: unknown): value is Todo[] {
  return Array.isArray(value) && value.every((item) => isTodo(item));
}

/**
 * Menghasilkan ID unik berdasarkan nilai maksimum ID yang sudah ada.
 * Lebih aman dari Date.now() untuk list kecil.
 */
export function generateId(todos: Todo[]): number {
  if (todos.length === 0) return 1;
  return Math.max(...todos.map((t) => t.id)) + 1;
}

/**
 * Memformat label status untuk ditampilkan di terminal.
 * [ACTIVE] dengan padding agar rata dengan [DONE].
 */
export function formatStatus(status: TodoStatus): string {
  return status === 'done' ? '[DONE]  ' : '[ACTIVE]';
}

/**
 * Memvalidasi apakah string input dari user tidak kosong.
 */
export function validateTitle(title: string): string | null {
  const trimmed = title.trim();
  if (trimmed.length === 0) {
    return 'Judul To-Do tidak boleh kosong.';
  }
  if (trimmed.length > 200) {
    return 'Judul To-Do terlalu panjang (maksimal 200 karakter).';
  }
  return null; // null berarti valid
}
