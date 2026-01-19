"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { useI18n } from "@/contexts/I18nContext";
import { categoriesApi, Category } from "@/lib/api/categories";
import toast from "react-hot-toast";
import * as Icons from "lucide-react";

interface CategoryFormProps {
    isOpen: boolean;
    onClose: () => void;
    category?: Category;
    onSuccess: () => void;
}

export default function CategoryForm({ isOpen, onClose, category, onSuccess }: CategoryFormProps) {
    const { t } = useI18n();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        displayOrder: 0,
        isActive: true,
    });

    useEffect(() => {
        if (category) {
            setFormData({
                name: category.name,
                description: category.description || "",
                displayOrder: category.displayOrder,
                isActive: category.isActive,
            });
        } else {
            setFormData({
                name: "",
                description: "",
                displayOrder: 0,
                isActive: true,
            });
        }
    }, [category, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error(t('common.requiredField') || "Name is required");
            return;
        }

        setLoading(true);
        try {
            if (category) {
                await categoriesApi.update(category.id, formData);
                toast.success(t('common.updateSuccess') || "Category updated successfully");
            } else {
                await categoriesApi.create(formData);
                toast.success(t('common.createSuccess') || "Category created successfully");
            }
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to save category");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {category ? (t('common.edit') || 'Edit Category') : (t('common.add') || 'Add Category')}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    <div className="space-y-2">
                        <Label>{t('common.name') || "Name"}</Label>
                        <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Appetizers"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>{t('common.description') || "Description"}</Label>
                        <Input
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Optional description"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>{t('common.displayOrder') || "Display Order"}</Label>
                            <Input
                                type="number"
                                value={formData.displayOrder}
                                onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                            />
                        </div>

                        <div className="flex items-center space-x-2 pt-8">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                                className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${formData.isActive ? 'bg-green-500' : 'bg-gray-300'}`}
                            >
                                <span className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform absolute left-1 ${formData.isActive ? 'translate-x-6' : ''}`} />
                            </button>
                            <span className="text-sm font-medium text-gray-700">
                                {formData.isActive ? (t('staff.active') || "Active") : (t('staff.inactive') || "Inactive")}
                            </span>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <Button variant="outline" type="button" onClick={onClose} disabled={loading}>
                            {t('common.cancel')}
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? <Icons.Loader2 className="w-4 h-4 animate-spin" /> : (t('common.save') || "Save")}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
