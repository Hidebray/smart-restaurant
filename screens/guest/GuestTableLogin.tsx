
import React, { useState } from 'react';
import { useUserStore } from '../../store/useUserStore';
import { tables } from '../../data/mockData';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { LogIn } from 'lucide-react';

const GuestTableLogin: React.FC = () => {
  const [tableNumber, setTableNumber] = useState('');
  const [error, setError] = useState('');
  const setTableId = useUserStore((state) => state.setTableId);
  const logout = useUserStore((state) => state.logout);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const foundTable = tables.find((t) => t.tableNumber === tableNumber);
    if (foundTable) {
      setTableId(foundTable.id);
    } else {
      setError('Số bàn không hợp lệ. Vui lòng thử lại.');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-sm p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-brand-dark">Nhập số bàn của bạn</h2>
          <p className="text-gray-500 mt-2">Vui lòng nhập số bàn được ghi trên mã QR.</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-2">
            <label htmlFor="tableNumber" className="text-sm font-medium">Số bàn</label>
            <Input
              id="tableNumber"
              type="text"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              placeholder="Ví dụ: 5"
              required
              autoFocus
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" className="w-full" size="lg">
            <LogIn className="mr-2 h-4 w-4" />
            Vào Bàn
          </Button>
          <Button variant="ghost" className="w-full" onClick={logout}>
            Quay lại
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default GuestTableLogin;
