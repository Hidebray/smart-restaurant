
import React from 'react';
import { useUserStore } from '../store/useUserStore';
import { UserRole } from '../types';
import Card from '../components/ui/Card';
import { Users, ChefHat, UtensilsCrossed, ShieldCheck } from 'lucide-react';

const RoleCard: React.FC<{
  role: UserRole;
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: (role: UserRole) => void;
}> = ({ role, title, description, icon, onClick }) => (
  <Card
    className="transform cursor-pointer p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg"
    onClick={() => onClick(role)}
  >
    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary">
      {icon}
    </div>
    <h3 className="mt-4 text-xl font-bold text-brand-dark">{title}</h3>
    <p className="mt-2 text-sm text-gray-500">{description}</p>
  </Card>
);

const LandingScreen: React.FC = () => {
  const login = useUserStore((state) => state.login);

  const handleRoleSelect = (role: UserRole) => {
    login(role);
  };

  const roles = [
    {
      role: UserRole.GUEST,
      title: 'Khách hàng',
      description: 'Đặt món tại bàn',
      icon: <Users size={32} />,
    },
    {
      role: UserRole.WAITER,
      title: 'Nhân viên',
      description: 'Quản lý đơn hàng',
      icon: <UtensilsCrossed size={32} />,
    },
    {
      role: UserRole.KITCHEN,
      title: 'Bếp',
      description: 'Xem món cần chế biến',
      icon: <ChefHat size={32} />,
    },
    {
      role: UserRole.ADMIN,
      title: 'Quản lý',
      description: 'Tổng quan hệ thống',
      icon: <ShieldCheck size={32} />,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-white p-4">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-brand-dark tracking-tight">
          Welcome to <span className="text-brand-primary">Smart Restaurant</span>
        </h1>
        <p className="mt-4 text-lg text-gray-600">Vui lòng chọn vai trò của bạn để bắt đầu.</p>
      </div>
      <div className="grid w-full max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {roles.map((r) => (
          <RoleCard key={r.role} {...r} onClick={handleRoleSelect} />
        ))}
      </div>
    </div>
  );
};

export default LandingScreen;
