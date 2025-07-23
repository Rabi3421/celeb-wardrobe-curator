import React, { useEffect, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import Image from '@tiptap/extension-image';
import { useNavigate } from 'react-router-dom';

const AddCelebrity = () => {
    const navigate = useNavigate();

    // Infobox fields
    const [name, setName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [occupation, setOccupation] = useState('');
    const [nationality, setNationality] = useState('');
    const [infoboxImage, setInfoboxImage] = useState('');
    const [facts, setFacts] = useState([
        { label: 'Born', value: '' },           // e.g. "15 March 1993 (age 32), Bombay, India"
        { label: 'Citizenship', value: '' },
        { label: 'Occupation', value: '' },
        { label: 'Years active', value: '' },
        { label: 'Works', value: '' },
        { label: 'Spouse', value: '' },
        { label: 'Children', value: '' },
        { label: 'Parents', value: '' },        // e.g. "Mahesh Bhatt (father), Soni Razdan (mother)"
        { label: 'Relatives', value: '' },
        { label: 'Awards', value: '' }
    ]);
    const [type, setType] = useState('');

    // Dynamic tables
    const [films, setFilms] = useState([{ title: '', year: '' }]);
    const [awards, setAwards] = useState([{ name: '', year: '' }]);
    const [matches, setMatches] = useState([{ type: '', count: '' }]);
    const [trophies, setTrophies] = useState([{ name: '', year: '' }]);
    const [albums, setAlbums] = useState([{ title: '', year: '' }]);
    const [books, setBooks] = useState([{ title: '', year: '' }]);
    const [positions, setPositions] = useState([{ title: '', year: '' }]);
    const [achievements, setAchievements] = useState([{ name: '', year: '' }]);
    const [events, setEvents] = useState([{ name: '', year: '' }]);
    const [medals, setMedals] = useState([{ type: '', year: '' }]);
    const [showScrollTop, setShowScrollTop] = useState(false);

    // Main content
    const [metaTitle, setMetaTitle] = useState('');
    const [metaDescription, setMetaDescription] = useState('');
    const [slug, setSlug] = useState('');
    const [coverImage, setCoverImage] = useState('');

    // Sections (for Wikipedia-style page)
    const [sections, setSections] = useState([
        { title: 'Early Life', content: '' },
        { title: 'Career', content: '' },
        { title: 'Awards', content: '' }
    ]);

    // Main biography editor
    const editor = useEditor({
        extensions: [StarterKit, Link, Underline, Image],
        content: '',
        autofocus: true,
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none min-h-[400px] border-0 rounded-none p-0 bg-gray-900 text-gray-100',
                style: 'font-size:1.1rem;',
            },
            placeholder: 'Start writing the main biography here...',
        },
    });

    // Section editors
    const handleSectionChange = (idx: number, value: string) => {
        const updated = [...sections];
        updated[idx].content = value;
        setSections(updated);
    };

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

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Publish handler
    const handlePublish = async () => {
        const profileData: any = {
            name,
            birthDate,
            occupation,
            nationality,
            infoboxImage,
            facts: facts.filter(f => f.label && f.value),
            type,
            sections: [
                { title: "Biography", content: editor?.getHTML() || "" },
                ...sections
            ],
            metaTitle,
            metaDescription,
            slug,
            coverImage,
        };

        // Only add relevant fields for the selected type
        if (type === "actor") {
            profileData.films = films.filter(f => f.title && f.year);
            profileData.awards = awards.filter(a => a.name && a.year);
        }
        if (type === "cricketer") {
            profileData.matches = matches.filter(m => m.type && m.count);
            profileData.trophies = trophies.filter(t => t.name && t.year);
        }
        if (type === "singer" || type === "musician") {
            profileData.albums = albums.filter(a => a.title && a.year);
            profileData.awards = awards.filter(a => a.name && a.year);
        }
        if (type === "writer") {
            profileData.books = books.filter(b => b.title && b.year);
        }
        if (type === "politician") {
            profileData.positions = positions.filter(p => p.title && p.year);
            profileData.achievements = achievements.filter(a => a.name && a.year);
        }
        if (type === "businessperson" || type === "philanthropist") {
            profileData.achievements = achievements.filter(a => a.name && a.year);
        }
        if (type === "athlete") {
            profileData.events = events.filter(e => e.name && e.year);
            profileData.medals = medals.filter(m => m.type && m.year);
        }

        try {
            const response = await fetch("http://localhost:5000/api/celebrities", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(profileData)
            });
            if (response.ok) {
                const result = await response.json();
                console.log("Celebrity added:", result);
                alert("Celebrity added successfully!");
                // Optionally reset form or navigate
            } else {
                const error = await response.json();
                console.log("Error adding celebrity:", error);
                alert("Error: " + (error.message || "Failed to add celebrity"));
            }
        } catch (err) {
            console.error("Network error:", err);
            alert("Network error: " + err);
        }
    };

    const handleSaveDraft = () => {
        const draftData: any = {
            name,
            birthDate,
            occupation,
            nationality,
            infoboxImage,
            facts: facts.filter(f => f.label && f.value),
            type,
            sections: [
                { title: "Biography", content: editor?.getHTML() || "" },
                ...sections
            ],
            metaTitle,
            metaDescription,
            slug,
            coverImage,
        };

        // Only add relevant fields for the selected type
        if (type === "actor") {
            draftData.films = films.filter(f => f.title && f.year);
            draftData.awards = awards.filter(a => a.name && a.year);
        }
        if (type === "cricketer") {
            draftData.matches = matches.filter(m => m.type && m.count);
            draftData.trophies = trophies.filter(t => t.name && t.year);
        }
        if (type === "singer" || type === "musician") {
            draftData.albums = albums.filter(a => a.title && a.year);
            draftData.awards = awards.filter(a => a.name && a.year);
        }
        if (type === "writer") {
            draftData.books = books.filter(b => b.title && b.year);
        }
        if (type === "politician") {
            draftData.positions = positions.filter(p => p.title && p.year);
            draftData.achievements = achievements.filter(a => a.name && a.year);
        }
        if (type === "businessperson" || type === "philanthropist") {
            draftData.achievements = achievements.filter(a => a.name && a.year);
        }
        if (type === "athlete") {
            draftData.events = events.filter(e => e.name && e.year);
            draftData.medals = medals.filter(m => m.type && m.year);
        }

        console.log("Draft Data:", JSON.stringify(draftData, null, 2));
        // TODO: Save draftData to your backend or local storage
    };

    // Preview: Show JSON in an alert (or modal if you want)
    const handlePreview = () => {
        const previewData: any = {
            name,
            birthDate,
            occupation,
            nationality,
            infoboxImage,
            facts: facts.filter(f => f.label && f.value),
            type,
            sections: [
                { title: "Biography", content: editor?.getHTML() || "" },
                ...sections
            ],
            metaTitle,
            metaDescription,
            slug,
            coverImage,
        };

        // Only add relevant fields for the selected type
        if (type === "actor") {
            previewData.films = films.filter(f => f.title && f.year);
            previewData.awards = awards.filter(a => a.name && a.year);
        }
        if (type === "cricketer") {
            previewData.matches = matches.filter(m => m.type && m.count);
            previewData.trophies = trophies.filter(t => t.name && t.year);
        }
        if (type === "singer" || type === "musician") {
            previewData.albums = albums.filter(a => a.title && a.year);
            previewData.awards = awards.filter(a => a.name && a.year);
        }
        if (type === "writer") {
            previewData.books = books.filter(b => b.title && b.year);
        }
        if (type === "politician") {
            previewData.positions = positions.filter(p => p.title && p.year);
            previewData.achievements = achievements.filter(a => a.name && a.year);
        }
        if (type === "businessperson" || type === "philanthropist") {
            previewData.achievements = achievements.filter(a => a.name && a.year);
        }
        if (type === "athlete") {
            previewData.events = events.filter(e => e.name && e.year);
            previewData.medals = medals.filter(m => m.type && m.year);
        }

        alert(JSON.stringify(previewData, null, 2));
        // You can replace alert with a modal for better UX
    };

    // Reset: Clear all fields to their initial state
    const handleReset = () => {
        setName('');
        setBirthDate('');
        setOccupation('');
        setNationality('');
        setInfoboxImage('');
        setFacts([
            { label: 'Born', value: '' },
            { label: 'Citizenship', value: '' },
            { label: 'Occupation', value: '' },
            { label: 'Years active', value: '' },
            { label: 'Works', value: '' },
            { label: 'Spouse', value: '' },
            { label: 'Children', value: '' },
            { label: 'Parents', value: '' },
            { label: 'Relatives', value: '' },
            { label: 'Awards', value: '' }
        ]);
        setType('');
        setFilms([{ title: '', year: '' }]);
        setAwards([{ name: '', year: '' }]);
        setMatches([{ type: '', count: '' }]);
        setTrophies([{ name: '', year: '' }]);
        setAlbums([{ title: '', year: '' }]);
        setBooks([{ title: '', year: '' }]);
        setPositions([{ title: '', year: '' }]);
        setAchievements([{ name: '', year: '' }]);
        setEvents([{ name: '', year: '' }]);
        setMedals([{ type: '', year: '' }]);
        setMetaTitle('');
        setMetaDescription('');
        setSlug('');
        setCoverImage('');
        setSections([
            { title: 'Early Life', content: '' },
            { title: 'Career', content: '' },
            { title: 'Awards', content: '' }
        ]);
        editor?.commands.setContent('');
    };

    // Duplicate: Copy current data to a new profile (here, just logs the data)
    const handleDuplicate = () => {
        const duplicateData: any = {
            name,
            birthDate,
            occupation,
            nationality,
            infoboxImage,
            facts: facts.map(f => ({ ...f })),
            type,
            films: films.map(f => ({ ...f })),
            awards: awards.map(a => ({ ...a })),
            matches: matches.map(m => ({ ...m })),
            trophies: trophies.map(t => ({ ...t })),
            albums: albums.map(a => ({ ...a })),
            books: books.map(b => ({ ...b })),
            positions: positions.map(p => ({ ...p })),
            achievements: achievements.map(a => ({ ...a })),
            events: events.map(e => ({ ...e })),
            medals: medals.map(m => ({ ...m })),
            sections: sections.map(s => ({ ...s })),
            metaTitle,
            metaDescription,
            slug,
            coverImage,
        };
        console.log("Duplicate Data:", JSON.stringify(duplicateData, null, 2));
        // You can use this data to create a new profile or pre-fill another form
    };

    return (
        <div className="min-h-screen bg-gray-900 py-10">
            <div className="w-full flex flex-col md:flex-row gap-4 px-4">
                {/* Left: Editor & Sections */}
                <div className="w-full md:w-3/5">
                    <div className="bg-gray-900 rounded-lg shadow border border-gray-700">
                        <div className="pt-6 pb-3 border-b border-gray-800 px-4 flex items-center gap-2">
                            {/* Back Arrow Button */}
                            <button
                                type="button"
                                onClick={() => navigate(-1)} // Use window.history.back() if not using React Router
                                className="mr-2 bg-gray-800 hover:bg-gray-700 text-white rounded-full p-2"
                                aria-label="Go Back"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M15 19L8 12L15 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                            <h1 className="text-2xl font-bold text-gray-100 mb-2">Add New Celebrity</h1>
                            <p className="text-gray-400 text-sm">Fill in all details for a Wikipedia-style profile.</p>
                        </div>
                        <div className="pt-4 pb-2 px-4">
                            {/* Toolbar */}
                            <div className="flex flex-wrap gap-2 mb-4 bg-gray-800 border border-gray-700 rounded-lg p-2">
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
                            <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-sm p-2 mb-6">
                                <EditorContent editor={editor} />
                            </div>
                            {/* Wikipedia-style sections */}
                            <h3 className="text-lg font-bold text-gray-200 mb-2">Additional Sections</h3>
                            {sections.map((section, idx) => (
                                <div key={idx} className="mb-4 bg-gray-800 border border-gray-700 rounded-lg p-3">
                                    <label className="font-semibold mb-1 block text-gray-200">{section.title}</label>
                                    <textarea
                                        value={section.content}
                                        onChange={e => handleSectionChange(idx, e.target.value)}
                                        className="input w-full border rounded px-3 py-2 bg-gray-900 text-gray-100 border-gray-700"
                                        rows={12}
                                        placeholder={`Write about ${section.title}...`}
                                    />
                                </div>
                            ))}
                            {/* Dynamic tables for type */}
                            {type === "actor" && (
                                <>
                                    {/* Films Table */}
                                    <div className="bg-gray-800 rounded-lg shadow border border-gray-700 p-4 mb-4">
                                        <label className="font-semibold mb-1 block text-gray-200">Films</label>
                                        {films.map((film, idx) => (
                                            <div key={idx} className="flex gap-2 mb-2">
                                                <input
                                                    type="text"
                                                    value={film.title}
                                                    onChange={e => {
                                                        const newFilms = [...films];
                                                        newFilms[idx].title = e.target.value;
                                                        setFilms(newFilms);
                                                    }}
                                                    placeholder="Film Title"
                                                    className="input border rounded px-2 py-1 bg-gray-900 text-gray-100 border-gray-700"
                                                />
                                                <input
                                                    type="text"
                                                    value={film.year}
                                                    onChange={e => {
                                                        const newFilms = [...films];
                                                        newFilms[idx].year = e.target.value;
                                                        setFilms(newFilms);
                                                    }}
                                                    placeholder="Year"
                                                    className="input border rounded px-2 py-1 bg-gray-900 text-gray-100 border-gray-700"
                                                />
                                                <button type="button" onClick={() => setFilms(films.filter((_, i) => i !== idx))} className="text-red-400">Remove</button>
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => setFilms([...films, { title: '', year: '' }])} className="text-purple-400 mt-2">Add Film</button>
                                    </div>
                                    {/* Awards Table */}
                                    <div className="bg-gray-800 rounded-lg shadow border border-gray-700 p-4 mb-4">
                                        <label className="font-semibold mb-1 block text-gray-200">Awards</label>
                                        {awards.map((award, idx) => (
                                            <div key={idx} className="flex gap-2 mb-2">
                                                <input
                                                    type="text"
                                                    value={award.name}
                                                    onChange={e => {
                                                        const newAwards = [...awards];
                                                        newAwards[idx].name = e.target.value;
                                                        setAwards(newAwards);
                                                    }}
                                                    placeholder="Award Name"
                                                    className="input border rounded px-2 py-1 bg-gray-900 text-gray-100 border-gray-700"
                                                />
                                                <input
                                                    type="text"
                                                    value={award.year}
                                                    onChange={e => {
                                                        const newAwards = [...awards];
                                                        newAwards[idx].year = e.target.value;
                                                        setAwards(newAwards);
                                                    }}
                                                    placeholder="Year"
                                                    className="input border rounded px-2 py-1 bg-gray-900 text-gray-100 border-gray-700"
                                                />
                                                <button type="button" onClick={() => setAwards(awards.filter((_, i) => i !== idx))} className="text-red-400">Remove</button>
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => setAwards([...awards, { name: '', year: '' }])} className="text-purple-400 mt-2">Add Award</button>
                                    </div>
                                </>
                            )}
                            {type === "cricketer" && (
                                <>
                                    {/* Matches Table */}
                                    <div className="bg-gray-800 rounded-lg shadow border border-gray-700 p-4 mb-4">
                                        <label className="font-semibold mb-1 block text-gray-200">Matches</label>
                                        {matches.map((match, idx) => (
                                            <div key={idx} className="flex gap-2 mb-2">
                                                <input
                                                    type="text"
                                                    value={match.type}
                                                    onChange={e => {
                                                        const newMatches = [...matches];
                                                        newMatches[idx].type = e.target.value;
                                                        setMatches(newMatches);
                                                    }}
                                                    placeholder="Match Type"
                                                    className="input border rounded px-2 py-1 bg-gray-900 text-gray-100 border-gray-700"
                                                />
                                                <input
                                                    type="number"
                                                    value={match.count}
                                                    onChange={e => {
                                                        const newMatches = [...matches];
                                                        newMatches[idx].count = e.target.value;
                                                        setMatches(newMatches);
                                                    }}
                                                    placeholder="Count"
                                                    className="input border rounded px-2 py-1 bg-gray-900 text-gray-100 border-gray-700"
                                                />
                                                <button type="button" onClick={() => setMatches(matches.filter((_, i) => i !== idx))} className="text-red-400">Remove</button>
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => setMatches([...matches, { type: '', count: '' }])} className="text-purple-400 mt-2">Add Match</button>
                                    </div>
                                    {/* Trophies Table */}
                                    <div className="bg-gray-800 rounded-lg shadow border border-gray-700 p-4 mb-4">
                                        <label className="font-semibold mb-1 block text-gray-200">Trophies</label>
                                        {trophies.map((trophy, idx) => (
                                            <div key={idx} className="flex gap-2 mb-2">
                                                <input
                                                    type="text"
                                                    value={trophy.name}
                                                    onChange={e => {
                                                        const newTrophies = [...trophies];
                                                        newTrophies[idx].name = e.target.value;
                                                        setTrophies(newTrophies);
                                                    }}
                                                    placeholder="Trophy Name"
                                                    className="input border rounded px-2 py-1 bg-gray-900 text-gray-100 border-gray-700"
                                                />
                                                <input
                                                    type="text"
                                                    value={trophy.year}
                                                    onChange={e => {
                                                        const newTrophies = [...trophies];
                                                        newTrophies[idx].year = e.target.value;
                                                        setTrophies(newTrophies);
                                                    }}
                                                    placeholder="Year"
                                                    className="input border rounded px-2 py-1 bg-gray-900 text-gray-100 border-gray-700"
                                                />
                                                <button type="button" onClick={() => setTrophies(trophies.filter((_, i) => i !== idx))} className="text-red-400">Remove</button>
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => setTrophies([...trophies, { name: '', year: '' }])} className="text-purple-400 mt-2">Add Trophy</button>
                                    </div>
                                </>
                            )}
                            {type === "singer" || type === "musician" ? (
                                <>
                                    {/* Albums Table */}
                                    <div className="bg-gray-800 rounded-lg shadow border border-gray-700 p-4 mb-4">
                                        <label className="font-semibold mb-1 block text-gray-200">Albums</label>
                                        {albums.map((album, idx) => (
                                            <div key={idx} className="flex gap-2 mb-2">
                                                <input
                                                    type="text"
                                                    value={album.title}
                                                    onChange={e => {
                                                        const newAlbums = [...albums];
                                                        newAlbums[idx].title = e.target.value;
                                                        setAlbums(newAlbums);
                                                    }}
                                                    placeholder="Album Title"
                                                    className="input border rounded px-2 py-1 bg-gray-900 text-gray-100 border-gray-700"
                                                />
                                                <input
                                                    type="text"
                                                    value={album.year}
                                                    onChange={e => {
                                                        const newAlbums = [...albums];
                                                        newAlbums[idx].year = e.target.value;
                                                        setAlbums(newAlbums);
                                                    }}
                                                    placeholder="Year"
                                                    className="input border rounded px-2 py-1 bg-gray-900 text-gray-100 border-gray-700"
                                                />
                                                <button type="button" onClick={() => setAlbums(albums.filter((_, i) => i !== idx))} className="text-red-400">Remove</button>
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => setAlbums([...albums, { title: '', year: '' }])} className="text-purple-400 mt-2">Add Album</button>
                                    </div>
                                    {/* Awards Table */}
                                    <div className="bg-gray-800 rounded-lg shadow border border-gray-700 p-4 mb-4">
                                        <label className="font-semibold mb-1 block text-gray-200">Awards</label>
                                        {awards.map((award, idx) => (
                                            <div key={idx} className="flex gap-2 mb-2">
                                                <input
                                                    type="text"
                                                    value={award.name}
                                                    onChange={e => {
                                                        const newAwards = [...awards];
                                                        newAwards[idx].name = e.target.value;
                                                        setAwards(newAwards);
                                                    }}
                                                    placeholder="Award Name"
                                                    className="input border rounded px-2 py-1 bg-gray-900 text-gray-100 border-gray-700"
                                                />
                                                <input
                                                    type="text"
                                                    value={award.year}
                                                    onChange={e => {
                                                        const newAwards = [...awards];
                                                        newAwards[idx].year = e.target.value;
                                                        setAwards(newAwards);
                                                    }}
                                                    placeholder="Year"
                                                    className="input border rounded px-2 py-1 bg-gray-900 text-gray-100 border-gray-700"
                                                />
                                                <button type="button" onClick={() => setAwards(awards.filter((_, i) => i !== idx))} className="text-red-400">Remove</button>
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => setAwards([...awards, { name: '', year: '' }])} className="text-purple-400 mt-2">Add Award</button>
                                    </div>
                                </>
                            ) : null}
                            {type === "writer" && (
                                <>
                                    {/* Books Table */}
                                    <div className="bg-gray-800 rounded-lg shadow border border-gray-700 p-4 mb-4">
                                        <label className="font-semibold mb-1 block text-gray-200">Books</label>
                                        {books.map((book, idx) => (
                                            <div key={idx} className="flex gap-2 mb-2">
                                                <input
                                                    type="text"
                                                    value={book.title}
                                                    onChange={e => {
                                                        const newBooks = [...books];
                                                        newBooks[idx].title = e.target.value;
                                                        setBooks(newBooks);
                                                    }}
                                                    placeholder="Book Title"
                                                    className="input border rounded px-2 py-1 bg-gray-900 text-gray-100 border-gray-700"
                                                />
                                                <input
                                                    type="text"
                                                    value={book.year}
                                                    onChange={e => {
                                                        const newBooks = [...books];
                                                        newBooks[idx].year = e.target.value;
                                                        setBooks(newBooks);
                                                    }}
                                                    placeholder="Year"
                                                    className="input border rounded px-2 py-1 bg-gray-900 text-gray-100 border-gray-700"
                                                />
                                                <button type="button" onClick={() => setBooks(books.filter((_, i) => i !== idx))} className="text-red-400">Remove</button>
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => setBooks([...books, { title: '', year: '' }])} className="text-purple-400 mt-2">Add Book</button>
                                    </div>
                                </>
                            )}
                            {type === "politician" && (
                                <>
                                    {/* Positions Table */}
                                    <div className="bg-gray-800 rounded-lg shadow border border-gray-700 p-4 mb-4">
                                        <label className="font-semibold mb-1 block text-gray-200">Positions</label>
                                        {positions.map((position, idx) => (
                                            <div key={idx} className="flex gap-2 mb-2">
                                                <input
                                                    type="text"
                                                    value={position.title}
                                                    onChange={e => {
                                                        const newPositions = [...positions];
                                                        newPositions[idx].title = e.target.value;
                                                        setPositions(newPositions);
                                                    }}
                                                    placeholder="Position Title"
                                                    className="input border rounded px-2 py-1 bg-gray-900 text-gray-100 border-gray-700"
                                                />
                                                <input
                                                    type="text"
                                                    value={position.year}
                                                    onChange={e => {
                                                        const newPositions = [...positions];
                                                        newPositions[idx].year = e.target.value;
                                                        setPositions(newPositions);
                                                    }}
                                                    placeholder="Year"
                                                    className="input border rounded px-2 py-1 bg-gray-900 text-gray-100 border-gray-700"
                                                />
                                                <button type="button" onClick={() => setPositions(positions.filter((_, i) => i !== idx))} className="text-red-400">Remove</button>
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => setPositions([...positions, { title: '', year: '' }])} className="text-purple-400 mt-2">Add Position</button>
                                    </div>
                                    {/* Achievements Table */}
                                    <div className="bg-gray-800 rounded-lg shadow border border-gray-700 p-4 mb-4">
                                        <label className="font-semibold mb-1 block text-gray-200">Achievements</label>
                                        {achievements.map((achievement, idx) => (
                                            <div key={idx} className="flex gap-2 mb-2">
                                                <input
                                                    type="text"
                                                    value={achievement.name}
                                                    onChange={e => {
                                                        const newAchievements = [...achievements];
                                                        newAchievements[idx].name = e.target.value;
                                                        setAchievements(newAchievements);
                                                    }}
                                                    placeholder="Achievement"
                                                    className="input border rounded px-2 py-1 bg-gray-900 text-gray-100 border-gray-700"
                                                />
                                                <input
                                                    type="text"
                                                    value={achievement.year}
                                                    onChange={e => {
                                                        const newAchievements = [...achievements];
                                                        newAchievements[idx].year = e.target.value;
                                                        setAchievements(newAchievements);
                                                    }}
                                                    placeholder="Year"
                                                    className="input border rounded px-2 py-1 bg-gray-900 text-gray-100 border-gray-700"
                                                />
                                                <button type="button" onClick={() => setAchievements(achievements.filter((_, i) => i !== idx))} className="text-red-400">Remove</button>
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => setAchievements([...achievements, { name: '', year: '' }])} className="text-purple-400 mt-2">Add Achievement</button>
                                    </div>
                                </>
                            )}
                            {type === "athlete" && (
                                <>
                                    {/* Events Table */}
                                    <div className="bg-gray-800 rounded-lg shadow border border-gray-700 p-4 mb-4">
                                        <label className="font-semibold mb-1 block text-gray-200">Events</label>
                                        {events.map((event, idx) => (
                                            <div key={idx} className="flex gap-2 mb-2">
                                                <input
                                                    type="text"
                                                    value={event.name}
                                                    onChange={e => {
                                                        const newEvents = [...events];
                                                        newEvents[idx].name = e.target.value;
                                                        setEvents(newEvents);
                                                    }}
                                                    placeholder="Event Name"
                                                    className="input border rounded px-2 py-1 bg-gray-900 text-gray-100 border-gray-700"
                                                />
                                                <input
                                                    type="text"
                                                    value={event.year}
                                                    onChange={e => {
                                                        const newEvents = [...events];
                                                        newEvents[idx].year = e.target.value;
                                                        setEvents(newEvents);
                                                    }}
                                                    placeholder="Year"
                                                    className="input border rounded px-2 py-1 bg-gray-900 text-gray-100 border-gray-700"
                                                />
                                                <button type="button" onClick={() => setEvents(events.filter((_, i) => i !== idx))} className="text-red-400">Remove</button>
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => setEvents([...events, { name: '', year: '' }])} className="text-purple-400 mt-2">Add Event</button>
                                    </div>
                                    {/* Medals Table */}
                                    <div className="bg-gray-800 rounded-lg shadow border border-gray-700 p-4 mb-4">
                                        <label className="font-semibold mb-1 block text-gray-200">Medals</label>
                                        {medals.map((medal, idx) => (
                                            <div key={idx} className="flex gap-2 mb-2">
                                                <input
                                                    type="text"
                                                    value={medal.type}
                                                    onChange={e => {
                                                        const newMedals = [...medals];
                                                        newMedals[idx].type = e.target.value;
                                                        setMedals(newMedals);
                                                    }}
                                                    placeholder="Medal Type"
                                                    className="input border rounded px-2 py-1 bg-gray-900 text-gray-100 border-gray-700"
                                                />
                                                <input
                                                    type="text"
                                                    value={medal.year}
                                                    onChange={e => {
                                                        const newMedals = [...medals];
                                                        newMedals[idx].year = e.target.value;
                                                        setMedals(newMedals);
                                                    }}
                                                    placeholder="Year"
                                                    className="input border rounded px-2 py-1 bg-gray-900 text-gray-100 border-gray-700"
                                                />
                                                <button type="button" onClick={() => setMedals(medals.filter((_, i) => i !== idx))} className="text-red-400">Remove</button>
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => setMedals([...medals, { type: '', year: '' }])} className="text-purple-400 mt-2">Add Medal</button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                {/* Right: Infobox & Options */}
                <div className="w-full md:w-2/5 flex flex-col gap-4 mt-8 md:mt-0">
                    {/* Action buttons */}
                    <div className="flex gap-2 mb-4">
                        <button
                            type="button"
                            className="bg-purple-800 hover:bg-purple-900 text-white font-semibold py-2 px-4 rounded shadow"
                            onClick={handlePublish}
                        >
                            Publish
                        </button>
                        <button
                            type="button"
                            className="bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded shadow"
                            onClick={handleSaveDraft}
                        >
                            Save as Draft
                        </button>
                        <button
                            type="button"
                            className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded shadow"
                            onClick={handlePreview}
                        >
                            Preview
                        </button>
                        <button
                            type="button"
                            className="bg-red-700 hover:bg-red-800 text-white font-semibold py-2 px-4 rounded shadow"
                            onClick={handleReset}
                        >
                            Reset
                        </button>
                        <button
                            type="button"
                            className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded shadow"
                            onClick={handleDuplicate}
                        >
                            Duplicate
                        </button>
                    </div>
                    {/* Type selector */}
                    <div className="bg-gray-800 rounded-lg shadow border border-gray-700 p-4">
                        <label className="font-semibold mb-1 block text-gray-200">Type</label>
                        <select
                            value={type}
                            onChange={e => setType(e.target.value)}
                            className="input w-full border rounded px-3 py-2 bg-gray-900 text-gray-100 border-gray-700"
                        >
                            <option value="">Select Type</option>
                            <option value="actor">Actor</option>
                            <option value="cricketer">Cricketer</option>
                            <option value="singer">Singer</option>
                            <option value="musician">Musician</option>
                            <option value="writer">Writer</option>
                            <option value="politician">Politician</option>
                            <option value="athlete">Athlete</option>
                            <option value="comedian">Comedian</option>
                            <option value="dancer">Dancer</option>
                            <option value="businessperson">Businessperson</option>
                            <option value="philanthropist">Philanthropist</option>
                            <option value="artist">Artist</option>
                            <option value="model">Model</option>
                            <option value="chef">Chef</option>
                            <option value="influencer">Influencer</option>
                            <option value="scientist">Scientist</option>
                            <option value="explorer">Explorer</option>
                            <option value="historian">Historian</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    {/* ...rest of infobox and meta fields... */}
                    <div className="bg-gray-800 rounded-lg shadow border border-gray-700 p-4">
                        <label className="font-semibold mb-1 block text-gray-200">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="input w-full border rounded px-3 py-2 bg-gray-900 text-gray-100 border-gray-700"
                            placeholder="Celebrity Name"
                        />
                    </div>
                    <div className="bg-gray-800 rounded-lg shadow border border-gray-700 p-4">
                        <label className="font-semibold mb-1 block text-gray-200">Birth Date</label>
                        <input
                            type="date"
                            value={birthDate}
                            onChange={e => setBirthDate(e.target.value)}
                            className="input w-full border rounded px-3 py-2 bg-gray-900 text-gray-100 border-gray-700"
                        />
                    </div>
                    <div className="bg-gray-800 rounded-lg shadow border border-gray-700 p-4">
                        <label className="font-semibold mb-1 block text-gray-200">Occupation</label>
                        <input
                            type="text"
                            value={occupation}
                            onChange={e => setOccupation(e.target.value)}
                            className="input w-full border rounded px-3 py-2 bg-gray-900 text-gray-100 border-gray-700"
                            placeholder="Occupation"
                        />
                    </div>
                    <div className="bg-gray-800 rounded-lg shadow border border-gray-700 p-4">
                        <label className="font-semibold mb-1 block text-gray-200">Nationality</label>
                        <input
                            type="text"
                            value={nationality}
                            onChange={e => setNationality(e.target.value)}
                            className="input w-full border rounded px-3 py-2 bg-gray-900 text-gray-100 border-gray-700"
                            placeholder="Nationality"
                        />
                    </div>
                    <div className="bg-gray-800 rounded-lg shadow border border-gray-700 p-4">
                        <label className="font-semibold mb-1 block text-gray-200">Infobox Image URL</label>
                        <input
                            type="url"
                            value={infoboxImage}
                            onChange={e => setInfoboxImage(e.target.value)}
                            className="input w-full border rounded px-3 py-2 mb-2 bg-gray-900 text-gray-100 border-gray-700"
                            placeholder="Paste image URL"
                        />
                        {infoboxImage && (
                            <img
                                src={infoboxImage}
                                alt="Infobox Preview"
                                className="mt-2 rounded shadow w-full h-32 object-cover border border-gray-700"
                            />
                        )}
                    </div>
                    {/* Facts (key-value pairs) */}
                    <div className="bg-gray-800 rounded-lg shadow border border-gray-700 p-4">
                        <label className="font-semibold mb-1 block text-gray-200">Facts (Infobox)</label>
                        {facts.map((fact, idx) => {
                            // Example placeholders for common labels
                            let example = '';
                            switch (fact.label) {
                                case 'Born':
                                    example = 'e.g. 15 March 1993 (age 32), Bombay, India';
                                    break;
                                case 'Citizenship':
                                    example = 'e.g. United Kingdom';
                                    break;
                                case 'Occupation':
                                    example = 'e.g. Actress';
                                    break;
                                case 'Years active':
                                    example = 'e.g. 2012–present';
                                    break;
                                case 'Works':
                                    example = 'e.g. Full list';
                                    break;
                                case 'Spouse':
                                    example = 'e.g. Ranbir Kapoor (m. 2022)';
                                    break;
                                case 'Children':
                                    example = 'e.g. 1';
                                    break;
                                case 'Parents':
                                    example = 'e.g. Mahesh Bhatt (father), Soni Razdan (mother)';
                                    break;
                                case 'Relatives':
                                    example = 'e.g. Bhatt family, Kapoor family';
                                    break;
                                case 'Awards':
                                    example = 'e.g. Full list';
                                    break;
                                default:
                                    example = 'Value';
                            }
                            return (
                                <div key={idx} className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={fact.label}
                                        onChange={e => {
                                            const newFacts = [...facts];
                                            newFacts[idx].label = e.target.value;
                                            setFacts(newFacts);
                                        }}
                                        placeholder="Label"
                                        className="input border rounded px-2 py-1 bg-gray-900 text-gray-100 border-gray-700"
                                    />
                                    <input
                                        type="text"
                                        value={fact.value}
                                        onChange={e => {
                                            const newFacts = [...facts];
                                            newFacts[idx].value = e.target.value;
                                            setFacts(newFacts);
                                        }}
                                        placeholder={example}
                                        className="input border rounded px-2 py-1 bg-gray-900 text-gray-100 border-gray-700"
                                    />
                                    <button type="button" onClick={() => setFacts(facts.filter((_, i) => i !== idx))} className="text-red-400">Remove</button>
                                </div>
                            );
                        })}
                        <button type="button" onClick={() => setFacts([...facts, { label: '', value: '' }])} className="text-purple-400 mt-2">Add Fact</button>
                    </div>
                    {/* Meta fields */}
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
                </div>
            </div>
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 z-50 bg-purple-700 hover:bg-purple-900 text-white rounded-full shadow-lg p-3 transition-all"
                    aria-label="Scroll to top"
                >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                        <path d="M12 19V5M12 5L5 12M12 5L19 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            )}
        </div>
    );
};

export default AddCelebrity;