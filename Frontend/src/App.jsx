import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Courses = lazy(() => import('./pages/Courses'));
const Research = lazy(() => import('./pages/Research'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Books = lazy(() => import('./pages/book'));
const Consulting = lazy(() => import('./pages/Consulting'));
const Opinions = lazy(() => import('./pages/Opinions'));

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#f5f1e8]">
              <div className="w-16 h-16 rounded-full border-4 border-[#d9d2c5] border-t-[#1E2A38] animate-spin" />
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/research" element={<Research />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/book" element={<Books />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/consulting" element={<Consulting />} />
            <Route path="/opinions" element={<Opinions />} />
          </Routes>
        </Suspense>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;