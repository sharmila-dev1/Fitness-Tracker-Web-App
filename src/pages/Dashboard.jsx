import StatCard from "../components/UI/StatCard";
import WorkoutChart from "../components/Charts/WorkoutChart";
import { NutritionChart } from "../components/Charts/NutritionChart";
import ProgressRing from "../components/UI/ProgressRing";
import { useWorkouts } from "../hooks/useWorkouts";
import { useNutrition } from "../hooks/useNutrition";
import { useProgress } from "../hooks/useProgress";
import { formatDate, formatDuration, getWorkoutTypeColor, getMealTypeIcon,} from "../utils/Helpers";

export default function Dashboard() {
  const { workouts, getTotalStats, getWeeklyData } = useWorkouts();
  const { getTodayTotals, goals: nutritionGoals, getWeeklyCalories,} = useNutrition();
  const { getLatestEntry, goals: progressGoals } = useProgress();

  const stats = getTotalStats();
  const todayNutrition = getTodayTotals();
  const latest = getLatestEntry();
  const weeklyWorkouts = getWeeklyData();
  const weeklyNutrition = getWeeklyCalories();
  const recentWorkouts = workouts.slice(0, 4);

  const caloriePct = Math.round((todayNutrition.calories / nutritionGoals.calories) * 100,);
  const proteinPct = Math.round((todayNutrition.protein / nutritionGoals.protein) * 100,);

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Welcome back, Here's your fitness overview.
          </p>
        </div>
        <div className="header-date">
          {formatDate(new Date().toISOString().split("T")[0])}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="stats-grid">
        <StatCard
          title="Total Workouts"
          value={stats.totalWorkouts}
          icon="🏋️"
          color="#ff6b35"
          trend={12}
          subtitle="All time"
        />
        <StatCard
          title="Calories Burned"
          value={stats.totalCalories.toLocaleString()}
          icon="🔥"
          color="#ff2d55"
          trend={8}
          subtitle="All time"
        />
        <StatCard
          title="Total Duration"
          value={formatDuration(stats.totalDuration)}
          icon="⏱️"
          color="#00d4ff"
          trend={5}
          subtitle="Active time"
        />
        <StatCard
          title="Current Weight"
          value={latest ? `${latest.weight}kg` : "—"}
          icon="⚖️"
          color="#34c759"
          trend={-2}
          subtitle="Last recorded"
        />
      </div>

      <div className="dashboard-grid">
        {/* Weekly Activity */}
        <div className="dashboard-card span-2">
          <div className="card-header">
            <h3>Weekly Activity</h3>
            <span className="card-badge">This Week</span>
          </div>
          <WorkoutChart data={weeklyWorkouts} />
        </div>

        {/* Today's Nutrition */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Today's Nutrition</h3>
            <span className="card-badge today">Today</span>
          </div>
          <div className="ring-row">
            <ProgressRing
              percentage= {caloriePct}
              color="#ff6b35"
              label="Calories"
              value={`${todayNutrition.calories}`}
            />
            <ProgressRing
              percentage={proteinPct}
              color="#00d4ff"
              label="Protein"
              value={`${todayNutrition.protein}g`}
            />
            <ProgressRing
              percentage={Math.round(
                (todayNutrition.carbs / nutritionGoals.carbs) * 100,
              )}
              color="#34c759"
              label="Carbs"
              value={`${todayNutrition.carbs}g`}
            />
          </div>
          <div className="nutrition-total">
            <span className="total-cal">{todayNutrition.calories}</span>
            <span className="total-cal-label">
              / {nutritionGoals.calories} kcal goal
            </span>
          </div>
        </div>

        {/* Weekly Calories Chart */}
        <div className="dashboard-card span-2">
          <div className="card-header">
            <h3>Weekly Nutrition</h3>
            <span className="card-badge">Calories & Protein</span>
          </div>
          <NutritionChart data={weeklyNutrition} goal={nutritionGoals.calories}/>
        </div>

        {/* Active Goals */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Active Goals</h3>
            <span className="card-badge">{progressGoals.length} goals</span>
          </div>
          <div className="goals-list">
            {progressGoals.map((goal) => {
              const pct = Math.min( 100, Math.round((goal.current / goal.target) * 100));
              return (
                <div key={goal.id} className="goal-item">
                  <div className="goal-meta">
                    <span className="goal-title">{goal.title}</span>
                    <span className="goal-val">
                      {goal.current} / {goal.target} {goal.unit}
                    </span>
                  </div>
                  <div className="goal-bar">
                    <div className="goal-fill" style={{ width: `${pct}%` }} />
                  </div>
                </div>
                );
            })}
          </div>
        </div>

        {/* Recent Workouts */}
        <div className="dashboard-card span-2">
          <div className="card-header">
            <h3>Recent Workouts</h3>
          </div>
          <div className="recent-list">
            {recentWorkouts.map((workout) => (
              <div key={workout.id} className="recent-item">
                <div
                  className="recent-type-dot"
                  style={{ background: getWorkoutTypeColor(workout.type) }}
                />
                <div className="recent-info">
                  <span className="recent-name">{workout.name}</span>
                  <span className="recent-meta">
                    {workout.type} · {formatDate(workout.date)}
                  </span>
                </div>
                <div className="recent-stats">
                  <span className="recent-duration">
                    {formatDuration(workout.duration)}
                  </span>
                  <span className="recent-calories">🔥 {workout.calories}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
