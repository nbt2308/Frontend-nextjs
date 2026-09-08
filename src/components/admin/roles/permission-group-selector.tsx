import { Badge } from "@/components/ui/badge";
import { PermissionType } from "@/types/generated-zod/schemas/models/Permission.schema";
import { Layers, Lock } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
type GroupedPermissions = Record<string, PermissionType[]>;

export function PermissionGroupSelector({
    permissions,
    selectedIds,
    onToggle,
    onToggleGroup,
    disabled = false,
}: {
    permissions: GroupedPermissions;
    selectedIds: number[];
    onToggle: (id: number) => void;
    onToggleGroup: (ids: number[], checked: boolean) => void;
    disabled?: boolean;
}) {

    return (
        <div className="space-y-4">
            {Object.entries(permissions).map(([groupName, groupPermissions]) => {
                const groupIds = groupPermissions.map((p) => p.id);
                const selectedCount = groupIds.filter((id) => selectedIds.includes(id)).length;
                const allSelected = selectedCount === groupIds.length;
                const someSelected = selectedCount > 0 && !allSelected;

                return (
                    <div key={groupName} className={`border rounded-xl overflow-hidden ${disabled ? "opacity-75" : ""}`}>
                        {/* Group Header */}
                        <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border-b">
                            <div className="flex items-center gap-2">
                                
                                    <Layers className="h-4 w-4 text-muted-foreground" />
                                
                                <span className="text-sm font-semibold">{groupName}</span>
                                <Badge variant="secondary" className="text-xs px-1.5 py-0 h-5">
                                    {selectedCount}/{groupIds.length}
                                </Badge>
                            </div>
                            {disabled ? (
                                <span className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 select-none">
                                    <Lock className="h-3 w-3" />
                                    Đã khoá
                                </span>
                            ) : (
                                <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-muted-foreground hover:text-foreground transition-colors">
                                    <Checkbox
                                        checked={allSelected ? true : someSelected ? "indeterminate" : false}
                                        onCheckedChange={(checked) => {
                                            onToggleGroup(groupIds, !!checked);
                                        }}
                                    />
                                    Chọn nhóm này
                                </label>
                            )}
                        </div>

                        {/* Permission Items */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
                            {groupPermissions.map((perm: PermissionType, idx: number) => {
                                const isChecked = selectedIds.includes(perm.id);
                                const label = perm.label || perm.name;
                                const desc = perm.description || "";

                                return (
                                    <label
                                        key={perm.id}
                                        className={`flex items-start gap-3 px-4 py-3 transition-colors border-b border-r last:border-b-0 ${disabled ? "cursor-not-allowed" : "cursor-pointer hover:bg-muted/30"} ${isChecked ? "bg-primary/5" : ""}`}
                                    >
                                        {disabled ? (
                                            <Lock className="h-4 w-4 mt-0.5 shrink-0 text-amber-500/70" />
                                        ) : (
                                            <Checkbox
                                                checked={isChecked}
                                                onCheckedChange={() => onToggle(perm.id)}
                                                className="mt-0.5"
                                            />
                                        )}
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-sm font-medium leading-tight">{label}</span>
                                            <code className="text-[11px] text-muted-foreground font-mono">{perm.name}</code>
                                            {desc && <span className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{desc}</span>}
                                        </div>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}