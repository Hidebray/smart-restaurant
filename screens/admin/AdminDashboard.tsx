
import React, { useState } from 'react';
import { useUserStore } from '../../store/useUserStore';
import Button from '../../components/ui/Button';
import { LogOut, LayoutDashboard, Utensils, Table, ShieldCheck } from 'lucide-react';
import TableManagement from './components/TableManagement';
import MenuManagement from './components/MenuManagement';
import DashboardOverview from './components/DashboardOverview';

type AdminView = 'dashboard' | 'menu' | 'tables';

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-4 py-3 text-left transition-colors ${
      isActive
        ? 'bg-brand-primary/10 text-brand-primary font-bold'
        : 'text-gray-600 hover:bg-gray-100'
    }`}
  >
    {icon}
    <span className="ml-3">{label}</span>
  </button>
);

const AdminDashboard: React.FC = () => {
  const logout = useUserStore((state) => state.logout);
  const [activeView, setActiveView] = useState<AdminView>('dashboard');

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'menu':
        return <MenuManagement />;
      case 'tables':
        return <TableManagement />;
      default:
        return <DashboardOverview />;
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Tổng quan', icon: <LayoutDashboard size={20} /> },
    { id: 'menu', label: 'Quản lý Menu', icon: <Utensils size={20} /> },
    { id: 'tables', label: 'Quản lý Bàn', icon: <Table size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="flex items-center justify-center p-6 border-b">
          <ShieldCheck className="text-brand-primary" size={24} />
          <h1 className="ml-2 text-xl font-bold text-brand-dark">Admin</h1>
        </div>
        <nav className="flex-grow py-4">
          {navItems.map(item => (
            <NavItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              isActive={activeView === item.id}
              onClick={() => setActiveView(item.id as AdminView)}
            />
          ))}
        </nav>
        <div className="p-4 border-t">
          <Button variant="ghost" className="w-full justify-start" onClick={logout}>
            <LogOut className="h-4 w-4 mr-2" /> Đăng xuất
          </Button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
            {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
