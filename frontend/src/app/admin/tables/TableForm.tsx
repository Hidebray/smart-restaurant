
'use client';

import { Table } from '@/types/table';
import { useForm, SubmitHandler } from 'react-hook-form';
import { tablesApi } from '@/lib/api/tables';
import toast from 'react-hot-toast';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const formSchema = z.object({
  tableNumber: z.string().min(1, 'Table number is required'),
  capacity: z.coerce.number().int().min(1, 'Capacity must be at least 1'),
  location: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface TableFormProps {
  table: Table | null;
  onClose: () => void;
}

export default function TableForm({ table, onClose }: TableFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tableNumber: table?.tableNumber || '',
      capacity: table?.capacity || 1,
      location: table?.location || '',
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      if (table) {
        await tablesApi.update(table.id, data);
        toast.success('Table updated successfully');
      } else {
        await tablesApi.create(data as Omit<Table, 'id'>);
        toast.success('Table created successfully');
      }
      onClose();
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{table ? 'Edit Table' : 'Create New Table'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input placeholder="Table Number" {...register('tableNumber')} />
            {errors.tableNumber && <p className="text-red-500 text-sm mt-1">{errors.tableNumber.message}</p>}
          </div>
          <div>
            <Input type="number" placeholder="Capacity" {...register('capacity')} />
            {errors.capacity && <p className="text-red-500 text-sm mt-1">{errors.capacity.message}</p>}
          </div>
          <div>
            <Input placeholder="Location (e.g., Patio)" {...register('location')} />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
