// TODO: Definisikan path file untuk menyimpan data To-Do

// TODO: Buat fungsi untuk membaca To-Do dari file
// Hint: Gunakan try-catch untuk handle error saat membaca file

// TODO: Buat fungsi untuk menyimpan To-Do ke file
// Hint: Jangan lupa konversi ke JSON string sebelum disimpan

// TODO: Buat fungsi untuk inisialisasi storage (buat file kosong jika belum ada)

// storage.ts — Operasi baca/tulis data ke file JSON

import fs from 'fs';
import path from 'path';
import { Todo } from './types';
import { isTodoArray } from './utils';

// Path ke folder dan file penyimpanan data
const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'todos.json');

/**
 * Memastikan folder 'data' sudah ada sebelum membaca/menulis.
 * Jika belum ada, folder dibuat secara otomatis.
 */
function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

/**
 * Membaca daftar To-Do dari file JSON.
 * Jika file belum ada atau formatnya tidak valid, mengembalikan array kosong.
 *
 * @returns Array of Todo
 */
export function readTodos(): Todo[] {
  try {
    ensureDataDir();

    if (!fs.existsSync(DATA_FILE)) {
      return [];
    }

    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed: unknown = JSON.parse(raw);

    // Validasi menggunakan type guard sebelum digunakan
    if (!isTodoArray(parsed)) {
      console.error(
        'Peringatan: Format data tidak valid. Memulai dengan list kosong.'
      );
      return [];
    }

    return parsed;
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error(
        'Peringatan: File data korup (JSON tidak valid). Memulai dengan list kosong.'
      );
    } else {
      console.error('Gagal membaca file data:', (error as Error).message);
    }
    return [];
  }
}

/**
 * Menyimpan daftar To-Do ke file JSON.
 * Menggunakan indentasi 2 spasi agar file mudah dibaca.
 *
 * @param todos - Array of Todo yang akan disimpan
 * @throws Error jika operasi tulis gagal
 */
export function writeTodos(todos: Todo[]): void {
  try {
    ensureDataDir();
    const json = JSON.stringify(todos, null, 2);
    fs.writeFileSync(DATA_FILE, json, 'utf-8');
  } catch (error) {
    throw new Error(`Gagal menyimpan data: ${(error as Error).message}`);
  }
}
