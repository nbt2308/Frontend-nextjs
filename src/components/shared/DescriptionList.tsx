import { Check, type LucideIcon } from "lucide-react";

export function DescriptionList({
    value,
    icon: Icon = Check,
}: {
    value?: string | null;
    icon?: LucideIcon;
}) {
    const items = value
        ?.split(/\r?\n/)
        .map((item) => item.trim())
        .filter(Boolean);

    if (!items?.length) {
        return (
            <p className="text-sm text-muted-foreground">
                Chưa có thông tin.
            </p>
        );
    }

    return (
        <ul className="space-y-3">
            {items.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                    <Icon className="mt-1 size-4 shrink-0 text-purple-500" />
                    <span>{item}</span>
                </li>
            ))}
        </ul>
    );
}