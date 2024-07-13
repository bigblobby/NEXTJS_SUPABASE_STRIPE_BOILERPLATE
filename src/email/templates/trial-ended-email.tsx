import { Button, Html, Body, Container, Text } from "@react-email/components";
import { getURL } from '@/lib/utils/helpers';

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #f0f0f0",
  padding: "45px",
};

export function TrialEndedEmail() {
  return (
    <Html lang="en">
      <Body>
        <Container style={container}>
          <Text>Trial ended test email</Text>

          <Button href={`${getURL()}/dashboard/settings`}></Button>
        </Container>
      </Body>
    </Html>
  );
}

export default TrialEndedEmail;