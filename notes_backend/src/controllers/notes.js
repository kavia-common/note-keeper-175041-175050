'use strict';

const { NotesService, ValidationError, NotFoundError } = require('../services/notes');

class NotesController {
  /**
   * PUBLIC_INTERFACE
   * List notes with optional search and pagination.
   */
  async list(req, res) {
    try {
      const { q } = req.query;
      const offset = Number.isNaN(Number(req.query.offset)) ? 0 : Number(req.query.offset);
      const limit = Number.isNaN(Number(req.query.limit)) ? 50 : Number(req.query.limit);
      const result = await NotesService.list({ q, offset, limit });
      return res.status(200).json(result);
    } catch (err) {
      return this._handleError(res, err);
    }
  }

  /**
   * PUBLIC_INTERFACE
   * Create a new note.
   */
  async create(req, res) {
    try {
      const { title, content = '' } = req.body || {};
      const note = await NotesService.create({ title, content });
      return res.status(201).json(note);
    } catch (err) {
      return this._handleError(res, err);
    }
  }

  /**
   * PUBLIC_INTERFACE
   * Get a note by id.
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      const note = await NotesService.getById(id);
      return res.status(200).json(note);
    } catch (err) {
      return this._handleError(res, err);
    }
  }

  /**
   * PUBLIC_INTERFACE
   * Update (PUT) a note by id.
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const { title, content } = req.body || {};
      const note = await NotesService.update(id, { title, content });
      return res.status(200).json(note);
    } catch (err) {
      return this._handleError(res, err);
    }
  }

  /**
   * PUBLIC_INTERFACE
   * Patch a note by id.
   */
  async patch(req, res) {
    try {
      const { id } = req.params;
      const payload = req.body || {};
      const note = await NotesService.patch(id, payload);
      return res.status(200).json(note);
    } catch (err) {
      return this._handleError(res, err);
    }
  }

  /**
   * PUBLIC_INTERFACE
   * Delete a note by id.
   */
  async remove(req, res) {
    try {
      const { id } = req.params;
      await NotesService.remove(id);
      return res.status(204).send();
    } catch (err) {
      return this._handleError(res, err);
    }
  }

  _handleError(res, err) {
    if (err instanceof ValidationError) {
      return res.status(400).json({ error: err.message });
    }
    if (err instanceof NotFoundError) {
      return res.status(404).json({ error: err.message });
    }
    // Fallback
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = new NotesController();
