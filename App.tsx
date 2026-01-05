
import React from 'react';
import { useUserStore } from './store/useUserStore';
import LandingScreen from './screens/LandingScreen';
import GuestFlow from './screens/guest/GuestFlow';
import AdminDashboard from './screens/admin/AdminDashboard';
import WaiterScreen from './screens/waiter/WaiterScreen';
import KitchenScreen from './screens/kitchen/KitchenScreen';
import Toast from './components/ui/Toast';
import { SocketProvider } from './context/SocketContext';

const App: React.FC = () => {
  const { role } = useUserStore();

  const renderContent = () => {
    switch (role) {
      case 'GUEST':
        return <GuestFlow />;
      case 'ADMIN':
        return <AdminDashboard />;
      case 'WAITER':
        return <WaiterScreen />;
      case 'KITCHEN':
        return <KitchenScreen />;
      default:
        return <LandingScreen />;
    }
  };

  return (
    <SocketProvider>
      <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
        {renderContent()}
        <Toast />
      </div>
    </SocketProvider>
  );
};

export default App;
