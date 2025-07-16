import { supabase } from '../supabase';

export interface TrackingInfo {
  trackingNumber: string;
  carrier: string;
  status: string;
  statusDescription: string;
  events: TrackingEvent[];
  estimatedDelivery?: string;
  origin: string;
  destination: string;
}

export interface TrackingEvent {
  date: string;
  time: string;
  location: string;
  description: string;
  status: string;
}

export class TrackingService {
  private apiKey: string;
  private baseUrl = 'https://api.17track.net/track/v2.2';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async trackPackage(trackingNumber: string, carrier?: string): Promise<TrackingInfo> {
    try {
      // In production, this would make an API call to 17track
      // For now, we'll use a mock implementation
      return this.mockTrackingInfo(trackingNumber, carrier);
    } catch (error) {
      console.error('Tracking error:', error);
      throw error;
    }
  }

  async trackMultiplePackages(trackingNumbers: string[]): Promise<TrackingInfo[]> {
    try {
      // In production, this would make an API call to 17track
      // For now, we'll use a mock implementation
      return Promise.all(trackingNumbers.map(number => this.mockTrackingInfo(number)));
    } catch (error) {
      console.error('Bulk tracking error:', error);
      throw error;
    }
  }

  private async mockTrackingInfo(trackingNumber: string, carrier?: string): Promise<TrackingInfo> {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate consistent mock data based on tracking number
    const hash = this.hashCode(trackingNumber);
    const statusIndex = Math.abs(hash) % 6;
    const statuses = ['not_found', 'in_transit', 'expired', 'pick_up', 'undelivered', 'delivered'];
    const status = statuses[statusIndex];
    
    // Generate events based on status
    const events = this.generateMockEvents(status, trackingNumber);
    
    return {
      trackingNumber,
      carrier: carrier || this.getMockCarrier(trackingNumber),
      status,
      statusDescription: this.getStatusDescription(status),
      events,
      estimatedDelivery: status === 'delivered' ? undefined : this.getMockEstimatedDelivery(hash),
      origin: this.getMockCountry(hash % 10),
      destination: this.getMockCountry((hash + 5) % 10),
    };
  }

  private generateMockEvents(status: string, trackingNumber: string): TrackingEvent[] {
    const hash = this.hashCode(trackingNumber);
    const events: TrackingEvent[] = [];
    
    // Always add shipment created event
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() - 10); // Start 10 days ago
    
    events.push({
      date: this.formatDate(baseDate),
      time: '08:30',
      location: this.getMockCountry(hash % 10),
      description: 'Shipment information received',
      status: 'info',
    });
    
    // Add picked up event
    baseDate.setDate(baseDate.getDate() + 1);
    events.push({
      date: this.formatDate(baseDate),
      time: '10:15',
      location: this.getMockCountry(hash % 10),
      description: 'Shipment picked up',
      status: 'pick_up',
    });
    
    // Add in transit events
    if (['in_transit', 'undelivered', 'delivered'].includes(status)) {
      baseDate.setDate(baseDate.getDate() + 2);
      events.push({
        date: this.formatDate(baseDate),
        time: '14:22',
        location: this.getMockCountry(hash % 10),
        description: 'Departed from origin facility',
        status: 'in_transit',
      });
      
      baseDate.setDate(baseDate.getDate() + 3);
      events.push({
        date: this.formatDate(baseDate),
        time: '09:45',
        location: this.getMockCountry((hash + 3) % 10),
        description: 'Arrived at transit facility',
        status: 'in_transit',
      });
      
      baseDate.setDate(baseDate.getDate() + 1);
      events.push({
        date: this.formatDate(baseDate),
        time: '16:30',
        location: this.getMockCountry((hash + 3) % 10),
        description: 'Departed from transit facility',
        status: 'in_transit',
      });
    }
    
    // Add out for delivery event
    if (['undelivered', 'delivered'].includes(status)) {
      baseDate.setDate(baseDate.getDate() + 2);
      events.push({
        date: this.formatDate(baseDate),
        time: '08:15',
        location: this.getMockCountry((hash + 5) % 10),
        description: 'Out for delivery',
        status: 'out_for_delivery',
      });
    }
    
    // Add final event based on status
    baseDate.setDate(baseDate.getDate() + 1);
    if (status === 'delivered') {
      events.push({
        date: this.formatDate(baseDate),
        time: '14:30',
        location: this.getMockCountry((hash + 5) % 10),
        description: 'Delivered to recipient',
        status: 'delivered',
      });
    } else if (status === 'undelivered') {
      events.push({
        date: this.formatDate(baseDate),
        time: '14:30',
        location: this.getMockCountry((hash + 5) % 10),
        description: 'Delivery attempted - recipient not available',
        status: 'undelivered',
      });
    } else if (status === 'expired') {
      events.push({
        date: this.formatDate(baseDate),
        time: '23:59',
        location: this.getMockCountry((hash + 5) % 10),
        description: 'Tracking information expired',
        status: 'expired',
      });
    }
    
