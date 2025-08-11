const Facility = require('../models/Facility');

exports.createFacility = async (req, res) => {
  try {
    const { name, location, description } = req.body;
    if (!name || !location) {
      return res.status(400).json({ error: 'Name and location are required' });
    }

    const facility = await Facility.create({
      name,
      location,
      description,
      imageUrl: req.file?.path,
      owner: req.user._id
    });

    res.status(201).json({ success: true, data: facility });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFacilities = async (_req, res) => {
  try {
    const facilities = await Facility.find({ status: 'approved' }).sort({ createdAt: -1 });
    res.json({ success: true, data: facilities });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFacilityById = async (req, res) => {
  try {
    const facility = await Facility.findById(req.params.id);
    if (!facility) return res.status(404).json({ error: 'Facility not found' });

    // Public can only view approved; owners/admins can view their own/pending
    const isOwner = req.user && facility.owner?.toString() === req.user._id.toString();
    const isAdmin = req.user && req.user.role === 'Admin';
    if (facility.status !== 'approved' && !isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Facility not accessible' });
    }

    res.json({ success: true, data: facility });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyFacilities = async (req, res) => {
  try {
    const facilities = await Facility.find({ owner: req.user._id });
    res.json({ success: true, data: facilities });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteFacility = async (req, res) => {
  try {
    const facility = await Facility.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!facility) {
      return res.status(404).json({ error: 'Facility not found or not owned by you' });
    }
    res.json({ success: true, message: 'Facility deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.approveFacility = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'approved' or 'rejected'
  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  const facility = await Facility.findByIdAndUpdate(id, { status }, { new: true });
  if (!facility) return res.status(404).json({ error: 'Facility not found' });
  res.json({ success: true, data: facility });
};

exports.getPendingFacilities = async (_req, res) => {
  const facilities = await Facility.find({ status: 'pending' });
  res.json({ success: true, data: facilities });
};