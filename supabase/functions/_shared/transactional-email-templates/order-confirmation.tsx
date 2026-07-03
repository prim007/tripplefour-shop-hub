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
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Tripplefour'

interface OrderItem {
  name: string
  quantity: number
  price: number
}

interface OrderConfirmationProps {
  customerName?: string
  orderRef?: string
  items?: OrderItem[]
  subtotal?: number
  deliveryFee?: number
  discount?: number
  total?: number
  deliveryZone?: string
}

const OrderConfirmationEmail = ({
  customerName,
  orderRef,
  items,
  subtotal,
  deliveryFee,
  discount,
  total,
  deliveryZone,
}: OrderConfirmationProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Order {orderRef || '#'} confirmed — Tripplefour 🌿</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>
          {customerName ? `Thanks, ${customerName}!` : 'Order Confirmed!'} 🌿
        </Heading>
        <Text style={text}>
          We've received your order{orderRef ? ` (${orderRef})` : ''} and it's being prepared for dispatch.
        </Text>

        {items && items.length > 0 && (
          <Section style={itemsSection}>
            <Text style={sectionTitle}>Order Items</Text>
            {items.map((item, i) => (
              <Text key={i} style={itemRow}>
                {item.quantity}× {item.name} — R{(item.price * item.quantity).toLocaleString()}
              </Text>
            ))}
          </Section>
        )}

        <Hr style={hr} />

        <Section style={summarySection}>
          {subtotal !== undefined && (
            <Text style={summaryRow}>Subtotal: R{subtotal.toLocaleString()}</Text>
          )}
          {discount !== undefined && discount > 0 && (
            <Text style={{ ...summaryRow, color: '#257a3e' }}>Discount: -R{discount.toLocaleString()}</Text>
          )}
          {deliveryFee !== undefined && (
            <Text style={summaryRow}>
              Delivery{deliveryZone ? ` (${deliveryZone})` : ''}: R{deliveryFee.toLocaleString()}
            </Text>
          )}
          {total !== undefined && (
            <Text style={totalRow}>Total: R{total.toLocaleString()}</Text>
          )}
        </Section>

        <Hr style={hr} />

        <Text style={text}>
          Please make your EFT payment using the banking details provided at checkout.
          Use <strong>{orderRef}</strong> as your payment reference.
        </Text>

        <Text style={text}>
          Once payment is confirmed, expect delivery within <strong>24–48 hours</strong>.
        </Text>

        <Button
          style={button}
          href={`https://wa.me/27645436734?text=${encodeURIComponent(`Hi, I just placed order ${orderRef || ''} and made payment`)}`}
        >
          Notify us on WhatsApp
        </Button>

        <Text style={footer}>
          Questions? Reply to this email or WhatsApp us at +27 64 543 6734.
        </Text>
        <Text style={footer}>
          — The {SITE_NAME} Team
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: OrderConfirmationEmail,
  subject: (data: Record<string, any>) =>
    `Order ${data.orderRef || ''} confirmed — Tripplefour`,
  displayName: 'Order confirmation',
  previewData: {
    customerName: 'Jane',
    orderRef: 'TF-ABC123',
    items: [
      { name: 'Indoor Dust', quantity: 2, price: 80 },
      { name: 'Edible Cubes', quantity: 1, price: 60 },
    ],
    subtotal: 220,
    discount: 22,
    deliveryFee: 50,
    total: 248,
    deliveryZone: 'Joburg CBD',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif', margin: 0, padding: 0 }
const container = { maxWidth: '560px', margin: '0 auto', padding: '24px' }
const h1 = { fontSize: '24px', fontWeight: 700, color: '#1a1a1a', margin: '0 0 16px' }
const text = { fontSize: '15px', lineHeight: '22px', color: '#333333', margin: '0 0 12px' }
const sectionTitle = { fontSize: '14px', fontWeight: 700, color: '#1a1a1a', margin: '0 0 8px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }
const itemsSection = { padding: '12px 0' }
const itemRow = { fontSize: '14px', color: '#333333', margin: '4px 0' }
const summarySection = { padding: '8px 0' }
const summaryRow = { fontSize: '14px', color: '#333333', margin: '4px 0' }
const totalRow = { fontSize: '16px', fontWeight: 700, color: '#1a1a1a', margin: '8px 0 0' }
const hr = { borderColor: '#e6e6e6', margin: '20px 0' }
const button = { backgroundColor: '#25D366', color: '#ffffff', padding: '12px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, display: 'inline-block', margin: '12px 0' }
const footer = { fontSize: '13px', color: '#666666', margin: '8px 0' }
