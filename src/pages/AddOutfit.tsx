import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import { storage } from "../components/ui/firebase";
import { getAuth, signInAnonymously } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL, listAll, deleteObject } from "firebase/storage";
import axios from "axios";
import { API_CONFIG } from "@/config/api";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

// --- SectionEditor Component ---
const SectionEditor = ({
    value,
    onChange,
    placeholder,
}: {
    value: string;
    onChange: (val: string) => void;
    placeholder: string;
}) => {
    const editor = useEditor({
        extensions: [StarterKit, Underline, Image, Link, BulletList, OrderedList, ListItem],
        content: value,
        editorProps: {
            attributes: {
                class: 'bg-gray-900 text-gray-100 rounded-lg border border-gray-700 p-4 min-h-[120px] focus:outline-none',
                style: 'font-size:1.05rem;',
            },
            placeholder,
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value || "");
        }
    }, [value, editor]);

    const setLink = () => {
        const url = window.prompt('Enter URL');
        if (url) editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };
    const unsetLink = () => editor?.chain().focus().unsetLink().run();
    const addImage = () => {
        const url = window.prompt('Enter image URL');
        if (url) editor?.chain().focus().setImage({ src: url }).run();
    };

    return (
        <div>
            <div className="flex flex-wrap gap-2 mb-3 bg-gray-800 border border-gray-700 rounded-lg p-2">
                {[
                    { label: "B", action: () => editor?.chain().focus().toggleBold().run(), active: editor?.isActive("bold") },
                    { label: "I", action: () => editor?.chain().focus().toggleItalic().run(), active: editor?.isActive("italic") },
                    { label: "U", action: () => editor?.chain().focus().toggleUnderline().run(), active: editor?.isActive("underline") },
                    { label: "P", action: () => editor?.chain().focus().setParagraph().run() },
                    { label: "H1", action: () => editor?.chain().focus().toggleHeading({ level: 1 }).run(), active: editor?.isActive("heading", { level: 1 }) },
                    { label: "H2", action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(), active: editor?.isActive("heading", { level: 2 }) },
                    { label: "H3", action: () => editor?.chain().focus().toggleHeading({ level: 3 }).run(), active: editor?.isActive("heading", { level: 3 }) },
                    { label: "• List", action: () => editor?.chain().focus().toggleBulletList().run() },
                    { label: "1. List", action: () => editor?.chain().focus().toggleOrderedList().run() },
                    { label: "❝", action: () => editor?.chain().focus().toggleBlockquote().run() },
                    { label: "🔗", action: setLink },
                    { label: "Unlink", action: unsetLink },
                    { label: "🖼️", action: addImage },
                ].map(({ label, action, active }, idx) => (
                    <button key={idx} type="button" onClick={action} className={`px-2 py-1 rounded hover:bg-purple-900 ${active ? 'bg-purple-800 text-purple-300' : 'text-gray-300'}`}>{label}</button>
                ))}
            </div>
            <EditorContent editor={editor} />
        </div>
    );
};

