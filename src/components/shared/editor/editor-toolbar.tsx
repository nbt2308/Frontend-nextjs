"use client"

import { useCallback, useRef, type ChangeEvent, type ReactNode } from "react"
import type { Editor } from "@tiptap/react"
import {
    AlignCenter,
    AlignLeft,
    AlignRight,
    Bold,
    Code,
    Heading1,
    Heading2,
    Heading3,
    ImagePlus,
    Italic,
    Link as LinkIcon,
    List,
    ListOrdered,
    Minus,
    Quote,
    Redo2,
    Strikethrough,
    Undo2,
    Underline as UnderlineIcon,
    Minimize2,
    Maximize2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { MAX_IMAGE_SIZE, MAX_IMAGES } from "@/constants/image.constants"

interface EditorToolbarProps {
    editor: Editor
    disabled?: boolean
    onAddImage: (image: { src: string; publicId?: string }) => void
    /** Callback khi user chọn ảnh — lưu File để upload khi submit. */
    onPendingImage?: (file: File, blobUrl: string) => void
    isFullscreen?: boolean
    onToggleFullscreen?: () => void
}

interface ToolbarButtonProps {
    label: string
    active?: boolean
    disabled?: boolean
    onClick: () => void
    children: ReactNode
}

function ToolbarButton({ label, active, disabled, onClick, children }: ToolbarButtonProps) {
    return (
        <Button
            type="button"
            variant={active ? "secondary" : "ghost"}
            size="icon-sm"
            title={label}
            aria-label={label}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </Button>
    )
}

export function EditorToolbar({
    editor,
    disabled = false,
    onAddImage,
    onPendingImage,
    isFullscreen = false,
    onToggleFullscreen,
}: EditorToolbarProps) {
    const imageInputRef = useRef<HTMLInputElement>(null)



    const handlePickImage = useCallback(() => {
        imageInputRef.current?.click()
    }, [])

    const handleImageChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0]
            // Cho phép chọn lại cùng một file ở lần sau
            event.target.value = ""
            if (!file) return

            if (!file.type.startsWith("image/")) {
                toast.error("Vui lòng chọn tệp hình ảnh")
                return
            }

            if (file.size > MAX_IMAGE_SIZE) {
                toast.error("Ảnh không được vượt quá 5MB")
                return
            }

            const currentImagesCount = editor.view.dom.querySelectorAll('img').length
            if (currentImagesCount >= MAX_IMAGES) {
                toast.error(`Chỉ được phép tối đa ${MAX_IMAGES} ảnh`)
                return
            }


            // Tạo blob URL để preview tức thì — chưa upload lên cloud
            const blobUrl = URL.createObjectURL(file)
            onAddImage({ src: blobUrl })
            onPendingImage?.(file, blobUrl)
        },
        [onAddImage, onPendingImage]
    )

    const separator = <span className="mx-0.5 h-5 w-px bg-border" aria-hidden="true" />

    return (
        <div className="flex flex-wrap items-center gap-0.5 border-b bg-muted/30 p-1.5">
            <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
            />
            <ToolbarButton label="Hoàn tác" disabled={disabled || !editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}>
                <Undo2 />
            </ToolbarButton>
            <ToolbarButton label="Làm lại" disabled={disabled || !editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}>
                <Redo2 />
            </ToolbarButton>
            {separator}
            <ToolbarButton label="Tiêu đề 1" active={editor.isActive("heading", { level: 1 })} disabled={disabled} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
                <Heading1 />
            </ToolbarButton>
            <ToolbarButton label="Tiêu đề 2" active={editor.isActive("heading", { level: 2 })} disabled={disabled} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
                <Heading2 />
            </ToolbarButton>
            <ToolbarButton label="Tiêu đề 3" active={editor.isActive("heading", { level: 3 })} disabled={disabled} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
                <Heading3 />
            </ToolbarButton>
            {separator}
            <ToolbarButton label="In đậm" active={editor.isActive("bold")} disabled={disabled} onClick={() => editor.chain().focus().toggleBold().run()}>
                <Bold />
            </ToolbarButton>
            <ToolbarButton label="In nghiêng" active={editor.isActive("italic")} disabled={disabled} onClick={() => editor.chain().focus().toggleItalic().run()}>
                <Italic />
            </ToolbarButton>
            <ToolbarButton label="Gạch chân" active={editor.isActive("underline")} disabled={disabled} onClick={() => editor.chain().focus().toggleUnderline().run()}>
                <UnderlineIcon />
            </ToolbarButton>
            <ToolbarButton label="Gạch ngang" active={editor.isActive("strike")} disabled={disabled} onClick={() => editor.chain().focus().toggleStrike().run()}>
                <Strikethrough />
            </ToolbarButton>
            <ToolbarButton label="Mã nội tuyến" active={editor.isActive("code")} disabled={disabled} onClick={() => editor.chain().focus().toggleCode().run()}>
                <Code />
            </ToolbarButton>
            {separator}
            <ToolbarButton label="Danh sách" active={editor.isActive("bulletList")} disabled={disabled} onClick={() => editor.chain().focus().toggleBulletList().run()}>
                <List />
            </ToolbarButton>
            <ToolbarButton label="Danh sách đánh số" active={editor.isActive("orderedList")} disabled={disabled} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
                <ListOrdered />
            </ToolbarButton>
            <ToolbarButton label="Trích dẫn" active={editor.isActive("blockquote")} disabled={disabled} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
                <Quote />
            </ToolbarButton>
            <ToolbarButton label="Đường kẻ ngang" disabled={disabled} onClick={() => editor.chain().focus().setHorizontalRule().run()}>
                <Minus />
            </ToolbarButton>
            {separator}
            <ToolbarButton label="Căn trái" active={editor.isActive({ textAlign: "left" })} disabled={disabled} onClick={() => editor.chain().focus().setTextAlign("left").run()}>
                <AlignLeft />
            </ToolbarButton>
            <ToolbarButton label="Căn giữa" active={editor.isActive({ textAlign: "center" })} disabled={disabled} onClick={() => editor.chain().focus().setTextAlign("center").run()}>
                <AlignCenter />
            </ToolbarButton>
            <ToolbarButton label="Căn phải" active={editor.isActive({ textAlign: "right" })} disabled={disabled} onClick={() => editor.chain().focus().setTextAlign("right").run()}>
                <AlignRight />
            </ToolbarButton>

            <ToolbarButton
                label="Chèn hình ảnh"
                disabled={disabled}
                onClick={handlePickImage}
            >
                <ImagePlus />
            </ToolbarButton>
            <ToolbarButton
                label={isFullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"}
                disabled={disabled}
                onClick={() => onToggleFullscreen?.()}
            >
                {isFullscreen ? <Minimize2 /> : <Maximize2 />}
            </ToolbarButton>
        </div>
    )
}
