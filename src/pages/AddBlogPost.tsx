import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { convertToSlug, generateMetaDescription } from "@/utils/blogUploader";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import OrderedList from "@tiptap/extension-ordered-list";
import { storage } from "../components/ui/firebase";
import { getAuth, signInAnonymously } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL, listAll, deleteObject } from "firebase/storage";
import './styles.scss';
import Document from '@tiptap/extension-document';
import { BulletList, ListItem } from '@tiptap/extension-list';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import { EditorContent, useEditor } from '@tiptap/react';
import axios from "axios";

const AddBlogPost: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { post } = location.state || {};
    const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm();
    const [coverImage, setCoverImage] = useState(post?.coverImage || "");
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [categories, setCategories] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [showGalleryModal, setShowGalleryModal] = useState(false);
    const [firebaseImages, setFirebaseImages] = useState<string[]>([]);
    const [isFetchingImages, setIsFetchingImages] = useState(false);
    const [deletingImageIdx, setDeletingImageIdx] = useState<number | null>(null);

    const [showImageModal, setShowImageModal] = useState(false);
    const [editorImageList, setEditorImageList] = useState<string[]>([]);
    const [isFetchingEditorImages, setIsFetchingEditorImages] = useState(false);

    function decodeHtmlEntities(str: string) {
        const txt = document.createElement('textarea');
        txt.innerHTML = str;
        return txt.value;
    }

    // TipTap editor for main content
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Image,
            Link,
            OrderedList,
            Document,
            Paragraph,
            Text,
            BulletList,
            ListItem
        ],
        content: post?.content ? decodeHtmlEntities(post.content) : "",
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none min-h-[300px] border-0 rounded-none p-0 bg-gray-900 text-gray-100',
                style: 'font-size:1.1rem;',
            },
            placeholder: 'Write your blog post here...',
        },
    });

    const fetchFirebaseImages = async () => {
        setIsFetchingImages(true);
        const images: string[] = [];
        const listRef = ref(storage, `blog-covers/`);
        const res = await listAll(listRef);
        for (const itemRef of res.items) {
            const url = await getDownloadURL(itemRef);
            images.push(url);
        }
        setFirebaseImages(images);
        setIsFetchingImages(false);
    };

    const uploadImageToFirebase = async (file: File, title: string) => {
        const auth = getAuth();
        if (!auth.currentUser) {
            await signInAnonymously(auth);
        }
        const seoName = (title || "blog")
            .trim()
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9\-]/g, '');
        const ext = file.name.split('.').pop();
        const fileName = `${seoName}-${Date.now()}.${ext}`;
        const fileRef = ref(storage, `blog-covers/${fileName}`);
        await uploadBytes(fileRef, file);
        return await getDownloadURL(fileRef);
    };

    const openGalleryModal = async () => {
        setShowGalleryModal(true);
        await fetchFirebaseImages();
    };

    // Fetch categories from Supabase
    useEffect(() => {
        (async () => {
            const { data, error } = await supabase
                .from('categories')
                .select('name')
                .eq('type', 'blog')
                .order('name');
            if (!error && data) setCategories(data.map((c: any) => c.name));
        })();
    }, []);

    // Prefill form if editing
    useEffect(() => {
        if (post) {
            Object.keys(post).forEach((key) => setValue(key, post[key]));
            setCoverImage(post.coverImage || "");
        }
    }, [post, setValue]);

    // Upload cover image to Supabase Storage (or Firebase if you use that)
    const uploadCoverImage = async (file: File) => {
        const fileName = `${convertToSlug(file.name.split(".")[0])}-${Date.now()}.${file.name.split(".").pop()}`;
        const { data, error } = await supabase.storage
            .from("blog-covers")
            .upload(fileName, file, { upsert: true });
        if (error) throw error;
        const { data: urlData } = supabase.storage.from("blog-covers").getPublicUrl(fileName);
        return urlData.publicUrl;
    };

    const onSubmit = async (data: any) => {
        setIsUploading(true);
        try {
            let uploadedCover = coverImage;
            if (coverFile) {
                uploadedCover = await uploadCoverImage(coverFile);
                setCoverImage(uploadedCover);
            }
            const slug = data.slug || convertToSlug(data.title);
            const metaDescription = data.metaDescription || generateMetaDescription(data.excerpt || "");
            const blogData = {
                ...data,
                slug,
                metaDescription,
                coverImage: uploadedCover,
                content: editor?.getHTML() || "",
                date: data.date || new Date().toISOString().split("T")[0],
                categories: data.categories ? data.categories.split(",").map((c: string) => c.trim()) : [],
                tags: data.tags ? data.tags.split(",").map((t: string) => t.trim()) : [],
            };
            console.log("blogData:", blogData);
            const response = await axios.post("http://localhost:5000/api/blogs", blogData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            console.log("response:", response);
            toast({ title: "Blog post published!" });
            navigate(-1);
        } catch (err: any) {
            console.error("Error saving blog post:", err);
            toast({ title: "Error", description: err?.response?.data?.message || err.message || "Failed to save blog post" });
        } finally {
            setIsUploading(false);
        }
    };

    // Toolbar actions
    const setLink = () => {
        const url = window.prompt('Enter URL');
        if (url) {
            editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
        }
    };

    const fetchEditorImages = async () => {
        setIsFetchingEditorImages(true);
        const images: string[] = [];
        const listRef = ref(storage, `blog-covers/`);
        const res = await listAll(listRef);
        for (const itemRef of res.items) {
            const url = await getDownloadURL(itemRef);
            images.push(url);
        }
        setEditorImageList(images);
        setIsFetchingEditorImages(false);
    };

    const unsetLink = () => editor?.chain().focus().unsetLink().run();
    const addImage = async () => {
        setShowImageModal(true);
        await fetchEditorImages();
    };

    return (
        <div className="min-h-screen bg-gray-900 py-4">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col md:flex-row gap-4 px-2 md:px-6 h-auto md:h-[calc(100vh-2rem)]">
                    {/* Left: Editor & Cover */}
                    <div className="flex-1 bg-gray-900 text-gray-100 rounded-lg shadow border border-gray-700 flex flex-col overflow-hidden">
                        <div className="flex items-center gap-2 px-4 pt-4 pb-2 border-b border-gray-800">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="bg-gray-800 hover:bg-gray-700 text-white rounded-full p-2"
                                aria-label="Go Back"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M15 19L8 12L15 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                            <h1 className="text-2xl font-bold text-gray-100">{post ? "Edit Blog Post" : "Add Blog Post"}</h1>
                        </div>
                        <div className="flex-1 overflow-y-auto px-4 py-4">
                            {/* Cover Image */}
                            <div className="mb-6">
                                <Label htmlFor="coverImage">Cover Image</Label>
                                <div className="flex items-center gap-4 mt-1">
                                    <button
                                        type="button"
                                        className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded cursor-pointer"
                                        onClick={openGalleryModal}
                                    >
                                        {coverImage ? "Change Image" : "Upload Image"}
                                    </button>
                                    {coverImage && (
                                        <div className="relative group">
                                            <img
                                                src={coverImage}
                                                alt="Cover Preview"
                                                className="rounded shadow w-24 h-24 object-cover border border-gray-700"
                                            />
                                            <button
                                                type="button"
                                                className="absolute top-1 right-1 bg-red-600 hover:bg-red-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-80 group-hover:opacity-100"
                                                title="Remove"
                                                onClick={() => setCoverImage("")}
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {/* Content Editor */}
                            <div>
                                {/* Toolbar */}
                                <div className="flex flex-wrap gap-2 mb-4 bg-gray-800 border border-gray-700 rounded-lg p-2">
                                    <button type="button" title="Bold" onClick={() => editor?.chain().focus().toggleBold().run()} className={`px-2 py-1 rounded hover:bg-purple-900 ${editor?.isActive('bold') ? 'bg-purple-800 font-bold text-purple-300' : 'text-gray-300'}`}>B</button>
                                    <button type="button" title="Italic" onClick={() => editor?.chain().focus().toggleItalic().run()} className={`px-2 py-1 rounded hover:bg-purple-900 ${editor?.isActive('italic') ? 'bg-purple-800 italic text-purple-300' : 'text-gray-300'}`}>I</button>
                                    <button type="button" title="Underline" onClick={() => editor?.chain().focus().toggleUnderline().run()} className={`px-2 py-1 rounded hover:bg-purple-900 ${editor?.isActive('underline') ? 'bg-purple-800 underline text-purple-300' : 'text-gray-300'}`}>U</button>
                                    <button type="button" title="Paragraph" onClick={() => editor?.chain().focus().setParagraph().run()} className="px-2 py-1 rounded hover:bg-purple-900 text-gray-300">P</button>
                                    <button type="button" title="Heading 1" onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} className={`px-2 py-1 rounded hover:bg-purple-900 ${editor?.isActive('heading', { level: 1 }) ? 'bg-purple-800 text-purple-300' : 'text-gray-300'}`}>H1</button>
                                    <button type="button" title="Heading 2" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} className={`px-2 py-1 rounded hover:bg-purple-900 ${editor?.isActive('heading', { level: 2 }) ? 'bg-purple-800 text-purple-300' : 'text-gray-300'}`}>H2</button>
                                    <button type="button" title="Heading 3" onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} className={`px-2 py-1 rounded hover:bg-purple-900 ${editor?.isActive('heading', { level: 3 }) ? 'bg-purple-800 text-purple-300' : 'text-gray-300'}`}>H3</button>
                                    <button
                                        type="button"
                                        title="Bullet List"
                                        disabled={!editor}
                                        onClick={() => editor?.chain().focus().toggleBulletList().run()}
                                        className="px-2 py-1 rounded hover:bg-purple-900 text-gray-300"
                                    >
                                        • List
                                    </button>
                                    <button type="button" title="Ordered List" onClick={() => editor?.chain().focus().toggleOrderedList().run()} className="px-2 py-1 rounded hover:bg-purple-900 text-gray-300">1. List</button>
                                    <button type="button" title="Blockquote" onClick={() => editor?.chain().focus().toggleBlockquote().run()} className="px-2 py-1 rounded hover:bg-purple-900 text-gray-300">❝</button>
                                    <button type="button" title="Add Link" onClick={setLink} className="px-2 py-1 rounded hover:bg-purple-900 text-gray-300">🔗</button>
                                    <button type="button" title="Remove Link" onClick={unsetLink} className="px-2 py-1 rounded hover:bg-purple-900 text-gray-300">Unlink</button>
                                    <button type="button" title="Add Image" onClick={addImage} className="px-2 py-1 rounded hover:bg-purple-900 text-gray-300">🖼️</button>
                                </div>
                                <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-sm p-2 mb-6">
                                    <EditorContent editor={editor} />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Right: Meta & Small Fields */}
                    <div className="w-full md:w-[340px] flex-shrink-0 flex flex-col gap-4 md:overflow-y-auto md:max-h-[calc(100vh-2rem)]">
                        <div className="bg-gray-900 text-gray-100 rounded-lg shadow border border-gray-700 p-4 space-y-4">
                            <div>
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" {...register("title", { required: "Title is required" })} className="bg-gray-800 border-gray-700 text-gray-100" />
                                {errors.title && <p className="text-red-500">{errors.title.message as string}</p>}
                            </div>
                            <div>
                                <Label htmlFor="excerpt">Excerpt</Label>
                                <Input id="excerpt" {...register("excerpt", { required: "Excerpt is required" })} className="bg-gray-800 border-gray-700 text-gray-100" />
                                {errors.excerpt && <p className="text-red-500">{errors.excerpt.message as string}</p>}
                            </div>
                            <div>
                                <Label htmlFor="categories">Categories</Label>
                                <Input
                                    id="categories"
                                    {...register("categories")}
                                    placeholder="e.g. Fashion, Bollywood"
                                    className="bg-gray-800 border-gray-700 text-gray-100"
                                    defaultValue={post?.categories ? post.categories.join(", ") : ""}
                                    list="category-list"
                                />
                                <datalist id="category-list">
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat} />
                                    ))}
                                </datalist>
                            </div>
                            <div>
                                <Label htmlFor="tags">Tags</Label>
                                <Input
                                    id="tags"
                                    {...register("tags")}
                                    placeholder="e.g. style, trends"
                                    className="bg-gray-800 border-gray-700 text-gray-100"
                                    defaultValue={post?.tags ? post.tags.join(", ") : ""}
                                />
                            </div>
                            <div>
                                <Label htmlFor="slug">Slug</Label>
                                <Input
                                    id="slug"
                                    {...register("slug")}
                                    placeholder="auto-generated if left blank"
                                    className="bg-gray-800 border-gray-700 text-gray-100"
                                    defaultValue={post?.slug || ""}
                                />
                            </div>
                            <div>
                                <Label htmlFor="metaTitle">Meta Title</Label>
                                <Input
                                    id="metaTitle"
                                    {...register("metaTitle")}
                                    placeholder="Meta Title"
                                    className="bg-gray-800 border-gray-700 text-gray-100"
                                    defaultValue={post?.metaTitle || ""}
                                    maxLength={70}
                                />
                            </div>
                            <div>
                                <Label htmlFor="metaDescription">Meta Description</Label>
                                <Input
                                    id="metaDescription"
                                    {...register("metaDescription")}
                                    placeholder="Meta Description"
                                    className="bg-gray-800 border-gray-700 text-gray-100"
                                    defaultValue={post?.metaDescription || ""}
                                    maxLength={170}
                                />
                            </div>
                            <div className="flex gap-2 pt-2">
                                <Button type="submit" className="bg-purple-700 hover:bg-purple-800 text-white w-full" disabled={isUploading}>
                                    {post ? "Update" : "Publish"}
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    disabled={isUploading}
                                    className="w-full bg-gray-700 hover:bg-gray-800 text-white border-0"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            {isUploading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
                    <div className="flex flex-col items-center">
                        <svg className="animate-spin h-12 w-12 text-purple-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        <span className="text-white text-lg font-semibold">Processing...</span>
                    </div>
                </div>
            )}

            {showGalleryModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
                    <div className="bg-gray-900 rounded-lg shadow-lg p-6 max-w-2xl w-full">
                        <h2 className="text-xl font-bold text-white mb-4">Select a Cover Image</h2>
                        {isFetchingImages ? (
                            <div className="text-white">Loading images...</div>
                        ) : (
                            <div className="flex flex-wrap gap-3 max-h-96 overflow-y-auto mb-4">
                                {firebaseImages.map((img, idx) => (
                                    <div key={idx} className="relative group">
                                        <img
                                            src={img}
                                            alt={`Firebase Gallery ${idx + 1}`}
                                            className="w-24 h-24 object-cover rounded border-2 border-transparent hover:border-purple-500 cursor-pointer"
                                            onClick={() => {
                                                setCoverImage(img);
                                                setShowGalleryModal(false);
                                            }}
                                        />
                                        <button
                                            type="button"
                                            className="absolute top-1 right-1 bg-red-600 hover:bg-red-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-80 group-hover:opacity-100"
                                            title="Delete"
                                            disabled={deletingImageIdx === idx}
                                            onClick={async (e) => {
                                                e.stopPropagation();
                                                setDeletingImageIdx(idx);
                                                try {
                                                    const auth = getAuth();
                                                    if (!auth.currentUser) {
                                                        await signInAnonymously(auth);
                                                    }
                                                    const match = img.match(/\/o\/(.*?)\?/);
                                                    if (match && match[1]) {
                                                        const path = decodeURIComponent(match[1]);
                                                        const fileRef = ref(storage, path);
                                                        await deleteObject(fileRef);
                                                        setFirebaseImages(prev => prev.filter((_, i) => i !== idx));
                                                        if (coverImage === img) setCoverImage("");
                                                    } else {
                                                        alert("Could not parse image path for deletion.");
                                                    }
                                                } catch (err) {
                                                    alert("Failed to delete image from Firebase.");
                                                } finally {
                                                    setDeletingImageIdx(null);
                                                }
                                            }}
                                        >
                                            {deletingImageIdx === idx ? (
                                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                                </svg>
                                            ) : (
                                                <>&times;</>
                                            )}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="flex gap-2">
                            <label className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded cursor-pointer">
                                Upload New
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={async e => {
                                        if (e.target.files && e.target.files[0]) {
                                            const url = await uploadImageToFirebase(e.target.files[0], "blog");
                                            setCoverImage(url);
                                            setShowGalleryModal(false);
                                        }
                                    }}
                                />
                            </label>
                            <button
                                className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded"
                                onClick={() => setShowGalleryModal(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showImageModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
                    <div className="bg-gray-900 rounded-lg shadow-lg p-6 max-w-2xl w-full">
                        <h2 className="text-xl font-bold text-white mb-4">Insert Image</h2>
                        {isFetchingEditorImages ? (
                            <div className="text-white">Loading images...</div>
                        ) : (
                            <div className="flex flex-wrap gap-3 max-h-96 overflow-y-auto mb-4">
                                {editorImageList.map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={img}
                                        alt={`Editor Gallery ${idx + 1}`}
                                        className="w-24 h-24 object-cover rounded border-2 border-transparent hover:border-purple-500 cursor-pointer"
                                        onClick={() => {
                                            editor?.chain().focus().setImage({ src: img }).run();
                                            setShowImageModal(false);
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                        <div className="flex gap-2">
                            <button
                                className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded"
                                onClick={() => setShowImageModal(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddBlogPost;