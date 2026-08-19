import { BrowserRouter, Router, Route, Routes } from "react-router-dom";
import { ThemeProvider,useTheme } from "./context/ThemeContext";
import Sidebar from "./components/Layout/Sidebar";
import Navbar from "./components/Layout/Navbar";
import Dashboard from "./pages/Dashboard";
import Workouts from "./pages/Workouts";
import Nutrition from "./pages/Nutrition";
import Progress from "./pages/Progress";

function Layout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-main">
        <Navbar />
        <main className="app-context">{children}</main>
      </div>
    </div>
  );
}

export default function App() {
  return (
   <ThemeProvider>
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element = { <Dashboard/> }/>
          <Route path="/workouts" element = { <Workouts/> }/>
          <Route path="/nutrition" element = { <Nutrition/> }/>
          <Route path="/progress" element = { <Progress/> }/>
        </Routes>
      </Layout>
    </BrowserRouter>
   </ThemeProvider>
  );
}
            