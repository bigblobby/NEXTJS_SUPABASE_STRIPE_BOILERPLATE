import { Text } from '@/lib/components/ui/text';
import { Heading } from '@/lib/components/ui/heading';
import { Container } from '@/lib/components/ui/container';

export default function TermsAndConditions() {
  return (
    <Container size={10} className="py-20 lg:py-28">
      <Heading as="h1" variant="h3">Terms and Conditions</Heading>
      <div className="space-y-8 mt-8">
        <div className="space-y-2">
          <Heading as="h2" variant="h5">1. Introduction</Heading>
          <Text>By using NextJS Boilerplate you confirm your acceptance of, and agree to be bound by, these terms and conditions.</Text>
        </div>

        <div className="space-y-2">
          <Heading as="h2" variant="h5">2. Agreement to Terms and Conditions</Heading>
          <Text>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorem, totam.</Text>
        </div>

        <div className="space-y-2">
          <Heading as="h2" variant="h5">3. Unlimited Access Software License with Termination Rights</Heading>
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
        </div>

        <div className="space-y-2">
          <Heading as="h2" variant="h5">4. Refunds</Heading>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque eius enim, explicabo laborum maxime molestias nemo quasi quia.
          </Text>
        </div>

        <div className="space-y-2">
          <Heading as="h2" variant="h5">5. Disclaimer</Heading>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam asperiores blanditiis, consequatur fugiat magni maxime optio! Adipisci, alias corporis cum debitis
            explicabo impedit incidunt iusto nam, nulla numquam quis repellat sed vel? Amet aut error eum iure minus natus quam quod rerum tenetur unde? Quae, repellendus
            reprehenderit? Alias animi assumenda eum impedit iure quia recusandae voluptates. Ad aut consequuntur delectus iure modi nesciunt officiis omnis. Ab commodi
            necessitatibus ullam. Aperiam?
          </Text>
        </div>

        <div className="space-y-2">
          <Heading as="h2" variant="h5">6. Warranties and Limitation of Liability</Heading>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium ad adipisci alias aliquam aliquid aperiam aut, beatae blanditiis consectetur debitis deserunt
            dicta dolor doloremque et exercitationem facilis hic in iure iusto laboriosam maiores molestias mollitia nobis non officiis perspiciatis placeat porro quaerat quasi rem
            repellendus repudiandae similique soluta unde vel vitae voluptas! Aut debitis dicta ducimus, enim et hic necessitatibus nostrum quos. Accusamus animi aperiam blanditiis
            consequatur corporis cumque debitis deleniti dicta distinctio dolor doloremque ea error esse et eveniet ex expedita facere, fuga in laudantium magnam, magni minus
            mollitia obcaecati officia officiis pariatur placeat quis quos saepe sed similique sit sunt tempora tenetur ullam vero. Aliquam consequuntur culpa doloribus dolorum
            enim, facilis iure numquam obcaecati pariatur placeat, praesentium rerum sit unde, vel veritatis? Alias aperiam commodi consequuntur, distinctio dolorem eaque earum eos
            expedita, fuga ipsam magni nemo perferendis praesentium similique temporibus! Cum ducimus iure iusto molestias officiis qui. Nemo.
          </Text>
        </div>

        <div className="space-y-2">
          <Heading as="h2" variant="h5">7. Responsibilities</Heading>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab id labore qui quis unde.
          </Text>
        </div>

        <div className="space-y-2">
          <Heading as="h2" variant="h5">8. General Terms and Law</Heading>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eligendi quia reiciendis reprehenderit tenetur veritatis! Aut ea excepturi itaque minus nam perferendis
            quibusdam quod, recusandae tempore tenetur? Ab assumenda dolore ducimus fugit, impedit incidunt, inventore iusto labore necessitatibus, nostrum odit omnis provident
            quam quo recusandae ullam ut voluptatibus? Earum, placeat quisquam?
          </Text>
        </div>

        <div>
          <Heading as="h3" variant="h6">
            Last updated: 26 July 2023.
          </Heading>
        </div>
      </div>
    </Container>
  );
}