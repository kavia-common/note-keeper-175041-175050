'use strict';

const { randomUUID } = require('crypto');
const FileStore = require('../storage/fileStore');

const DEFAULT_DATA_FILE = process.env.NOTES_DATA_FILE || './data/notes.json';

// Error classes to map to HTTP status codes
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.status = 404;
  }
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.status = 400;
  }
}

class NotesService {
  constructor(filePath = DEFAULT_DATA_FILE) {
    this.store = new FileStore(filePath);
  }

  /**
   * PUBLIC_INTERFACE
   * List notes with optional search and pagination.
   * @param {{ q?: string, offset?: number, limit?: number }} opts
   * @returns {Promise<{items: import('../models/note').Note[], total: number, offset: number, limit: number}>}
   */
  async list({ q, offset = 0, limit = 50 } = {}) {
    if (offset < 0 || limit < 0) {
      throw new ValidationError('offset and limit must be non-negative');
    }
    const { notes } = await this.store.read();
    let filtered = notes;
    if (q && typeof q === 'string' && q.trim() !== '') {
      const term = q.toLowerCase();
      filtered = notes.filter((n) =>
        (n.title && n.title.toLowerCase().includes(term)) ||
        (n.content && n.content.toLowerCase().includes(term))
      );
    }
    const total = filtered.length;
    const items = filtered.slice(offset, offset + limit);
    return { items, total, offset, limit };
  }

  /**
   * PUBLIC_INTERFACE
   * Create a new note.
   * @param {{title: string, content?: string}} payload
   * @returns {Promise<import('../models/note').Note>}
   */
  async create({ title, content = '' }) {
    if (typeof title !== 'string' || title.trim() === '') {
      throw new ValidationError('title is required and must be a non-empty string');
    }
    if (typeof content !== 'string') {
      throw new ValidationError('content must be a string');
    }
    const now = new Date().toISOString();
    const note = {
      id: randomUUID(),
      title: title.trim(),
      content,
      createdAt: now,
      updatedAt: now,
    };
    const data = await this.store.read();
    data.notes.push(note);
    await this.store.write(data);
    return note;
  }

  /**
   * PUBLIC_INTERFACE
   * Get a note by ID.
   * @param {string} id
   * @returns {Promise<import('../models/note').Note>}
   */
  async getById(id) {
    const { notes } = await this.store.read();
    const note = notes.find((n) => n.id === id);
    if (!note) {
      throw new NotFoundError('Note not found');
    }
    return note;
  }

  /**
   * PUBLIC_INTERFACE
   * Update entire note (PUT).
   * @param {string} id
   * @param {{title: string, content: string}} payload
   * @returns {Promise<import('../models/note').Note>}
   */
  async update(id, { title, content }) {
    if (typeof title !== 'string') throw new ValidationError('title must be a string');
    if (title.trim() === '') throw new ValidationError('title cannot be empty');
    if (typeof content !== 'string') throw new ValidationError('content must be a string');

    const data = await this.store.read();
    const idx = data.notes.findIndex((n) => n.id === id);
    if (idx === -1) throw new NotFoundError('Note not found');

    const prev = data.notes[idx];
    const updated = {
      ...prev,
      title: title.trim(),
      content,
      updatedAt: new Date().toISOString(),
    };
    data.notes[idx] = updated;
    await this.store.write(data);
    return updated;
  }

  /**
   * PUBLIC_INTERFACE
   * Patch note (partial update).
   * @param {string} id
   * @param {{title?: string, content?: string}} payload
   * @returns {Promise<import('../models/note').Note>}
   */
  async patch(id, payload) {
    if (payload.title !== undefined) {
      if (typeof payload.title !== 'string') throw new ValidationError('title must be a string');
      if (payload.title.trim() === '') throw new ValidationError('title cannot be empty');
    }
    if (payload.content !== undefined && typeof payload.content !== 'string') {
      throw new ValidationError('content must be a string');
    }

    const data = await this.store.read();
    const idx = data.notes.findIndex((n) => n.id === id);
    if (idx === -1) throw new NotFoundError('Note not found');

    const prev = data.notes[idx];
    const updated = {
      ...prev,
      title: payload.title !== undefined ? payload.title.trim() : prev.title,
      content: payload.content !== undefined ? payload.content : prev.content,
      updatedAt: new Date().toISOString(),
    };
    data.notes[idx] = updated;
    await this.store.write(data);
    return updated;
  }

  /**
   * PUBLIC_INTERFACE
   * Remove a note by ID.
   * @param {string} id
   * @returns {Promise<void>}
   */
  async remove(id) {
    const data = await this.store.read();
    const idx = data.notes.findIndex((n) => n.id === id);
    if (idx === -1) throw new NotFoundError('Note not found');
    data.notes.splice(idx, 1);
    await this.store.write(data);
  }
}

module.exports = {
  NotesService: new NotesService(),
  NotFoundError,
  ValidationError,
};
