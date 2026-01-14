"use client";

import useSWR from "swr";
import { tablesApi } from "@/lib/api/tables";
import { Table } from "@/types/table";
import { useState } from "react";
import TableList from "./table-list";
import TableForm from "./table-form";
import Button from "@/components/ui/button";
import * as Icons from "lucide-react";

const fetcher = () => tablesApi.getAll();

export default function TablesPage() {
  const { data: tables, error, mutate } = useSWR<Table[]>("tables", fetcher);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  const handleEdit = (table: Table) => {
    setSelectedTable(table);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setSelectedTable(null);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedTable(null);
    mutate(); // Re-fetch data
  };

  if (error) return <div>Failed to load tables</div>;
  if (!tables) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Table Management</h1>
        <Button onClick={handleAddNew}>
          <Icons.PlusCircle className="mr-2 h-4 w-4" /> Add New Table
        </Button>
      </div>

      {isFormOpen ? (
        <TableForm table={selectedTable} onClose={handleFormClose} />
      ) : (
        <TableList tables={tables} onEdit={handleEdit} onUpdate={mutate} />
      )}
    </div>
  );
}
