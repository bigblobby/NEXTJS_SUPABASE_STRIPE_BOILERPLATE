import { BlogPost } from '@/lib/types/blog.types';
import { Container } from '@/lib/components/ui/container';
import { Heading } from '@/lib/components/ui/heading';
import Image from 'next/image';
import DateFormatter from '@/lib/components/date-formatter';
import { Text } from '@/lib/components/ui/text';
import markdownStyles from '@/styles/markdown-styles.module.css';
import markdownToHtml from '@/lib/utils/markdown-to-html';

interface BlogPostContentsProps {
  post: BlogPost;
}

export default async function BlogPostContents({
  post
}: BlogPostContentsProps) {
  const content = await markdownToHtml(post.content || "");

  return (
    <Container size={6} className="py-14">
      <article>
        <Heading className="mb-3" as="h1">{post.title}</Heading>
        <div className="flex flex-row items-center">
          {post.author.picture && (
            <Image className="my-4 rounded-full object-cover w-16 h-16 mr-4" src={post.author.picture} alt="the alt" width={80} height={80}  />
          )}
          <div>
            <DateFormatter dateString={post.date} />
            <Text className="font-semibold text-lg">{post.author.name}</Text>
          </div>
        </div>
        <Image className="my-4" src={post.coverImage} alt="the alt" width={1300} height={630}  />
        <div
          className={markdownStyles['markdown']}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </article>
    </Container>
  );
}