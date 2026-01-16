"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { tablesApi } from "@/lib/api/tables";
import LanguageSwitcher from "@/components/LanguageSwitcher";

interface HeaderProps {
    title: string;
    showBack?: boolean;
    backUrl?: string;
    tableId?: string | null;
}

export default function Header({ title, showBack, backUrl, tableId }: HeaderProps) {
    const [tableNumber, setTableNumber] = useState<string | null>(null);

    useEffect(() => {
        if (!tableId) return;

        const fetchTable = async () => {
            try {
                const table = await tablesApi.getById(tableId);
                setTableNumber(table.tableNumber);
            } catch (error) {
                console.error("Failed to fetch table info:", error);
            }
        };

        fetchTable();
    }, [tableId]);

    return (
        <div className="sticky top-0 bg-white z-40 px-4 py-3 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
                {showBack && (
                    <Link href={backUrl || "/guest"} className="text-2xl text-gray-600">
                        ←
                    </Link>
                )}
                <span className="text-lg font-bold text-gray-800">{title}</span>
            </div>
            <div className="flex items-center gap-3">
                {tableNumber && (
                    <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {tableNumber}
                    </span>
                )}
                <LanguageSwitcher />
            </div>
        </div>
    );
}
