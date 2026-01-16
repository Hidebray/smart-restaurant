"use client";

import { ModifierGroupWithWithOptions } from "@/lib/api/modifiers";
import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Edit, Trash2 } from "lucide-react";
import { modifiersApi } from "@/lib/api/modifiers";
import toast from "react-hot-toast";

interface ModifierGroupListProps {
  groups: ModifierGroupWithWithOptions[];
  onEdit: (group: ModifierGroupWithWithOptions) => void;
  onUpdate: () => void;
}

export default function ModifierGroupList({
  groups,
  onEdit,
  onUpdate,
}: ModifierGroupListProps) {
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this modifier group?")) {
      try {
        await modifiersApi.deleteGroup(id);
        toast.success("Modifier group deleted successfully");
        onUpdate();
      } catch (error: any) {
        toast.error(
          `Error: ${
            error.response?.data?.message || "Failed to delete modifier group"
          }`
        );
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Modifier Groups</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {groups.map((group) => (
            <div key={group.id} className="p-4 border rounded-lg shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">
                    {group.name}
                  </h3>
                  <p className="text-gray-700">
                    {group.options.map((o) => o.name).join(", ")}
                  </p>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEdit(group)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(group.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
