import { useState } from "react";
import Modal from "../components/UI/Modal";
import WorkoutChart from "../components/Charts/WorkoutChart";
import { useWorkouts } from "../hooks/useWorkouts";
import { formatDate, formatDuration, getWorkoutTypeColor, WORKOUT_TYPES, getTodayDate,} from "../utils/Helpers";

const EMPTY_FORM = { name: "", type: "Cardio", duration: "", calories: "", date: getTodayDate(), notes: "",};

export default function Workouts() {
  const { workouts, addWorkout, deleteWorkout, getWeeklyData } = useWorkouts();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = workouts.filter((w) => {
    const matchType = filter === "All" || w.type === filter;
    const matchSearch = (w.name || "").toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const handleSubmit = () => {
    if (!form.name || !form.duration) return;
    addWorkout({
      ...form,
      duration: Number(form.duration),
      calories: Number(form.calories) || 0,
    });
    setShowModal(false);
    setForm(EMPTY_FORM);
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Workouts</h1>
          <p className="page-subtitle"> Track and manage your training sessions </p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + Log Workout
        </button>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card span-3">
          <div className="card-header">
            <h3>Weekly Activity</h3>
          </div>
          <WorkoutChart data={getWeeklyData()} />
        </div>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <input
          className="search-input"
          placeholder="🔍 Search workouts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="filter-chips">
          {["All", ...WORKOUT_TYPES].map((type) => (
            <button
              key={type}
              className={`filter-chip ${filter === type ? "active" : ""}`}
              onClick={() => setFilter(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Workout List */}
      <div className="workout-grid">
        {filtered.length === 0 && (
          <div className="empty-state">
            <span className="empty-icon">🏋️</span>
            <p>No workouts found. Log your first workout!</p>
          </div>
        )}
        {filtered.map((workout) => (
          <div key={workout.id} className="workout-card">
            <div className="workout-card-header">
              <div
                className="workout-type-badge"
                style={{
                  background: getWorkoutTypeColor(workout.type) + "22",
                  color: getWorkoutTypeColor(workout.type),
                }}
              >
                {workout.type}
              </div>
              <button className="delete-btn" onClick={() => deleteWorkout(workout.id)} > 
                ✕ 
              </button>
            </div>
            <h4 className="workout-name">{workout.name}</h4>
            <p className="workout-date">{formatDate(workout.date)}</p>
            <div className="workout-stats-row">
              <div className="w-stat">
                <span className="w-stat-val">
                  {formatDuration(workout.duration)}
                </span>
                <span className="w-stat-lbl">Duration</span>
              </div>
              <div className="w-stat">
                <span className="w-stat-val">🔥 {workout.calories}</span>
                <span className="w-stat-lbl">Calories</span>
              </div>
            </div>
            {workout.notes && (
              <p className="workout-notes">"{workout.notes}"</p>
            )}
            <div
              className="workout-bar"
              style={{ "--type-color": getWorkoutTypeColor(workout.type) }}
            />
          </div>
        ))}
      </div>

      {/* Add Workout Modal */}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        title="Log New Workout"
      >
        <div className="form-grid">
          <div className="form-group span-2">
            <label>Workout Name *</label>
            <input
              className="form-input"
              placeholder="e.g. Morning Run"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Type</label>
            <select
              className="form-input"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              {WORKOUT_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              className="form-input"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Duration (minutes) *</label>
            <input
              type="number"
              className="form-input"
              placeholder="45"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Calories Burned</label>
            <input
              type="number"
              className="form-input"
              placeholder="300"
              value={form.calories}
              onChange={(e) => setForm({ ...form, calories: e.target.value })}
            />
          </div>
          <div className="form-group span-2">
            <label>Notes</label>
            <textarea
              className="form-input"
              rows={3}
              placeholder="How did it go?"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>
          <div className="form-actions span-2">
            <button
              className="btn-secondary"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
            <button className="btn-primary" onClick={handleSubmit}>
              Save Workout
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
