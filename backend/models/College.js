const { ObjectId } = require('mongodb');
const db = require('../config/connection');

class College {
  constructor(data) {
    this.name = data.name;
    this.streams = data.streams || [];
    this.locations = data.locations || [];
    this.positions = data.positions;
    this.portalLink = data.portalLink;
    this.image = data.image;
    this.brochure = data.brochure;
    this.feeStructureDoc = data.feeStructureDoc;
    this.overview = data.overview || {};
    this.courses = data.courses || [];
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  async save() {
    try {
      const result = await db.get().collection('collegeoruni').insertOne(this);
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async findAll() {
    try {
      return await db.get().collection('collegeoruni').find().sort({ name: 1 }).toArray();
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      return await db.get().collection('collegeoruni').findOne({ _id: new ObjectId(id) });
    } catch (error) {
      throw error;
    }
  }

  static async findByName(name) {
    try {
      return await db.get().collection('collegeoruni').findOne({ name: name });
    } catch (error) {
      throw error;
    }
  }

  static async search(query) {
    try {
      const searchRegex = new RegExp(query, 'i');
      return await db.get().collection('collegeoruni').find({
        $or: [
          { name: searchRegex },
          { streams: searchRegex },
          { locations: searchRegex }
        ]
      }).toArray();
    } catch (error) {
      throw error;
    }
  }

  static async update(id, updateData) {
    try {
      updateData.updatedAt = new Date();
      return await db.get().collection('collegeoruni').updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      return await db.get().collection('collegeoruni').deleteOne({ _id: new ObjectId(id) });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = College;
