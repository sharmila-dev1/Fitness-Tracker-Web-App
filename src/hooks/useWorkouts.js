import { useLocalStorage } from './useLocalStorage'
import {generateId,getTodayDate} from '../utils/Helpers'

const INITIAL_WORKOUTS = [
  { id: '1', date: '2026-08-08', name: 'Morning Run', type: 'Cardio', duration: 35, calories: 320, notes: 'Felt great!' },
  { id: '2', date: '2026-04-29', name: 'Upper Body', type: 'Strength', duration: 50, calories: 280, notes: 'New PR on bench' },
  { id: '3', date: '2026-04-30', name: 'Yoga Flow', type: 'Flexibility', duration: 45, calories: 150, notes: 'Good stretch session' },
  { id: '4', date: '2026-05-01', name: 'HIIT Circuit', type: 'HIIT', duration: 30, calories: 410, notes: 'Intense!' },
  { id: '5', date: '2026-05-02', name: 'Leg Day', type: 'Strength', duration: 60, calories: 350, notes: 'Squats and deadlifts' },
  { id: '6', date: '2026-05-05', name: 'Cycling', type: 'Cardio', duration: 55, calories: 480, notes: 'Outdoor ride' },
  { id: '7', date: '2026-05-07', name: 'Core Blast', type: 'Strength', duration: 25, calories: 200, notes: 'Ab day' },
];

export function useWorkouts(){
    const [workouts, setWorkouts] = useLocalStorage('workouts', INITIAL_WORKOUTS);
    
    const addWorkout = (workout) => {
        const newWorkout = { ...workout, id: generateId(), date: workout.date || getTodayDate() };
        setWorkouts(prev => [newWorkout, ...prev]);
        return newWorkout;
      };
    
    const deleteWorkout = (id) => {
        setWorkouts(prev => prev.filter(w => w.id !== id));
      };
    
    const updateWorkout = (id, updates) => {
        setWorkouts(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w));
      };
    
    const getTotalStats = () => {
        return workouts.reduce((acc, w) => ({
            totalWorkouts: acc.totalWorkouts + 1,
            totalCalories: acc.totalCalories + (w.calories || 0),
            totalDuration: acc.totalDuration + (w.duration || 0),
            }), { totalWorkouts: 0, totalCalories: 0, totalDuration: 0 });
      };
    
    const getWeeklyData = () => {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const now = new Date();
        return days.map((day, i) => {
            const date = new Date(now);
            const dayOfWeek = now.getDay();
            const diff = i - (dayOfWeek === 0 ? 6 : dayOfWeek - 1);
            date.setDate(now.getDate() + diff);
            const dateStr = date.toISOString().split('T')[0];
            const dayWorkouts = workouts.filter(w => w.date === dateStr);
            return {
            day,
            calories: dayWorkouts.reduce((s, w) => s + (w.calories || 0), 0),
            duration: dayWorkouts.reduce((s, w) => s + (w.duration || 0), 0),
            count: dayWorkouts.length,
          };
        });
      };
      return { workouts, addWorkout, deleteWorkout, updateWorkout, getTotalStats, getWeeklyData}
}

