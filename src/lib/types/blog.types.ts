export interface BlogPostAuthor {
  name: string;
  picture: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  coverImage: string;
  author: BlogPostAuthor;
  excerpt: string;
  ogImage: {
    url: string;
  };
  content: string;
  preview?: boolean;
}