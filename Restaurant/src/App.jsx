import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Header from "./Components/Header";
import Hero from "./Components/Hero";
import Menu from "./Components/Menu";
import Footer from "./Components/Footer";
import Login from "./Components/Login";
import FullMenu from "./Components/FullMenu";

import AdminRoute from "./admin/AdminRoute";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";

function Home() {
  return (
    <>
      <Hero />
      <Menu />
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="bg-[#140d08] min-h-screen">
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/full-menu" element={<FullMenu />} />

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
