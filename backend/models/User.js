const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const db = require('../config/connection');

class User {
  constructor(data) {
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.role = data.role || 'user';
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  async save() {
    try {
      // Hash password before saving
      this.password = await bcrypt.hash(this.password, 10);
      const result = await db.get().collection('users').insertOne(this);
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      return await db.get().collection('users').findOne({ email: email });
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      return await db.get().collection('users').findOne({ _id: new ObjectId(id) });
    } catch (error) {
      throw error;
    }
  }

  static async validatePassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;
