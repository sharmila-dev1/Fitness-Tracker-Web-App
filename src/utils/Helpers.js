export const generateId = () => Math.random().toString(36).substr(2, 9);

export const getTodayDate = () => new Date().toISOString().split("T")[0];

export const formatDate = (dateStr) => {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatDuration = (minutes) => {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
};

export const getWorkoutTypeColor = (type) => {
  const colors = {
    Cardio: "#00d4ff",
    Strength: "#ff6b35",
    HIIT: "#ff2d55",
    Flexibility: "#34c759",
    Sports: "#af52de",
    Other: "#8e8e93",
  };
  return colors[type] || colors.Other;
};

export const getMealTypeIcon = (type) => {
  const icons = {
    Breakfast: "🌅",
    Lunch: "☀️",
    Snack: "🍎",
    Dinner: "🌙",
  };
  return icons[type] || "🍽️";
};

export const calculateBMI = (weight, heightCm) => {
  const heightM = heightCm / 100;
  return (weight / (heightM * heightM)).toFixed(1);
};

export const getGoalProgress = (current, target, isLowerBetter = false) => {
  if (isLowerBetter) {
    const initial = target * 1.1;
    return Math.min(
      100,
      Math.max(0, ((initial - current) / (initial - target)) * 100),
    );
  }
  return Math.min(100, Math.max(0, (current / target) * 100));
};

export const WORKOUT_TYPES = [
  "Cardio",
  "Strength",
  "HIIT",
  "Flexibility",
  "Sports",
  "Other",
];

export const MEAL_TYPES = ["Breakfast", "Lunch", "Snack", "Dinner"];