const AddOutfit: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { outfit } = location.state || {};
    const { setValue } = useForm();
    const mediaUploaderRef = useRef<{ uploadAllMedia: () => Promise<any[]> }>(null);

    // Main form state
    const [galleryImages, setGalleryImages] = useState<string[]>([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState("");
    const [celebrity, setCelebrity] = useState("");
    const [occasion, setOccasion] = useState("");
    const [brand, setBrand] = useState("");
    const [price, setPrice] = useState("");
    const [affiliateLink, setAffiliateLink] = useState("");
    const [sections, setSections] = useState([
        { title: "Look Details", content: "" },
        { title: "Style Notes", content: "" },
    ]);
    const [celebrityId, setCelebrityId] = useState("");
    const [outfitId, setOutfitId] = useState<string>(() => outfit?.outfitId || Date.now().toString());

    // Gallery modal state
    const [showGalleryModal, setShowGalleryModal] = useState(false);
    const [firebaseImages, setFirebaseImages] = useState<string[]>([]);
    const [isFetchingImages, setIsFetchingImages] = useState(false);
    const [deletingImageIdx, setDeletingImageIdx] = useState<number | null>(null);

    // Celebrity search state
    const [celebrityOptions, setCelebrityOptions] = useState<any[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loadingCelebs, setLoadingCelebs] = useState(false);
    const celebInputRef = useRef<HTMLInputElement>(null);

    // Fetch images for this outfit only
    const fetchFirebaseImages = async () => {
        if (!celebrityId || !outfitId) {
            toast.error("Please select a celebrity and enter an outfit title first.");
            setFirebaseImages([]);
            setIsFetchingImages(false);
            return;
        }
        setIsFetchingImages(true);
        const images: string[] = [];
        const listRef = ref(storage, `outfits/${celebrityId}/${outfitId}/`);
        const res = await listAll(listRef);
        for (const itemRef of res.items) {
            const url = await getDownloadURL(itemRef);
            images.push(url);
        }
        setFirebaseImages(images);
        setIsFetchingImages(false);
    };

    // Upload to Firebase using outfitId
    const uploadImageToFirebase = async (file: File) => {
        const auth = getAuth();
        if (!auth.currentUser) {
            await signInAnonymously(auth);
        }
        // 1. Slugify celebrity name
        const actorSlug = celebrity
            .trim()
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9\-]/g, '');

        // 2. Get current image count in this outfit folder
        const listRef = ref(storage, `outfits/${celebrityId}/${outfitId}/`);
        const res = await listAll(listRef);
        const count = res.items.length + 1;

        // 3. Build file name
        const ext = file.name.split('.').pop();
        const fileName = `${actorSlug}-${count}.${ext}`;

        // 4. Upload
        const fileRef = ref(storage, `outfits/${celebrityId}/${outfitId}/${fileName}`);
        await uploadBytes(fileRef, file);
        return await getDownloadURL(fileRef);
    };

    useEffect(() => {
        if (outfit) {
            Object.keys(outfit).forEach((key) => {
                setValue(key, outfit[key]);
            });
            setTitle(outfit.title || "");
            setDescription(outfit.description || "");
            setTags(
                Array.isArray(outfit.tags)
                    ? outfit.tags.join(", ")
                    : (outfit.tags || "")
            );
            setCelebrity(outfit.celebrity?.name || "");
            setCelebrityId(outfit.celebrity?._id || "");
            setOccasion(outfit.occasion || "");
            setBrand(outfit.brand || "");
            setPrice(outfit.price ? String(outfit.price) : "");
            setAffiliateLink(outfit.affiliateLink || "");
            setGalleryImages(outfit.images ? outfit.images.map((url: string) => url) : []);
            setOutfitId(outfit.outfitId || Date.now().toString());
            if (outfit.sections) setSections(outfit.sections);
        }
    }, [outfit, setValue]);

    useEffect(() => {
        if (!celebrity || celebrityId) {
            setCelebrityOptions([]);
            setShowDropdown(false);
            return;
        }
        const timeout = setTimeout(async () => {
            setLoadingCelebs(true);
            try {
                const res = await axios.get(
                    `${API_CONFIG.baseUrl}/celebrities/search`,
                    {
                        params: { name: celebrity },
                        headers: { api_key: API_CONFIG.websiteApiKey }
                    }
                );
                setCelebrityOptions(res.data?.data || []);
                setShowDropdown(true);
            } catch (err) {
                setCelebrityOptions([]);
                setShowDropdown(false);
            }
            setLoadingCelebs(false);
        }, 300);
        return () => clearTimeout(timeout);
    }, [celebrity, celebrityId]);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (
                celebInputRef.current &&
                !celebInputRef.current.contains(e.target as Node)
            ) {
                setShowDropdown(false);
            }
        };
        if (showDropdown) {
            document.addEventListener("mousedown", handler);
        }
        return () => document.removeEventListener("mousedown", handler);
    }, [showDropdown]);

    const handleCelebritySelect = (celeb: any) => {
        setCelebrity(celeb.name);
        setCelebrityId(celeb._id);
        setShowDropdown(false);
    };

    const handleCelebrityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCelebrity(e.target.value);
        setCelebrityId("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let uploadedMedia = galleryImages;

        // If using a media uploader, get the URLs from it
        if (mediaUploaderRef.current) {
            uploadedMedia = await mediaUploaderRef.current.uploadAllMedia();
            setGalleryImages(uploadedMedia);
        }

        // Ensure images is always an array of strings (filter out null/undefined)
        const images = (uploadedMedia || [])
            .map((file: any) =>
                typeof file === "string"
                    ? file
                    : (file && file.url) ? file.url : null
            )
            .filter(Boolean);

        const priceNumber = price && !isNaN(Number(price)) ? Number(price) : null;

        const tagsArray = tags
            .split(",")
            .map(tag => tag.trim())
            .filter(Boolean);

        const body = {
            title: title,
            description,
            celebrity: celebrityId,
            occasion,
            brand,
            tags: tagsArray,
            price: priceNumber,
            affiliateLink,
            images,
            outfitId,
            sections,
        };
        try {
            await axios.post(`${API_CONFIG.baseUrl}/outfits`, body);
            toast.success("Outfit added successfully!");
            navigate(-1);
        } catch (error: any) {
            console.error("Failed to add outfit:", error, error?.response);
            let message = "Failed to add outfit";
            if (error?.response?.data?.message) {
                message = error.response.data.message;
            } else if (error?.message) {
                message = error.message;
            }
            toast.error(message);
        }
    };

    // Open modal and fetch images
    const openGalleryModal = async () => {
        if (!celebrityId) {
            toast.error("Please select a celebrity first.");
            return;
        }
        setShowGalleryModal(true);
        await fetchFirebaseImages();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 py-12 px-2">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-10">
                {/* Sidebar */}
                <aside className="md:w-1/3 w-full md:sticky top-8 self-start min-w-0">
                    <div className="bg-gray-900 rounded-2xl shadow-lg p-8 mb-8 border border-gray-800">
                        <h1 className="text-3xl font-extrabold text-purple-400 mb-2">Add Outfit</h1>
                        <p className="text-gray-400 mb-6">Create a new fashion outfit profile. Fill in all the details and add beautiful images.</p>
                        <div className="mb-4">
                            <Label className="text-gray-300 mb-1 block">Title</Label>
                            <Input
                                className="bg-gray-800 border-gray-700 text-gray-100"
                                placeholder="Outfit title"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <Label className="text-gray-300 mb-1 block">Tags</Label>
                            <Input
                                className="bg-gray-800 border-gray-700 text-gray-100"
                                placeholder="Comma separated tags"
                                value={tags}
                                onChange={e => setTags(e.target.value)}
                            />
                        </div>
                        <div className="mb-4" ref={celebInputRef}>
                            <Label htmlFor="celebrity" className="text-gray-300 mb-1 block">Celebrity</Label>
                            <Input
                                className="bg-gray-800 border-gray-700 text-gray-100"
                                id="celebrity"
                                placeholder="Type celebrity name"
                                value={celebrity}
                                onChange={handleCelebrityChange}
                                autoComplete="off"
                            />
                            {showDropdown && celebrityOptions.length > 0 && (
                                <div className="absolute z-20 bg-gray-900 border border-gray-700 rounded-md mt-1 w-full max-h-60 overflow-y-auto shadow-lg">
                                    {celebrityOptions.map((celeb) => (
                                        <div
                                            key={celeb._id}
                                            className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-purple-900"
                                            onClick={() => handleCelebritySelect(celeb)}
                                        >
                                            {celeb.image && (
                                                <img src={celeb.image} alt={celeb.name} className="w-8 h-8 rounded-full object-cover" />
                                            )}
                                            <span className="text-gray-100">{celeb.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {loadingCelebs && (
                                <div className="absolute right-2 top-2 text-xs text-gray-400">Searching...</div>
                            )}
                        </div>
                        <div className="mb-4">
                            <Label className="text-gray-300 mb-1 block">Occasion</Label>
                            <Input
                                className="bg-gray-800 border-gray-700 text-gray-100"
                                placeholder="Occasion"
                                value={occasion}
                                onChange={e => setOccasion(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <Label className="text-gray-300 mb-1 block">Brand</Label>
                            <Input
                                className="bg-gray-800 border-gray-700 text-gray-100"
                                placeholder="Brand"
                                value={brand}
                                onChange={e => setBrand(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <Label className="text-gray-300 mb-1 block">Price</Label>
                            <Input
                                className="bg-gray-800 border-gray-700 text-gray-100"
                                type="number"
                                placeholder="Price"
                                value={price}
                                onChange={e => setPrice(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <Label className="text-gray-300 mb-1 block">Affiliate Link</Label>
                            <Input
                                className="bg-gray-800 border-gray-700 text-gray-100"
                                placeholder="https://example.com/affiliate"
                                value={affiliateLink}
                                onChange={e => setAffiliateLink(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <Label className="text-gray-300 mb-1 block">Description</Label>
                            <textarea
                                className="w-full rounded-lg bg-gray-800 border border-gray-700 text-gray-100 p-2 min-h-[80px]"
                                placeholder="Describe this outfit..."
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 mt-6">
                            <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
                            <Button type="submit" form="outfit-form" className="bg-purple-700 hover:bg-purple-800 text-white">Save</Button>
                        </div>
                    </div>
                </aside>
                {/* Main Content */}
                <main className="flex-1">
                    <form id="outfit-form" onSubmit={handleSubmit} className="flex flex-col gap-10">
                        <div className="bg-gray-900 rounded-2xl shadow-lg p-8 border border-gray-800">
                            <Label className="text-gray-300 mb-1 block">Gallery Images</Label>
                            <button
                                type="button"
                                className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded mb-2"
                                onClick={openGalleryModal}
                            >
                                Add Image
                            </button>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {galleryImages.map((img, idx) => (
                                    <div key={idx} className="relative">
                                        <img
                                            src={img}
                                            alt={`Gallery ${idx + 1}`}
                                            className="rounded shadow w-24 h-24 object-cover border border-gray-700"
                                        />
                                        <button
                                            type="button"
                                            className="absolute top-1 right-1 bg-red-600 hover:bg-red-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                                            onClick={() => setGalleryImages(prev => prev.filter((_, i) => i !== idx))}
                                            title="Remove"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-gray-900 rounded-2xl shadow-lg p-8 border border-gray-800">
                            <h2 className="text-2xl font-bold text-purple-400 mb-6">Sections</h2>
                            <div className="flex flex-col gap-8">
                                {sections.map((section, idx) => (
                                    <div key={idx}>
                                        <Label className="text-lg font-semibold text-gray-200 mb-2 block">{section.title}</Label>
                                        <SectionEditor
                                            value={section.content}
                                            onChange={val => {
                                                const updated = [...sections];
                                                updated[idx].content = val;
                                                setSections(updated);
                                            }}
                                            placeholder={`Write about ${section.title}...`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </form>
                </main>
            </div>
            {showGalleryModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
                    <div className="bg-gray-900 rounded-lg shadow-lg p-6 max-w-2xl w-full">
                        <h2 className="text-xl font-bold text-white mb-4">Select an Image from Gallery</h2>
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
                                                setGalleryImages(prev => [...prev, img]);
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
                                                        setGalleryImages(prev => prev.filter(url => url !== img));
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
                                            const url = await uploadImageToFirebase(e.target.files[0], title || "outfit");
                                            setGalleryImages(prev => [...prev, url]);
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
        </div>
    );
};

export default AddOutfit;