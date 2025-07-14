export interface TrackingInfo {
  trackingNumber: string
  carrier: string
  status: string
  statusDescription: string
  events: TrackingEvent[]
  estimatedDelivery?: string
  origin: string
  destination: string
}

export interface TrackingEvent {
  date: string
  time: string
  location: string
  description: string
  status: string
}

export class TrackingService {
  private apiKey: string
  private baseUrl = 'https://api.17track.net/track/v2.2'

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async trackPackage(trackingNumber: string, carrier?: string): Promise<TrackingInfo> {
    try {
      const response = await fetch(`${this.baseUrl}/gettrackinfo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          '17token': this.apiKey,
        },
        body: JSON.stringify([
          {
            number: trackingNumber,
            carrier: carrier || 0, // 0 = auto-detect
          },
        ]),
      })

      if (!response.ok) {
        throw new Error('Failed to track package')
      }

      const data = await response.json()
      const trackInfo = data.data?.accepted?.[0]

      if (!trackInfo) {
        throw new Error('Tracking information not found')
      }

      return this.transformTrackingData(trackInfo)
    } catch (error) {
      console.error('Tracking error:', error)
      throw error
    }
  }

  async trackMultiplePackages(trackingNumbers: string[]): Promise<TrackingInfo[]> {
    try {
      const requests = trackingNumbers.map(number => ({
        number,
        carrier: 0,
      }))

      const response = await fetch(`${this.baseUrl}/gettrackinfo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          '17token': this.apiKey,
        },
        body: JSON.stringify(requests),
      })

      if (!response.ok) {
        throw new Error('Failed to track packages')
      }

      const data = await response.json()
      return data.data?.accepted?.map(this.transformTrackingData) || []
    } catch (error) {
      console.error('Bulk tracking error:', error)
      throw error
    }
  }

  private transformTrackingData(data: any): TrackingInfo {
    const track = data.track
    const events = track?.z0 || []

    return {
      trackingNumber: data.number,
      carrier: this.getCarrierName(track?.w1),
      status: this.getStatusName(track?.e1),
      statusDescription: track?.z1?.[0]?.z || 'No status available',
      events: events.map((event: any) => ({
        date: event.a,
        time: event.b,
        location: event.c,
        description: event.z,
        status: this.getStatusName(event.a1),
      })),
      estimatedDelivery: track?.w2,
      origin: track?.w3,
      destination: track?.w4,
    }
  }

  private getCarrierName(carrierId: number): string {
    const carriers: { [key: number]: string } = {
      1: 'China Post',
      2: 'EMS',
      3: 'DHL',
      4: 'UPS',
      5: 'FedEx',
      6: 'TNT',
      7: 'USPS',
      8: 'La Poste',
      9: 'Royal Mail',
      10: 'Deutsche Post',
      // Add more carriers as needed
    }
    return carriers[carrierId] || 'Unknown Carrier'
  }

  private getStatusName(statusId: number): string {
    const statuses: { [key: number]: string } = {
      0: 'Not Found',
      10: 'In Transit',
      20: 'Expired',
      30: 'Pick Up',
      35: 'Undelivered',
      40: 'Delivered',
      50: 'Alert',
    }
    return statuses[statusId] || 'Unknown Status'
  }
}

// Supabase integration
import { supabase } from '@/lib/supabase'

export const saveTrackingInfo = async (
  userId: string,
  orderId: string,
  trackingInfo: TrackingInfo
) => {
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
      })

    if (error) throw error
  } catch (error) {
    console.error('Failed to save tracking info:', error)
    throw error
  }
}

export const getTrackingHistory = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('order_tracking')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Failed to get tracking history:', error)
    throw error
  }
}