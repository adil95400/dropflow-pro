import Stripe from 'stripe'
import { supabase } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export interface SubscriptionPlan {
  id: string
  name: string
  price: number
  interval: 'month' | 'year'
  features: string[]
  stripePriceId: string
}

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 29,
    interval: 'month',
    stripePriceId: 'price_starter_monthly',
    features: [
      '1,000 produits importés/mois',
      '5 boutiques connectées',
      'SEO IA basique',
      'Tracking standard',
      'Support email',
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 79,
    interval: 'month',
    stripePriceId: 'price_professional_monthly',
    features: [
      '10,000 produits importés/mois',
      'Boutiques illimitées',
      'SEO IA avancée + traduction',
      'Tracking premium + analytics',
      'CRM intégré',
      'Support prioritaire',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 199,
    interval: 'month',
    stripePriceId: 'price_enterprise_monthly',
    features: [
      'Produits illimités',
      'Multi-utilisateurs',
      'IA personnalisée',
      'API complète',
      'Marketplace B2B privée',
      'Support dédié 24/7',
    ],
  },
]

export const createCheckoutSession = async (
  userId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
) => {
  try {
    // Get or create Stripe customer
    let { data: customer } = await supabase
      .from('stripe_customers')
      .select('customer_id')
      .eq('user_id', userId)
      .single()

    if (!customer) {
      // Get user email
      const { data: user } = await supabase
        .from('users')
        .select('email')
        .eq('id', userId)
        .single()

      if (!user) throw new Error('User not found')

      // Create Stripe customer
      const stripeCustomer = await stripe.customers.create({
        email: user.email,
        metadata: { userId },
      })

      // Save customer to database
      await supabase.from('stripe_customers').insert({
        user_id: userId,
        customer_id: stripeCustomer.id,
      })

      customer = { customer_id: stripeCustomer.id }
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.customer_id,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId,
      },
    })

    return session
  } catch (error) {
    console.error('Stripe checkout error:', error)
    throw error
  }
}

export const createPortalSession = async (userId: string, returnUrl: string) => {
  try {
    const { data: customer } = await supabase
      .from('stripe_customers')
      .select('customer_id')
      .eq('user_id', userId)
      .single()

    if (!customer) {
      throw new Error('No Stripe customer found')
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customer.customer_id,
      return_url: returnUrl,
    })

    return session
  } catch (error) {
    console.error('Stripe portal error:', error)
    throw error
  }
}

export const handleWebhook = async (body: string, signature: string) => {
  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice)
        break
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break
    }

    return { received: true }
  } catch (error) {
    console.error('Webhook error:', error)
    throw error
  }
}

const handleCheckoutCompleted = async (session: Stripe.Checkout.Session) => {
  const userId = session.metadata?.userId
  if (!userId) return

  const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
  
  await supabase.from('stripe_subscriptions').upsert({
    customer_id: session.customer as string,
    subscription_id: subscription.id,
    price_id: subscription.items.data[0].price.id,
    status: subscription.status,
    current_period_start: subscription.current_period_start,
    current_period_end: subscription.current_period_end,
    cancel_at_period_end: subscription.cancel_at_period_end,
  })
}

const handlePaymentSucceeded = async (invoice: Stripe.Invoice) => {
  // Update subscription status
  if (invoice.subscription) {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string)
    
    await supabase
      .from('stripe_subscriptions')
      .update({
        status: subscription.status,
        current_period_start: subscription.current_period_start,
        current_period_end: subscription.current_period_end,
      })
      .eq('subscription_id', subscription.id)
  }
}

const handleSubscriptionUpdated = async (subscription: Stripe.Subscription) => {
  await supabase
    .from('stripe_subscriptions')
    .update({
      status: subscription.status,
      price_id: subscription.items.data[0].price.id,
      current_period_start: subscription.current_period_start,
      current_period_end: subscription.current_period_end,
      cancel_at_period_end: subscription.cancel_at_period_end,
    })
    .eq('subscription_id', subscription.id)
}

const handleSubscriptionDeleted = async (subscription: Stripe.Subscription) => {
  await supabase
    .from('stripe_subscriptions')
    .update({
      status: 'canceled',
      canceled_at: new Date().toISOString(),
    })
    .eq('subscription_id', subscription.id)
}