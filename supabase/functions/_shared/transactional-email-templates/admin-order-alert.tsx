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
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface OrderItem {
  name: string
  quantity: number
  price: number
}

interface AdminOrderAlertProps {
  orderRef?: string
  source?: string
  paymentMethod?: string
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  deliveryAddress?: string
  deliveryZone?: string
  items?: OrderItem[]
  subtotal?: number
  deliveryFee?: number
  total?: number
}

const AdminOrderAlertEmail = ({
  orderRef,
  source,
  paymentMethod,
  customerName,
  customerEmail,
  customerPhone,
  deliveryAddress,
  deliveryZone,
  items,
  subtotal,
  deliveryFee,
  total,
}: AdminOrderAlertProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>🛒 New order {orderRef || ''} — R{total ?? ''}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>🛒 New order received</Heading>
        <Text style={text}>
          <strong>Reference:</strong> {orderRef || '—'}<br />
          <strong>Source:</strong> {source || 'Tripplefour'}<br />
          <strong>Payment method:</strong> {paymentMethod || '—'}
        </Text>

        <Hr style={hr} />

        <Section>
          <Text style={sectionTitle}>Customer</Text>
          <Text style={text}>
            {customerName || '—'}<br />
            {customerEmail || ''}<br />
            {customerPhone || ''}
          </Text>
          {deliveryAddress && (
            <Text style={text}>
              <strong>Deliver to{deliveryZone ? ` (${deliveryZone})` : ''}:</strong><br />
              {deliveryAddress}
            </Text>
          )}
        </Section>

        {items && items.length > 0 && (
          <Section>
            <Text style={sectionTitle}>Items</Text>
            {items.map((item, i) => (
              <Text key={i} style={itemRow}>
                {item.quantity}× {item.name} — R{(item.price * item.quantity).toLocaleString()}
              </Text>
            ))}
          </Section>
        )}

        <Hr style={hr} />

        <Section>
          {subtotal !== undefined && <Text style={text}>Subtotal: R{subtotal.toLocaleString()}</Text>}
          {deliveryFee !== undefined && <Text style={text}>Delivery: R{deliveryFee.toLocaleString()}</Text>}
          {total !== undefined && <Text style={totalRow}>Total: R{total.toLocaleString()}</Text>}
        </Section>

        <Text style={footer}>
          Open the admin dashboard to confirm payment and dispatch this order.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: AdminOrderAlertEmail,
  subject: (data: Record<string, any>) =>
    `🛒 New order ${data.orderRef || ''} — R${data.total ?? ''}`,
  to: 'tripple4442@gmail.com',
  displayName: 'Admin order alert',
  previewData: {
    orderRef: 'TF-ABC123',
    source: 'Tripplefour Shop',
    paymentMethod: 'eft',
    customerName: 'Jane Doe',
    customerEmail: 'jane@example.com',
    customerPhone: '+27 64 000 0000',
    deliveryAddress: '123 Test Rd, Joburg',
    deliveryZone: 'Joburg CBD',
    items: [
      { name: 'Indoor Dust', quantity: 2, price: 80 },
      { name: 'Edible Cubes', quantity: 1, price: 60 },
    ],
    subtotal: 220,
    deliveryFee: 50,
    total: 270,
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px', maxWidth: '600px', margin: '0 auto' }
const h1 = { color: '#111111', fontSize: '22px', margin: '0 0 12px' }
const text = { color: '#333333', fontSize: '14px', lineHeight: '22px', margin: '6px 0' }
const sectionTitle = { color: '#111111', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase' as const, margin: '12px 0 4px' }
const itemRow = { color: '#333333', fontSize: '14px', margin: '2px 0' }
const totalRow = { color: '#111111', fontSize: '16px', fontWeight: 700, margin: '8px 0' }
const hr = { borderColor: '#eeeeee', margin: '16px 0' }
const footer = { color: '#888888', fontSize: '12px', marginTop: '16px' }