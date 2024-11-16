import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext"; // Access dentistId from context
import { toast } from "react-toastify";

const DentistSchedule = () => {
  const { dentistId } = useAuth(); // Get dentistId from the context
  const [availableTime, setAvailableTime] = useState(""); // Store available time
  const [loading, setLoading] = useState(false); // For loading state
  const [error, setError] = useState(""); // For error state

  // Fetch existing schedule when the component mounts
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/schedule?dentistId=${dentistId}`
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

    try {
      const response = await axios.post(
        "http://localhost:3000/api/schedule",
        {
          dentistId,
          availableTime,
        }
      );
      toast.success(response.data.message); // Show success message
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Error updating schedule.");
      toast.error(error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
        Dentist Schedule
      </h1>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Manage Schedule</h2>

        {error && (
          <p className="text-red-500 mb-4">{error}</p> // Show error message if any
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="availableTime"
              className="block text-gray-700 font-semibold mb-2"
            >
              Available Time Slots
            </label>
            <input
              type="text"
              id="availableTime"
              className="w-full p-3 border border-gray-300 rounded-md"
              placeholder="Enter available time slots (e.g., 9:00 AM - 5:00 PM)"
              value={availableTime}
              onChange={(e) => setAvailableTime(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <button
              type="submit"
              className={`w-full py-3 text-white font-semibold rounded-md ${
                loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
              }`}
              disabled={loading}
            >
              {loading ? "Updating..." : "Save Schedule"}
            </button>
          </div>
        </form>

        {availableTime && !loading && (
          <div className="mt-6 text-gray-600">
            <h3 className="font-semibold">Current Schedule:</h3>
            <p>{availableTime}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DentistSchedule;