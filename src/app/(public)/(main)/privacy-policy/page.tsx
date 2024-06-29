import { Text } from '@/lib/components/ui/text';
import { Heading } from '@/lib/components/ui/heading';
import { Container } from '@/lib/components/ui/container';

export default function PrivacyPolicyPage() {
  return (
    <Container size={7} className="py-20 lg:py-28">
      <Heading as="h1" variant="h3">Privacy Policy</Heading>

      <div className="space-y-6 mt-6">
        <Text>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias asperiores, corporis ipsam necessitatibus porro voluptatum! Deleniti molestiae nostrum odit quibusdam
          rerum tenetur voluptatibus? At beatae, blanditiis commodi et ex, exercitationem fugit nam quam reiciendis rerum sapiente, sunt ullam veniam. Accusamus architecto autem
          dolorem illum impedit ipsum iure odit similique vel.
        </Text>
        <Text>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur ipsam quo quod soluta velit voluptates voluptatum! Architecto, dolorem ipsam nostrum nulla
          repellendus voluptatem! Alias error, ex hic molestiae nostrum numquam pariatur repudiandae sint totam vero? Aliquam deserunt illo non voluptates?
        </Text>
        <Text>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab amet, corporis doloribus ducimus fugit incidunt itaque magni, modi odio possimus quis sint tenetur totam
          veritatis.
        </Text>

        <Heading as="h3" variant="h6">
          This policy is effective as of 26 July 2023.
        </Heading>
      </div>
    </Container>
  );
}