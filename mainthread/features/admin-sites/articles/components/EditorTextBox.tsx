'use client'

import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor';

interface EditorTextBoxProps {
    value?: string;
    onChange?: (content: string) => void;
}

export default function EditorTextBox({ value, onChange }: EditorTextBoxProps) {
    if(!value) return <SimpleEditor value="" onChange={onChange ? onChange : () => {}} />
    return <SimpleEditor value={value as string} onChange={onChange ? onChange : () => {}} />
}