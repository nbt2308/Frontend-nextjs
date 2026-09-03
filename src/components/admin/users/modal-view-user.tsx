
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { User } from "./columns";
import { Calendar, CircleCheck, Clock, Lock, Mail, MapPinHouse, PhoneCall, ShieldCheck, ShieldX, ShieldUser, User as UserIcon, Info, BadgeCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { UserType } from "@/types/generated-zod/schemas/models/User.schema";

interface ModalViewUserProps {
    open: boolean;
    closeDialog: () => void;
    data: UserType;
}

export default function ModalViewUser({ open, closeDialog, data }: ModalViewUserProps) {
    const user = data;
    const sliceName = user?.name?.slice(0, 2).toUpperCase();
    return (
        <Dialog open={open} onOpenChange={closeDialog}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <UserIcon className="h-5 w-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-semibold">Chi Tiết Người Dùng</DialogTitle>
                            <DialogDescription className="text-xs text-muted-foreground">
                                Thông tin tổng quan và chi tiết của người dùng
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                <Separator />
                <div className="flex items-center gap-3 p-3 bg-card border rounded-lg">
                    {/* Vòng tròn Avatar */}
                    <Avatar className="h-10 w-10 rounded-full">
                        <AvatarImage src={user.avatar || ""} alt={sliceName} />
                        <AvatarFallback className="rounded-full">{sliceName}</AvatarFallback>
                    </Avatar>
                    <div className="leading-tight flex gap-2 flex-col">
                        <div className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center ml-1">
                            <span>{user.name}</span>
                        </div>
                        <Badge variant="outline" className="font-mono text-xs px-2.5 py-1 bg-background shrink-0">
                            ID: {user.id}
                        </Badge>
                    </div>
                </div>
                {/* vai trò trạng thái kích hoạt */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-card p-3 rounded border rounded-lg space-y-1.5">
                        <span className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1.5">
                            Vai trò
                        </span>
                        {user.roles?.map((item) => (
                            <Badge key={item.name} variant="outline" className="text-xs font-medium mt-1 px-2.5 py-1">
                                {item.name}
                            </Badge>
                        ))}
                    </div>
                    <div className="bg-card p-3 rounded border rounded-lg space-y-1.5">
                        <span className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1.5">
                            Phương thức đăng nhập
                        </span>
                        {
                            user.provider.map((item) => (
                                <Badge key={item} variant="outline" className="text-xs font-medium mt-1 px-2.5 py-1 mr-1">
                                    {item}
                                </Badge>
                            ))
                        }
                    </div>
                    <div className="bg-card p-3 rounded border rounded-lg space-y-1.5">
                        <span className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1.5">
                            Trạng thái
                        </span>
                        <div className="mt-1">
                            <Badge className={
                                user.status ?
                                    "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                                    :
                                    "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
                            }>
                                {
                                    user.status ?
                                        <CircleCheck data-icon="inline-start" className="h-4 w-4" color="green" />
                                        :
                                        <Lock data-icon="inline-start" className="h-4 w-4" color="red" />
                                }
                                {user.status ? "Hoạt động" : "Bị khoá"}
                            </Badge>
                        </div>
                    </div>
                    <div className="bg-card p-3 rounded border rounded-lg space-y-1.5">
                        <span className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1.5">
                            Xác thực
                        </span>
                        <div className="mt-1">
                            <Badge className={
                                user.isActive ?
                                    "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                                    :
                                    "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
                            }>
                                {
                                    user.isActive ?
                                        <ShieldCheck data-icon="inline-start" size={14} color="green" />
                                        :
                                        <ShieldX data-icon="inline-start" size={14} color="red" />
                                }
                                {user.isActive ? "Đã kích hoạt" : "Chưa kích hoạt"}
                            </Badge>
                        </div>
                    </div>
                </div>

                <div className="p-3.5 rounded-lg border bg-card space-y-1.5">
                    <span className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1.5">
                        <MapPinHouse className="h-3.5 w-3.5" />
                        Địa chỉ
                    </span>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed">
                        {user.address ? user.address : <span className="italic text-muted-foreground">Chưa có địa chỉ cho người dùng này.</span>}
                    </p>
                </div>
                <div className="divide-y divide-border border rounded-lg px-3.5 py-1 bg-card">
                    <div className="flex items-center justify-between py-2.5">
                        <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                            <Mail className="h-3.5 w-3.5" />
                            Email
                        </span>
                        <span className="text-xs font-medium">{user.email || "N/A"}</span>
                    </div>
                    <div className="flex items-center justify-between py-2.5">
                        <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                            <PhoneCall className="h-3.5 w-3.5" />
                            Số điện thoại
                        </span>
                        <span className="text-xs font-medium">{user.phone || "N/A"}</span>
                    </div>
                    <div className="flex items-center justify-between py-2.5">
                        <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            Ngày tạo
                        </span>
                        <span className="text-xs font-medium">{formatDate(user.createdAt)}</span>
                    </div>
                    <div className="flex items-center justify-between py-2.5">
                        <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            Cập nhật lần cuối
                        </span>
                        <span className="text-xs font-medium">{formatDate(user.updatedAt)}</span>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={closeDialog}>Đóng</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}