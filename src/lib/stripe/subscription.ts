import Stripe from 'stripe';
import { supabase } from '../supabase';

const stripeSecretKey = import.meta.env.VITE_STRIPE_SECRET_KEY || 'sk_test_mock';
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2023-10-16',
});

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  stripePriceId: string;
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
];

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
      .single();

    if (!customer) {
      // Get user email
      const { data: user } = await supabase
        .from('users')
        .select('email')
        .eq('id', userId)
        .single();

      if (!user) throw new Error('User not found');

      // Create Stripe customer
      const stripeCustomer = await stripe.customers.create({
        email: user.email,
        metadata: { userId },
      });

      // Save customer to database
      await supabase.from('stripe_customers').insert({
        user_id: userId,
        customer_id: stripeCustomer.id,
      });

      customer = { customer_id: stripeCustomer.id };
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
    });

    return session;
  } catch (error) {
    console.error('Stripe checkout error:', error);
    throw error;
  }
};

export const createPortalSession = async (userId: string, returnUrl: string) => {
  try {
    const { data: customer } = await supabase
      .from('stripe_customers')
      .select('customer_id')
      .eq('user_id', userId)
      .single();

    if (!customer) {
      throw new Error('No Stripe customer found');
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customer.customer_id,
      return_url: returnUrl,
    });

    return session;
  } catch (error) {
    console.error('Stripe portal error:', error);
    throw error;
  }
};

export const handleWebhook = async (body: string, signature: string) => {
  try {
    const webhookSecret = import.meta.env.VITE_STRIPE_WEBHOOK_SECRET || '';
    
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
    }

    return { received: true };
  } catch (error) {
    console.error('Webhook error:', error);
    throw error;
  }
};

