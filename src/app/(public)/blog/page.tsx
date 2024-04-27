import { getAllBlogPosts } from "@/src/lib/api/blog";
import { Heading } from '@/src/lib/components/ui/heading';
import { Text } from '@/src/lib/components/ui/text';
import { Container } from '@/src/lib/components/ui/container';
import Image from 'next/image';
import DateFormatter from '@/src/lib/components/date-formatter';
import Link from 'next/link';

export default function Blog() {
  const allPosts = getAllBlogPosts();

  return (
    <Container size={11} className="py-14">
      <Heading as="h1" variant="h1" className="text-center">Blog</Heading>

      <div className=" my-20 sm:my-36">
        {allPosts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {allPosts.map(post => {
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