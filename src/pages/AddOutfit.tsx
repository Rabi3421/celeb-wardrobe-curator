import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import MediaUploader from "@/components/admin/MediaUploader";
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
import axios from "axios";
import { API_CONFIG } from "@/config/api";
import { useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { storage } from "../components/ui/firebase";
import { getAuth, signInAnonymously } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// --- SectionEditor Component ---
const SectionEditor = ({ value, onChange, placeholder }: { value: string; onChange: (val: string) => void; placeholder: string }) => {
    const editor = useEditor({
        extensions: [StarterKit, Underline, Image, Link, BulletList, OrderedList, ListItem],
        content: value,
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none min-h-[200px] border border-gray-700 rounded-md p-4 bg-gray-900 text-gray-100',
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
    const mediaUploaderRef = useRef<{ uploadAllMedia: () => Promise<any[]> }>(null);
    const { outfit } = location.state || {};
    const { register, setValue } = useForm();
    const [mediaFiles, setMediaFiles] = useState<any[]>([]);
    const [sections, setSections] = useState([
        { title: "Look Details", content: "" },
        { title: "Style Notes", content: "" },
    ]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState("");
    const [celebrity, setCelebrity] = useState(""); // This will be the name shown in the input
    const [celebrityId, setCelebrityId] = useState(""); // This will be the selected celebrity's ID
    const [occasion, setOccasion] = useState("");
    const [brand, setBrand] = useState("");
    const [price, setPrice] = useState("");
    const [affiliateLink, setAffiliateLink] = useState("");

    // Celebrity search state
    const [celebrityOptions, setCelebrityOptions] = useState<any[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loadingCelebs, setLoadingCelebs] = useState(false);
    const celebInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (outfit) {
            // Set react-hook-form values (if you use them elsewhere)
            Object.keys(outfit).forEach((key) => {
                setValue(key, outfit[key]);
            });

            // Set local state for each field
            setTitle(outfit.title || "");
            setDescription(outfit.description || "");
            setTags(Array.isArray(outfit.tags) ? outfit.tags.join(", ") : (outfit.tags || ""));
            setCelebrity(outfit.celebrity?.name || "");
            setCelebrityId(outfit.celebrity?._id || "");
            setOccasion(outfit.occasion || "");
            setBrand(outfit.brand || "");
            setPrice(outfit.price ? String(outfit.price) : "");
            setAffiliateLink(outfit.affiliateLink || "");
            setMediaFiles(outfit.images ? outfit.images.map((url: string) => ({ url })) : []);
            // If you want to prefill sections, do it here as well
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
                    `http://localhost:5000/api/celebrities/search`,
                    {
                        params: { name: celebrity },
                        headers: { api_key: API_CONFIG.websiteApiKey }
                    }
                );
                setCelebrityOptions(res.data?.data || []);
                setShowDropdown(true);
            } catch (err) {
                console.error("Error fetching celebrity data:", err);
                setCelebrityOptions([]);
                setShowDropdown(false);
            }
            setLoadingCelebs(false);
        }, 300);
        return () => clearTimeout(timeout);
    }, [celebrity, celebrityId]);

    // Hide dropdown on outside click
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

    const uploadImageToFirebase = async (file: File, outfitTitle: string) => {
        const auth = getAuth();
        if (!auth.currentUser) {
            await signInAnonymously(auth);
        }
        const ext = file.name.split('.').pop();
        const seoName = outfitTitle
            .trim()
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9\-]/g, '');
        const fileName = `${seoName}-${Date.now()}.${ext}`;
        const fileRef = ref(storage, `outfits/${fileName}`);
        await uploadBytes(fileRef, file);
        return await getDownloadURL(fileRef);
    };

    const handleCelebritySelect = (celeb: any) => {
        setCelebrity(celeb.name);
        setCelebrityId(celeb._id);
        setShowDropdown(false);
    };

    const handleCelebrityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCelebrity(e.target.value);
        setCelebrityId(""); // Reset ID if user types
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Upload all media and get Firebase URLs
        let uploadedMedia = mediaFiles;
        if (mediaUploaderRef.current) {
            uploadedMedia = await mediaUploaderRef.current.uploadAllMedia();
            setMediaFiles(uploadedMedia); // update state with real URLs
        }

        // 2. Prepare images array from uploaded media
        const images = uploadedMedia.map((file: any) => file.url);

        const priceNumber = price && !isNaN(Number(price)) ? Number(price) : null;

        // Prepare the request body
        const body = {
            title: title,
            description,
            celebrity: celebrityId, // Use the selected celebrity's ID
            occasion,
            brand,
            price: priceNumber,
            affiliateLink,
            images,
            // tags: tags.split(",").map(tag => tag.trim()).filter(Boolean), // optional: send tags as array
            // sections // optional: send sections if your backend supports it
        };
        console.log("Submitting body:", body);
        try {
            const response = await axios.post(
                `${API_CONFIG.baseUrl}/outfits`,
                body
            );
            console.log("API response:", response.data);
            // Optionally show a success message or redirect
            navigate(-1);
        } catch (error: any) {
            console.error("API error:", error);
            alert(error?.response?.data?.message || "Failed to add outfit");
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 py-10">
            <div className="w-full bg-gray-800 rounded-xl shadow-lg p-8">
                <h1 className="text-4xl font-extrabold text-gray-100 mb-8 text-center">Add New Outfit</h1>
                <form onSubmit={handleSubmit} className="space-y-8 w-full">
                    {/* Two-column layout */}
                    <div className="grid md:grid-cols-2 gap-8 w-full">
                        {/* Left column: Media + Description */}
                        <div className="flex flex-col gap-6">
                            <div>
                                <MediaUploader
                                    ref={mediaUploaderRef}
                                    existingMedia={mediaFiles}
                                    onMediaChange={setMediaFiles}
                                />
                            </div>
                            <div>
                                <Label htmlFor="description" className="text-base text-gray-200 mb-1 block">Description</Label>
                                <textarea
                                    id="description"
                                    className="w-full rounded-md bg-gray-900 border border-gray-700 text-gray-100 p-2 min-h-[120px]"
                                    placeholder="Describe this outfit..."
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                />
                            </div>
                        </div>
                        {/* Right column: Fields */}
                        <div className="flex flex-col gap-6">
                            <div>
                                <Label htmlFor="title" className="text-base text-gray-200 mb-1 block">Title</Label>
                                <Input
                                    id="title"
                                    placeholder="Outfit title"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="tags" className="text-base text-gray-200 mb-1 block">Tags</Label>
                                <Input
                                    id="tags"
                                    placeholder="Comma separated tags"
                                    value={tags}
                                    onChange={e => setTags(e.target.value)}
                                />
                            </div>
                            {/* Celebrity Autocomplete */}
                            <div className="relative" ref={celebInputRef}>
                                <Label htmlFor="celebrity" className="text-base text-gray-200 mb-1 block">Celebrity</Label>
                                <Input
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
                            <div>
                                <Label htmlFor="occasion" className="text-base text-gray-200 mb-1 block">Occasion</Label>
                                <Input
                                    id="occasion"
                                    placeholder="Occasion"
                                    value={occasion}
                                    onChange={e => setOccasion(e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="brand" className="text-base text-gray-200 mb-1 block">Brand</Label>
                                <Input
                                    id="brand"
                                    placeholder="Brand"
                                    value={brand}
                                    onChange={e => setBrand(e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="price" className="text-base text-gray-200 mb-1 block">Price</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    placeholder="Price"
                                    value={price}
                                    onChange={e => setPrice(e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="affiliateLink" className="text-base text-gray-200 mb-1 block">Affiliate Link</Label>
                                <Input
                                    id="affiliateLink"
                                    placeholder="https://example.com/affiliate"
                                    value={affiliateLink}
                                    onChange={e => setAffiliateLink(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    {/* Sections */}
                    <div>
                        <h2 className="text-2xl font-extrabold text-gray-100 mb-6 mt-8">Sections</h2>
                        {sections.map((section, idx) => (
                            <div key={idx} className="mb-8">
                                <Label className="text-xl font-bold text-gray-100 mb-2 block">{section.title}</Label>
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
                    <div className="flex gap-4 justify-end mt-8">
                        <Button type="button" onClick={() => navigate(-1)} variant="outline">Cancel</Button>
                        <Button type="submit">
                            {outfit ? "Update Outfit" : "Add Outfit"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddOutfit;
