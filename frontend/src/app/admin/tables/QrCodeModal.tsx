
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import Button from '@/components/ui/button';
import Image from 'next/image';

interface QrCodeModalProps {
  qrCodeUrl: string;
  tableName: string;
  onClose: () => void;
}

export default function QrCodeModal({ qrCodeUrl, tableName, onClose }: QrCodeModalProps) {
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>Print QR Code</title></head>
          <body style="text-align: center; margin-top: 50px;">
            <h2>Table: ${tableName}</h2>
            <img src="${qrCodeUrl}" alt="QR Code for table ${tableName}" />
            <script>
              window.onload = () => {
                window.print();
                window.onafterprint = () => window.close();
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };
  
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>QR Code for Table: {tableName}</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center my-4">
          <Image src={qrCodeUrl} alt={`QR Code for ${tableName}`} width={256} height={256} />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button onClick={handlePrint}>Print</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
