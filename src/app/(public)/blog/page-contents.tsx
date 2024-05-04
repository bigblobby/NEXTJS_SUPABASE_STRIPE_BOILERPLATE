import { Heading } from '@/lib/components/ui/heading';
import Link from 'next/link';
import Image from 'next/image';
import { Text } from '@/lib/components/ui/text';
import DateFormatter from '@/lib/components/date-formatter';
import { Container } from '@/lib/components/ui/container';
import { BlogPost } from '@/lib/types/blog.types';

interface BlogPageContentsProps {
  posts: BlogPost[];
}

export default function BlogPageContents({
  posts
}: BlogPageContentsProps) {
  return (
    <Container size={11} className="py-14">
      <Heading as="h1" variant="h1" className="text-center">Blog</Heading>

      <div className=" my-20 sm:my-36">
        {posts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {posts.map((post: BlogPost) => {
              return (
                <Link href={`/blog/${post.slug}`} className="col-span-1">
                  <Image className="mb-3 rounded-3xl" src={post.coverImage} alt="the alt" width={1300} height={630}  />
                  <Heading className="mb-3" as="h2" variant="h4">{post.title}</Heading>
                  <Text className="mb-3">{post.excerpt}</Text>
                  <div className="flex flex-row items-center">
                    {post.author.picture && (
                      <Image className="rounded-full object-cover w-10 h-10 mr-4" src={post.author.picture} alt="the alt" width={80} height={80}  />
                    )}
                    <div>
                      <DateFormatter dateString={post.date} />
                      <Text className="font-semibold text-lg">{post.author.name}</Text>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="mt-4">
            <Text variant="leading" className="text-center">No blog posts, check back later!</Text>
          </div>
        )}
      </div>
    </Container>
  )
}