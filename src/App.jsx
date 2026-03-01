import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CVProvider } from './context/CVContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import HomePage from './pages/HomePage';
import BuilderPage from './pages/BuilderPage';

function App() {
  return (
    <CVProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/builder" element={<BuilderPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </CVProvider>
  );
}

export default App;
