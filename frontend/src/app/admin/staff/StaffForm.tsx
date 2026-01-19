"use client";

import { useState } from "react";
import { usersApi } from "@/lib/api/users";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import toast from "react-hot-toast";

interface StaffFormProps {
    onClose: () => void;
}

export default function StaffForm({ onClose }: StaffFormProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "WAITER", // Default
        phone: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await usersApi.create(formData);
            toast.success("Created staff successfully!");
            onClose();
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to create staff");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Add New Staff</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <Input
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Full Name"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <Input
                            required
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="staff@example.com"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <Input
                            required
                            type="password"
                            minLength={6}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="••••••••"
                        />
                    </div>

                    {/* Role Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                type="button"
                                className={`py-2 px-4 rounded border text-center transition-colors ${formData.role === 'WAITER' ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold' : 'border-gray-300 hover:bg-gray-50'}`}
                                onClick={() => setFormData({ ...formData, role: 'WAITER' })}
                            >
                                🤵 Waiter
                            </button>
                            <button
                                type="button"
                                className={`py-2 px-4 rounded border text-center transition-colors ${formData.role === 'KITCHEN' ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold' : 'border-gray-300 hover:bg-gray-50'}`}
                                onClick={() => setFormData({ ...formData, role: 'KITCHEN' })}
                            >
                                👨‍🍳 Kitchen
                            </button>
                            <button
                                type="button"
                                className={`py-2 px-4 rounded border text-center transition-colors ${formData.role === 'ADMIN' ? 'bg-red-50 border-red-500 text-red-700 font-bold' : 'border-gray-300 hover:bg-gray-50'}`}
                                onClick={() => setFormData({ ...formData, role: 'ADMIN' })}
                            >
                                🛡️ Admin
                            </button>
                        </div>
                        {formData.role === 'ADMIN' && (
                            <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
                                ⚠️ <strong>Warning:</strong> Admin accounts have full system access. Only create for trusted staff.
                            </div>
                        )}
                    </div>

                    {/* Phone (Optional) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone (Optional)</label>
                        <Input
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="0912345678"
                        />
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <Button variant="outline" type="button" onClick={onClose} disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Creating..." : "Create Staff"}
                        </Button>
                    </div>

                </form>
            </DialogContent>
        </Dialog>
    );
}
