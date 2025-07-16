export interface ZapierWebhookData {
  event: string
  data: Record<string, any>
  timestamp: string
  userId: string
}

export class ZapierIntegration {
  private webhookUrl: string

  constructor(webhookUrl: string) {
    this.webhookUrl = webhookUrl
  }

  async triggerWebhook(event: string, data: Record<string, any>, userId: string) {
    try {
      const payload: ZapierWebhookData = {
        event,
        data,
        timestamp: new Date().toISOString(),
        userId,
      }

      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`Zapier webhook failed: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Zapier webhook error:', error)
      throw error
    }
  }

  // Predefined webhook triggers
  async onNewLead(leadData: any, userId: string) {
    return this.triggerWebhook('new_lead', leadData, userId)
  }

  async onProductImported(productData: any, userId: string) {
    return this.triggerWebhook('product_imported', productData, userId)
  }

  async onOrderReceived(orderData: any, userId: string) {
    return this.triggerWebhook('order_received', orderData, userId)
  }

  async onLowStock(productData: any, userId: string) {
    return this.triggerWebhook('low_stock_alert', productData, userId)
  }

  async onSEOOptimized(productData: any, userId: string) {
    return this.triggerWebhook('seo_optimized', productData, userId)
  }
}

// CRM Lead Management
import { supabase } from '@/lib/supabase'

export interface CRMLead {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost'
  source: string
  value?: number
  notes?: string
  tags: string[]
  lastContact?: string
  nextFollowUp?: string
  userId: string
}

export const createLead = async (leadData: Omit<CRMLead, 'id'>) => {
  try {
    const { data, error } = await supabase
      .from('crm_leads')
      .insert(leadData)
      .select()
      .single()

    if (error) throw error

    // Trigger Zapier webhook
    const zapier = new ZapierIntegration(process.env.ZAPIER_WEBHOOK_URL!)
    await zapier.onNewLead(data, leadData.userId)

    return data
  } catch (error) {
    console.error('Failed to create lead:', error)
    throw error
  }
}

export const updateLeadStatus = async (
  leadId: string,
  status: CRMLead['status'],
  userId: string
) => {
  try {
    const { data, error } = await supabase
      .from('crm_leads')
      .update({ 
        status,
        last_contact: new Date().toISOString(),
      })
      .eq('id', leadId)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error

    return data
  } catch (error) {
    console.error('Failed to update lead status:', error)
    throw error
  }
}

export const getLeadsByStatus = async (userId: string, status?: CRMLead['status']) => {
  try {
    let query = supabase
      .from('crm_leads')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) throw error
    return data
  } catch (error) {
    console.error('Failed to get leads:', error)
    throw error
  }
}