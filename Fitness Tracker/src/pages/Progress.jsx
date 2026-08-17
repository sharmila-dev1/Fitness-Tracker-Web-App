import { useState } from "react";
import Modal from "../components/UI/Modal";
import ProgressChart from "../components/Charts/ProgressChart";
import { useProgress } from "../hooks/useProgress";
import { formatDate, getGoalProgress } from "../utils/Helpers";

const EMPTY_ENTRY = { date: new Date().toISOString().split("T")[0], weight: "", bodyFat: "", chest: "", waist: "", hips: "",};
const EMPTY_GOAL = { title: "", target: "", current: "", unit: "kg", category: "weight", deadline: ""};

const CATEGORY_ICONS = { weight: "⚖️", cardio: "🏃", strength: "💪", composition: "📊",};

export default function ProgressPage() {
  const { entries, addEntry, deleteEntry, goals, addGoal, deleteGoal, getLatestEntry, getFirstEntry, getWeightTrend,} = useProgress();
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [entryForm, setEntryForm] = useState(EMPTY_ENTRY);
  const [goalForm, setGoalForm] = useState(EMPTY_GOAL);

  const latest = getLatestEntry();
  const first = getFirstEntry();
  const weightDiff = latest && first ? (latest.weight - first.weight).toFixed(1) : null;
  const fatDiff = latest && first ? (latest.bodyFat - first.bodyFat).toFixed(1) : null;

  const handleAddEntry = () => {
    if (!entryForm.weight) return;
    addEntry({
      ...entryForm,
      weight: Number(entryForm.weight),
      bodyFat: Number(entryForm.bodyFat) || 0,
      chest: Number(entryForm.chest) || 0,
      waist: Number(entryForm.waist) || 0,
      hips: Number(entryForm.hips) || 0,
    });
    setShowEntryModal(false);
    setEntryForm(EMPTY_ENTRY);
  };

  const handleAddGoal = () => {
    if (!goalForm.title || !goalForm.target) return;
    addGoal({
      ...goalForm,
      target: Number(goalForm.target),
      current: Number(goalForm.current) || 0,
    });
    setShowGoalModal(false);
    setGoalForm(EMPTY_GOAL);
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Progress</h1>
          <p className="page-subtitle"> Track your body measurements and fitness goals </p>
        </div>
        <div className="header-actions">
          <button
            className="btn-secondary"
            onClick={() => setShowGoalModal(true)}
          >
            + Add Goal
          </button>
          <button
            className="btn-primary"
            onClick={() => setShowEntryModal(true)}
          >
            + Log Measurements
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      {latest && (
        <div className="stats-grid">
          <div className="stat-card" style={{ "--card-accent": "#00d4ff" }}>
            <div className="stat-card-header">
              <span className="stat-icon">⚖️</span>
              {weightDiff !== null && (
                <span className={`stat-trend ${Number(weightDiff) <= 0 ? "up" : "down"}`}>
                  {Number(weightDiff) <= 0 ? "↓" : "↑"} {Math.abs(weightDiff)}kg
                </span>
              )}
            </div>
            <div className="stat-value">{latest.weight}kg</div>
            <div className="stat-title">Current Weight</div>
            <div className="stat-subtitle">Since {formatDate(first?.date)}</div>
            <div className="stat-card-glow" />
          </div>
          <div className="stat-card" style={{ "--card-accent": "#ff6b35" }}>
            <div className="stat-card-header">
              <span className="stat-icon">📊</span>
              {fatDiff !== null && (
                <span className={`stat-trend ${Number(fatDiff) <= 0 ? "up" : "down"}`} >
                  {Number(fatDiff) <= 0 ? "↓" : "↑"} {Math.abs(fatDiff)}%
                </span>
              )}
            </div>
            <div className="stat-value">{latest.bodyFat}%</div>
            <div className="stat-title">Body Fat</div>
            <div className="stat-subtitle">Current reading</div>
            <div className="stat-card-glow" />
          </div>
          <div className="stat-card" style={{ "--card-accent": "#34c759" }}>
            <div className="stat-card-header">
              <span className="stat-icon">📏</span>
            </div>
            <div className="stat-value">{latest.waist}cm</div>
            <div className="stat-title">Waist</div>
            <div className="stat-subtitle">Latest measurement</div>
            <div className="stat-card-glow" />
          </div>
          <div className="stat-card" style={{ "--card-accent": "#af52de" }}>
            <div className="stat-card-header">
              <span className="stat-icon">💪</span>
            </div>
            <div className="stat-value">{entries.length}</div>
            <div className="stat-title">Total Entries</div>
            <div className="stat-subtitle">Measurements logged</div>
            <div className="stat-card-glow" />
          </div>
        </div>
      )}

      <div className="dashboard-grid">
        {/* Weight Trend Chart */}
        <div className="dashboard-card span-3">
          <div className="card-header">
            <h3>Weight & Body Fat Trend</h3>
          </div>
          <ProgressChart data={getWeightTrend()} />
        </div>

        {/* Goals */}
        <div className="dashboard-card span-2">
          <div className="card-header">
            <h3>Fitness Goals</h3>
            <span className="card-badge">{goals.length} active</span>
          </div>
          <div className="goals-detailed">
            {goals.map((goal) => {
              const pct = Math.min(
                100,
                Math.round((goal.current / goal.target) * 100),
            );
            const isLower = ["weight", "composition"].includes(goal.category);
            const adjPct = isLower ? Math.min(100,
                Math.round(getGoalProgress(goal.current, goal.target, true),),) : pct;
                return (
                <div key={goal.id} className="goal-detail-card">
                    <div className="goal-detail-header">
                        <span className="goal-cat-icon">
                            {CATEGORY_ICONS[goal.category] || "🎯"}
                        </span>
                    <div className="goal-detail-meta">
                      <span className="goal-detail-title">{goal.title}</span>
                      {goal.deadline && (
                        <span className="goal-deadline"> Due {formatDate(goal.deadline)} </span>
                      )}
                    </div>
                    <button
                      className="delete-btn"
                      onClick={() => deleteGoal(goal.id)}
                    >
                      ✕
                    </button>
                  </div>
                  <div className="goal-progress-row">
                    <span className="goal-current"> {goal.current} {goal.unit} </span>
                    <span className="goal-target"> / {goal.target} {goal.unit} </span>
                    <span className="goal-pct">{adjPct}%</span>
                  </div>
                  <div className="goal-bar full">
                    <div
                      className="goal-fill"
                      style={{ width: `${adjPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Measurement History */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Measurement History</h3>
          </div>
          <div className="entry-list">
            {[...entries].reverse().map((entry) => (
              <div key={entry.id} className="entry-item">
                <div className="entry-date">{formatDate(entry.date)}</div>
                <div className="entry-vals">
                  <span>{entry.weight}kg</span>
                  <span>{entry.bodyFat}% BF</span>
                  <span className="entry-waist">W:{entry.waist}cm</span>
                </div>
                <button
                  className="delete-btn sm"
                  onClick={() => deleteEntry(entry.id)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Log Entry Modal */}
      <Modal
        show={showEntryModal}
        onClose={() => setShowEntryModal(false)}
        title="Log Measurements"
      >
        <div className="form-grid">
          <div className="form-group span-2">
            <label>Date</label>
            <input
              type="date"
              className="form-input"
              value={entryForm.date}
              onChange={(e) =>
                setEntryForm({ ...entryForm, date: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>Weight (kg) *</label>
            <input
              type="number"
              step="0.1"
              className="form-input"
              placeholder="75.5"
              value={entryForm.weight}
              onChange={(e) =>
                setEntryForm({ ...entryForm, weight: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>Body Fat %</label>
            <input
              type="number"
              step="0.1"
              className="form-input"
              placeholder="16.5"
              value={entryForm.bodyFat}
              onChange={(e) =>
                setEntryForm({ ...entryForm, bodyFat: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>Chest (cm)</label>
            <input
              type="number"
              className="form-input"
              placeholder="95"
              value={entryForm.chest}
              onChange={(e) =>
                setEntryForm({ ...entryForm, chest: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>Waist (cm)</label>
            <input
              type="number"
              className="form-input"
              placeholder="82"
              value={entryForm.waist}
              onChange={(e) =>
                setEntryForm({ ...entryForm, waist: e.target.value })
              }
            />
          </div>
          <div className="form-group span-2">
            <label>Hips (cm)</label>
            <input
              type="number"
              className="form-input"
              placeholder="93"
              value={entryForm.hips}
              onChange={(e) =>
                setEntryForm({ ...entryForm, hips: e.target.value })
              }
            />
          </div>
          <div className="form-actions span-2">
            <button
              className="btn-secondary"
              onClick={() => setShowEntryModal(false)}
            >
              Cancel
            </button>
            <button className="btn-primary" onClick={handleAddEntry}>
              Save Entry
            </button>
          </div>
        </div>
      </Modal>

      {/* Add Goal Modal */}
      <Modal
        show={showGoalModal}
        onClose={() => setShowGoalModal(false)}
        title="Add New Goal"
      >
        <div className="form-grid">
          <div className="form-group span-2">
            <label>Goal Title *</label>
            <input
              className="form-input"
              placeholder="e.g. Run 5K under 25min"
              value={goalForm.title}
              onChange={(e) =>
                setGoalForm({ ...goalForm, title: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select
              className="form-input"
              value={goalForm.category}
              onChange={(e) =>
                setGoalForm({ ...goalForm, category: e.target.value })
              }
            >
              <option value="weight">Weight</option>
              <option value="cardio">Cardio</option>
              <option value="strength">Strength</option>
              <option value="composition">Body Composition</option>
            </select>
          </div>
          <div className="form-group">
            <label>Unit</label>
            <input
              className="form-input"
              placeholder="kg, min, reps..."
              value={goalForm.unit}
              onChange={(e) =>
                setGoalForm({ ...goalForm, unit: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>Target Value *</label>
            <input
              type="number"
              className="form-input"
              placeholder="100"
              value={goalForm.target}
              onChange={(e) =>
                setGoalForm({ ...goalForm, target: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>Current Value</label>
            <input
              type="number"
              className="form-input"
              placeholder="75"
              value={goalForm.current}
              onChange={(e) =>
                setGoalForm({ ...goalForm, current: e.target.value })
              }
            />
          </div>
          <div className="form-group span-2">
            <label>Deadline</label>
            <input
              type="date"
              className="form-input"
              value={goalForm.deadline}
              onChange={(e) =>
                setGoalForm({ ...goalForm, deadline: e.target.value })
              }
            />
          </div>
          <div className="form-actions span-2">
            <button
              className="btn-secondary"
              onClick={() => setShowGoalModal(false)}
            >
              Cancel
            </button>
            <button className="btn-primary" onClick={handleAddGoal}>
              Add Goal
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
