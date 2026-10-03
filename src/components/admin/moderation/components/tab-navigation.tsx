import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle2, XCircle } from "lucide-react"

interface TabNavigationProps {
    selectedStatusTab: string
    setSelectedStatusTab: (value: string) => void
    kpiCounts: {
        pending: number
        approved: number
        rejected: number
        total: number
    }
}

export const TabNavigation = ({ selectedStatusTab, setSelectedStatusTab, kpiCounts }: TabNavigationProps) => {
    return (
        <Tabs
            value={selectedStatusTab}
            onValueChange={setSelectedStatusTab}
            className="w-full sm:w-auto"
        >
            <TabsList className="bg-muted/60 p-1 rounded-xl h-11 grid grid-cols-4 sm:flex gap-1">
                <TabsTrigger
                    value="PENDING"
                    className="text-xs sm:text-sm font-medium gap-2 data-[state=active]:bg-background data-[state=active]:shadow-xs rounded-lg px-3"
                >
                    <Clock className="h-4 w-4 text-amber-500" />
                    <span>Chờ duyệt</span>
                    <Badge
                        variant="secondary"
                        className="ml-1 px-1.5 py-0 h-4 text-[10px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    >
                        {kpiCounts.pending}
                    </Badge>
                </TabsTrigger>

                <TabsTrigger
                    value="PUBLISHED"
                    className="text-xs sm:text-sm font-medium gap-2 data-[state=active]:bg-background data-[state=active]:shadow-xs rounded-lg px-3"
                >
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Đã duyệt</span>
                    <Badge
                        variant="secondary"
                        className="ml-1 px-1.5 py-0 h-4 text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    >
                        {kpiCounts.approved}
                    </Badge>
                </TabsTrigger>

                <TabsTrigger
                    value="REJECTED"
                    className="text-xs sm:text-sm font-medium gap-2 data-[state=active]:bg-background data-[state=active]:shadow-xs rounded-lg px-3"
                >
                    <XCircle className="h-4 w-4 text-rose-500" />
                    <span>Từ chối</span>
                    <Badge
                        variant="secondary"
                        className="ml-1 px-1.5 py-0 h-4 text-[10px] font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400"
                    >
                        {kpiCounts.rejected}
                    </Badge>
                </TabsTrigger>

                <TabsTrigger
                    value="ALL"
                    className="text-xs sm:text-sm font-medium gap-2 data-[state=active]:bg-background data-[state=active]:shadow-xs rounded-lg px-3"
                >
                    <span>Tất cả</span>
                    <Badge variant="outline" className="ml-1 px-1.5 py-0 h-4 text-[10px] font-semibold">
                        {kpiCounts.total}
                    </Badge>
                </TabsTrigger>
            </TabsList>
        </Tabs>
    )
}