const handleCheckoutCompleted = async (session: Stripe.Checkout.Session) => {
  const userId = session.metadata?.userId;
  if (!userId) return;

  const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
  
  await supabase.from('stripe_subscriptions').upsert({
    customer_id: session.customer as string,
    subscription_id: subscription.id,
    price_id: subscription.items.data[0].price.id,
    status: subscription.status,
    current_period_start: subscription.current_period_start,
    current_period_end: subscription.current_period_end,
    cancel_at_period_end: subscription.cancel_at_period_end,
  });
  
  // Also update the subscriptions table for our app
  await supabase.from('subscriptions').upsert({
    user_id: userId,
    stripe_customer_id: session.customer as string,
    stripe_subscription_id: subscription.id,
    plan: getPlanFromPriceId(subscription.items.data[0].price.id),
    status: subscription.status,
    price_id: subscription.items.data[0].price.id,
    current_period_end: subscription.current_period_end,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
};

const handlePaymentSucceeded = async (invoice: Stripe.Invoice) => {
  // Update subscription status
  if (invoice.subscription) {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
    
    await supabase
      .from('stripe_subscriptions')
      .update({
        status: subscription.status,
        current_period_start: subscription.current_period_start,
        current_period_end: subscription.current_period_end,
      })
      .eq('subscription_id', subscription.id);
    
    // Also update our subscriptions table
    const { data: subData } = await supabase
      .from('subscriptions')
      .select('user_id')
      .eq('stripe_subscription_id', subscription.id)
      .single();
    
    if (subData) {
      await supabase
        .from('subscriptions')
        .update({
          status: subscription.status,
          current_period_end: subscription.current_period_end,
          updated_at: new Date().toISOString(),
        })
        .eq('stripe_subscription_id', subscription.id);
    }
    
    // Save invoice
    await supabase.from('invoices').insert({
      user_id: subData?.user_id,
      stripe_invoice_id: invoice.id,
      number: invoice.number || '',
      amount: invoice.amount_paid / 100, // Convert from cents
      status: invoice.status,
      date: new Date(invoice.created * 1000).toISOString(),
      pdf_url: invoice.invoice_pdf || '',
    });
  }
};

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
    .eq('subscription_id', subscription.id);
  
  // Also update our subscriptions table
  const { data: subData } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_subscription_id', subscription.id)
    .single();
  
  if (subData) {
    await supabase
      .from('subscriptions')
      .update({
        plan: getPlanFromPriceId(subscription.items.data[0].price.id),
        status: subscription.status,
        price_id: subscription.items.data[0].price.id,
        current_period_end: subscription.current_period_end,
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_subscription_id', subscription.id);
  }
};

const handleSubscriptionDeleted = async (subscription: Stripe.Subscription) => {
  await supabase
    .from('stripe_subscriptions')
    .update({
      status: 'canceled',
      canceled_at: new Date().toISOString(),
    })
    .eq('subscription_id', subscription.id);
  
  // Also update our subscriptions table
  await supabase
    .from('subscriptions')
    .update({
      status: 'canceled',
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id);
};

// Helper function to get plan from price ID
const getPlanFromPriceId = (priceId: string): string => {
  if (priceId.includes('starter')) return 'starter';
  if (priceId.includes('professional')) return 'professional';
  if (priceId.includes('enterprise')) return 'enterprise';
  return 'starter'; // Default
};

// Customer management
export const getCustomerSubscription = async (userId: string) => {
  try {
    // Get subscription from our database
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No subscription found
      }
      throw error;
    }
    
    // Get payment method if subscription exists
    if (subscription && subscription.stripe_customer_id) {
      try {
        const paymentMethods = await stripe.paymentMethods.list({
          customer: subscription.stripe_customer_id,
          type: 'card',
        });
        
        if (paymentMethods.data.length > 0) {
          const card = paymentMethods.data[0].card;
          
          return {
            ...subscription,
            paymentMethod: {
              brand: card?.brand || 'unknown',
              last4: card?.last4 || '****',
              expMonth: card?.exp_month,
              expYear: card?.exp_year,
            },
          };
        }
      } catch (pmError) {
        console.error('Error fetching payment method:', pmError);
        // Continue without payment method
      }
    }
    
    return subscription;
  } catch (error) {
    console.error('Failed to get customer subscription:', error);
    throw error;
  }
};

export const cancelSubscription = async (userId: string) => {
  try {
    // Get subscription from our database
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('stripe_subscription_id')
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    if (!subscription?.stripe_subscription_id) {
      throw new Error('No active subscription found');
    }
    
    // Cancel at period end
    await stripe.subscriptions.update(subscription.stripe_subscription_id, {
      cancel_at_period_end: true,
    });
    
    // Update our database
    await supabase
      .from('subscriptions')
      .update({
        cancel_at_period_end: true,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);
    
    return { success: true };
  } catch (error) {
    console.error('Failed to cancel subscription:', error);
    throw error;
  }
};

export const resumeSubscription = async (userId: string) => {
  try {
    // Get subscription from our database
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('stripe_subscription_id')
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    if (!subscription?.stripe_subscription_id) {
      throw new Error('No active subscription found');
    }
    
    // Resume subscription
    await stripe.subscriptions.update(subscription.stripe_subscription_id, {
      cancel_at_period_end: false,
    });
    
    // Update our database
    await supabase
      .from('subscriptions')
      .update({
        cancel_at_period_end: false,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);
    
    return { success: true };
  } catch (error) {
    console.error('Failed to resume subscription:', error);
    throw error;
  }
};

export const changeSubscriptionPlan = async (userId: string, newPlanId: string) => {
  try {
    // Get subscription from our database
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('stripe_subscription_id')
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    
    // Find the new plan
    const newPlan = subscriptionPlans.find(plan => plan.id === newPlanId);
    if (!newPlan) {
      throw new Error('Invalid plan ID');
    }
    
    if (!subscription?.stripe_subscription_id) {
      // No existing subscription, create a new checkout session
      const session = await createCheckoutSession(
        userId,
        newPlan.stripePriceId,
        `${window.location.origin}/billing?success=true`,
        `${window.location.origin}/billing?canceled=true`
      );
      
      return { sessionId: session.id };
    }
    
    // Update existing subscription
    await stripe.subscriptions.update(subscription.stripe_subscription_id, {
      items: [{
        id: (await stripe.subscriptions.retrieve(subscription.stripe_subscription_id)).items.data[0].id,
        price: newPlan.stripePriceId,
      }],
    });
    
    // Update our database
    await supabase
      .from('subscriptions')
      .update({
        plan: newPlanId,
        price_id: newPlan.stripePriceId,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);
    
    return { success: true };
  } catch (error) {
    console.error('Failed to change subscription plan:', error);
    throw error;
  }
};

export const getInvoices = async (userId: string, limit = 10) => {
  try {
    // Get customer ID
    const { data: customer, error } = await supabase
      .from('stripe_customers')
      .select('customer_id')
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    if (!customer?.customer_id) {
      return []; // No customer, no invoices
    }
    
    // Get invoices from Stripe
    const invoices = await stripe.invoices.list({
      customer: customer.customer_id,
      limit,
    });
    
    // Format invoices
    return invoices.data.map(invoice => ({
      id: invoice.id,
      number: invoice.number || '',
      amount: invoice.amount_paid / 100, // Convert from cents
      status: invoice.status,
      date: new Date(invoice.created * 1000).toISOString(),
      pdfUrl: invoice.invoice_pdf || '',
    }));
  } catch (error) {
    console.error('Failed to get invoices:', error);
    throw error;
  }
};