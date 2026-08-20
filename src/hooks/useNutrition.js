import { useLocalStorage } from "./useLocalStorage";
import { generateId, getTodayDate } from "../utils/Helpers";

const INITIAL_MEALS = [
    { id: '1', date: '2026-08-08', name: 'Oatmeal', type: 'Breakfast', calories: 320, protein: 12, carbs: 54, fat: 6 },
    { id: '2', date: '2026-08-08', name: 'Grilled Chicken Salad', type: 'Lunch', calories: 450, protein: 42, carbs: 18, fat: 14 },
    { id: '3', date: '2026-08-08', name: 'Protein Shake', type: 'Snack', calories: 180, protein: 30, carbs: 10, fat: 2 },
    { id: '4', date: '2026-08-08', name: 'Chapati with Paneer Gravy', type: 'Dinner', calories: 520, protein: 48, carbs: 22, fat: 22 },
    { id: '5', date: '2026-08-09', name: 'Mushroom egg omelette', type: 'Breakfast', calories: 150, protein: 15, carbs: 12, fat: 4 },
    { id: '6', date: '2026-08-09', name: 'Sandwich', type: 'Lunch', calories: 420, protein: 35, carbs: 45, fat: 10 },
    { id: '7', date: '2026-08-09', name: 'Sweet Potato and Corn Salad', type: 'Dinner', calories: 580, protein: 50, carbs: 40, fat: 18 },
];

const CALORIE_GOAL = 1500;
const PROTEIN_GOAL = 160;

export function useNutrition(){
    const [meals,setMeals] = useLocalStorage('meals',INITIAL_MEALS);
    const [goals,setGoals] = useLocalStorage('nutritionGoals',{
        calories : CALORIE_GOAL, protein : PROTEIN_GOAL, carbs : 220, fat : 70
    })

    const addMeal =(meal) => {
        const newMeal =  {...meal, id: generateId(), date: meal.date || getTodayDate()};
        setMeals(prev => [newMeal, ...prev]);
        return newMeal;
    }

    const deleteMeal = (id) => setMeals(prev => prev.filter( m => m.id !== id));

    const getTodayMeals = () => {
        const today = getTodayDate();
        return meals.filter(m => m.date === today);
    }

    const getTodayTotals = () => {
        const todayMeals = getTodayMeals();
         return todayMeals.reduce((acc, m) => ({
            calories: acc.calories + (m.calories || 0),
            protein: acc.protein + (m.protein || 0),
            carbs: acc.carbs + (m.carbs || 0),
            fat: acc.fat + (m.fat || 0),
        }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
    }

    const getWeeklyCalories = () => {
         const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
         const now = new Date();
         return days.map((day, i) => {
            const date = new Date(now);
            const dayOfWeek = now.getDay();
            const diff = i - (dayOfWeek === 0 ? 6 : dayOfWeek - 1);
            date.setDate(now.getDate() + diff);
            const dateStr = date.toISOString().split('T')[0];
            const dayMeals = meals.filter(m => m.date === dateStr);
            return {
                day,
                calories: dayMeals.reduce((s, m) => s + (m.calories || 0), 0),
                protein: dayMeals.reduce((s, m) => s + (m.protein || 0), 0),
            };
        });
    };
    return { meals, addMeal, deleteMeal, getTodayMeals, getTodayTotals, goals, setGoals, getWeeklyCalories }
}

