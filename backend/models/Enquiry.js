const { ObjectId } = require('mongodb');
const db = require('../config/connection');

class Enquiry {
  constructor(data) {
    this.name = data.name;
    this.email = data.email;
    this.mobile = data.mobile;
    this.message = data.message;
    this.documentType = data.documentType;
    this.documentUrl = data.documentUrl;
    this.status = data.status || 'New';
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  async save() {
    try {
      const result = await db.get().collection('enquiries').insertOne(this);
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async findAll() {
    try {
      return await db.get().collection('enquiries').find().sort({ createdAt: -1 }).toArray();
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      return await db.get().collection('enquiries').findOne({ _id: new ObjectId(id) });
    } catch (error) {
      throw error;
    }
  }

  static async updateStatus(id, status) {
    try {
      return await db.get().collection('enquiries').updateOne(
        { _id: new ObjectId(id) },
        { $set: { status, updatedAt: new Date() } }
      );
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      return await db.get().collection('enquiries').deleteOne({ _id: new ObjectId(id) });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Enquiry;
