import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

interface Court {
  _id: string;
  name: string;
  sportType: string;
  pricePerHour: number;
  facility: string;
}

interface TimeSlot {
  _id?: string;
  courtId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'available' | 'blocked' | 'maintenance';
  reason?: string;
}

interface Facility {
  _id: string;
  name: string;
  status: string;
}

const TimeSlotManagement = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [courts, setCourts] = useState<Court[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<string>('');
  const [selectedCourt, setSelectedCourt] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const { getToken } = useAuth();

  // Form state for adding/editing time slots
  const [formData, setFormData] = useState({
    startTime: '',
    endTime: '',
    status: 'blocked' as 'available' | 'blocked' | 'maintenance',
    reason: ''
  });

  // Load facilities
  useEffect(() => {
    const loadFacilities = async () => {
      try {
        const token = await getToken();
        const res = await axios.get('http://localhost:5000/api/facilities/mine', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const userFacilities = res.data.data || [];
        setFacilities(userFacilities.filter((f: Facility) => f.status === 'approved'));
        
        if (userFacilities.length > 0) {
          setSelectedFacility(userFacilities[0]._id);
        }
      } catch (error) {
        console.error('Failed to load facilities:', error);
      }
    };

    loadFacilities();
  }, [getToken]);

  // Load courts when facility changes
  useEffect(() => {
    const loadCourts = async () => {
      if (!selectedFacility) return;
      
      try {
        const token = await getToken();
        const res = await axios.get(`http://localhost:5000/api/courts?facility=${selectedFacility}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const facilityCourts = res.data.data || [];
        setCourts(facilityCourts);
        
        if (facilityCourts.length > 0) {
          setSelectedCourt(facilityCourts[0]._id);
        }
      } catch (error) {
        console.error('Failed to load courts:', error);
      }
    };

    loadCourts();
  }, [selectedFacility, getToken]);

  // Load time slots when court or date changes
  useEffect(() => {
    const loadTimeSlots = async () => {
      if (!selectedCourt || !selectedDate) return;
      
      try {
        const token = await getToken();
        // This would be your actual API endpoint for time slots
        // For now, we'll generate sample data
        const sampleSlots = generateSampleTimeSlots();
        setTimeSlots(sampleSlots);
      } catch (error) {
        console.error('Failed to load time slots:', error);
      }
    };

    loadTimeSlots();
  }, [selectedCourt, selectedDate, getToken]);

  // Generate sample time slots (replace with actual API call)
  const generateSampleTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const hours = ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', 
                   '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', 
                   '20:00', '21:00', '22:00'];
    
    hours.forEach((hour, index) => {
      if (index < hours.length - 1) {
        slots.push({
          courtId: selectedCourt,
          date: selectedDate,
          startTime: hour,
          endTime: hours[index + 1],
          status: Math.random() > 0.8 ? 'blocked' : 'available',
          reason: Math.random() > 0.8 ? 'Maintenance' : undefined
        });
      }
    });
    
    return slots;
  };

  const handleAddTimeSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCourt || !selectedDate || !formData.startTime || !formData.endTime) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const token = await getToken();
      
      const newSlot: TimeSlot = {
        courtId: selectedCourt,
        date: selectedDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        status: formData.status,
        reason: formData.reason
      };

      // This would be your actual API call to create/update time slots
      // await axios.post('http://localhost:5000/api/timeslots', newSlot, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });

      // For now, add to local state
      setTimeSlots([...timeSlots, { ...newSlot, _id: Date.now().toString() }]);
      
      // Reset form
      setFormData({
        startTime: '',
        endTime: '',
        status: 'blocked',
        reason: ''
      });
      setShowAddForm(false);
      
      alert('Time slot updated successfully!');
    } catch (error) {
      console.error('Failed to update time slot:', error);
      alert('Failed to update time slot');
    } finally {
      setLoading(false);
    }
  };

  const updateTimeSlotStatus = async (slotId: string, status: 'available' | 'blocked' | 'maintenance') => {
    try {
      const token = await getToken();
      
      // This would be your actual API call to update time slot status
      // await axios.put(`http://localhost:5000/api/timeslots/${slotId}`, { status }, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });

      // Update local state
      setTimeSlots(prev => prev.map(slot => 
        slot._id === slotId ? { ...slot, status } : slot
      ));
      
      alert('Time slot status updated successfully!');
    } catch (error) {
      console.error('Failed to update time slot status:', error);
      alert('Failed to update time slot status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'blocked': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Available';
      case 'blocked': return 'Blocked';
      case 'maintenance': return 'Maintenance';
      default: return 'Unknown';
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Time Slot Management</h1>
      
      {/* Selection Controls */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Facility</label>
            <select
              value={selectedFacility}
              onChange={(e) => setSelectedFacility(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choose a facility</option>
              {facilities.map(facility => (
                <option key={facility._id} value={facility._id}>
                  {facility.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Court</label>
            <select
              value={selectedCourt}
              onChange={(e) => setSelectedCourt(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={!selectedFacility}
            >
              <option value="">Choose a court</option>
              {courts.map(court => (
                <option key={court._id} value={court._id}>
                  {court.name} - {court.sportType}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            {showAddForm ? 'Cancel' : 'Add/Edit Time Slots'}
          </button>
          
          {selectedCourt && selectedDate && (
            <span className="text-sm text-gray-600">
              Managing: {courts.find(c => c._id === selectedCourt)?.name} on {new Date(selectedDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h3 className="text-lg font-semibold mb-4">Add/Edit Time Slot</h3>
          <form onSubmit={handleAddTimeSlot} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="available">Available</option>
                <option value="blocked">Blocked</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason (Optional)</label>
              <input
                type="text"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Maintenance, Event"
              />
            </div>
            
            <div className="md:col-span-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Updating...' : 'Update Time Slot'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Time Slots Grid */}
      {selectedCourt && selectedDate && timeSlots.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Time Slots for {new Date(selectedDate).toLocaleDateString()}</h3>
          
          <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2">
            {timeSlots.map((slot) => (
              <div
                key={slot._id}
                className={`p-2 rounded border text-center text-xs ${
                  slot.status === 'available' ? 'bg-green-50 border-green-200' :
                  slot.status === 'blocked' ? 'bg-red-50 border-red-200' :
                  'bg-yellow-50 border-yellow-200'
                }`}
              >
                <div className="font-medium">{slot.startTime}</div>
                <div className="text-gray-600">to</div>
                <div className="font-medium">{slot.endTime}</div>
                
                <div className="mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(slot.status)}`}>
                    {getStatusText(slot.status)}
                  </span>
                </div>
                
                {slot.reason && (
                  <div className="mt-1 text-xs text-gray-600 truncate" title={slot.reason}>
                    {slot.reason}
                  </div>
                )}
                
                <div className="mt-2 space-y-1">
                  <button
                    onClick={() => updateTimeSlotStatus(slot._id!, 'available')}
                    className={`w-full px-1 py-1 text-xs rounded ${
                      slot.status === 'available' 
                        ? 'bg-green-200 text-green-800' 
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => updateTimeSlotStatus(slot._id!, 'blocked')}
                    className={`w-full px-1 py-1 text-xs rounded ${
                      slot.status === 'blocked' 
                        ? 'bg-red-200 text-red-800' 
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}
                  >
                    ✗
                  </button>
                  <button
                    onClick={() => updateTimeSlotStatus(slot._id!, 'maintenance')}
                    className={`w-full px-1 py-1 text-xs rounded ${
                      slot.status === 'maintenance' 
                        ? 'bg-yellow-200 text-yellow-800' 
                        : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                    }`}
                  >
                    🔧
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            <p><strong>Legend:</strong></p>
            <div className="flex gap-4 mt-2">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-100 border border-green-200 rounded"></span>
                Available
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 bg-red-100 border border-red-200 rounded"></span>
                Blocked
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 bg-yellow-100 border border-yellow-200 rounded"></span>
                Maintenance
              </span>
            </div>
          </div>
        </div>
      )}

      {selectedCourt && selectedDate && timeSlots.length === 0 && (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-500">No time slots configured for this date.</p>
          <p className="text-sm text-gray-400 mt-2">Use the form above to add time slots.</p>
        </div>
      )}

      {!selectedCourt || !selectedDate ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-500">Please select a facility, court, and date to manage time slots.</p>
        </div>
      ) : null}
    </div>
  );
};

export default TimeSlotManagement;
