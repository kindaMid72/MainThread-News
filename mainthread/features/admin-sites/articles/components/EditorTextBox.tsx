'use client'

import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor';

interface EditorTextBoxProps {
    value?: string;
    onChange?: (content: string) => void;
    articleId?: string;
}

export default function EditorTextBox({ value, onChange, articleId }: EditorTextBoxProps) {
    if (!value) return <SimpleEditor value="" onChange={onChange ? onChange : () => { }} articleId={articleId} />
    return <SimpleEditor value={value as string} onChange={onChange ? onChange : () => { }} articleId={articleId} />
}