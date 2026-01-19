"use client";

import { useState, useEffect } from "react";
import { categoriesApi, Category } from "@/lib/api/categories";
import Button from "@/components/ui/Button";
import { useI18n } from "@/contexts/I18nContext";
import CategoryForm from "./CategoryForm";
import * as Icons from "lucide-react";
import toast from "react-hot-toast";

export default function CategoriesPage() {
    const { t } = useI18n();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | undefined>(undefined);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const data = await categoriesApi.getAll();
            setCategories(data);
        } catch (error) {
            console.error(error);
            toast.error(t('common.error') || "Failed to load categories");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleCreate = () => {
        setEditingCategory(undefined);
        setIsFormOpen(true);
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(t('common.confirmDelete') || `Are you sure you want to delete ${name}?`)) return;

        try {
            await categoriesApi.delete(id);
            toast.success(t('common.deleteSuccess') || "Category deleted");
            fetchCategories();
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to delete category");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Icons.Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{t('admin.categories') || "Categories"}</h1>
                    <p className="text-gray-500 mt-1">{t('common.manageCategoriesDesc') || "Manage your food menu categories"}</p>
                </div>
                <Button onClick={handleCreate} className="flex items-center gap-2">
                    <Icons.Plus className="w-4 h-4" />
                    {t('common.add') || "Add Category"}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((cat) => (
                    <div key={cat.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-bold text-gray-900">{cat.name}</h3>
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${cat.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                                    }`}>
                                    {cat.isActive ? (t('staff.active') || "Active") : (t('staff.inactive') || "Inactive")}
                                </span>
                            </div>

                            <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                                {cat.description || <span className="italic text-gray-400">{t('common.noDescription') || "No description"}</span>}
                            </p>

                            <div className="flex items-center justify-between text-sm text-gray-400 border-t border-gray-100 pt-4">
                                <div className="flex items-center gap-1">
                                    <Icons.ListOrdered className="w-4 h-4" />
                                    <span>{t('common.sortDir') || "Order"}: {cat.displayOrder}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(cat)}
                                        className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                                        title={t('common.edit')}
                                    >
                                        <Icons.Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(cat.id, cat.name)}
                                        className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                                        title={t('common.delete')}
                                    >
                                        <Icons.Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {categories.length === 0 && (
                    <div className="col-span-full py-12 text-center bg-white rounded-xl border border-dashed border-gray-300">
                        <Icons.FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-900">{t('common.noCategories') || "No categories found"}</h3>
                        <p className="text-gray-500 mb-4">{t('common.createCategoryPrompt') || "Get started by creating your first category."}</p>
                        <Button onClick={handleCreate}>
                            {t('common.createCategory') || "Create Category"}
                        </Button>
                    </div>
                )}
            </div>

            <CategoryForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                category={editingCategory}
                onSuccess={fetchCategories}
            />
        </div>
    );
}
