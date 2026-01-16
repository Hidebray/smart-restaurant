"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  modifiersApi,
  ModifierGroupWithWithOptions,
} from "@/lib/api/modifiers";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import toast from "react-hot-toast";

const formSchema = z.object({
  name: z.string().min(1, "Group name is required"),
  selectionType: z.enum(["SINGLE", "MULTIPLE"]),
  options: z.array(
    z.object({
      id: z.string().optional(),
      name: z.string().min(1, "Option name is required"),
      priceAdjustment: z.coerce.number(),
    })
  ),
});

type FormData = z.infer<typeof formSchema>;

interface Props {
  group: ModifierGroupWithWithOptions | null;
  onClose: (shouldMutate: boolean) => void;
}

export default function ModifierGroupForm({ group, onClose }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [initialOptionIds, setInitialOptionIds] = useState<string[]>([]);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: group?.name || "",
      selectionType: (group?.selectionType as "SINGLE" | "MULTIPLE") || "SINGLE",
      options: group?.options || [{ name: "", priceAdjustment: 0 }],
    },
  });

  useEffect(() => {
    if (group) {
      setInitialOptionIds(group.options.map(opt => opt.id).filter((id): id is string => !!id));
    }
  }, [group]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      let savedGroup = group;
      if (group) {
        // Update
        await modifiersApi.updateGroup(group.id, {
          name: data.name,
          selectionType: data.selectionType,
        });

        const updatedOptionIds = new Set<string>();

        // Update or create options
        for (const option of data.options) {
          if (option.id) {
            await modifiersApi.updateOption(option.id, option);
            updatedOptionIds.add(option.id);
          } else {
            const newOption = await modifiersApi.createOption({ ...option, groupId: group.id });
            updatedOptionIds.add(newOption.id);
          }
        }
        
        // Delete removed options
        const optionsToDelete = initialOptionIds.filter(id => !updatedOptionIds.has(id));
        if (optionsToDelete.length > 0) {
          await Promise.all(optionsToDelete.map(id => modifiersApi.deleteOption(id)));
        }

      } else {
        // Create
        savedGroup = await modifiersApi.createGroup({
          name: data.name,
          selectionType: data.selectionType,
        });
        for (const option of data.options) {
          await modifiersApi.createOption({ ...option, groupId: savedGroup.id });
        }
      }
      toast.success(
        `Modifier group ${group ? "updated" : "created"} successfully`
      );
      onClose(true);
    } catch (error: any) {
      toast.error(
        `Error: ${
          error.response?.data?.message ||
          "Failed to save modifier group"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-1">
        <label htmlFor="group-name" className="text-sm font-semibold">Group Name</label>
        <Input
          id="group-name"
          {...register("name")}
          className={errors.name ? "!border-red-500" : ""}
        />
        {errors.name && (
          <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>
        )}
      </div>
      <div>
        <label className="label-text">Selection Type</label>
        <select {...register("selectionType")} className="input">
          <option value="SINGLE">Single</option>
          <option value="MULTIPLE">Multiple</option>
        </select>
      </div>

      <div>
        <h3 className="text-lg font-semibold">Options</h3>
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-start gap-2 mt-2">
            <div className="flex-grow space-y-1">
              <Input
                placeholder="Option name"
                {...register(`options.${index}.name`)}
                className={errors.options?.[index]?.name ? "!border-red-500" : ""}
              />
              {errors.options?.[index]?.name && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.options?.[index]?.name?.message}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <Input
                type="number"
                step="any"
                placeholder="Price adjustment"
                {...register(`options.${index}.priceAdjustment`)}
                className={
                  errors.options?.[index]?.priceAdjustment ? "!border-red-500" : ""
                }
              />
              {errors.options?.[index]?.priceAdjustment && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.options?.[index]?.priceAdjustment?.message}
                </p>
              )}
            </div>
            <Button
              type="button"
              variant="destructive"
              onClick={() => remove(index)}
            >
              Remove
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          className="mt-2"
          onClick={() => append({ name: "", priceAdjustment: 0 })}
        >
          Add Option
        </Button>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => onClose(false)}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
}
