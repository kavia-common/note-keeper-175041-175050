'use strict';

const fs = require('fs/promises');
const path = require('path');

/**
 * FileStore provides JSON file-backed storage with:
 * - In-memory cache
 * - Atomic writes (write to temp file and rename)
 * - Lazy directory creation
 */
class FileStore {
  /**
   * @param {string} filePath
   */
  constructor(filePath) {
    this.filePath = path.resolve(filePath);
    this.dir = path.dirname(this.filePath);
    this.cache = null;
    this._writing = Promise.resolve(); // serialize writes
  }

  async ensureDir() {
    await fs.mkdir(this.dir, { recursive: true });
  }

  async read() {
    if (this.cache !== null) return this.cache;
    try {
      const data = await fs.readFile(this.filePath, 'utf8');
      this.cache = JSON.parse(data);
      return this.cache;
    } catch (err) {
      if (err.code === 'ENOENT') {
        // Initialize empty store
        this.cache = { notes: [] };
        return this.cache;
      }
      throw err;
    }
  }

  async write(data) {
    // serialize writes to prevent race conditions
    this._writing = this._writing.then(async () => {
      await this.ensureDir();
      const tmpFile = `${this.filePath}.tmp-${Date.now()}`;
      const json = JSON.stringify(data, null, 2);
      await fs.writeFile(tmpFile, json, 'utf8');
      await fs.rename(tmpFile, this.filePath);
      this.cache = data;
    }).catch((e) => {
      // reset cache only if write fails catastrophically
      throw e;
    });
    return this._writing;
  }
}

module.exports = FileStore;
