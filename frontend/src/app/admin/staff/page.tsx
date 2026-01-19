"use client";

import { useState } from "react";
import useSWR from "swr";
import { usersApi, User } from "@/lib/api/users";
import Button from "@/components/ui/Button";
import * as Icons from "lucide-react";
import StaffForm from "./StaffForm";
import EditStaffModal from "./EditStaffModal";
import { useI18n } from "@/contexts/I18nContext";
import toast from "react-hot-toast";

const fetcher = () => usersApi.getAll();

export default function StaffPage() {
    const { t } = useI18n();
    const { data: users, error, mutate } = useSWR<User[]>("users", fetcher);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const waiters = users?.filter(u => u.role === 'WAITER') || [];
    const kitchenStaff = users?.filter(u => u.role === 'KITCHEN') || [];
    const admins = users?.filter(u => u.role === 'ADMIN') || [];

    const handleAddNew = () => {
        setIsFormOpen(true);
    };

    const handleFormClose = () => {
        setIsFormOpen(false);
        mutate();
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setIsEditModalOpen(true);
    };

    const handleEditClose = () => {
        setIsEditModalOpen(false);
        setEditingUser(null);
    };

    const handleEditSuccess = () => {
        mutate();
    };

    const handleToggleStatus = async (user: User) => {
        try {
            await usersApi.update(user.id, { isActive: !user.isActive });
            toast.success(t('staff.toggleStatusSuccess').replace('{name}', user.name));
            mutate();
        } catch (error: any) {
            toast.error(error.message || 'Failed to update status');
        }
    };

    const handleDelete = async (userId: string, userName: string) => {
        if (!confirm(t('staff.confirmDelete').replace('{name}', userName))) {
            return;
        }

        try {
            await usersApi.delete(userId);
            toast.success(t('staff.deleteSuccess').replace('{name}', userName));
            mutate();
        } catch (error: any) {
            console.error('Delete user error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to delete user';
            toast.error(`Error: ${errorMessage}`);
        }
    };

    if (error) return <div>{t('common.error')}</div>;
    if (!users) return <div>{t('common.loading')}</div>;

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">{t('staff.title')}</h1>
                    <p className="text-sm text-gray-700">{t('staff.subtitle')}</p>
                </div>
                <Button onClick={handleAddNew}>
                    <Icons.PlusCircle className="mr-2 h-4 w-4" /> {t('staff.addNew')}
                </Button>
            </div>

            {isFormOpen && (
                <StaffForm onClose={handleFormClose} />
            )}

            {editingUser && (
                <EditStaffModal
                    user={editingUser}
                    isOpen={isEditModalOpen}
                    onClose={handleEditClose}
                    onSuccess={handleEditSuccess}
                />
            )}

            <div className="space-y-8">
                {/* Waiters Section */}
                <section>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        🤵 {t('role.waiter')} <span className="bg-gray-200 text-gray-900 text-sm px-2 py-1 rounded-full border border-gray-300">{waiters.length}</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {waiters.map(user => (
                            <StaffCard key={user.id} user={user} icon="🤵" onEdit={handleEdit} onDelete={handleDelete} onToggleStatus={handleToggleStatus} />
                        ))}
                        {waiters.length === 0 && <p className="text-gray-500 italic">{t('common.noData')}</p>}
                    </div>
                </section>

                {/* Kitchen Section */}
                <section>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        👨‍🍳 {t('role.kitchen')} <span className="bg-gray-200 text-gray-900 text-sm px-2 py-1 rounded-full border border-gray-300">{kitchenStaff.length}</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {kitchenStaff.map(user => (
                            <StaffCard key={user.id} user={user} icon="👨‍🍳" onEdit={handleEdit} onDelete={handleDelete} onToggleStatus={handleToggleStatus} />
                        ))}
                        {kitchenStaff.length === 0 && <p className="text-gray-500 italic">{t('common.noData')}</p>}
                    </div>
                </section>

                {/* Admins Section */}
                <section>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        🛡️ {t('role.admin')} <span className="bg-gray-200 text-gray-900 text-sm px-2 py-1 rounded-full border border-gray-300">{admins.length}</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {admins.map(user => (
                            <StaffCard key={user.id} user={user} icon="🛡️" onEdit={handleEdit} onDelete={handleDelete} onToggleStatus={handleToggleStatus} />
                        ))}
                        {admins.length === 0 && <p className="text-gray-500 italic">{t('common.noData')}</p>}
                    </div>
                </section>
            </div>
        </div>
    );
}

function StaffCard({ user, icon, onEdit, onDelete, onToggleStatus }: {
    user: User;
    icon: string;
    onEdit: (user: User) => void;
    onDelete: (userId: string, userName: string) => void;
    onToggleStatus: (user: User) => void;
}) {
    const { t } = useI18n();
    return (
        <div className={`p-4 rounded-xl shadow-sm border transition-all ${user.isActive ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-300 opacity-75 grayscale-[0.5]'}`}>
            <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{icon}</span>
                        <div className="font-bold text-lg text-gray-900 truncate">{user.name}</div>
                        {!user.isActive && (
                            <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                                {t('staff.inactive')}
                            </span>
                        )}
                        {user.isActive && (
                            <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                                {t('staff.active')}
                            </span>
                        )}
                    </div>
                    <div className="text-gray-600 text-sm flex items-center gap-1">
                        <Icons.Mail className="h-3 w-3" />
                        <span className="truncate">{user.email}</span>
                    </div>
                    {user.phone && (
                        <div className="text-gray-500 text-xs mt-1 flex items-center gap-1">
                            <Icons.Phone className="h-3 w-3" />
                            {user.phone}
                        </div>
                    )}
                </div>
                <div className="ml-4 flex flex-col items-end gap-2">
                    <div className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded uppercase tracking-wider">
                        {user.role}
                    </div>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="flex gap-1">
                    <button
                        onClick={() => onEdit(user)}
                        className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 p-2 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium"
                    >
                        <Icons.Edit className="h-4 w-4" />
                        {t('staff.edit')}
                    </button>
                    <button
                        onClick={() => onDelete(user.id, user.name)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium"
                    >
                        <Icons.Trash2 className="h-4 w-4" />
                        {t('staff.delete')}
                    </button>
                </div>

                <button
                    onClick={() => onToggleStatus(user)}
                    className={`flex items-center gap-1 text-xs font-bold px-3 py-2 rounded-lg transition-all shadow-sm ${user.isActive
                        ? 'text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200'
                        : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200'
                        }`}
                >
                    {user.isActive ? (
                        <>
                            <Icons.UserX className="h-4 w-4" />
                            {t('staff.deactivate')}
                        </>
                    ) : (
                        <>
                            <Icons.UserCheck className="h-4 w-4" />
                            {t('staff.activate')}
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
