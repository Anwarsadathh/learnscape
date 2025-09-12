const { ObjectId } = require('mongodb');
const db = require('../config/connection');

class Banner {
  constructor(data) {
    this.title = data.title;
    this.subtitle = data.subtitle;
    this.link = data.link;
    this.description = data.description;
    this.position = data.position;
    this.image = data.image;
    this.isActive = data.isActive || false;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  async save() {
    try {
      const result = await db.get().collection('banners').insertOne(this);
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async findAll() {
    try {
      return await db.get().collection('banners').find().sort({ position: 1 }).toArray();
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      return await db.get().collection('banners').findOne({ _id: new ObjectId(id) });
    } catch (error) {
      throw error;
    }
  }

  static async findByPosition(position) {
    try {
      return await db.get().collection('banners').findOne({ position: parseInt(position) });
    } catch (error) {
      throw error;
    }
  }

  static async findActive() {
    try {
      return await db.get().collection('banners').find({ isActive: true }).sort({ position: 1 }).toArray();
    } catch (error) {
      throw error;
    }
  }

  static async update(id, updateData) {
    try {
      updateData.updatedAt = new Date();
      return await db.get().collection('banners').updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );
    } catch (error) {
      throw error;
    }
  }

  static async updateStatus(id, isActive) {
    try {
      return await db.get().collection('banners').updateOne(
        { _id: new ObjectId(id) },
        { $set: { isActive, updatedAt: new Date() } }
      );
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      return await db.get().collection('banners').deleteOne({ _id: new ObjectId(id) });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Banner;
