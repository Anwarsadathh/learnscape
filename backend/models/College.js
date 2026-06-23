const { ObjectId } = require('mongodb');
const db = require('../config/connection');

class College {
  constructor(data = {}) {
    this.name = data.name?.trim() || '';
    this.slug = data.slug?.trim() || '';
    this.streams = Array.isArray(data.streams) ? data.streams.filter(Boolean) : [];
    this.locations = Array.isArray(data.locations) ? data.locations.filter(Boolean) : [];
    this.positions = Number(data.positions) || 0;

    this.image = data.image?.trim() || '';
    this.brochure = data.brochure?.trim() || '';
    this.feeStructureDoc = data.feeStructureDoc?.trim() || '';

    this.courses = Array.isArray(data.courses)
      ? data.courses.map(course => ({
          name: course.name?.trim() || '',
          level: course.level?.trim() || 'UG',
          duration: course.duration?.trim() || '',
          fees: course.fees?.trim() || '',
          seats: Number(course.seats) || 0,
          entrance: course.entrance?.trim() || ''
        }))
      : [];

    this.overview = {
      heading: data.overview?.heading?.trim() || '',
      description: data.overview?.description?.trim() || '',
      points: Array.isArray(data.overview?.points)
        ? data.overview.points.map(point => ({
            heading: point.heading?.trim() || '',
            description: point.description?.trim() || ''
          }))
        : []
    };

    this.portalLink = data.portalLink?.trim() || '';
    this.rating = Number(data.rating) || 0;
    this.naac = data.naac?.trim() || '';

    this.fees = {
      min: Number(data.fees?.min) || 0,
      max: Number(data.fees?.max) || 0
    };

    this.type = data.type?.trim() || 'private';
    this.established = Number(data.established) || 0;

    this.accreditations = Array.isArray(data.accreditations)
      ? data.accreditations.filter(Boolean)
      : [];

    this.highlights = Array.isArray(data.highlights)
      ? data.highlights.filter(Boolean)
      : [];

    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
    this.updatedAt = new Date();
  }

  static collection() {
    return db.get().collection('colleges');
  }

  static sanitize(data = {}, isUpdate = false) {
    const payload = {
      name: data.name?.trim() || '',
      slug: data.slug?.trim() || '',
      streams: Array.isArray(data.streams) ? data.streams.filter(Boolean) : [],
      locations: Array.isArray(data.locations) ? data.locations.filter(Boolean) : [],
      positions: Number(data.positions) || 0,

      image: data.image?.trim() || '',
      brochure: data.brochure?.trim() || '',
      feeStructureDoc: data.feeStructureDoc?.trim() || '',

      courses: Array.isArray(data.courses)
        ? data.courses.map(course => ({
            name: course.name?.trim() || '',
            level: course.level?.trim() || 'UG',
            duration: course.duration?.trim() || '',
            fees: course.fees?.trim() || '',
            seats: Number(course.seats) || 0,
            entrance: course.entrance?.trim() || ''
          }))
        : [],

      overview: {
        heading: data.overview?.heading?.trim() || '',
        description: data.overview?.description?.trim() || '',
        points: Array.isArray(data.overview?.points)
          ? data.overview.points.map(point => ({
              heading: point.heading?.trim() || '',
              description: point.description?.trim() || ''
            }))
          : []
      },

      portalLink: data.portalLink?.trim() || '',
      rating: Number(data.rating) || 0,
      naac: data.naac?.trim() || '',

      fees: {
        min: Number(data.fees?.min) || 0,
        max: Number(data.fees?.max) || 0
      },

      type: data.type?.trim() || 'private',
      established: Number(data.established) || 0,

      accreditations: Array.isArray(data.accreditations)
        ? data.accreditations.filter(Boolean)
        : [],

      highlights: Array.isArray(data.highlights)
        ? data.highlights.filter(Boolean)
        : [],

      updatedAt: new Date()
    };

    if (!isUpdate) {
      payload.createdAt = new Date();
    }

    return payload;
  }

  async save() {
    const payload = College.sanitize(this);
    return await College.collection().insertOne(payload);
  }

  static async findAll(filter = {}, options = {}) {
    const sort = options.sort || { positions: 1 };
    const skip = options.skip || 0;
    const limit = options.limit || 0;

    return await College.collection()
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray();
  }

  static async count(filter = {}) {
    return await College.collection().countDocuments(filter);
  }

  static async findById(id) {
    return await College.collection().findOne({
      _id: new ObjectId(id)
    });
  }

  static async findBySlug(slug) {
    return await College.collection().findOne({ slug });
  }

  static async findByName(name) {
    return await College.collection().findOne({ name });
  }

  static async search(query) {
    const searchRegex = new RegExp(query, 'i');

    return await College.collection()
      .find({
        $or: [
          { name: searchRegex },
          { slug: searchRegex },
          { streams: { $in: [searchRegex] } },
          { locations: { $in: [searchRegex] } },
          { naac: searchRegex },
          { accreditations: { $in: [searchRegex] } }
        ]
      })
      .toArray();
  }

  static async update(id, updateData) {
    const payload = College.sanitize(updateData, true);

    return await College.collection().updateOne(
      { _id: new ObjectId(id) },
      { $set: payload }
    );
  }

  static async delete(id) {
    return await College.collection().deleteOne({
      _id: new ObjectId(id)
    });
  }
}

module.exports = College;