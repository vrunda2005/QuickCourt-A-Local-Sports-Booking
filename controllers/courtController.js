const Court = require('../models/Court');

exports.createCourt = async (req, res) => {
  try {
    const { facility, name, sportType, pricePerHour, operatingHours, amenities, images } = req.body;
    if (!facility || !name || !sportType || !pricePerHour || !operatingHours) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const court = await Court.create({
      facility,
      name,
      sportType,
      pricePerHour,
      operatingHours,
      amenities: amenities || [],
      images: images || [],
    });
    res.status(201).json({ success: true, data: court });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCourtsByFacility = async (req, res) => {
  try {
    const { facilityId } = req.params;
    const courts = await Court.find({ facility: facilityId });
    res.json({ success: true, data: courts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCourt = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const court = await Court.findByIdAndUpdate(id, updates, { new: true });
    if (!court) return res.status(404).json({ error: 'Court not found' });
    res.json({ success: true, data: court });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteCourt = async (req, res) => {
  try {
    const { id } = req.params;
    const court = await Court.findByIdAndDelete(id);
    if (!court) return res.status(404).json({ error: 'Court not found' });
    res.json({ success: true, message: 'Court deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
