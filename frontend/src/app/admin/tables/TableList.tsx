
'use client';

import { Table } from '@/types/table';
import Button from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QrCode, Edit, Trash2 } from 'lucide-react';
import { tablesApi } from '@/lib/api/tables';
import toast from 'react-hot-toast';
import { useState } from 'react';
import QrCodeModal from './qr-code-modal';

interface TableListProps {
  tables: Table[];
  onEdit: (table: Table) => void;
  onUpdate: () => void;
}

export default function TableList({ tables, onEdit, onUpdate }: TableListProps) {
  const [qrCodeData, setQrCodeData] = useState<{ url: string; tableName: string } | null>(null);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this table?')) {
      try {
        await tablesApi.delete(id);
        toast.success('Table deleted successfully');
        onUpdate();
      } catch (error) {
        toast.error('Failed to delete table');
      }
    }
  };

  const handleGenerateQr = async (table: Table) => {
    try {
      const { qrCodeDataUrl } = await tablesApi.generateQrCode(table.id);
      setQrCodeData({ url: qrCodeDataUrl, tableName: table.tableNumber });
    } catch (error) {
      toast.error('Failed to generate QR code');
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>All Tables</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tables.map((table) => (
              <div key={table.id} className="p-4 border rounded-lg shadow-sm">
                <h3 className="font-semibold text-lg">{table.tableNumber}</h3>
                <p>Capacity: {table.capacity}</p>
                <p>Location: {table.location || 'N/A'}</p>
                <p>Status: <span className="font-medium">{table.status}</span></p>
                <div className="flex justify-end space-x-2 mt-4">
                  <Button variant="outline" size="icon" onClick={() => handleGenerateQr(table)}>
                    <QrCode className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => onEdit(table)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDelete(table.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      {qrCodeData && (
        <QrCodeModal
          qrCodeUrl={qrCodeData.url}
          tableName={qrCodeData.tableName}
          onClose={() => setQrCodeData(null)}
        />
      )}
    </>
  );
}
