import RoleManagement from "@/components/admin/roles/roles";

export const metadata = {
    title: "Phân quyền và Vai trò | Admin Panel",
    description: "Quản lý quyền hạn truy cập của các nhóm người dùng trong hệ thống",
};

export default function RolesPage() {
    return <RoleManagement />;
}
