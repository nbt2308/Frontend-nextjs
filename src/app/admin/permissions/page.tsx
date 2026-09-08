import PermissionList from "@/components/admin/permissions/permission-list";

export const metadata = {
    title: "Danh sách quyền | Admin Panel",
    description: "Danh sách tất cả các quyền hạn trên hệ thống",
};

export default function PermissionsPage() {
    return <PermissionList />;
}
