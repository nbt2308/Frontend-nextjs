export { RichTextEditor } from "./rich-text-editor"
export type { RichTextEditorProps } from "./rich-text-editor"
export type { Editor, JSONContent } from "@tiptap/react"

/** Payload ảnh chèn vào nội dung, kèm `publicId` để dọn dẹp Cloudinary sau này. */
export interface EditorImagePayload {
    src: string
    publicId?: string
}
