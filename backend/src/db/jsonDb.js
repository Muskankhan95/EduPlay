import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');

class JsonDatabase {
  constructor() {
    this.ensureDataDir();
  }

  async ensureDataDir() {
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
    } catch (err) {
      console.error('Error creating data directory:', err);
    }
  }

  getFilePath(collectionName) {
    return path.join(DATA_DIR, `${collectionName}.json`);
  }

  async read(collectionName) {
    await this.ensureDataDir();
    const filePath = this.getFilePath(collectionName);
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      if (err.code === 'ENOENT') {
        return [];
      }
      throw err;
    }
  }

  async write(collectionName, data) {
    await this.ensureDataDir();
    const filePath = this.getFilePath(collectionName);
    const tempPath = `${filePath}.tmp`;
    const serialized = JSON.stringify(data, null, 2);
    await fs.writeFile(tempPath, serialized, 'utf-8');
    await fs.rename(tempPath, filePath);
    return data;
  }

  async seedIfEmpty(collectionName, defaultData) {
    const filePath = this.getFilePath(collectionName);
    try {
      await fs.access(filePath);
      const existing = await this.read(collectionName);
      if (Array.isArray(existing) && existing.length === 0 && defaultData.length > 0) {
        await this.write(collectionName, defaultData);
      }
    } catch {
      await this.write(collectionName, defaultData);
    }
  }

  async getAll(collectionName) {
    return this.read(collectionName);
  }

  async find(collectionName, predicate) {
    const list = await this.read(collectionName);
    return list.filter(predicate);
  }

  async findOne(collectionName, predicate) {
    const list = await this.read(collectionName);
    return list.find(predicate) || null;
  }

  async findById(collectionName, id) {
    const list = await this.read(collectionName);
    return list.find(item => String(item.id) === String(id)) || null;
  }

  async insert(collectionName, item) {
    const list = await this.read(collectionName);
    const newItem = {
      id: item.id || `id_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      ...item,
    };
    list.push(newItem);
    await this.write(collectionName, list);
    return newItem;
  }

  async update(collectionName, id, updates) {
    const list = await this.read(collectionName);
    const index = list.findIndex(item => String(item.id) === String(id));
    if (index === -1) {
      return null;
    }
    const updated = {
      ...list[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    list[index] = updated;
    await this.write(collectionName, list);
    return updated;
  }

  async delete(collectionName, id) {
    const list = await this.read(collectionName);
    const filtered = list.filter(item => String(item.id) !== String(id));
    if (filtered.length === list.length) {
      return false;
    }
    await this.write(collectionName, filtered);
    return true;
  }
}

export const db = new JsonDatabase();
