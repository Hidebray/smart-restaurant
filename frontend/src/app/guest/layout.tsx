import BottomNav from "@/components/mobile/BottomNav";
import TableSync from "@/components/TableSync";
import { Suspense } from "react";

export default function GuestLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="bg-[#f5f6fa] min-h-screen pb-20">
            <Suspense>
                <TableSync />
            </Suspense>
            {children}
            <Suspense>
                <BottomNav />
            </Suspense>
        </div>
    );
}
