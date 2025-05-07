
import React from "react";
import { useParams, Link } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { blogPosts } from "@/data/mockData";

const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const post = blogPosts.find((post) => post.id === id);

  if (!post) {
    return (
      <PageLayout>
        <div className="container-custom py-16 text-center">
          <h2 className="font-serif text-2xl mb-4">Blog post not found</h2>
          <p className="text-muted-foreground">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container-custom py-8 md:py-16">
        <div className="mb-6">
          <Link
            to="/blog"
            className="text-sm font-medium text-primary-foreground hover:underline inline-flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back to Blog
          </Link>
        </div>

        <article className="max-w-3xl mx-auto">
          <header className="mb-8 text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <span className="text-sm text-muted-foreground">{post.date}</span>
              <span className="text-muted-foreground">•</span>
              <span className="bg-pastel-blue px-2 py-0.5 rounded-full text-xs">
                {post.category}
              </span>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-medium mb-6">
              {post.title}
            </h1>
            <div className="flex items-center justify-center">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mr-3">
                  <span className="font-medium text-sm">
                    {post.author.charAt(0)}
                  </span>
                </div>
                <span className="font-medium text-sm">{post.author}</span>
              </div>
            </div>
          </header>

          <figure className="mb-8 rounded-2xl overflow-hidden">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-auto object-cover"
            />
          </figure>

          <div className="prose prose-lg max-w-none">
            {post.content.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="mb-6 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-12 border-t border-border pt-8 flex flex-col items-center">
            <h3 className="font-serif text-xl font-medium mb-4">Share this article</h3>
            <div className="flex space-x-4">
              <button className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center transition-colors hover:bg-primary hover:text-primary-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </button>
              <button className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center transition-colors hover:bg-primary hover:text-primary-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </button>
              <button className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center transition-colors hover:bg-primary hover:text-primary-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </button>
            </div>
          </div>
        </article>
      </div>
    </PageLayout>
  );
};

export default BlogPost;
