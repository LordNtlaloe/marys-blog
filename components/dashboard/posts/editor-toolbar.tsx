"use client";

import type { Editor } from "@tiptap/react";
import { JSX, MouseEvent } from "react";

import {
    Bold,
    Italic,
    Underline,
    Strikethrough,
    Code,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Quote,
    Undo,
    Redo,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface EditorToolbarProps {
    editor: Editor | null;
}

export function EditorToolbar({ editor }: EditorToolbarProps): JSX.Element | null {
    if (!editor) return null;

    const handleBold = (e: MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault();
        editor.chain().focus().toggleBold().run();
    };

    const handleItalic = (e: MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault();
        editor.chain().focus().toggleItalic().run();
    };

    const handleUnderline = (e: MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault();
        editor.chain().focus().toggleUnderline().run();
    };

    const handleStrike = (e: MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault();
        editor.chain().focus().toggleStrike().run();
    };

    const handleCode = (e: MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault();
        editor.chain().focus().toggleCode().run();
    };

    const handleHeading1 = (e: MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault();
        editor.chain().focus().toggleHeading({ level: 1 }).run();
    };

    const handleHeading2 = (e: MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault();
        editor.chain().focus().toggleHeading({ level: 2 }).run();
    };

    const handleHeading3 = (e: MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault();
        editor.chain().focus().toggleHeading({ level: 3 }).run();
    };

    const handleBulletList = (e: MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault();
        editor.chain().focus().toggleBulletList().run();
    };

    const handleOrderedList = (e: MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault();
        editor.chain().focus().toggleOrderedList().run();
    };

    const handleBlockquote = (e: MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault();
        editor.chain().focus().toggleBlockquote().run();
    };

    const handleUndo = (e: MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault();
        editor.chain().focus().undo().run();
    };

    const handleRedo = (e: MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault();
        editor.chain().focus().redo().run();
    };

    return (
        <div className="border-b border-gray-200 p-2 flex flex-wrap gap-1">
            <Button
                type="button"
                variant={editor.isActive("bold") ? "default" : "ghost"}
                size="sm"
                onClick={handleBold}
            >
                <Bold className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant={editor.isActive("italic") ? "default" : "ghost"}
                size="sm"
                onClick={handleItalic}
            >
                <Italic className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant={editor.isActive("underline") ? "default" : "ghost"}
                size="sm"
                onClick={handleUnderline}
            >
                <Underline className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant={editor.isActive("strike") ? "default" : "ghost"}
                size="sm"
                onClick={handleStrike}
            >
                <Strikethrough className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant={editor.isActive("code") ? "default" : "ghost"}
                size="sm"
                onClick={handleCode}
            >
                <Code className="h-4 w-4" />
            </Button>

            <div className="w-px h-6 bg-gray-300 mx-1" />

            <Button
                type="button"
                variant={editor.isActive("heading", { level: 1 }) ? "default" : "ghost"}
                size="sm"
                onClick={handleHeading1}
            >
                <Heading1 className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant={editor.isActive("heading", { level: 2 }) ? "default" : "ghost"}
                size="sm"
                onClick={handleHeading2}
            >
                <Heading2 className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant={editor.isActive("heading", { level: 3 }) ? "default" : "ghost"}
                size="sm"
                onClick={handleHeading3}
            >
                <Heading3 className="h-4 w-4" />
            </Button>

            <div className="w-px h-6 bg-gray-300 mx-1" />

            <Button
                type="button"
                variant={editor.isActive("bulletList") ? "default" : "ghost"}
                size="sm"
                onClick={handleBulletList}
            >
                <List className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant={editor.isActive("orderedList") ? "default" : "ghost"}
                size="sm"
                onClick={handleOrderedList}
            >
                <ListOrdered className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant={editor.isActive("blockquote") ? "default" : "ghost"}
                size="sm"
                onClick={handleBlockquote}
            >
                <Quote className="h-4 w-4" />
            </Button>

            <div className="w-px h-6 bg-gray-300 mx-1" />

            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleUndo}
                disabled={!editor.can().undo()}
            >
                <Undo className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRedo}
                disabled={!editor.can().redo()}
            >
                <Redo className="h-4 w-4" />
            </Button>
        </div>
    );
}