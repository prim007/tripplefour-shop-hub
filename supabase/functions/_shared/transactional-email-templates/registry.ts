/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'

export interface TemplateEntry {
  component: React.ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  to?: string
  displayName?: string
  previewData?: Record<string, any>
}

import { template as orderConfirmation } from './order-confirmation.tsx'
import { template as adminOrderAlert } from './admin-order-alert.tsx'
import { template as partnerInquiryAlert } from './partner-inquiry-alert.tsx'
import { template as partnerInquiryConfirmation } from './partner-inquiry-confirmation.tsx'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'order-confirmation': orderConfirmation,
  'admin-order-alert': adminOrderAlert,
  'partner-inquiry-alert': partnerInquiryAlert,
  'partner-inquiry-confirmation': partnerInquiryConfirmation,
}
