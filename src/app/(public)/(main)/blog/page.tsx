import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../../../keystatic.config';

import Link from 'next/link';
import { Heading } from '@/lib/components/ui/heading';
import Image from 'next/image';
import { Text } from '@/lib/components/ui/text';
import DateFormatter from '@/lib/components/date-formatter';
import { Container } from '@/lib/components/ui/container';

const reader = createReader(process.cwd(), keystaticConfig);

export default async function Page() {
  const posts = await reader.collections.posts.all();

  async function getAuthor(slug: string) {
    return await reader.collections.authors.read(slug);
  }

  return (
    <Container size={10} className="py-14">
      <Heading as="h1" variant="h1" className="text-center">Blog</Heading>

      <div className=" my-20 sm:my-36">
        {posts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {posts.map(async(post: any) => {
              const author = await getAuthor(post.entry.authors[0]);

              return (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="col-span-1">
                  {post.entry.coverImage && <Image className="mb-3 rounded-md" src={`/images/blog/cover-image/${post.slug}/${post.entry.coverImage}`} alt="the alt" width={1300} height={630}  />}
                  <Heading className="mb-3" as="h2" variant="h4">{post.entry.title}</Heading>
                  <Text className="mb-3">{post.entry.excerpt}</Text>
                  <div className="flex flex-row items-center">
                    {author?.avatar && (
                      <Image className="rounded-full object-cover w-10 h-10 mr-4" src={`/images/avatars/${post.entry.authors[0]}/${author.avatar}`} alt="the alt" width={80} height={80}  />
                    )}
                    <div>
                      <DateFormatter dateString={post.entry.published} />
                      {author?.name && <Text className="font-semibold text-lg">{author.name}</Text>}
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
  );
}