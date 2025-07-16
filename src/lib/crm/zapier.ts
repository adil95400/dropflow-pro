export interface ZapierWebhookData {
  event: string;
  data: Record<string, any>;
  timestamp: string;
  userId: string;
}

export class ZapierIntegration {
  private webhookUrl: string;

  constructor(webhookUrl: string) {
    this.webhookUrl = webhookUrl;
  }

  async triggerWebhook(event: string, data: Record<string, any>, userId: string) {
    try {
      const payload: ZapierWebhookData = {
        event,
        data,
        timestamp: new Date().toISOString(),
        userId,
      };

      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Zapier webhook failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Zapier webhook error:', error);
      throw error;
    }
  }

  // Predefined webhook triggers
  async onNewLead(leadData: any, userId: string) {
    return this.triggerWebhook('new_lead', leadData, userId);
  }

  async onProductImported(productData: any, userId: string) {
    return this.triggerWebhook('product_imported', productData, userId);
  }

  async onOrderReceived(orderData: any, userId: string) {
    return this.triggerWebhook('order_received', orderData, userId);
  }

  async onLowStock(productData: any, userId: string) {
    return this.triggerWebhook('low_stock_alert', productData, userId);
  }

  async onSEOOptimized(productData: any, userId: string) {
    return this.triggerWebhook('seo_optimized', productData, userId);
  }
}

// CRM Lead Management
import { supabase } from '../supabase';

export interface CRMLead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';
  source: string;
  value?: number;
  notes?: string;
  tags: string[];
  lastContact?: string;
  nextFollowUp?: string;
  userId: string;
}

export const createLead = async (leadData: Omit<CRMLead, 'id'>) => {
  try {
    const { data, error } = await supabase
      .from('crm_leads')
      .insert({
        name: leadData.name,
        email: leadData.email,
        phone: leadData.phone,
        company: leadData.company,
        status: leadData.status,
        source: leadData.source,
        value: leadData.value,
        notes: leadData.notes,
        tags: leadData.tags,
        last_contact: leadData.lastContact,
        next_follow_up: leadData.nextFollowUp,
        user_id: leadData.userId,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    // Trigger Zapier webhook if URL is configured
    try {
      const { data: settings } = await supabase
        .from('user_settings')
        .select('zapier_webhook_url')
        .eq('user_id', leadData.userId)
        .single();
      
      if (settings?.zapier_webhook_url) {
        const zapier = new ZapierIntegration(settings.zapier_webhook_url);
        await zapier.onNewLead(data, leadData.userId);
      }
    } catch (webhookError) {
      console.error('Zapier webhook error:', webhookError);
      // Continue even if webhook fails
    }

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company,
      status: data.status,
      source: data.source,
      value: data.value,
      notes: data.notes,
      tags: data.tags,
      lastContact: data.last_contact,
      nextFollowUp: data.next_follow_up,
      userId: data.user_id,
    };
  } catch (error) {
    console.error('Failed to create lead:', error);
    throw error;
  }
};

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
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company,
      status: data.status,
      source: data.source,
      value: data.value,
      notes: data.notes,
      tags: data.tags,
      lastContact: data.last_contact,
      nextFollowUp: data.next_follow_up,
      userId: data.user_id,
    };
  } catch (error) {
    console.error('Failed to update lead status:', error);
    throw error;
  }
};

export const getLeadsByStatus = async (userId: string, status?: CRMLead['status']) => {
  try {
    let query = supabase
      .from('crm_leads')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) throw error;
    
    return data.map(lead => ({
      id: lead.id,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      status: lead.status,
      source: lead.source,
      value: lead.value,
      notes: lead.notes,
      tags: lead.tags,
      lastContact: lead.last_contact,
      nextFollowUp: lead.next_follow_up,
      userId: lead.user_id,
    }));
  } catch (error) {
    console.error('Failed to get leads:', error);
    throw error;
  }
};

export const updateLead = async (
  leadId: string,
  updates: Partial<Omit<CRMLead, 'id' | 'userId'>>,
  userId: string
) => {
  try {
    const { data, error } = await supabase
      .from('crm_leads')
      .update({
        name: updates.name,
        email: updates.email,
        phone: updates.phone,
        company: updates.company,
        status: updates.status,
        source: updates.source,
        value: updates.value,
        notes: updates.notes,
        tags: updates.tags,
        last_contact: updates.lastContact,
        next_follow_up: updates.nextFollowUp,
        updated_at: new Date().toISOString(),
      })
      .eq('id', leadId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company,
      status: data.status,
      source: data.source,
      value: data.value,
      notes: data.notes,
      tags: data.tags,
      lastContact: data.last_contact,
      nextFollowUp: data.next_follow_up,
      userId: data.user_id,
    };
  } catch (error) {
    console.error('Failed to update lead:', error);
    throw error;
  }
};

export const deleteLead = async (leadId: string, userId: string) => {
  try {
    const { error } = await supabase
      .from('crm_leads')
      .delete()
      .eq('id', leadId)
      .eq('user_id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Failed to delete lead:', error);
    throw error;
  }
};

export const getCRMStats = async (userId: string) => {
  try {
    // Get lead counts by status
    const { data: counts, error: countsError } = await supabase
      .from('crm_leads')
      .select('status, count')
      .eq('user_id', userId)
      .group('status');

    if (countsError) throw countsError;
    
    // Get total value
    const { data: valueData, error: valueError } = await supabase
      .from('crm_leads')
      .select('sum')
      .eq('user_id', userId)
      .eq('status', 'won')
      .single();

    if (valueError && valueError.code !== 'PGRST116') throw valueError;
    
    // Calculate stats
    const total = counts?.reduce((sum, item) => sum + item.count, 0) || 0;
    const new_leads = counts?.find(c => c.status === 'new')?.count || 0;
    const contacted = counts?.find(c => c.status === 'contacted')?.count || 0;
    const qualified = counts?.find(c => c.status === 'qualified')?.count || 0;
    const proposal = counts?.find(c => c.status === 'proposal')?.count || 0;
    const won = counts?.find(c => c.status === 'won')?.count || 0;
    const lost = counts?.find(c => c.status === 'lost')?.count || 0;
    
    const conversionRate = total > 0 ? (won / total) * 100 : 0;
    const totalValue = valueData?.sum || 0;
    
    return {
      total,
      new: new_leads,
      contacted,
      qualified,
      proposal,
      won,
      lost,
      conversionRate,
      totalValue,
    };
  } catch (error) {
    console.error('Failed to get CRM stats:', error);
    throw error;
  }
};