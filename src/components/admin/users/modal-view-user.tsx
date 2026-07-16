
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { User } from "./columns";
import { CircleCheck, Lock, ShieldCheck, ShieldX, User as UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";


export default function ModalViewUser({ open, closeDialog, data }: { open: boolean, closeDialog: () => void, data: User }) {
    const user = data as User;
    const sliceName = user?.name?.slice(0, 2).toUpperCase();
    return (
        <Dialog open={open} onOpenChange={closeDialog}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Xem thông tin người dùng</DialogTitle>
                </DialogHeader>
                <Separator />
                <div className="flex items-center gap-3 py-1">
                    {/* Vòng tròn Avatar */}
                    <Avatar className="h-10 w-10 rounded-full">
                        <AvatarImage src={user.avatar} alt={sliceName} />
                        <AvatarFallback className="rounded-full">{sliceName}</AvatarFallback>
                    </Avatar>
                    <div className="leading-tight">
                        <div className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1">
                            <span>{user.name}</span>
                        </div>
                        <span className="text-xs font-mono text-zinc-400">ID: {user.id}</span>
                    </div>
                </div>
                {/* vai trò trạng thái kích hoạt */}
                <div className="bg-zinc-50 dark:bg-zinc-900/50 p-3 rounded border border-zinc-100 dark:border-zinc-800/50 grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div>
                        <div className="text-[10px] uppercase text-zinc-400 font-semibold">Vai trò</div>
                        <div className="text-sm font-medium mt-1">
                            {user.role}
                        </div>
                    </div>
                    <div>
                        <div className="text-[10px] uppercase text-zinc-400 font-semibold">Trạng thái tài khoản</div>
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
                    <div>
                        <div className="text-[10px] uppercase text-zinc-400 font-semibold">Xác thực</div>
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
                <div className="grid grid-cols-1 gap-2">

                    <div className="flex flex-row justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Email :</span>
                        <span className="text-sm">{user.email}</span>
                    </div>
                    <Separator />
                    <div className="flex flex-row justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Số điện thoại :</span>
                        <span className="text-sm">{user.phone}</span>
                    </div>
                    <Separator />
                    <div className="flex flex-row justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Ngày tạo :</span>
                        <span className="text-sm">{new Date(user.createdAt).toLocaleString()}</span>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={closeDialog}>Đóng</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}