    // Reverse events to have most recent first
    return events.reverse();
  }

  private getMockCarrier(trackingNumber: string): string {
    const hash = this.hashCode(trackingNumber);
    const carriers = [
      'DHL', 'FedEx', 'UPS', 'USPS', 'China Post', 
      'Colissimo', 'Chronopost', 'La Poste', 'Royal Mail', 'PostNL'
    ];
    return carriers[Math.abs(hash) % carriers.length];
  }

  private getMockCountry(index: number): string {
    const countries = [
      'China', 'United States', 'France', 'Germany', 'United Kingdom',
      'Netherlands', 'Spain', 'Italy', 'Canada', 'Australia'
    ];
    return countries[index];
  }

  private getMockEstimatedDelivery(hash: number): string {
    const date = new Date();
    date.setDate(date.getDate() + (Math.abs(hash) % 10) + 3); // 3-13 days from now
    return this.formatDate(date);
  }

  private getStatusDescription(status: string): string {
    const descriptions: Record<string, string> = {
      'not_found': 'Tracking information not found',
      'in_transit': 'Shipment in transit',
      'expired': 'Tracking information expired',
      'pick_up': 'Shipment picked up',
      'undelivered': 'Delivery attempted',
      'delivered': 'Shipment delivered',
    };
    return descriptions[status] || 'Unknown status';
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }
}

// Database functions
export const saveTrackingInfo = async (
  userId: string,
  orderId: string,
  trackingInfo: TrackingInfo
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('order_tracking')
      .upsert({
        user_id: userId,
        order_id: orderId,
        tracking_number: trackingInfo.trackingNumber,
        carrier: trackingInfo.carrier,
        status: trackingInfo.status,
        status_description: trackingInfo.statusDescription,
        events: trackingInfo.events,
        estimated_delivery: trackingInfo.estimatedDelivery,
        origin: trackingInfo.origin,
        destination: trackingInfo.destination,
        updated_at: new Date().toISOString(),
      });

    if (error) throw error;
  } catch (error) {
    console.error('Failed to save tracking info:', error);
    throw error;
  }
};

export const getTrackingHistory = async (userId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('order_tracking')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Failed to get tracking history:', error);
    throw error;
  }
};

export const getOrderTracking = async (
  userId: string,
  orderId: string
): Promise<TrackingInfo | null> => {
  try {
    const { data, error } = await supabase
      .from('order_tracking')
      .select('*')
      .eq('user_id', userId)
      .eq('order_id', orderId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No tracking info found
      }
      throw error;
    }
    
    return {
      trackingNumber: data.tracking_number,
      carrier: data.carrier,
      status: data.status,
      statusDescription: data.status_description,
      events: data.events,
      estimatedDelivery: data.estimated_delivery,
      origin: data.origin,
      destination: data.destination,
    };
  } catch (error) {
    console.error('Failed to get order tracking:', error);
    throw error;
  }
};

export const updateOrderTrackingStatus = async (
  userId: string,
  trackingNumber: string
): Promise<TrackingInfo> => {
  try {
    // Get API key from user settings
    const { data: settings, error: settingsError } = await supabase
      .from('user_settings')
      .select('tracking_api_key')
      .eq('user_id', userId)
      .single();

    if (settingsError) throw settingsError;
    
    const apiKey = settings?.tracking_api_key || process.env.VITE_17TRACK_API_KEY || 'mock-api-key';
    const trackingService = new TrackingService(apiKey);
    
    // Get updated tracking info
    const trackingInfo = await trackingService.trackPackage(trackingNumber);
    
    // Find order with this tracking number
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id')
      .eq('user_id', userId)
      .eq('tracking_number', trackingNumber)
      .single();

    if (orderError) throw orderError;
    
    // Save updated tracking info
    await saveTrackingInfo(userId, order.id, trackingInfo);
    
    // Update order status based on tracking status
    await supabase
      .from('orders')
      .update({
        status: mapTrackingStatusToOrderStatus(trackingInfo.status),
        updated_at: new Date().toISOString(),
      })
      .eq('id', order.id);
    
    return trackingInfo;
  } catch (error) {
    console.error('Failed to update order tracking status:', error);
    throw error;
  }
};

// Helper function to map tracking status to order status
const mapTrackingStatusToOrderStatus = (trackingStatus: string): string => {
  switch (trackingStatus) {
    case 'delivered':
      return 'delivered';
    case 'in_transit':
      return 'in_transit';
    case 'pick_up':
      return 'shipped';
    case 'out_for_delivery':
      return 'out_for_delivery';
    case 'undelivered':
      return 'exception';
    case 'expired':
      return 'exception';
    default:
      return 'processing';
  }
};