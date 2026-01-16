"use client";

import useSWR from "swr";
import { useState } from "react";
import { modifiersApi, ModifierGroupWithWithOptions } from "@/lib/api/modifiers";
import Button from "@/components/ui/Button";
import * as Icons from "lucide-react";
import ModifierGroupForm from "./ModifierGroupForm";
import ModifierGroupList from "./ModifierGroupList";

const fetcher = () => modifiersApi.getAllGroups();

export default function ModifiersPage() {
  const {
    data: groups,
    error,
    mutate,
  } = useSWR<ModifierGroupWithWithOptions[]>("modifiers", fetcher);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] =
    useState<ModifierGroupWithWithOptions | null>(null);

  const handleEdit = (group: ModifierGroupWithWithOptions) => {
    setSelectedGroup(group);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setSelectedGroup(null);
    setIsFormOpen(true);
  };

  const handleFormClose = (shouldMutate: boolean) => {
    setIsFormOpen(false);
    setSelectedGroup(null);
    if (shouldMutate) {
      mutate();
    }
  };

  if (error) return <div>Failed to load modifier groups</div>;
  if (!groups) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Modifier Management</h1>
        <Button onClick={handleAddNew}>
          <Icons.PlusCircle className="mr-2 h-4 w-4" /> Add New Group
        </Button>
      </div>

      {isFormOpen ? (
        <ModifierGroupForm group={selectedGroup} onClose={handleFormClose} />
      ) : (
        <ModifierGroupList
          groups={groups}
          onEdit={handleEdit}
          onUpdate={mutate}
        />
      )}
    </div>
  );
}
