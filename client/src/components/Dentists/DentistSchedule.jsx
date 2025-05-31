import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
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
  const [timeRanges, setTimeRanges] = useState([
    { startTime: "", endTime: "" },
  ]); // For handling multiple time ranges
  const [loading, setLoading] = useState(false); // For loading state
  const [error, setError] = useState(""); // For error state
  const [availableTime, setAvailableTime] = useState([]); // Store generated time slots
  const [availableSlots, setAvailableSlots] = useState([]); // Store available slots from API
  const [date, setDate] = useState(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  });

  // Fetch available slots when component mounts or dentistId/date changes
  useEffect(() => {
    const fetchSlots = async () => {
      if (!dentistId || !date) return; // Avoid unnecessary API calls

      setLoading(true);
      setError(""); // Clear previous errors

      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_BASE_URL
          }appointments/${dentistId}/available-slots/${date}`
        );

        const { availableSlots } = response.data; // Extract available slots from the API response
        if (availableSlots && availableSlots.length > 0) {
          setAvailableSlots(availableSlots);
        } else {
          setAvailableSlots([]);
        }
      } catch (err) {
        console.error(err);
        // setError(err.response?.data?.message || "Failed to fetch available slots.");
        setAvailableSlots([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [dentistId, date]);

  // Fetch existing schedule when the component mounts or dentistId changes
  useEffect(() => {
    const fetchSchedule = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_BASE_URL
          }appointments/schedule?dentistId=${dentistId}&date=${date}`
        );
        if (
          response.data.schedule &&
          response.data.schedule.availableTime.length > 0
        ) {
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
    const generatedSlots = timeRanges.flatMap((range) =>
      generateSlots(range.startTime, range.endTime)
    );

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}appointments/schedule`,
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-100 flex justify-center items-center px-5 py-10">
        <div className="w-full max-w-4xl p-8 bg-white rounded-2xl shadow-2xl border border-gray-300">
          <h2 className="text-3xl font-extrabold text-center text-teal-700 mb-6">
            Manage Your Schedule
          </h2>

          {error && (
            <div className="mb-6 p-4 text-red-700 bg-red-100 border border-red-300 rounded-xl">
              {error}
            </div>
          )}

          {availableTime.length === 0 && !loading && (
            <div className="mb-6 p-4 text-yellow-700 bg-yellow-100 border border-yellow-300 rounded-xl">
              No schedule found on {date}. Please create a new one.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-teal-900 mb-1"
              >
                Select Date
              </label>
              <input
                type="date"
                id="date"
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            {timeRanges.map((range, index) => (
              <div
                key={index}
                className="flex flex-wrap gap-4 border border-gray-200 p-4 rounded-xl bg-teal-50"
              >
                <div className="flex-1 min-w-[45%]">
                  <label
                    htmlFor={`startTime-${index}`}
                    className="block text-sm font-medium text-teal-900 mb-1"
                  >
                    Start Time
                  </label>
                  <input
                    type="time"
                    id={`startTime-${index}`}
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                    value={range.startTime}
                    onChange={(e) =>
                      handleTimeRangeChange(index, "startTime", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="flex-1 min-w-[45%]">
                  <label
                    htmlFor={`endTime-${index}`}
                    className="block text-sm font-medium text-teal-900 mb-1"
                  >
                    End Time
                  </label>
                  <input
                    type="time"
                    id={`endTime-${index}`}
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                    value={range.endTime}
                    onChange={(e) =>
                      handleTimeRangeChange(index, "endTime", e.target.value)
                    }
                    required
                  />
                </div>

                {timeRanges.length > 1 && (
                  <div className="flex items-end">
                    <button
                      type="button"
                      className="text-red-600 hover:text-red-800 font-medium text-sm"
                      onClick={() => handleRemoveTimeRange(index)}
                    >
                      <i className="fas fa-trash-alt mr-1"></i> Remove
                    </button>
                  </div>
                )}
              </div>
            ))}

            <div>
              <button
                type="button"
                className="text-teal-600 font-medium text-sm hover:underline"
                onClick={handleAddTimeRange}
              >
                + Add Another Time Range
              </button>
            </div>

            <div className="pt-4 flex justify-center">
              <button
                type="submit"
                className={`w-full md:w-1/3 py-3 text-base font-semibold text-white rounded-xl transition shadow-md ${
                  loading
                    ? "bg-teal-400 cursor-not-allowed"
                    : "bg-teal-500 hover:bg-teal-600"
                }`}
                disabled={loading}
              >
                {loading ? "Updating..." : "Save"}
              </button>
            </div>
          </form>

          {availableSlots.length > 0 && !loading && (
            <div className="mt-10">
              <h3 className="text-2xl font-semibold text-teal-700 mb-4">
                Available Slots:
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {availableSlots.map((slot, index) => (
                  <div
                    key={index}
                    className="bg-teal-100 text-center py-2 rounded-lg shadow-md hover:bg-teal-200 transition"
                  >
                    <span className="text-lg font-semibold text-teal-700">
                      {slot}
                    </span>
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
