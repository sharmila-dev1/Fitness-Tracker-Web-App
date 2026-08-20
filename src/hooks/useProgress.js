import { useLocalStorage } from './useLocalStorage'
import { generateId } from '../utils/Helpers'

const INITIAL_PROGRESS = [
    { id: '1', date: '2026-04-01', weight: 82.5, bodyFat: 18.2, chest: 98, waist: 86, hips: 97 },
    { id: '2', date: '2026-04-15', weight: 81.8, bodyFat: 17.8, chest: 97, waist: 85, hips: 96 },
    { id: '3', date: '2026-05-01', weight: 80.9, bodyFat: 17.1, chest: 96, waist: 84, hips: 95 },
    { id: '4', date: '2026-05-15', weight: 80.1, bodyFat: 16.5, chest: 95, waist: 83, hips: 94 },
    { id: '5', date: '2026-06-01', weight: 79.3, bodyFat: 15.9, chest: 95, waist: 82, hips: 94 },
    { id: '6', date: '2026-06-07', weight: 78.8, bodyFat: 15.4, chest: 94, waist: 81, hips: 93 },
];

const INITIAL_GOALS = [
    { id: '1', title: 'Lose 5kg', target: 77.5, current: 78.8, unit: 'kg', category: 'weight', deadline: '2026-07-01' },
    { id: '2', title: 'Run 5K under 25min', target: 25, current: 27, unit: 'min', category: 'cardio', deadline: '2026-06-15' },
    { id: '3', title: 'Bench Press 100kg', target: 100, current: 85, unit: 'kg', category: 'strength', deadline: '2026-08-01' },
    { id: '4', title: 'Body Fat under 14%', target: 14, current: 15.4, unit: '%', category: 'composition', deadline: '2026-07-15' },
];

export function useProgress(){
    const [entries, setEntries] = useLocalStorage( 'progressEntries', INITIAL_PROGRESS);
    const [goals, setGoals] = useLocalStorage( 'progressGoals', INITIAL_GOALS);

    const addEntry = (entry) => {
        const newEntry = {...entry, id: generateId()};
        setEntries( prev => [...prev, newEntry].sort((a,b) => new Date(a.date) - new Date(b.date)));
        return newEntry;
    }

    const deleteEntry = (id) => setEntries( prev => prev.filter(e => e.id !== id));

    const addGoal = (goal) => {
        const newGoal = {...goal, id: generateId()};
        setGoals( prev => [...prev, newGoal]);
        return newGoal;
    }

    const updateGoal = (id, updates) => {
        setGoals(prev => prev.map(g => g.id === id ? {...g, ...updates} : g));
    }
    
    const deleteGoal = (id) => setGoals(prev => prev.filter(g => g.id !== id));

    const getLatestEntry = () => entries[entries.length - 1] || null;

    const getFirstEntry = () => entries[0] || null;

    const getWeightTrend = () => entries.map(e => ({ date: e.date.slice(5), weight: e.weight, bodyFat: e.bodyFat }));

    return { entries, addEntry, deleteEntry, goals, addGoal, updateGoal, deleteGoal, getLatestEntry, getFirstEntry, getWeightTrend}
}

