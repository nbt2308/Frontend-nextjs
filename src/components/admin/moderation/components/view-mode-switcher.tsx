import { Button } from "@/components/ui/button";
import { TableIcon, LayoutGrid } from "lucide-react";

interface ViewModeSwitcherProps {
    viewMode: "table" | "grid";
    setViewMode: (viewMode: "table" | "grid") => void;
}

export default function ViewModeSwitcher({ viewMode, setViewMode }: ViewModeSwitcherProps) {
    return (
        <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button
                variant={viewMode === "table" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="h-9 px-3 gap-1.5 text-xs font-medium"
            >
                <TableIcon className="h-4 w-4" />
                <span>Bảng</span>
            </Button>
            <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="h-9 px-3 gap-1.5 text-xs font-medium"
            >
                <LayoutGrid className="h-4 w-4" />
                <span>Lưới thẻ</span>
            </Button>
        </div>
    )
}