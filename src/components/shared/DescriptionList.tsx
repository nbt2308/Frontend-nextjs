import { Check, type LucideIcon } from "lucide-react";

interface DescriptionListProps {
    value?: string | null;
    icon?: LucideIcon;
    cols?: number;
    maxRowsPerCol?: number;
}

const gridColMap: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
};

export function DescriptionList({
    value,
    icon: Icon = Check,
    cols = 2,
    maxRowsPerCol = 5,
}: DescriptionListProps) {
    // Tối đa số item = số cột * số dòng mỗi cột
    const maxItems = cols * maxRowsPerCol;

    const items = value
        ?.split(/\r?\n/)
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, maxItems);

    if (!items?.length) {
        return (
            <p className="text-sm text-muted-foreground">
                Chưa có thông tin.
            </p>
        );
    }

    const colClass = gridColMap[cols] || gridColMap[2];

    return (
        <ul className={`grid ${colClass} gap-x-6 gap-y-3`}>
            {items.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                    <Icon className="mt-1 size-4 shrink-0 text-foreground" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                </li>
            ))}
        </ul>
    );
}