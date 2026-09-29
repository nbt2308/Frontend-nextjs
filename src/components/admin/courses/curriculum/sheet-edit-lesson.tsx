import { useEffect, useState, useRef } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, FileText, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { IUpdateLesson, UpdateLessonSchema } from "@/schemas/lession.schema";
import { useUpdateLesson } from "@/hooks/useLession";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { RichTextEditor } from "@/components/shared/editor";
import { LessonWithResources } from "./curriculum-view";
import { CloudinaryService } from "@/services/cloudinary";
import { MAX_IMAGES, MAX_TOTAL_SIZE } from "@/constants/image.constants";

interface SheetEditLessonProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    lesson: LessonWithResources | null;
}

export const SheetEditLesson = ({ open, onOpenChange, lesson }: SheetEditLessonProps) => {
    const videoInputRef = useRef<HTMLInputElement>(null);
    const resourceInputRef = useRef<HTMLInputElement>(null);
    const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
    const [selectedResources, setSelectedResources] = useState<File[]>([]);
    
    // Lưu tạm các ảnh chờ upload (Blob URL)
    const [pendingImages, setPendingImages] = useState<{ file: File, blobUrl: string }[]>([]);
    const [isUploadingImages, setIsUploadingImages] = useState(false);

    const form = useForm<IUpdateLesson>({
        resolver: zodResolver(UpdateLessonSchema),
        defaultValues: {
            title: "",
            content: "",
            isPreview: false,
            sectionId: undefined,
            order: 0,
        },
    });

    useEffect(() => {
        if (lesson) {
            form.reset({
                title: lesson.title,
                content: lesson.content || '',
                isPreview: lesson.isPreview,
                sectionId: lesson.sectionId,
                order: Number(lesson.order),
            });
            // Reset file states when lesson changes
            setSelectedVideo(null);
            setSelectedResources([]);
        }
    }, [lesson]);


    const { mutate, isPending } = useUpdateLesson()
    const handleSubmit = async (data: IUpdateLesson) => {
        if (!lesson) {
            toast.error("Không tìm thấy bài giảng")
            return;
        }

        const imageCount = (data.content?.match(/<img/g) || []).length;
        if (imageCount > MAX_IMAGES) {
            toast.error(`Bài giảng không được vượt quá ${MAX_IMAGES} ảnh!`);
            return;
        }

        const totalImageSize = pendingImages.reduce((sum, img) => sum + img.file.size, 0);
        if (totalImageSize > MAX_TOTAL_SIZE) {
            toast.error(`Tổng dung lượng các ảnh mới thêm không được vượt quá 30MB!`);
            return;
        }

        try {
            if (pendingImages.length > 0) {
                setIsUploadingImages(true);
                let finalHtml = data.content || "";

                for (const pending of pendingImages) {
                    // Chỉ upload nếu ảnh đó vẫn còn nằm trong content (không bị user xoá đi)
                    if (finalHtml.includes(pending.blobUrl)) {
                        const { signature, timestamp, folder, apiKey } = await CloudinaryService.getSignature("lessons/content");
                        
                        const formData = new FormData();
                        formData.append("file", pending.file);
                        formData.append("folder", folder);
                        formData.append("api_key", apiKey);
                        formData.append("timestamp", timestamp);
                        formData.append("signature", signature);

                        const res = await CloudinaryService.postImageToCloudinary(formData);
                        
                        if (res.secure_url) {
                            // Dùng string replace để đổi URL tạm thành URL thật của Cloudinary
                            finalHtml = finalHtml.replaceAll(pending.blobUrl, res.secure_url);
                            // Chèn thêm data-public-id để BE có thể xoá ảnh sau này
                            finalHtml = finalHtml.replaceAll(`src="${res.secure_url}"`, `src="${res.secure_url}" data-public-id="${res.public_id}"`);
                        }
                    }
                    // Giải phóng bộ nhớ Blob
                    URL.revokeObjectURL(pending.blobUrl);
                }
                
                data.content = finalHtml;
                setPendingImages([]);
            }
        } catch (error: any) {
            toast.error(error?.message || "Tải ảnh lên thất bại");
            setIsUploadingImages(false);
            return;
        } finally {
            setIsUploadingImages(false);
        }

        mutate({ lessonId: lesson.id, lessonData: data }, {
            onSuccess: () => {
                form.reset()
                setSelectedVideo(null);
                setSelectedResources([]);
                onOpenChange(false)
            }
        })
    }

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange} >
            <SheetContent className="overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>Chỉnh sửa Bài giảng</SheetTitle>
                    <SheetDescription>
                        Cập nhật thông tin Bài giảng
                    </SheetDescription>
                    <Separator className="mt-3" />
                </SheetHeader>
                <div className="mx-3">
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
                        {/* Section 1: Thông tin chung */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">1</div>
                                <span className="font-semibold text-sm">Thông tin chung</span>
                            </div>
                            <Controller
                                name="title"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="lesson-title">
                                            Tiêu đề  <span className="text-red-500">*</span>
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="lesson-title"
                                            placeholder="Bài 1: Giới thiệu..."
                                            autoComplete="off"
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="content"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="lesson-content">
                                            Nội dung
                                        </FieldLabel>
                                        <RichTextEditor
                                            content={field.value ?? ""}
                                            onChange={({ html }) => field.onChange(html)}
                                            onPendingImage={(file, blobUrl) => {
                                                setPendingImages(prev => [...prev, { file, blobUrl }]);
                                            }}
                                            placeholder="Mô tả nội dung bài giảng..."
                                            minHeight={160}
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <div className="grid grid-cols-2 gap-3">
                                <Controller
                                    name="order"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="section-order">
                                                Thứ tự <span className="text-red-500">*</span>
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                                id="section-order"
                                                type="number"
                                                min={0}
                                                placeholder="1"
                                                autoComplete="off"
                                            />
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="isPreview"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid} className="flex flex-col justify-end">
                                            <div className="flex items-center gap-2 h-9">
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    id="lesson-isPreview"
                                                />
                                                <FieldLabel htmlFor="lesson-isPreview" className="!mb-0">
                                                    Cho phép xem trước
                                                </FieldLabel>
                                            </div>
                                        </Field>
                                    )}
                                />
                            </div>
                        </div>

                        <Separator />

                        {/* Section 2: Video Bài giảng */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">2</div>
                                <span className="font-semibold text-sm">Video Bài giảng</span>
                                <span className="text-xs text-muted-foreground">(bỏ trống nếu không đổi)</span>
                            </div>
                            <Controller
                                name="video"
                                control={form.control}
                                render={({ field: { value, onChange, ...fieldProps }, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <input
                                            ref={videoInputRef}
                                            type="file"
                                            accept="video/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const files = e.target.files;
                                                onChange(files);
                                                if (files && files.length > 0) {
                                                    setSelectedVideo(files[0]);
                                                }
                                            }}
                                        />
                                        {!selectedVideo ? (
                                            <div
                                                onClick={() => videoInputRef.current?.click()}
                                                className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all"
                                            >
                                                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                                <p className="text-sm font-medium">Nhấn để chọn video mới</p>
                                                <p className="text-xs text-muted-foreground mt-1">Hỗ trợ MP4, AVI, MOV • Tối đa 2GB</p>
                                            </div>
                                        ) : (
                                            <div className="border rounded-lg p-3 flex items-center justify-between bg-muted/30">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <div className="p-2 rounded-md bg-blue-500/10">
                                                        <Upload className="h-4 w-4 text-blue-600" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-medium truncate">{selectedVideo.name}</p>
                                                        <p className="text-xs text-muted-foreground">{formatFileSize(selectedVideo.size)}</p>
                                                    </div>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 shrink-0"
                                                    onClick={() => {
                                                        setSelectedVideo(null);
                                                        onChange(undefined);
                                                        if (videoInputRef.current) videoInputRef.current.value = "";
                                                    }}
                                                >
                                                    <X className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        )}
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        </div>

                        <Separator />

                        {/* Section 3: Tài liệu đính kèm */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">3</div>
                                <span className="font-semibold text-sm">Tài liệu đính kèm mới</span>
                                <span className="text-xs text-muted-foreground">(không bắt buộc)</span>
                            </div>
                            <Controller
                                name="resources"
                                control={form.control}
                                render={({ field: { value, onChange, ...fieldProps }, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <input
                                            ref={resourceInputRef}
                                            type="file"
                                            multiple
                                            accept=".pdf,.zip"
                                            className="hidden"
                                            onChange={(e) => {
                                                const files = e.target.files;
                                                onChange(files);
                                                if (files) {
                                                    setSelectedResources(Array.from(files));
                                                }
                                            }}
                                        />
                                        <div
                                            onClick={() => resourceInputRef.current?.click()}
                                            className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all"
                                        >
                                            <FileText className="h-6 w-6 mx-auto mb-1.5 text-muted-foreground" />
                                            <p className="text-sm font-medium">Nhấn để chọn tài liệu</p>
                                            <p className="text-xs text-muted-foreground mt-1">Hỗ trợ PDF, ZIP • Tối đa 5 file, mỗi file 20MB</p>
                                        </div>

                                        {selectedResources.length > 0 && (
                                            <div className="space-y-1.5 mt-3">
                                                {selectedResources.map((file, index) => (
                                                    <div key={index} className="flex items-center justify-between p-2 rounded-md border bg-muted/20 text-sm">
                                                        <div className="flex items-center gap-2 min-w-0">
                                                            <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                                            <span className="truncate">{file.name}</span>
                                                            <span className="text-xs text-muted-foreground shrink-0">({formatFileSize(file.size)})</span>
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-6 w-6 shrink-0"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                const newResources = selectedResources.filter((_, i) => i !== index);
                                                                setSelectedResources(newResources);
                                                                const dt = new DataTransfer();
                                                                newResources.forEach(f => dt.items.add(f));
                                                                onChange(dt.files.length > 0 ? dt.files : undefined);
                                                            }}
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        </div>

                        <Separator />

                        <Button type="submit" className="w-full gap-2" disabled={isPending || isUploadingImages}>
                            {(isPending || isUploadingImages) ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    {isUploadingImages ? "Đang tải ảnh lên..." : "Đang xử lý..."}
                                </>
                            ) : (
                                "Lưu bài giảng"
                            )}
                        </Button>
                    </form>
                </div>
            </SheetContent>
        </Sheet>
    )
}
