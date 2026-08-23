/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface PartnerInquiryConfirmationProps {
  contactName?: string
  companyName?: string
  placementInterest?: string
}

const PartnerInquiryConfirmationEmail = ({
  contactName,
  companyName,
  placementInterest,
}: PartnerInquiryConfirmationProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>We received your Tripplefour partner inquiry</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>444 · TRIPPLEFOUR</Text>
        <Heading style={h1}>Thanks for reaching out{contactName ? `, ${contactName}` : ''}</Heading>

        <Text style={text}>
          We've received the partner inquiry{companyName ? ` for ${companyName}` : ''} and our team
          will review it within 48 hours.
        </Text>

        <Text style={sectionTitle}>What happens next</Text>
        <Text style={text}>
          1. We review your product range and fit for our audience.<br />
          2. If it's a match, we ask you to courier samples of the exact products you'd like listed.<br />
          3. Once approved, we build your dedicated partner page with direct WhatsApp ordering.
        </Text>

        {placementInterest ? (
          <Text style={text}>
            <strong>Placement you selected:</strong> {placementInterest}
          </Text>
        ) : null}

        <Button style={button} href="https://tripplefourshophub.online/partners">
          View partner details
        </Button>

        <Hr style={hr} />
        <Text style={footer}>
          Questions? Reply to this email or contact support@tripplefourshophub.online.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: PartnerInquiryConfirmationEmail,
  subject: 'We received your Tripplefour partner inquiry',
  displayName: 'Partner inquiry confirmation',
  previewData: {
    contactName: 'Jane',
    companyName: 'Acme Seeds',
    placementInterest: 'banner',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px', maxWidth: '600px', margin: '0 auto' }
const brand = {
  color: '#B8860B',
  fontSize: '12px',
  letterSpacing: '3px',
  fontWeight: 700,
  margin: '0 0 16px',
}
const h1 = { color: '#111111', fontSize: '22px', margin: '0 0 12px' }
const text = { color: '#333333', fontSize: '14px', lineHeight: '22px', margin: '8px 0' }
const sectionTitle = {
  color: '#111111',
  fontSize: '13px',
  fontWeight: 700,
  textTransform: 'uppercase' as const,
  margin: '16px 0 4px',
}
const button = {
  backgroundColor: '#B8860B',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: 700,
  padding: '12px 22px',
  borderRadius: '6px',
  textDecoration: 'none',
  display: 'inline-block',
  margin: '18px 0 4px',
}
const hr = { borderColor: '#eeeeee', margin: '20px 0' }
const footer = { color: '#888888', fontSize: '12px', marginTop: '8px' }
