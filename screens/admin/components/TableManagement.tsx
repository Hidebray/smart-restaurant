
import React, { useMemo } from 'react';
import { tables as mockTables } from '../../../data/mockData';
import { useOrderStore } from '../../../store/useOrderStore';
import { OrderStatus, TableStatus } from '../../../types';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import { QrCode } from 'lucide-react';

const TableManagement: React.FC = () => {
  const { orders } = useOrderStore();
  
  const activeTableIds = useMemo(() => {
    const activeStatuses = [OrderStatus.PENDING, OrderStatus.ACCEPTED, OrderStatus.PREPARING, OrderStatus.READY];
    return new Set(orders.filter(o => activeStatuses.includes(o.status)).map(o => o.tableId));
  }, [orders]);
  
  const tables = mockTables.map(table => {
    if (activeTableIds.has(table.id)) {
      return {...table, status: TableStatus.OCCUPIED};
    }
    // Keep original INACTIVE or RESERVED status, otherwise it's AVAILABLE
    return table.status === TableStatus.INACTIVE || table.status === TableStatus.RESERVED ? table : {...table, status: TableStatus.AVAILABLE};
  });

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Quản lý bàn</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {tables.map((table) => (
          <Card key={table.id} className="p-4 flex flex-col items-center justify-center text-center relative overflow-hidden group">
             <div className="absolute inset-0 bg-brand-primary/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="text-white text-center">
                    <QrCode size={48} className="mx-auto" />
                    <p className="mt-2 font-semibold">Hiển thị QR</p>
                </div>
            </div>
            <span className="text-4xl font-bold text-brand-dark">{table.tableNumber}</span>
            <p className="text-sm text-gray-500 mt-1">Sức chứa: {table.capacity}</p>
            <div className="mt-2">
              <Badge status={table.status} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TableManagement;
