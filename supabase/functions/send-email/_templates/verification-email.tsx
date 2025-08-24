import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Section,
  Button,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface VerificationEmailProps {
  supabase_url: string
  email_action_type: string
  redirect_to: string
  token_hash: string
  token: string
  user_email: string
}

export const VerificationEmail = ({
  token,
  supabase_url,
  email_action_type,
  redirect_to,
  token_hash,
  user_email,
}: VerificationEmailProps) => (
  <Html>
    <Head />
    <Preview>Verify your email address for Samaj Setu</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoSection}>
          <Heading style={h1}>🏛️ Samaj Setu</Heading>
        </Section>
        
        <Section style={contentSection}>
          <Heading style={h2}>Welcome to Samaj Setu!</Heading>
          <Text style={text}>
            Thank you for joining our community platform. To complete your registration and start connecting with your community, please verify your email address.
          </Text>
          
          <Section style={buttonSection}>
            <Button
              href={`${supabase_url}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`}
              style={button}
            >
              Verify Email Address
            </Button>
          </Section>
          
          <Text style={text}>
            Or copy and paste this verification code if the button doesn't work:
          </Text>
          <Section style={codeSection}>
            <code style={code}>{token}</code>
          </Section>
          
          <Text style={disclaimer}>
            If you didn't create an account with Samaj Setu, you can safely ignore this email.
          </Text>
        </Section>
        
        <Section style={footerSection}>
          <Text style={footer}>
            This email was sent to {user_email} by Samaj Setu Community Platform.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default VerificationEmail

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
}

const logoSection = {
  padding: '32px',
  textAlign: 'center' as const,
}

const contentSection = {
  padding: '0 48px',
}

const buttonSection = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const codeSection = {
  textAlign: 'center' as const,
  margin: '24px 0',
}

const footerSection = {
  padding: '0 48px',
  marginTop: '32px',
}

const h1 = {
  color: '#1a1a1a',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0',
  textAlign: 'center' as const,
}

const h2 = {
  color: '#1a1a1a',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 16px',
}

const text = {
  color: '#484848',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
}

const button = {
  backgroundColor: '#5469d4',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px 24px',
}

const code = {
  display: 'inline-block',
  padding: '16px 24px',
  backgroundColor: '#f4f4f4',
  borderRadius: '6px',
  border: '1px solid #e1e1e1',
  color: '#333',
  fontSize: '18px',
  fontWeight: 'bold',
  letterSpacing: '2px',
}

const disclaimer = {
  color: '#898989',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '24px 0 0',
}

const footer = {
  color: '#898989',
  fontSize: '12px',
  lineHeight: '16px',
  margin: '0',
  textAlign: 'center' as const,
}