
import React from "react";
import PageLayout from "@/components/layout/PageLayout";
import BlogPostCard from "@/components/ui/BlogPostCard";
import SectionHeader from "@/components/ui/SectionHeader";
import { blogPosts } from "@/data/mockData";

const Blog: React.FC = () => {
  return (
    <PageLayout>
      <div className="container-custom py-12">
        <SectionHeader title="Fashion Blog" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {blogPosts.map((post) => (
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
    </PageLayout>
  );
};

export default Blog;
