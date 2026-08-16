"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateCourseSchema, ICreateCourse } from "@/schemas/course.schema";
import { CourseTypeSchema, LevelSchema } from "@/types/generated-zod/schemas";
import { useCreateCourse } from "@/hooks/useCourse";
import { cn } from "@/lib/utils";

// Components UI
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Loader2, Upload, X, ImagePlus, FileText, CircleDollarSign, Settings, Check, ChevronsUpDown, BookPlus } from "lucide-react";
import Image from "next/image";
import { UserType } from "@/types/generated-zod/schemas/models/User.schema";
import { TagType } from "@/types/generated-zod/schemas/models/Tag.schema";
import { toast } from "sonner";
import { CloudinaryService } from "@/services/cloudinary";

interface ModalCreateCourseProps {
    open: boolean;
    closeDialog: () => void;
    tags: TagType[]
    instructors: UserType[]
}

export default function ModalCreateCourse({ open, closeDialog, tags, instructors }: ModalCreateCourseProps) {
    const CourseType = CourseTypeSchema.enum;
    const Level = LevelSchema.enum;
    const [isImageLoading, setIsImageLoading] = useState<boolean>(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const form = useForm<ICreateCourse>({
        resolver: zodResolver(CreateCourseSchema),
        defaultValues: {
            title: "",
            description: "",
            courseType: CourseType.FREE,
            level: Level.BEGINNER,
            price: 0,
            discount: 0,
            status: true,
            instructorId: undefined,
            tags: [],
            thumbnail: "",
            thumbnail_publicID: "",
        },
    });



    // Theo dõi giá trị courseType để ẩn/hiện ô nhập giá
    const watchCourseType = form.watch("courseType");

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file?.size > 5 * 1024 * 1024) {
            toast.error("Dung lượng file không được vượt quá 5MB!");
            return;
        }
        if (file) {
            const url = URL.createObjectURL(file);
            setImagePreview(url);
            setSelectedFile(file);
            form.setValue("thumbnail", url, { shouldValidate: true });
            form.setValue("thumbnail_publicID", "temp_public_id", { shouldValidate: true });
        }
    };

    const handleRemoveImage = () => {
        setImagePreview(null);
        setSelectedFile(null);
        form.setValue("thumbnail", "", { shouldValidate: true });
        form.setValue("thumbnail_publicID", "", { shouldValidate: true });
    };

    const { mutate: createCourse, isPending } = useCreateCourse();
    const handleSubmit = async (data: ICreateCourse) => {
        try {

            if (selectedFile) {
                const signResponse = await CloudinaryService.getSignature("courses");
                const { signature, timestamp, folder, apiKey } = signResponse;

                const formData = new FormData();
                formData.append("file", selectedFile);
                formData.append("folder", folder);
                formData.append("api_key", apiKey);
                formData.append("timestamp", timestamp);
                formData.append("signature", signature);

                setIsImageLoading(true);
                const uploadResponse = await CloudinaryService.postImageToCloudinary(formData);
                data.thumbnail = uploadResponse.secure_url;
                data.thumbnail_publicID = uploadResponse.public_id;
                if (uploadResponse.secure_url && uploadResponse.public_id) {
                    setIsImageLoading(false);
                }
            }
            createCourse(data, {
                onSuccess: () => {
                    form.reset();
                    setImagePreview(null);
                    setSelectedFile(null);
                    closeDialog();
                },
            });
        } catch (error) {
            console.error("Lỗi khi tạo khóa học:", error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={closeDialog}>
            <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
                <DialogHeader>
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <BookPlus className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col">
                            <DialogTitle className="text-xl font-semibold">Tạo Khóa Học Mới</DialogTitle>
                            <DialogDescription className="text-xs text-muted-foreground">
                                Điền đầy đủ thông tin bên dưới để tạo khóa học mới vào hệ thống.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <Separator />

                {/* Thêm scroll cho Form khi màn hình nhỏ */}
                <div className="flex-1 overflow-y-auto pr-1 py-2">
                    <form
                        id="create-course-form"
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-5"
                    >
                        <FieldGroup className="bg-zinc-50 dark:bg-zinc-900/50 p-3 rounded-lg border">
                            <FieldLabel className="text-lg font-medium"><FileText size={20} /> Thông tin cơ bản</FieldLabel>
                            <FieldGroup>
                                {/* 1. Tên khóa học */}
                                <Controller
                                    name="title"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="course-title">
                                                Tên khóa học <span className="text-red-500">*</span>
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="course-title"
                                                placeholder="Ví dụ: Lập trình Next.js 14 từ cơ bản đến nâng cao"
                                                autoComplete="off"
                                            />
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />

                                {/* 2. Mô tả khóa học */}
                                <Controller
                                    name="description"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="course-description">
                                                Mô tả khóa học <span className="text-red-500">*</span>
                                            </FieldLabel>
                                            <Textarea
                                                {...field}
                                                id="course-description"
                                                placeholder="Tóm tắt ngắn gọn nội dung và giá trị của khóa học..."
                                                rows={3}
                                            />
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />

                                {/* 3. Upload Ảnh Thumbnail */}
                                <Controller
                                    name="thumbnail"
                                    control={form.control}
                                    render={({ fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel>
                                                Ảnh đại diện khóa học <span className="text-red-500">*</span>
                                            </FieldLabel>

                                            {imagePreview ? (
                                                <div className="relative w-full h-44 rounded-lg overflow-hidden border border-zinc-200 group">
                                                    <Image
                                                        src={imagePreview}
                                                        alt="Thumbnail Preview"
                                                        fill
                                                        className="object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={handleRemoveImage}
                                                        className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 rounded-full text-white transition-all"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <label
                                                    htmlFor="thumbnail-upload"
                                                    className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                                                >
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-zinc-500">
                                                        <ImagePlus className="w-8 h-8 mb-2" />
                                                        <p className="text-sm font-medium">Nhấn để tải ảnh đại diện lên</p>
                                                        <p className="text-xs">PNG, JPG hoặc WEBP (Tối đa 5MB)</p>
                                                    </div>
                                                    <input
                                                        id="thumbnail-upload"
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={handleImageChange}
                                                    />
                                                </label>
                                            )}
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />
                            </FieldGroup>
                        </FieldGroup>

                        <FieldGroup className="bg-zinc-50 dark:bg-zinc-900/50 p-3 rounded-lg border">
                            <FieldLabel className="text-lg font-medium"><Settings size={20} /> Cài đặt và trạng thái</FieldLabel>
                            <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Controller
                                    name="courseType"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel>
                                                Loại khóa học <span className="text-red-500">*</span>
                                            </FieldLabel>
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Chọn loại khóa học" />
                                                </SelectTrigger>
                                                <SelectContent position="popper">
                                                    <SelectItem value={CourseType.FREE}>Miễn phí (FREE)</SelectItem>
                                                    <SelectItem value={CourseType.PAID}>Trả phí (PAID)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="level"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel>
                                                Cấp độ <span className="text-red-500">*</span>
                                            </FieldLabel>
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Chọn cấp độ" />
                                                </SelectTrigger>
                                                <SelectContent position="popper">
                                                    <SelectItem value={Level.BEGINNER}>Cơ bản (Beginner)</SelectItem>
                                                    <SelectItem value={Level.INTERMEDIATE}>Trung cấp (Intermediate)</SelectItem>
                                                    <SelectItem value={Level.ADVANCED}>Nâng cao (Advanced)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="tags"
                                    control={form.control}
                                    render={({ field, fieldState }) => {
                                        const selectedIds: number[] = field.value ?? [];
                                        const toggleTag = (tagId: number) => {
                                            const newValue = selectedIds.includes(tagId)
                                                ? selectedIds.filter((id) => id !== tagId)
                                                : [...selectedIds, tagId];
                                            field.onChange(newValue);
                                        };
                                        return (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel>
                                                    Danh mục / Tag <span className="text-red-500">*</span>
                                                </FieldLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            role="combobox"
                                                            type="button"
                                                            className={cn(
                                                                "w-full justify-between font-normal h-auto min-h-9",
                                                                selectedIds.length === 0 && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {selectedIds.length > 0 ? (
                                                                <div className="flex flex-wrap gap-1">
                                                                    {selectedIds.map((id) => {
                                                                        const tag = tags.find((t) => t.id === id);
                                                                        return (
                                                                            <Badge key={id} variant="secondary" className="text-xs">
                                                                                {tag?.name}
                                                                                <span
                                                                                    role="button"
                                                                                    className="ml-1 rounded-full outline-none hover:text-destructive"
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation();
                                                                                        toggleTag(id);
                                                                                    }}
                                                                                >
                                                                                    <X className="h-3 w-3" />
                                                                                </span>
                                                                            </Badge>
                                                                        );
                                                                    })}
                                                                </div>
                                                            ) : (
                                                                "Chọn danh mục / Tag..."
                                                            )}
                                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                                                        <Command>
                                                            <CommandInput placeholder="Tìm tag..." />
                                                            <CommandList>
                                                                <CommandEmpty>Không tìm thấy tag nào.</CommandEmpty>
                                                                <CommandGroup>
                                                                    {tags.map((tag) => (
                                                                        <CommandItem
                                                                            key={tag.id}
                                                                            value={tag.name}
                                                                            onSelect={() => toggleTag(tag.id)}
                                                                            data-checked={selectedIds.includes(tag.id)}
                                                                        >
                                                                            {tag.name}
                                                                        </CommandItem>
                                                                    ))}
                                                                </CommandGroup>
                                                            </CommandList>
                                                        </Command>
                                                    </PopoverContent>
                                                </Popover>
                                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                            </Field>
                                        );
                                    }}
                                />
                                <Controller
                                    name="instructorId"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel>
                                                Giảng viên <span className="text-red-500">*</span>
                                            </FieldLabel>
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Chọn giảng viên" />
                                                </SelectTrigger>
                                                <SelectContent position="popper">
                                                    {instructors && instructors.length > 0 ? (
                                                        instructors.map((instructor) => (
                                                            <SelectItem key={instructor.id} value={String(instructor.id)}>
                                                                {instructor.email} - {instructor.name}
                                                            </SelectItem>
                                                        ))
                                                    ) : (
                                                        <div className="py-4 text-center text-sm text-muted-foreground">
                                                            Không có dữ liệu
                                                        </div>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />
                            </FieldGroup>

                        </FieldGroup>

                        {/* 5. Giá gốc & Giá giảm (Chỉ hiển thị khi chọn PAID) */}
                        {watchCourseType === CourseType.PAID && (
                            <FieldGroup className="bg-zinc-50 dark:bg-zinc-900/50 p-3 rounded-lg border">
                                <FieldLabel className="text-lg font-medium"><CircleDollarSign size={20} /> Thông tin giá</FieldLabel>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">

                                    <Controller
                                        name="price"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel htmlFor="course-price">
                                                    Giá bán (VNĐ) <span className="text-red-500">*</span>
                                                </FieldLabel>
                                                <Input
                                                    {...field}
                                                    id="course-price"
                                                    type="number"
                                                    placeholder="Nhập giá khóa học..."
                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                />
                                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                            </Field>
                                        )}
                                    />

                                    <Controller
                                        name="discount"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel htmlFor="course-discount">Giá khuyến mãi (VNĐ)</FieldLabel>
                                                <Input
                                                    {...field}
                                                    id="course-discount"
                                                    type="number"
                                                    placeholder="Nhập giá sau giảm..."
                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                />
                                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                            </Field>
                                        )}
                                    />
                                </div>
                            </FieldGroup>
                        )}



                    </form>
                </div>

                <DialogFooter className="sm:gap-2 gap-1">
                    <Button variant="outline" type="button"
                        onClick={() => {
                            form.reset();
                            closeDialog();
                        }}
                        disabled={isPending || isImageLoading}>
                        Hủy bỏ
                    </Button>

                    <Button type="submit" form="create-course-form" disabled={isPending || isImageLoading}>
                        {isPending || isImageLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Đang xử lý...
                            </>
                        ) : (
                            "Tạo khóa học"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}