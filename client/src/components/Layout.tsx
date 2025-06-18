import React, { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  // Don't show header/footer on admin pages
  const isAdminPage = location.pathname.startsWith('/admin');
  
  if (isAdminPage) {
    return (
      <div className="min-h-screen bg-gray-100">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};