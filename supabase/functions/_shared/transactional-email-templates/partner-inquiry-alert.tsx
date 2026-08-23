/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface PartnerInquiryAlertProps {
  companyName?: string
  contactName?: string
  contactEmail?: string
  websiteUrl?: string
  placementInterest?: string
  productDescription?: string
  message?: string
  submittedAt?: string
}

const PartnerInquiryAlertEmail = ({
  companyName,
  contactName,
  contactEmail,
  websiteUrl,
  placementInterest,
  productDescription,
  message,
  submittedAt,
}: PartnerInquiryAlertProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>🤝 New partner inquiry from {companyName || 'a supplier'}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>🤝 New partner inquiry</Heading>
        <Text style={text}>
          <strong>Company:</strong> {companyName || '—'}<br />
          <strong>Contact:</strong> {contactName || '—'}<br />
          <strong>Email:</strong> {contactEmail || '—'}<br />
          <strong>Website:</strong> {websiteUrl || '—'}<br />
          <strong>Placement interest:</strong> {placementInterest || '—'}<br />
          <strong>Submitted:</strong> {submittedAt || '—'}
        </Text>

        <Hr style={hr} />

        <Text style={sectionTitle}>Products</Text>
        <Text style={text}>{productDescription || '—'}</Text>

        {message ? (
          <>
            <Text style={sectionTitle}>Additional notes</Text>
            <Text style={text}>{message}</Text>
          </>
        ) : null}

        <Hr style={hr} />
        <Text style={footer}>
          Reply directly to {contactEmail || 'the contact'} to arrange samples and next steps.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: PartnerInquiryAlertEmail,
  subject: (data: Record<string, any>) =>
    `🤝 New partner inquiry — ${data.companyName || 'Unknown company'}`,
  to: 'support@tripplefourshophub.online',
  displayName: 'Partner inquiry alert',
  previewData: {
    companyName: 'Acme Seeds',
    contactName: 'Jane Doe',
    contactEmail: 'jane@acme.com',
    websiteUrl: 'https://acme.com',
    placementInterest: 'banner',
    productDescription: 'Premium CBD gummies and tinctures made in Cape Town.',
    message: 'We can courier samples this week.',
    submittedAt: '23 August 2026, 08:45',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px', maxWidth: '600px', margin: '0 auto' }
const h1 = { color: '#111111', fontSize: '22px', margin: '0 0 12px' }
const text = { color: '#333333', fontSize: '14px', lineHeight: '22px', margin: '6px 0' }
const sectionTitle = {
  color: '#111111',
  fontSize: '13px',
  fontWeight: 700,
  textTransform: 'uppercase' as const,
  margin: '12px 0 4px',
}
const hr = { borderColor: '#eeeeee', margin: '16px 0' }
const footer = { color: '#888888', fontSize: '12px', marginTop: '16px' }
