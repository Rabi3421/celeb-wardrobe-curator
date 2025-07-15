import React, { useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import Image from '@tiptap/extension-image';

const AddCelebrity = () => {
    const [metaTitle, setMetaTitle] = useState('');
    const [metaDescription, setMetaDescription] = useState('');
    const [slug, setSlug] = useState('');
    const [coverImage, setCoverImage] = useState('');

    const editor = useEditor({
        extensions: [StarterKit, Link, Underline, Image],
        content: '',
        autofocus: true,
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none min-h-[400px] border-0 rounded-none p-0 bg-gray-900 text-gray-100',
                style: 'font-size:1.1rem;',
            },
            placeholder: 'Start writing your celebrity profile here...',
        },
    });

    // Toolbar actions
    const setLink = () => {
        const url = window.prompt('Enter URL');
        if (url) {
            editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
        }
    };
    const unsetLink = () => editor?.chain().focus().unsetLink().run();

    const addImage = () => {
        const url = window.prompt('Enter image URL');
        if (url) {
            editor?.chain().focus().setImage({ src: url }).run();
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 py-10">
            <div className="w-full flex flex-col md:flex-row gap-4 px-4">
                {/* Left: Editor */}
                <div className="w-full md:w-4/5">
                    <div className="bg-gray-900 rounded-lg shadow border border-gray-700">
                        <div className="pt-6 pb-3 border-b border-gray-800 px-4">
                            <h1 className="text-2xl font-bold text-gray-100 mb-2">Add New Celebrity</h1>
                            <p className="text-gray-400 text-sm">Write the profile below. Format and style just like WordPress!</p>
                        </div>
                        <div className="pt-4 pb-2 px-4">
                            <div className="flex flex-wrap gap-2 mb-4 bg-gray-800 border border-gray-700 rounded-lg p-2">
                                {/* Toolbar buttons ... */}
                                {/* ...existing toolbar code... */}
                                <button type="button" title="Bold" onClick={() => editor?.chain().focus().toggleBold().run()} className={`px-2 py-1 rounded hover:bg-purple-900 ${editor?.isActive('bold') ? 'bg-purple-800 font-bold text-purple-300' : 'text-gray-300'}`}>B</button>
                                <button type="button" title="Italic" onClick={() => editor?.chain().focus().toggleItalic().run()} className={`px-2 py-1 rounded hover:bg-purple-900 ${editor?.isActive('italic') ? 'bg-purple-800 italic text-purple-300' : 'text-gray-300'}`}>I</button>
                                <button type="button" title="Underline" onClick={() => editor?.chain().focus().toggleUnderline().run()} className={`px-2 py-1 rounded hover:bg-purple-900 ${editor?.isActive('underline') ? 'bg-purple-800 underline text-purple-300' : 'text-gray-300'}`}>U</button>
                                <button type="button" title="Paragraph" onClick={() => editor?.chain().focus().setParagraph().run()} className="px-2 py-1 rounded hover:bg-purple-900 text-gray-300">P</button>
                                <button type="button" title="Heading 1" onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} className={`px-2 py-1 rounded hover:bg-purple-900 ${editor?.isActive('heading', { level: 1 }) ? 'bg-purple-800 text-purple-300' : 'text-gray-300'}`}>H1</button>
                                <button type="button" title="Heading 2" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} className={`px-2 py-1 rounded hover:bg-purple-900 ${editor?.isActive('heading', { level: 2 }) ? 'bg-purple-800 text-purple-300' : 'text-gray-300'}`}>H2</button>
                                <button type="button" title="Heading 3" onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} className={`px-2 py-1 rounded hover:bg-purple-900 ${editor?.isActive('heading', { level: 3 }) ? 'bg-purple-800 text-purple-300' : 'text-gray-300'}`}>H3</button>
                                <button type="button" title="Bullet List" onClick={() => editor?.chain().focus().toggleBulletList().run()} className="px-2 py-1 rounded hover:bg-purple-900 text-gray-300">• List</button>
                                <button type="button" title="Ordered List" onClick={() => editor?.chain().focus().toggleOrderedList().run()} className="px-2 py-1 rounded hover:bg-purple-900 text-gray-300">1. List</button>
                                <button type="button" title="Blockquote" onClick={() => editor?.chain().focus().toggleBlockquote().run()} className="px-2 py-1 rounded hover:bg-purple-900 text-gray-300">❝</button>
                                <button type="button" title="Add Link" onClick={setLink} className="px-2 py-1 rounded hover:bg-purple-900 text-gray-300">🔗</button>
                                <button type="button" title="Remove Link" onClick={unsetLink} className="px-2 py-1 rounded hover:bg-purple-900 text-gray-300">Unlink</button>
                                <button type="button" title="Add Image" onClick={addImage} className="px-2 py-1 rounded hover:bg-purple-900 text-gray-300">🖼️</button>
                            </div>
                            <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-sm p-2">
                                <EditorContent editor={editor} />
                            </div>
                        </div>
                    </div>
                </div>
                {/* Right: Options */}
                <div className="w-full md:w-1/5 flex flex-col gap-4 mt-8 md:mt-0">
                    <div className="bg-gray-800 rounded-lg shadow border border-gray-700 p-4">
                        <label className="font-semibold mb-1 block text-gray-200">Cover Image URL</label>
                        <input
                            type="url"
                            value={coverImage}
                            onChange={e => setCoverImage(e.target.value)}
                            className="input w-full border rounded px-3 py-2 mb-2 bg-gray-900 text-gray-100 border-gray-700"
                            placeholder="Paste image URL"
                        />
                        {coverImage && (
                            <img
                                src={coverImage}
                                alt="Cover Preview"
                                className="mt-2 rounded shadow w-full h-32 object-cover border border-gray-700"
                            />
                        )}
                    </div>
                    <div className="bg-gray-800 rounded-lg shadow border border-gray-700 p-4">
                        <label className="font-semibold mb-1 block text-gray-200">Slug</label>
                        <input
                            type="text"
                            value={slug}
                            onChange={e => setSlug(e.target.value.replace(/\s+/g, '-').toLowerCase())}
                            className="input w-full border rounded px-3 py-2 bg-gray-900 text-gray-100 border-gray-700"
                            placeholder="e.g. alia-bhatt"
                            maxLength={75}
                        />
                    </div>
                    <div className="bg-gray-800 rounded-lg shadow border border-gray-700 p-4">
                        <label className="font-semibold mb-1 block text-gray-200">Meta Title</label>
                        <input
                            type="text"
                            value={metaTitle}
                            onChange={e => setMetaTitle(e.target.value)}
                            className="input w-full border rounded px-3 py-2 bg-gray-900 text-gray-100 border-gray-700"
                            placeholder="Meta Title"
                            maxLength={70}
                        />
                    </div>
                    <div className="bg-gray-800 rounded-lg shadow border border-gray-700 p-4">
                        <label className="font-semibold mb-1 block text-gray-200">Meta Description</label>
                        <input
                            type="text"
                            value={metaDescription}
                            onChange={e => setMetaDescription(e.target.value)}
                            className="input w-full border rounded px-3 py-2 bg-gray-900 text-gray-100 border-gray-700"
                            placeholder="Meta Description"
                            maxLength={170}
                        />
                    </div>
                    <button
                        type="button"
                        className="mt-2 bg-purple-800 hover:bg-purple-900 text-white font-semibold py-2 px-4 rounded shadow"
                        onClick={() => {
                            console.log('Editor HTML:', editor?.getHTML());
                            console.log('Meta Title:', metaTitle);
                            console.log('Meta Description:', metaDescription);
                            console.log('Slug:', slug);
                            console.log('Cover Image:', coverImage);
                            // Add your save logic here
                        }}
                    >
                        Publish
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddCelebrity;