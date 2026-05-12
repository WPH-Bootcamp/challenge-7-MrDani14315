// TODO: Import tipe-tipe yang sudah didefinisikan di types.ts

// TODO: Import fungsi storage untuk baca/tulis file

// TODO: Buat fungsi untuk menambahkan To-Do baru
// - Generate id yang unik (bisa pakai timestamp atau counter)
// - Pastikan text tidak kosong
// - Set default status sebagai active

// TODO: Buat fungsi untuk menandai To-Do sebagai selesai
// - Cari To-Do berdasarkan id
// - Ubah statusnya menjadi completed
// - Handle kasus jika id tidak ditemukan

// TODO: Buat fungsi untuk menghapus To-Do
// - Filter To-Do berdasarkan id
// - Handle kasus jika id tidak ditemukan

// TODO: Buat fungsi untuk menampilkan semua To-Do
// - Tampilkan dengan format yang rapi
// - Tambahkan status [ACTIVE] atau [DONE] di depan setiap To-Do
// - Berikan nomor urut untuk memudahkan user memilih

// TODO: Buat fungsi untuk mencari To-Do berdasarkan keyword

// todoService.ts — Business logic: operasi CRUD To-Do

import { Todo, CreateTodoInput, Result } from './types';
import { readTodos, writeTodos } from './storage';
import { generateId, formatStatus, validateTitle } from './utils';

/**
 * Menambahkan To-Do baru ke dalam daftar.
 *
 * @param input - Objek berisi title yang akan dibuat
 * @returns Result berisi Todo baru jika sukses, atau pesan error
 */
export function addTodo(input: CreateTodoInput): Result<Todo> {
  const validationError = validateTitle(input.title);
  if (validationError !== null) {
    return { success: false, error: validationError };
  }

  try {
    const todos = readTodos();

    const newTodo: Todo = {
      id: generateId(todos),
      title: input.title.trim(),
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    todos.push(newTodo);
    writeTodos(todos);

    return { success: true, data: newTodo };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Menandai sebuah To-Do sebagai selesai (done).
 *
 * @param id - ID To-Do yang ingin diselesaikan
 * @returns Result berisi Todo yang diperbarui jika sukses, atau pesan error
 */
export function completeTodo(id: number): Result<Todo> {
  try {
    const todos = readTodos();
    const index = todos.findIndex((t) => t.id === id);

    if (index === -1) {
      return {
        success: false,
        error: `To-Do dengan ID ${id} tidak ditemukan.`,
      };
    }

    if (todos[index].status === 'done') {
      return {
        success: false,
        error: `To-Do dengan ID ${id} sudah berstatus DONE.`,
      };
    }

    todos[index] = {
      ...todos[index],
      status: 'done',
      completedAt: new Date().toISOString(),
    };

    writeTodos(todos);
    return { success: true, data: todos[index] };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Menghapus sebuah To-Do dari daftar berdasarkan ID.
 *
 * @param id - ID To-Do yang ingin dihapus
 * @returns Result berisi Todo yang dihapus jika sukses, atau pesan error
 */
export function deleteTodo(id: number): Result<Todo> {
  try {
    const todos = readTodos();
    const index = todos.findIndex((t) => t.id === id);

    if (index === -1) {
      return {
        success: false,
        error: `To-Do dengan ID ${id} tidak ditemukan.`,
      };
    }

    const [deleted] = todos.splice(index, 1);
    writeTodos(todos);

    return { success: true, data: deleted };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Mengambil semua To-Do dan mengembalikannya sebagai array.
 *
 * @returns Result berisi array Todo
 */
export function listTodos(): Result<Todo[]> {
  try {
    const todos = readTodos();
    return { success: true, data: todos };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Menampilkan semua To-Do ke console dengan format yang rapi.
 * Format: [ACTIVE] 1. Judul To-Do
 *         [DONE]   2. Judul lainnya
 */
export function printTodos(): void {
  const result = listTodos();

  if (!result.success) {
    console.error(`Error: ${result.error}`);
    return;
  }

  const todos = result.data;

  if (todos.length === 0) {
    console.log('\nBelum ada To-Do. Tambahkan yang pertama!\n');
    return;
  }

  console.log('\n' + '─'.repeat(50));
  console.log('  DAFTAR TO-DO');
  console.log('─'.repeat(50));

  todos.forEach((todo, index) => {
    const label = formatStatus(todo.status);
    const number = String(index + 1).padStart(2, ' ');
    console.log(`  ${label} ${number}. [ID:${todo.id}] ${todo.title}`);
  });

  const total = todos.length;
  const done = todos.filter((t) => t.status === 'done').length;
  const active = total - done;

  console.log('─'.repeat(50));
  console.log(`  Total: ${total} | Aktif: ${active} | Selesai: ${done}`);
  console.log('─'.repeat(50) + '\n');
}
