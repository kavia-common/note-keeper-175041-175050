'use strict';

/**
 * Validates that :id param is a non-empty string.
 */
function validateIdParam(req, res, next) {
  const { id } = req.params;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid id parameter' });
  }
  next();
}

/**
 * Validate POST /notes payload
 * Requires title (non-empty string), content optional defaults to '' (handled by controller/service).
 */
function validateCreate(req, res, next) {
  const { title, content } = req.body || {};
  if (typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'title is required and must be a non-empty string' });
  }
  if (content !== undefined && typeof content !== 'string') {
    return res.status(400).json({ error: 'content must be a string' });
  }
  next();
}

/**
 * Validate PUT /notes/:id payload
 * Requires title and content, both strings. Title non-empty.
 */
function validatePut(req, res, next) {
  const { title, content } = req.body || {};
  if (typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'title is required and must be a non-empty string' });
  }
  if (typeof content !== 'string') {
    return res.status(400).json({ error: 'content is required and must be a string' });
  }
  next();
}

/**
 * Validate PATCH /notes/:id payload
 * Allows partial but validates types.
 */
function validatePatch(req, res, next) {
  const { title, content } = req.body || {};
  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'title must be a non-empty string when provided' });
    }
  }
  if (content !== undefined && typeof content !== 'string') {
    return res.status(400).json({ error: 'content must be a string when provided' });
  }
  next();
}

module.exports = {
  validateIdParam,
  validateCreate,
  validatePut,
  validatePatch,
};
