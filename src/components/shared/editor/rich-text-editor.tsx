"use client"

import { useCallback, useEffect, useState } from "react"
import { EditorContent, useEditor, type JSONContent, type Editor as TiptapEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import TextAlign from "@tiptap/extension-text-align"
import Underline from "@tiptap/extension-underline"
import { TextStyle } from "@tiptap/extension-text-style"
import { Color } from "@tiptap/extension-color"
import { cn } from "@/lib/utils"
import { EditorToolbar } from "./editor-toolbar"
import type { EditorImagePayload } from "./index"
export interface RichTextEditorProps {
    /** Nội dung HTML ban đầu. Ưu tiên `content` khi chỉ cần nhập liệu từ form. */
    content?: string
    /** Nội dung JSON (khuyến nghị khi lưu/load từ DB). */
    contentJson?: JSONContent | null
    onChange?: (payload: { html: string; json: JSONContent | null; text: string }) => void
    placeholder?: string
    disabled?: boolean
    className?: string
    editorClassName?: string
    minHeight?: number
    /** Callback nhận file ảnh và blob URL để component cha tự xử lý upload */
    onPendingImage?: (file: File, blobUrl: string) => void
}

export type { TiptapEditor, JSONContent }

/**
 * Image node mở rộng thêm attribute `publicId`.
 */
const PublicIdImage = Image.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            publicId: {
                default: null,
                parseHTML: (el: HTMLElement) => el.getAttribute("data-public-id"),
                renderHTML: (attrs: Record<string, any>) =>
                    attrs.publicId ? { "data-public-id": attrs.publicId } : {},
            },
        }
    },
})

export function RichTextEditor({
    content = "",
    contentJson,
    onChange,
    placeholder = "Nhập nội dung...",
    disabled = false,
    className,
    editorClassName,
    minHeight = 200,
    onPendingImage,
}: RichTextEditorProps) {
    const [isFullscreen, setIsFullscreen] = useState(false)
    const editor = useEditor({
        immediatelyRender: false,
        editable: !disabled,
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
                codeBlock: { HTMLAttributes: { class: "rounded-md bg-muted p-3 font-mono text-sm" } },
            }),
            Underline,
            TextStyle,
            Color,
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            Placeholder.configure({ placeholder }),
            PublicIdImage.configure({ inline: false, allowBase64: true }),

        ],
        content: contentJson ?? content,
        editorProps: {
            attributes: {
                class: cn(
                    "tiptap prose-sm max-w-none px-3 py-2 focus:outline-none",
                    editorClassName
                ),
            },
        },
        onUpdate: ({ editor: instance }) => {
            onChange?.({
                html: instance.getHTML(),
                json: instance.getJSON(),
                text: instance.getText(),
            })
        },
    })

    // Đồng bộ `disabled` khi props thay đổi
    useEffect(() => {
        if (editor) editor.setEditable(!disabled)
    }, [editor, disabled])

    useEffect(() => {
        if (!isFullscreen) return

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsFullscreen(false)
            }
        }

        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = "hidden"
        document.addEventListener("keydown", handleKeyDown)

        return () => {
            document.body.style.overflow = previousOverflow
            document.removeEventListener("keydown", handleKeyDown)
        }
    }, [isFullscreen])

    // Đồng bộ nội dung từ bên ngoài (reset form, load lại dữ liệu)
    useEffect(() => {
        if (!editor) return

        if (contentJson) {
            const current = JSON.stringify(editor.getJSON())
            if (current !== JSON.stringify(contentJson)) {
                editor.commands.setContent(contentJson, { emitUpdate: false })
            }
            return
        }

        if (content && content !== editor.getHTML()) {
            editor.commands.setContent(content, { emitUpdate: false })
        }
    }, [editor, content, contentJson])

    const setLink = useCallback(
        (url: string) => {
            if (!editor) return
            if (url === "") {
                editor.chain().focus().extendMarkRange("link").unsetLink().run()
                return
            }
            editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
        },
        [editor]
    )

    const addImage = useCallback(
        (image: EditorImagePayload) => {
            if (!editor || !image?.src) return
            editor
                .chain()
                .focus()
                .insertContent({
                    type: "image",
                    attrs: {
                        src: image.src,
                        alt: null,
                        title: null,
                        publicId: image.publicId ?? null,
                    },
                })
                .run()
        },
        [editor]
    )

    if (!editor) {
        return (
            <div
                className={cn(
                    "rounded-lg border bg-background",
                    className
                )}
                style={{ minHeight }}
            />
        )
    }

    return (
        <div
            className={
                isFullscreen
                    ? "fixed inset-0 z-[100] flex flex-col bg-background"
                    : "relative border border-input rounded-lg"
            }
        >
            <EditorToolbar
                editor={editor}
                disabled={disabled}
                onAddImage={addImage}
                onPendingImage={onPendingImage}
                isFullscreen={isFullscreen}
                onToggleFullscreen={() => setIsFullscreen((prev) => !prev)}
            />
            <div className={cn(
                isFullscreen
                    ? "min-h-0 flex-1 overflow-y-auto p-4 md:p-6"
                    : "overflow-y-auto"
            )}
                style={!isFullscreen ? { minHeight } : undefined}>
                <EditorContent editor={editor} />
            </div>
        </div>
    )
}

export default RichTextEditor
