// TODO: Definisikan tipe data untuk To-Do item di sini
// Hint: To-Do sebaiknya memiliki id, text, dan status completed

// TODO: Buat interface untuk To-Do item

// TODO: Buat tipe untuk status To-Do (active/done)

// TODO: Buat tipe untuk fungsi-fungsi yang akan digunakan

// types.ts — Definisi tipe data untuk aplikasi To-Do

/**
 * Status yang mungkin dimiliki oleh sebuah To-Do item.
 * Menggunakan union type agar hanya dua nilai yang valid.
 */
export type TodoStatus = 'active' | 'done';

/**
 * Interface utama yang merepresentasikan satu To-Do item.
 */
export interface Todo {
  /** ID unik, dibuat otomatis saat To-Do ditambahkan */
  id: number;

  /** Teks deskripsi tugas */
  title: string;

  /** Status tugas: 'active' atau 'done' */
  status: TodoStatus;

  /** Waktu pembuatan dalam format ISO string */
  createdAt: string;

  /** Waktu penyelesaian, hanya ada jika status === 'done' */
  completedAt?: string;
}

/**
 * Tipe untuk data yang diterima saat membuat To-Do baru.
 * Hanya membutuhkan title karena field lain dibuat otomatis.
 */
export type CreateTodoInput = {
  title: string;
};

/**
 * Tipe kembalian untuk operasi yang bisa sukses atau gagal.
 * Pola ini memungkinkan error handling yang type-safe.
 */
export type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string };
