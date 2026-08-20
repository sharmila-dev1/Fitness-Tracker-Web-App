import { useState } from "react";
import Modal from "../components/UI/Modal";
import ProgressRing from "../components/UI/ProgressRing";
import { NutritionChart, MacroPieChart,} from "../components/Charts/NutritionChart";
import { useNutrition } from "../hooks/useNutrition";
import { formatDate, getMealTypeIcon, MEAL_TYPES, getTodayDate} from "../utils/Helpers";

const EMPTY_FORM = { name: "", type: "Breakfast", calories: "", protein: "", carbs: "", fat: "", date: getTodayDate()};

export default function Nutrition() {
  const { meals, addMeal, deleteMeal, getTodayMeals, getTodayTotals, goals, getWeeklyCalories,} = useNutrition();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [activeTab, setActiveTab] = useState("today");

  const todayTotals = getTodayTotals();
  const todayMeals = getTodayMeals();
  const weeklyData = getWeeklyCalories();

  const handleSubmit = () => {
    if (!form.name || !form.calories) return;
    addMeal({
      ...form,
      calories: Number(form.calories),
      protein: Number(form.protein) || 0,
      carbs: Number(form.carbs) || 0,
      fat: Number(form.fat) || 0,
    });
    setShowModal(false);
    setForm(EMPTY_FORM);
  };

  const macroData = [
    {
      label: "Protein",
      current: todayTotals.protein,
      goal: goals.protein,
      color: "#00d4ff",
      unit: "g",
    },
    {
      label: "Carbs",
      current: todayTotals.carbs,
      goal: goals.carbs,
      color: "#ff6b35",
      unit: "g",
    },
    {
      label: "Fat",
      current: todayTotals.fat,
      goal: goals.fat,
      color: "#ffcc00",
      unit: "g",
    },
  ];

  const displayMeals = activeTab === "today" ? todayMeals : meals.slice(0, 20);

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Nutrition</h1>
          <p className="page-subtitle">
            Monitor your daily macros and calories
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + Log Meal
        </button>
      </div>

      <div className="dashboard-grid">
        {/* Calorie Overview */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Today's Calories</h3>
            <span className="card-badge today">Today</span>
          </div>
          <div className="calorie-center">
            <ProgressRing
              percentage={Math.min(
                100,
                Math.round((todayTotals.calories / goals.calories) * 100),
              )}
              size={140}
              strokeWidth={10}
              color="#34c759"
              value={todayTotals.calories.toString()}
            />
            <p className="calorie-goal-text">of {goals.calories} kcal goal</p>
          </div>
          <div className="macro-summary">
            {macroData.map((m) => (
              <div key={m.label} className="macro-item">
                <ProgressRing
                  percentage={Math.min( 100, Math.round((m.current / m.goal) * 100),)}
                  size={60}
                  strokeWidth={5}
                  color={m.color}
                  value={`${m.current}${m.unit}`}
                />
                <span className="macro-label">{m.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Macro Breakdown Pie */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Macro Breakdown</h3>
          </div>
          <MacroPieChart
            protein={todayTotals.protein}
            carbs={todayTotals.carbs}
            fat={todayTotals.fat}
          />
          <div className="macro-legend">
            {[
              ["Protein", "#00d4ff"],
              ["Carbs", "#ff6b35"],
              ["Fat", "#ffcc00"],
            ].map(([label, color]) => (
              <div key={label} className="legend-item">
                <div className="legend-dot" style={{ background: color }} />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Chart */}
        <div className="dashboard-card span-2">
          <div className="card-header">
            <h3>Weekly Nutrition Trends</h3>
          </div>
          <NutritionChart data={weeklyData} goal={goals.calories} />
        </div>
      </div>

      {/* Meal Log */}
      <div className="section-header">
        <div className="tab-group">
          <button
            className={`tab-btn ${activeTab === "today" ? "active" : ""}`}
            onClick={() => setActiveTab("today")}
          >
            Today
          </button>
          <button
            className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            All Meals
          </button>
        </div>
      </div>

      <div className="meal-list">
        {displayMeals.length === 0 && (
          <div className="empty-state">
            <span className="empty-icon">🥗</span>
            <p>No meals logged today. Track your first meal!</p>
          </div>
        )}
        {displayMeals.map((meal) => (
          <div key={meal.id} className="meal-card">
            <div className="meal-icon-wrap">{getMealTypeIcon(meal.type)}</div>
            <div className="meal-info">
              <span className="meal-name">{meal.name}</span>
              <span className="meal-type-date">
                {meal.type} · {formatDate(meal.date)}
              </span>
            </div>
            <div className="meal-macros">
              <span className="macro-pill protein">{meal.protein}g P</span>
              <span className="macro-pill carbs">{meal.carbs}g C</span>
              <span className="macro-pill fat">{meal.fat}g F</span>
            </div>
            <div className="meal-calories">
              {meal.calories} <span>kcal</span>
            </div>
            <button className="delete-btn" onClick={() => deleteMeal(meal.id)}>
              ✕
            </button>
          </div>
        ))}
      </div>

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        title="Log New Meal"
      >
        <div className="form-grid">
          <div className="form-group span-2">
            <label>Meal Name *</label>
            <input
              className="form-input"
              placeholder="e.g. Chicken Salad"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Meal Type</label>
            <select
              className="form-input"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              {MEAL_TYPES.map((t) => (
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
            <label>Calories *</label>
            <input
              type="number"
              className="form-input"
              placeholder="450"
              value={form.calories}
              onChange={(e) => setForm({ ...form, calories: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Protein (g)</label>
            <input
              type="number"
              className="form-input"
              placeholder="30"
              value={form.protein}
              onChange={(e) => setForm({ ...form, protein: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Carbs (g)</label>
            <input
              type="number"
              className="form-input"
              placeholder="45"
              value={form.carbs}
              onChange={(e) => setForm({ ...form, carbs: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Fat (g)</label>
            <input
              type="number"
              className="form-input"
              placeholder="15"
              value={form.fat}
              onChange={(e) => setForm({ ...form, fat: e.target.value })}
            />
          </div>
          <div className="form-actions span-2">
            <button className="btn-secondary" onClick={() => setShowModal(false)}>
              Cancel
            </button>
            <button className="btn-primary" onClick={handleSubmit}>
              Save Meal
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}