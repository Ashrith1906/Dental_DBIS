import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext"; // Access dentistId from context
import { toast } from "react-toastify";
import DentistNavbar from "./DentistNavbar";

// Helper function to generate 20-minute time slots
const generateSlots = (startTime, endTime) => {
  const slots = [];
  let start = new Date(`1970-01-01T${startTime}:00`);
  const end = new Date(`1970-01-01T${endTime}:00`);

  while (start < end) {
    const nextSlot = new Date(start.getTime() + 20 * 60 * 1000);
    slots.push(start.toTimeString().substring(0, 5)); // Add HH:mm format
    start = nextSlot;
  }

  return slots;
};

const DentistSchedule = () => {
  const { dentistId } = useAuth(); // Get dentistId from the context
  const [timeRanges, setTimeRanges] = useState([{ startTime: "", endTime: "" }]); // For handling multiple time ranges
  const [loading, setLoading] = useState(false); // For loading state
  const [error, setError] = useState(""); // For error state
  const [availableTime, setAvailableTime] = useState([]); // Store generated time slots

  // Fetch existing schedule when the component mounts
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/appointments/schedule?dentistId=${dentistId}`
        );
        if (response.data.schedule) {
          setAvailableTime(response.data.schedule.availableTime); // Set existing available time
        }
      } catch (err) {
        setError("Error fetching schedule.");
      }
    };

    if (dentistId) {
      fetchSchedule();
    }
  }, [dentistId]);

  // Handle form submission to create or update schedule
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Reset error state

    // Generate slots for all time ranges
    const generatedSlots = timeRanges.flatMap(range =>
      generateSlots(range.startTime, range.endTime)
    );

    try {
      const response = await axios.post(
        "http://localhost:3000/api/appointments/schedule",
        {
          dentistId,
          timeRanges: timeRanges, // Send time ranges to the backend
        }
      );
      toast.success(response.data.message); // Show success message
      setAvailableTime(generatedSlots); // Update the UI with generated slots
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Error updating schedule.");
      toast.error(error);
    }
  };

  // Handle adding/removing time ranges
  const handleTimeRangeChange = (index, field, value) => {
    const newRanges = [...timeRanges];
    newRanges[index][field] = value;
    setTimeRanges(newRanges);
  };

  const handleAddTimeRange = () => {
    setTimeRanges([...timeRanges, { startTime: "", endTime: "" }]);
  };

  const handleRemoveTimeRange = (index) => {
    const newRanges = [...timeRanges];
    newRanges.splice(index, 1);
    setTimeRanges(newRanges);
  };

  return (
    <>
    <DentistNavbar/>
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-gray-800 text-center mb-6">
        Manage Dentist Schedule
      </h1>

      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-semibold text-gray-700 mb-6">Schedule Management</h2>

        {error && (
          <div className="mb-4 p-4 text-red-700 bg-red-100 border border-red-300 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {timeRanges.map((range, index) => (
            <div key={index} className="mb-6 flex flex-wrap space-x-6">
              <div className="flex-1">
                <label
                  htmlFor={`startTime-${index}`}
                  className="block text-gray-700 font-medium mb-2"
                >
                  Start Time
                </label>
                <input
                  type="time"
                  id={`startTime-${index}`}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={range.startTime}
                  onChange={(e) => handleTimeRangeChange(index, "startTime", e.target.value)}
                  required
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor={`endTime-${index}`}
                  className="block text-gray-700 font-medium mb-2"
                >
                  End Time
                </label>
                <input
                  type="time"
                  id={`endTime-${index}`}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={range.endTime}
                  onChange={(e) => handleTimeRangeChange(index, "endTime", e.target.value)}
                  required
                />
              </div>
              {timeRanges.length > 1 && (
                <button
                  type="button"
                  className="text-red-500 mt-8"
                  onClick={() => handleRemoveTimeRange(index)}
                >
                  <i className="fas fa-trash-alt"></i> Remove
                </button>
              )}
            </div>
          ))}

          <div className="mb-6">
            <button
              type="button"
              className="text-blue-600 font-medium hover:underline"
              onClick={handleAddTimeRange}
            >
              + Add Another Time Range
            </button>
          </div>

          <div className="mb-6">
            <button
              type="submit"
              className={`w-full py-3 text-white font-semibold rounded-lg ${
                loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
              disabled={loading}
            >
              {loading ? "Updating..." : "Save Schedule"}
            </button>
          </div>
        </form>

        {availableTime.length > 0 && !loading && (
          <div className="mt-8 text-gray-800">
            <h3 className="text-2xl font-semibold mb-4">Current Schedule:</h3>
            <ul className="space-y-2">
              {availableTime.map((slot, index) => (
                <li key={index} className="text-lg">{slot}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default DentistSchedule;