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
  const [date, setDate] = useState("2024-11-18"); // Default date, can be dynamic

  // Fetch existing schedule when the component mounts or dentistId changes
  useEffect(() => {
    const fetchSchedule = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:3000/api/appointments/schedule?dentistId=${dentistId}&date=${date}`
        );
        if (response.data.schedule && response.data.schedule.availableTime.length > 0) {
          setAvailableTime(response.data.schedule.availableTime); // Set available times
        } else {
          setAvailableTime([]); // If no schedule, show empty
        }
      } catch (err) {
        setAvailableTime([]); // If error, assume no schedule
        // setError("Error fetching schedule.");
      } finally {
        setLoading(false);
      }
    };

    if (dentistId) {
      fetchSchedule();
    }
  }, [dentistId, date]);

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
          date, // Use the selected date
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
      <DentistNavbar />
      <div className="flex justify-center items-center min-h-screen  px-5"> {/* Added px-5 for 20px padding on both sides */}
        <div className="w-full max-w-4xl p-8 space-y-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-teal-600">Manage Your Schedule</h2>

          {error && (
            <div className="mb-4 p-4 text-red-700 bg-red-100 border border-red-300 rounded-md">
              {error}
            </div>
          )}

          {availableTime.length === 0 && !loading && (
            <div className="mb-4 p-4 text-yellow-700 bg-yellow-100 border border-yellow-300 rounded-md">
              No schedule found on {date}. Please create a new one.
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="date" className="block text-teal-600 font-medium mb-2">
                Select Date
              </label>
              <input
                type="date"
                id="date"
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={date}
                onChange={(e) => setDate(e.target.value)} // Handle date change
                required
              />
            </div>

            {timeRanges.map((range, index) => (
              <div key={index} className="mb-6 flex flex-wrap space-x-6">
                <div className="flex-1">
                  <label
                    htmlFor={`startTime-${index}`}
                    className="block text-teal-600 font-medium mb-2"
                  >
                    Start Time
                  </label>
                  <input
                    type="time"
                    id={`startTime-${index}`}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={range.startTime}
                    onChange={(e) => handleTimeRangeChange(index, "startTime", e.target.value)}
                    required
                  />
                </div>
                <div className="flex-1">
                  <label
                    htmlFor={`endTime-${index}`}
                    className="block text-teal-600 font-medium mb-2"
                  >
                    End Time
                  </label>
                  <input
                    type="time"
                    id={`endTime-${index}`}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                className="text-teal-600 font-medium hover:underline"
                onClick={handleAddTimeRange}
              >
                + Add Another Time Range
              </button>
            </div>

            <div className="mb-6">
              <button
                type="submit"
                className={`w-full py-3 text-white font-semibold rounded-lg ${
                  loading ? "bg-teal-400" : "bg-teal-600 hover:bg-teal-700"
                }`}
                disabled={loading}
              >
                {loading ? "Updating..." : "Save Schedule"}
              </button>
            </div>
          </form>

          {availableTime.length > 0 && !loading && (
            <div className="mt-8">
              <h3 className="text-2xl font-semibold mb-4 text-teal-600">Your Slots:</h3>
              <div className="grid grid-cols-3 gap-4">
                {availableTime.map((slot, index) => (
                  <div
                    key={index}
                    className="bg-teal-100 text-center py-2 rounded-lg shadow-md hover:bg-teal-200"
                  >
                    <span className="text-xl font-semibold text-teal-700">{slot}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DentistSchedule;