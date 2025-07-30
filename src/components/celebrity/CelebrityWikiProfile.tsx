import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import DOMPurify from "dompurify";

const CelebrityWikiProfile: React.FC<{ celebrity: any }> = ({ celebrity }) => {
    // Helper to render facts as table rows

    // ...existing code...
    function decodeHtml(html: string) {
        const txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }

    function stripHtml(html: string) {
        if (!html) return "";
        const decoded = decodeHtml(html);
        const tmp = document.createElement("div");
        tmp.innerHTML = decoded;
        return tmp.textContent || tmp.innerText || "";
    }
    function addTargetBlankToLinks(html: string) {
        // Create a DOM parser
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        doc.querySelectorAll("a").forEach((a) => {
            a.setAttribute("target", "_blank");
            a.setAttribute("rel", "noopener noreferrer");
        });
        return doc.body.innerHTML;
    }
    // ...existing code...

    const renderFacts = () =>
        celebrity.facts && celebrity.facts.length > 0 ? (
            <table className="w-full text-sm mb-4 border border-gray-200 rounded overflow-hidden">
                <tbody>
                    {celebrity.facts.map((fact: any) => (
                        <tr key={fact._id || fact.label}>
                            <td className="font-medium px-2 py-1 bg-gray-50 border-b border-gray-200 w-1/3">{fact.label}</td>
                            <td className="px-2 py-1 border-b border-gray-200">{fact.value}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        ) : null;

    // Helper to render films
    const renderFilms = () =>
        celebrity.films && celebrity.films.length > 0 ? (
            <div className="mb-4">
                <div className="w-full border-b border-gray-700 pb-1 mb-4 mt-6">
                    <h3 className="font-serif text-xl font-bold text-gray-900">
                        Filmography
                    </h3>
                </div>                <table className="w-full text-sm border border-gray-300 rounded mb-2">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="px-2 py-1 text-left font-semibold border border-gray-300">Title</th>
                            <th className="px-2 py-1 text-left font-semibold border border-gray-300">Year</th>
                        </tr>
                    </thead>
                    <tbody>
                        {celebrity.films.map((film: any) => (
                            <tr key={film._id || film.title}>
                                <td className="px-2 py-1 border border-gray-300">{film.title}</td>
                                <td className="px-2 py-1 border border-gray-300">{film.year}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        ) : null;

    // Helper to render awards
    const renderAwards = () =>
        celebrity.awards && celebrity.awards.length > 0 ? (
            <div className="mb-4">
                <div className="w-full border-b border-gray-700 pb-1 mb-4 mt-6">
                    <h3 className="font-serif text-xl font-bold text-gray-900">
                        Awards
                    </h3>
                </div>
                <table className="w-full text-sm border border-gray-300 rounded mb-2">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="px-2 py-1 text-left font-semibold border border-gray-300">Name</th>
                            <th className="px-2 py-1 text-left font-semibold border border-gray-300">Category</th>
                            <th className="px-2 py-1 text-left font-semibold border border-gray-300">Movie</th>
                            <th className="px-2 py-1 text-left font-semibold border border-gray-300">Year</th>
                            <th className="px-2 py-1 text-left font-semibold border border-gray-300">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {celebrity.awards.map((award: any) => (
                            <tr key={award._id || award.name}>
                                <td className="px-2 py-1 border border-gray-300">{award.name}</td>
                                <td className="px-2 py-1 border border-gray-300">{award.category || "-"}</td>
                                <td className="px-2 py-1 border border-gray-300">{award.movie || "-"}</td>
                                <td className="px-2 py-1 border border-gray-300">{award.year}</td>
                                <td className="px-2 py-1 border border-gray-300">{award.status || "-"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        ) : null;

    // Helper to render sections (Biography, Career, etc.)
    const renderSections = () =>
        celebrity.sections && celebrity.sections.length > 0 ? (
            <div className="mb-4">
                {celebrity.sections.map((section: any, idx: number) => (
                    <div key={idx} className="mb-6">
                        <div className="w-full border-b border-gray-700 pb-1 mb-4 mt-6">
                            <h3 className="font-serif text-2xl font-bold text-gray-900">
                                {section.title}
                            </h3>
                        </div>
                        {/* <div
                            className="prose prose-stone max-w-none text-muted-foreground"
                            dangerouslySetInnerHTML={{ __html: section.content }}
                        /> */}
                        {/* <div className="prose prose-stone max-w-none text-muted-foreground whitespace-pre-line">
                            {stripHtml(section.content)}
                        </div> */}
                        {/* <div
                            className="prose prose-stone max-w-none text-muted-foreground"
                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(decodeHtml(section.content)) }}
                        /> */}
                        <div
                            className="prose prose-stone max-w-none text-gray-800 prose-a:text-blue-700 prose-a:underline prose-a:font-normal prose-p:my-2 prose-p:leading-relaxed prose-p:text-base prose-strong:font-semibold prose-strong:text-gray-900"
                            dangerouslySetInnerHTML={{
                                __html: addTargetBlankToLinks(DOMPurify.sanitize(decodeHtml(section.content))),
                            }}
                        />
                    </div>
                ))}
            </div>
        ) : null;

    // Helper to render gallery images
    const renderGallery = () =>
        celebrity.galleryImages && celebrity.galleryImages.length > 0 ? (
            <div className="mb-4">
                <div className="w-full border-b border-gray-700 pb-1 mb-4 mt-6">
                    <h3 className="font-serif text-xl font-bold text-gray-900">
                        Gallery
                    </h3>
                </div>                <div className="flex flex-wrap gap-4">
                    {celebrity.galleryImages.map((img: string, idx: number) => (
                        <img
                            key={idx}
                            src={img}
                            alt={`${celebrity.name} gallery ${idx + 1}`}
                            className="rounded shadow w-32 h-32 object-cover border border-gray-200"
                        />
                    ))}
                </div>
            </div>
        ) : null;

    return (
        <Card className="w-full max-w-7xl mx-auto border border-gray-200 shadow-sm bg-white">
            <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Left: Main content */}
                    <div className="md:w-3/4">
                        {renderSections()}
                        {renderFilms()}
                        {renderAwards()}
                    </div>
                    {/* Right: Image and quick info */}
                    <div className="md:w-1/4 flex flex-col items-center">
                        {(celebrity.coverImage || celebrity.infoboxImage) && (
                            <img
                                src={celebrity.coverImage || celebrity.infoboxImage}
                                alt={celebrity.name}
                                className="rounded-lg shadow w-48 h-48 object-cover mb-4 border border-gray-200"
                            />
                        )}
                        <h1 className="font-serif text-3xl font-bold mb-2 text-center">{celebrity.name}</h1>
                        {celebrity.type && (
                            <span className="text-sm text-muted-foreground mb-2">{celebrity.type.charAt(0).toUpperCase() + celebrity.type.slice(1)}</span>
                        )}
                        {celebrity.birthDate && (
                            <span className="text-sm text-muted-foreground mb-2">
                                Born: {new Date(celebrity.birthDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                            </span>
                        )}
                        {celebrity.nationality && (
                            <span className="text-sm text-muted-foreground mb-2">Nationality: {celebrity.nationality}</span>
                        )}
                        {celebrity.occupation && (
                            <span className="text-sm text-muted-foreground mb-2">Occupation: {celebrity.occupation}</span>
                        )}
                        {celebrity.metaDescription && (
                            <span className="text-xs text-muted-foreground mt-2 text-center">{celebrity.metaDescription}</span>
                        )}
                        <Separator className="my-4" />
                        {renderFacts()}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default CelebrityWikiProfile;