import { TabsContent } from "@/components/ui/tabs";
import { ShieldX } from "lucide-react";

interface TabReasonProps {
    reasonRejected: string;
}

export default function TabReason({ reasonRejected }: TabReasonProps) {
    if (!reasonRejected) return null;

    return (
        <TabsContent value="reason" className="flex-1 overflow-y-auto p-6 m-0 focus-visible:outline-none">
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <ShieldX className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />

                    <div className="flex flex-col">
                        <h3 className="text-sm font-semibold text-foreground text-rose-700 dark:text-rose-400">
                            Lý do từ chối phê duyệt
                        </h3>
                        <p className="text-xs text-muted-foreground">
                            Thông tin chi tiết về các lý do khóa học này bị từ chối xuất bản.
                        </p>
                    </div>
                </div>
                <div className="p-4 rounded-lg bg-rose-50 border border-rose-100 dark:bg-rose-950/20 dark:border-rose-900/50">
                    <div className="flex gap-3">

                        <div className="space-y-1 text-sm text-rose-800 dark:text-rose-300 whitespace-pre-wrap leading-relaxed">
                            {reasonRejected}
                        </div>
                    </div>
                </div>
            </div>
        </TabsContent>
    );
}
