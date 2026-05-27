import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RootLayout from '../layouts/RootLayout';
import Dashboard from '../pages/Dashboard';
import Books from '../pages/Books';
import Members from '../pages/Members';
import Transactions from '../pages/Transactions';

export default function AppRoutes() {
  return (
    <RootLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/books" element={<Books />} />
        <Route path="/members" element={<Members />} />
        <Route path="/transactions" element={<Transactions />} />
      </Routes>
    </RootLayout>
  );
}
