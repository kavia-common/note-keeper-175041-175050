'use strict';

const express = require('express');
const notesController = require('../controllers/notes');
const { validateIdParam, validateCreate, validatePut, validatePatch } = require('../middleware/validateNote');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Notes
 *     description: Notes management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Note:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: UUID v4 identifier
 *         title:
 *           type: string
 *         content:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     NoteListResponse:
 *       type: object
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Note'
 *         total:
 *           type: integer
 *         offset:
 *           type: integer
 *         limit:
 *           type: integer
 */

/**
 * @swagger
 * /api/notes:
 *   get:
 *     summary: List notes
 *     description: Returns paginated list of notes with optional search over title/content.
 *     tags: [Notes]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query across title and content
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 50
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NoteListResponse'
 */
router.get('/', notesController.list.bind(notesController));

/**
 * @swagger
 * /api/notes:
 *   post:
 *     summary: Create a note
 *     description: Creates a new note
 *     tags: [Notes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *                 default: ""
 *     responses:
 *       201:
 *         description: Note created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       400:
 *         description: Validation error
 */
router.post('/', validateCreate, notesController.create.bind(notesController));

/**
 * @swagger
 * /api/notes/{id}:
 *   get:
 *     summary: Get a note
 *     description: Get a single note by ID
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Note ID (UUID)
 *     responses:
 *       200:
 *         description: Note found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       404:
 *         description: Note not found
 */
router.get('/:id', validateIdParam, notesController.getById.bind(notesController));

/**
 * @swagger
 * /api/notes/{id}:
 *   put:
 *     summary: Update a note (replace)
 *     description: Replaces a note with provided title and content
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, content]
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Note updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Note not found
 */
router.put('/:id', validateIdParam, validatePut, notesController.update.bind(notesController));

/**
 * @swagger
 * /api/notes/{id}:
 *   patch:
 *     summary: Patch a note
 *     description: Partially updates a note
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Note updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Note not found
 */
router.patch('/:id', validateIdParam, validatePatch, notesController.patch.bind(notesController));

/**
 * @swagger
 * /api/notes/{id}:
 *   delete:
 *     summary: Delete a note
 *     description: Deletes a note by ID
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Note deleted
 *       404:
 *         description: Note not found
 */
router.delete('/:id', validateIdParam, notesController.remove.bind(notesController));

module.exports = router;
