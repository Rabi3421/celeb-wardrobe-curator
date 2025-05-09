import React from "react";
import PageLayout from "@/components/layout/PageLayout";
import OutfitCard from "@/components/ui/OutfitCard";
import CelebrityCard from "@/components/ui/CelebrityCard";
import BlogPostCard from "@/components/ui/BlogPostCard";
import SectionHeader from "@/components/ui/SectionHeader";
import { outfits, celebrities, blogPosts } from "@/data/mockData";
import TestimonialCard from "@/components/ui/TestimonialCard";

const Index: React.FC = () => {
  const featuredOutfits = outfits.slice(0, 6);
  const featuredCelebrities = celebrities.slice(0, 4);
  const recentBlogPosts = blogPosts.slice(0, 3);

  const testimonials = [
    {
      id: 1,
      name: "Emma Thompson",
      role: "Fashion Enthusiast",
      avatar: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      quote: "CelebrityPersona completely transformed how I approach my personal style. Now I can easily find affordable alternatives to my favorite celebrity outfits!"
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      role: "Style Blogger",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      quote: "As a style blogger, this platform has become my go-to resource for researching celebrity fashion trends and finding budget-friendly options for my readers."
    },
    {
      id: 3,
      name: "Sophia Chen",
      role: "Personal Shopper",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      quote: "The detailed breakdown of each outfit and similar alternatives at different price points makes this an invaluable tool for my clients who want celebrity-inspired looks."
    }
  ];

  return (
    <PageLayout>
      {/* Hero Banner */}
      <section className="relative bg-pastel-lavender">
        <div className="container-custom py-10 md:py-16 lg:py-24 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium mb-4">
              Discover Celebrity Style & Shop Similar Looks
            </h1>
            <p className="text-muted-foreground mb-6 md:text-lg">
              Your ultimate destination for celebrity fashion inspiration and affordable alternatives.
            </p>
            <div className="flex space-x-4">
              <button className="btn-primary">Explore Outfits</button>
              <button className="border border-primary-foreground text-primary-foreground rounded-full px-6 py-2.5 font-medium transition-all hover:bg-primary-foreground hover:text-white">
                Browse Celebrities
              </button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img
              src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
              alt="Celebrity fashion"
              className="rounded-2xl shadow-lg max-w-xs md:max-w-sm"
            />
          </div>
        </div>
      </section>

      {/* Latest Outfits Section */}
      <section className="container-custom py-16">
        <SectionHeader
          title="Latest Celebrity Outfits"
          viewAllLink="/outfits"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {featuredOutfits.map((outfit) => (
            <OutfitCard
              key={outfit.id}
              id={outfit.id}
              image={outfit.image}
              celebrity={outfit.celebrity}
              celebrityId={outfit.celebrityId}
              title={outfit.title}
              description={outfit.description}
            />
          ))}
        </div>
      </section>

      {/* Popular Celebrities Section */}
      <section className="bg-secondary py-16">
        <div className="container-custom">
          <SectionHeader
            title="Popular Celebrities"
            viewAllLink="/celebrities"
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {featuredCelebrities.map((celebrity) => (
              <CelebrityCard
                key={celebrity.id}
                id={celebrity.id}
                name={celebrity.name}
                image={celebrity.image}
                outfitCount={celebrity.outfitCount}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container-custom py-16">
        <h2 className="section-title text-center mx-auto mb-12">
          Why Choose CelebrityPersona
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-pastel-pink rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary-foreground"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <h3 className="font-serif font-medium text-xl mb-2">Authentic Looks</h3>
            <p className="text-muted-foreground">
              Verified celebrity outfits with detailed information about the occasion and styling.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-pastel-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary-foreground"
              >
                <circle cx="12" cy="12" r="8" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="m4.93 4.93 1.41 1.41" />
                <path d="m17.66 17.66 1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="m6.34 17.66-1.41 1.41" />
                <path d="m19.07 4.93-1.41 1.41" />
              </svg>
            </div>
            <h3 className="font-serif font-medium text-xl mb-2">Affordable Alternatives</h3>
            <p className="text-muted-foreground">
              Shop similar styles across different price points from trusted retailers.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-pastel-peach rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary-foreground"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M3 9h18" />
                <path d="M9 21V9" />
              </svg>
            </div>
            <h3 className="font-serif font-medium text-xl mb-2">Fashion Insights</h3>
            <p className="text-muted-foreground">
              Expert fashion analysis and styling tips from industry professionals.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-pastel-lavender">
        <div className="container-custom">
          <h2 className="section-title text-center mx-auto mb-10">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <TestimonialCard
                key={testimonial.id}
                name={testimonial.name}
                role={testimonial.role}
                avatar={testimonial.avatar}
                quote={testimonial.quote}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="bg-secondary py-16">
        <div className="container-custom">
          <SectionHeader
            title="Fashion Blog"
            viewAllLink="/blog"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentBlogPosts.map((post) => (
              <BlogPostCard
                key={post.id}
                id={post.id}
                title={post.title}
                excerpt={post.excerpt}
                image={post.image}
                date={post.date}
                category={post.category}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="container-custom py-16">
        <div className="bg-pastel-pink rounded-2xl p-8 md:p-12 text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-medium mb-4">
            Stay Updated with Celebrity Fashion
          </h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Subscribe to our newsletter for the latest celebrity outfit inspirations and exclusive style guides.
          </p>
          <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow rounded-full px-4 py-2.5 border border-border focus:outline-none focus:ring-2 focus:ring-primary-foreground"
              required
            />
            <button type="submit" className="btn-primary whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </PageLayout>
  );
};

export default Index;
