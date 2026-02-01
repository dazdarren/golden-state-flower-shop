/**
 * Email Service Integration using Resend
 *
 * Handles transactional and marketing emails for Golden State Flower Shop.
 */

import { Resend } from 'resend';

export interface EmailEnv {
  RESEND_API_KEY: string;
  EMAIL_FROM_ADDRESS?: string;
  EMAIL_FROM_NAME?: string;
}

let resendClient: Resend | null = null;

// Default from address - should be overridden with EMAIL_FROM_ADDRESS env var
// The Resend test domain only works for sending to the account owner's email
const DEFAULT_FROM_ADDRESS = 'onboarding@resend.dev';
const DEFAULT_FROM_NAME = 'Golden State Flower Shop';

// Track if we've warned about using default email
let hasWarnedAboutDefaultEmail = false;

/**
 * Create a Resend client
 */
export function createEmailClient(apiKey: string): Resend {
  if (resendClient) return resendClient;
  resendClient = new Resend(apiKey);
  return resendClient;
}

/**
 * Check if email service is configured
 */
export function hasEmailCredentials(env: Partial<EmailEnv>): boolean {
  return !!env.RESEND_API_KEY;
}

/**
 * Check if email is properly configured for production
 * Returns true if using a custom domain, false if using test domain
 */
export function isEmailProductionReady(env: Partial<EmailEnv>): boolean {
  return !!(env.EMAIL_FROM_ADDRESS && !env.EMAIL_FROM_ADDRESS.includes('resend.dev'));
}

/**
 * Get from address string
 */
function getFromAddress(env: EmailEnv): string {
  const name = env.EMAIL_FROM_NAME || DEFAULT_FROM_NAME;
  const email = env.EMAIL_FROM_ADDRESS || DEFAULT_FROM_ADDRESS;

  // Warn once if using default test domain
  if (!env.EMAIL_FROM_ADDRESS && !hasWarnedAboutDefaultEmail) {
    hasWarnedAboutDefaultEmail = true;
    console.warn(
      'WARNING: Using Resend test domain for emails. ' +
      'Set EMAIL_FROM_ADDRESS environment variable to use a verified domain. ' +
      'Test emails will only work for the account owner\'s email address.'
    );
  }

  return `${name} <${email}>`;
}

// ============================================
// Email Templates
// ============================================

interface BaseEmailParams {
  to: string;
  env: EmailEnv;
}

/**
 * Welcome email for new subscribers
 */
export async function sendWelcomeEmail(
  resend: Resend,
  params: BaseEmailParams & {
    firstName?: string;
  }
) {
  const { to, firstName, env } = params;

  return resend.emails.send({
    from: getFromAddress(env),
    to,
    subject: "You're in! Here's what's next",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Golden State Flower Shop</title>
</head>
<body style="font-family: Georgia, serif; line-height: 1.6; color: #1a2e1a; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; padding: 30px 0; border-bottom: 1px solid #e5e7e3;">
    <h1 style="color: #1a2e1a; font-size: 28px; margin: 0;">Golden State Flower Shop</h1>
    <p style="color: #6b7a6b; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin-top: 5px;">Premium Flower Delivery</p>
  </div>

  <div style="padding: 40px 20px;">
    <h2 style="color: #1a2e1a; font-size: 24px; margin-bottom: 20px;">
      Welcome${firstName ? `, ${firstName}` : ''}!
    </h2>

    <p style="margin-bottom: 20px;">
      Thank you for joining our flower-loving community. We're thrilled to have you!
    </p>

    <p style="margin-bottom: 20px;">
      As a subscriber, you'll be the first to know about:
    </p>

    <ul style="margin-bottom: 30px; padding-left: 20px;">
      <li style="margin-bottom: 10px;">Seasonal collections and new arrivals</li>
      <li style="margin-bottom: 10px;">Exclusive subscriber-only offers</li>
      <li style="margin-bottom: 10px;">Flower care tips and inspiration</li>
      <li style="margin-bottom: 10px;">Special holiday promotions</li>
    </ul>

    <div style="text-align: center; margin: 30px 0;">
      <a href="https://goldenstateflowershop.com/ca/san-francisco/flowers/birthday"
         style="display: inline-block; background-color: #1a2e1a; color: white; padding: 15px 30px;
                text-decoration: none; border-radius: 30px; font-size: 16px;">
        Browse Our Collection
      </a>
    </div>
  </div>

  <div style="border-top: 1px solid #e5e7e3; padding: 20px; text-align: center; font-size: 12px; color: #6b7a6b;">
    <p>&copy; ${new Date().getFullYear()} Golden State Flower Shop. All rights reserved.</p>
    <p>
      <a href="https://goldenstateflowershop.com/unsubscribe?email=${encodeURIComponent(to)}"
         style="color: #6b7a6b;">Unsubscribe</a>
    </p>
  </div>
</body>
</html>
    `,
  });
}

/**
 * Order confirmation email
 */
export async function sendOrderConfirmationEmail(
  resend: Resend,
  params: BaseEmailParams & {
    orderNumber: string;
    customerName: string;
    orderTotal: string;
    deliveryDate: string;
    recipientName: string;
    recipientAddress: string;
    items: Array<{
      name: string;
      price: string;
    }>;
  }
) {
  const { to, orderNumber, customerName, orderTotal, deliveryDate, recipientName, recipientAddress, items, env } = params;

  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 15px 0; border-bottom: 1px solid #e5e7e3;">${item.name}</td>
      <td style="padding: 15px 0; border-bottom: 1px solid #e5e7e3; text-align: right;">${item.price}</td>
    </tr>
  `).join('');

  return resend.emails.send({
    from: getFromAddress(env),
    to,
    subject: `Got it! Your flowers are on the way - #${orderNumber}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Georgia, serif; line-height: 1.6; color: #1a2e1a; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; padding: 30px 0; border-bottom: 1px solid #e5e7e3;">
    <h1 style="color: #1a2e1a; font-size: 28px; margin: 0;">Golden State Flower Shop</h1>
  </div>

  <div style="padding: 40px 20px;">
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="width: 60px; height: 60px; background-color: #8b996f; border-radius: 50%; margin: 0 auto 15px;
                  display: flex; align-items: center; justify-content: center;">
        <span style="color: white; font-size: 24px;">&#10003;</span>
      </div>
      <h2 style="color: #1a2e1a; font-size: 24px; margin: 0;">Order Confirmed!</h2>
    </div>

    <p>Hi ${customerName},</p>
    <p>Thank you for your order! We've received it and are preparing your beautiful arrangement.</p>

    <div style="background-color: #f9faf8; padding: 20px; border-radius: 10px; margin: 25px 0;">
      <p style="margin: 0; font-size: 14px; color: #6b7a6b;">Order Number</p>
      <p style="margin: 5px 0 0; font-size: 18px; font-weight: bold;">#${orderNumber}</p>
    </div>

    <h3 style="color: #1a2e1a; border-bottom: 1px solid #e5e7e3; padding-bottom: 10px;">Delivery Details</h3>
    <p><strong>Recipient:</strong> ${recipientName}</p>
    <p><strong>Address:</strong> ${recipientAddress}</p>
    <p><strong>Delivery Date:</strong> ${deliveryDate}</p>

    <h3 style="color: #1a2e1a; border-bottom: 1px solid #e5e7e3; padding-bottom: 10px; margin-top: 30px;">Order Summary</h3>
    <table style="width: 100%; border-collapse: collapse;">
      ${itemsHtml}
      <tr>
        <td style="padding: 15px 0; font-weight: bold;">Total</td>
        <td style="padding: 15px 0; text-align: right; font-weight: bold;">${orderTotal}</td>
      </tr>
    </table>
  </div>

  <div style="border-top: 1px solid #e5e7e3; padding: 20px; text-align: center; font-size: 12px; color: #6b7a6b;">
    <p>Questions? Contact us at support@goldenstateflowershop.com</p>
    <p>&copy; ${new Date().getFullYear()} Golden State Flower Shop. All rights reserved.</p>
  </div>
</body>
</html>
    `,
  });
}

/**
 * Subscription welcome email
 */
export async function sendSubscriptionWelcomeEmail(
  resend: Resend,
  params: BaseEmailParams & {
    customerName: string;
    tierName: string;
    price: string;
    nextDeliveryDate: string;
  }
) {
  const { to, customerName, tierName, price, nextDeliveryDate, env } = params;

  return resend.emails.send({
    from: getFromAddress(env),
    to,
    subject: 'Welcome to the Golden Bloom Club!',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Georgia, serif; line-height: 1.6; color: #1a2e1a; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; padding: 30px 0; border-bottom: 1px solid #e5e7e3;">
    <h1 style="color: #1a2e1a; font-size: 28px; margin: 0;">Golden Bloom Club</h1>
    <p style="color: #b8860b; font-size: 14px; margin-top: 5px;">Premium Flower Subscription</p>
  </div>

  <div style="padding: 40px 20px;">
    <h2 style="color: #1a2e1a; font-size: 24px; text-align: center; margin-bottom: 30px;">
      Welcome, ${customerName}!
    </h2>

    <p>You're now a member of the Golden Bloom Club! Get ready for beautiful, hand-arranged flowers delivered right to your door.</p>

    <div style="background: linear-gradient(135deg, #f9faf8 0%, #fff 100%); padding: 25px; border-radius: 15px;
                margin: 25px 0; border: 1px solid #e5e7e3;">
      <h3 style="color: #b8860b; margin: 0 0 15px; font-size: 20px;">${tierName} Membership</h3>
      <p style="margin: 0; font-size: 28px; font-weight: bold; color: #1a2e1a;">${price}/month</p>
    </div>

    <div style="background-color: #8b996f; color: white; padding: 20px; border-radius: 10px; margin: 25px 0; text-align: center;">
      <p style="margin: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Your First Delivery</p>
      <p style="margin: 10px 0 0; font-size: 24px; font-weight: bold;">${nextDeliveryDate}</p>
    </div>

    <h3 style="color: #1a2e1a;">What's Next?</h3>
    <ul style="padding-left: 20px;">
      <li style="margin-bottom: 10px;">We'll send you an email reminder before each delivery</li>
      <li style="margin-bottom: 10px;">You can skip, pause, or modify your subscription anytime</li>
      <li style="margin-bottom: 10px;">Access exclusive subscriber-only arrangements</li>
    </ul>

    <div style="text-align: center; margin: 30px 0;">
      <a href="https://goldenstateflowershop.com/account/subscriptions"
         style="display: inline-block; background-color: #1a2e1a; color: white; padding: 15px 30px;
                text-decoration: none; border-radius: 30px; font-size: 16px;">
        Manage Subscription
      </a>
    </div>
  </div>

  <div style="border-top: 1px solid #e5e7e3; padding: 20px; text-align: center; font-size: 12px; color: #6b7a6b;">
    <p>&copy; ${new Date().getFullYear()} Golden State Flower Shop. All rights reserved.</p>
  </div>
</body>
</html>
    `,
  });
}

/**
 * Subscription delivery reminder email
 */
export async function sendDeliveryReminderEmail(
  resend: Resend,
  params: BaseEmailParams & {
    customerName: string;
    deliveryDate: string;
    recipientName: string;
    skipDeadline: string;
  }
) {
  const { to, customerName, deliveryDate, recipientName, skipDeadline, env } = params;

  return resend.emails.send({
    from: getFromAddress(env),
    to,
    subject: `Upcoming Delivery on ${deliveryDate}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Georgia, serif; line-height: 1.6; color: #1a2e1a; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; padding: 30px 0; border-bottom: 1px solid #e5e7e3;">
    <h1 style="color: #1a2e1a; font-size: 28px; margin: 0;">Golden Bloom Club</h1>
  </div>

  <div style="padding: 40px 20px;">
    <h2 style="color: #1a2e1a; font-size: 24px;">Hi ${customerName},</h2>

    <p>Just a heads up - your next flower delivery is coming soon!</p>

    <div style="background-color: #f9faf8; padding: 25px; border-radius: 15px; margin: 25px 0; text-align: center;">
      <p style="margin: 0; font-size: 14px; color: #6b7a6b; text-transform: uppercase; letter-spacing: 1px;">Delivery Date</p>
      <p style="margin: 10px 0 0; font-size: 28px; font-weight: bold; color: #1a2e1a;">${deliveryDate}</p>
      <p style="margin: 15px 0 0; font-size: 14px; color: #6b7a6b;">To: ${recipientName}</p>
    </div>

    <p style="text-align: center; color: #6b7a6b; font-size: 14px;">
      Need to skip this delivery? You have until <strong>${skipDeadline}</strong> to make changes.
    </p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="https://goldenstateflowershop.com/account/subscriptions"
         style="display: inline-block; background-color: #1a2e1a; color: white; padding: 15px 30px;
                text-decoration: none; border-radius: 30px; font-size: 16px; margin-right: 10px;">
        Manage Delivery
      </a>
    </div>
  </div>

  <div style="border-top: 1px solid #e5e7e3; padding: 20px; text-align: center; font-size: 12px; color: #6b7a6b;">
    <p>&copy; ${new Date().getFullYear()} Golden State Flower Shop. All rights reserved.</p>
  </div>
</body>
</html>
    `,
  });
}

/**
 * Occasion reminder email
 */
export async function sendOccasionReminderEmail(
  resend: Resend,
  params: BaseEmailParams & {
    customerName: string;
    occasionTitle: string;
    recipientName: string;
    occasionDate: string;
    daysUntil: number;
  }
) {
  const { to, customerName, occasionTitle, recipientName, occasionDate, daysUntil, env } = params;

  return resend.emails.send({
    from: getFromAddress(env),
    to,
    subject: `Reminder: ${recipientName}'s ${occasionTitle} is in ${daysUntil} days!`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Georgia, serif; line-height: 1.6; color: #1a2e1a; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; padding: 30px 0; border-bottom: 1px solid #e5e7e3;">
    <h1 style="color: #1a2e1a; font-size: 28px; margin: 0;">Golden State Flower Shop</h1>
  </div>

  <div style="padding: 40px 20px;">
    <h2 style="color: #1a2e1a; font-size: 24px;">Hi ${customerName},</h2>

    <p>This is a friendly reminder that <strong>${recipientName}'s ${occasionTitle}</strong> is coming up!</p>

    <div style="background-color: #f9faf8; padding: 25px; border-radius: 15px; margin: 25px 0; text-align: center;">
      <p style="margin: 0; font-size: 48px;">🎉</p>
      <p style="margin: 10px 0; font-size: 20px; font-weight: bold; color: #1a2e1a;">${occasionDate}</p>
      <p style="margin: 0; font-size: 14px; color: #6b7a6b;">${daysUntil} days away</p>
    </div>

    <p>Make their day special with a beautiful flower arrangement! Order now to ensure same-day or next-day delivery.</p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="https://goldenstateflowershop.com/ca/san-francisco/flowers/birthday"
         style="display: inline-block; background-color: #1a2e1a; color: white; padding: 15px 30px;
                text-decoration: none; border-radius: 30px; font-size: 16px;">
        Send Flowers Now
      </a>
    </div>
  </div>

  <div style="border-top: 1px solid #e5e7e3; padding: 20px; text-align: center; font-size: 12px; color: #6b7a6b;">
    <p>
      <a href="https://goldenstateflowershop.com/account/reminders" style="color: #6b7a6b;">
        Manage your reminders
      </a>
    </p>
    <p>&copy; ${new Date().getFullYear()} Golden State Flower Shop. All rights reserved.</p>
  </div>
</body>
</html>
    `,
  });
}

/**
 * Abandoned cart email
 */
export async function sendAbandonedCartEmail(
  resend: Resend,
  params: BaseEmailParams & {
    customerName?: string;
    items: Array<{
      name: string;
      price: string;
      imageUrl?: string;
    }>;
    cartTotal: string;
    recoveryUrl: string;
  }
) {
  const { to, customerName, items, cartTotal, recoveryUrl, env } = params;

  const itemsHtml = items.map(item => `
    <div style="display: flex; align-items: center; padding: 15px 0; border-bottom: 1px solid #e5e7e3;">
      <div style="flex: 1;">
        <p style="margin: 0; font-weight: bold;">${item.name}</p>
        <p style="margin: 5px 0 0; color: #6b7a6b;">${item.price}</p>
      </div>
    </div>
  `).join('');

  return resend.emails.send({
    from: getFromAddress(env),
    to,
    subject: 'Still thinking it over?',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Georgia, serif; line-height: 1.6; color: #1a2e1a; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; padding: 30px 0; border-bottom: 1px solid #e5e7e3;">
    <h1 style="color: #1a2e1a; font-size: 28px; margin: 0;">Golden State Flower Shop</h1>
  </div>

  <div style="padding: 40px 20px;">
    <h2 style="color: #1a2e1a; font-size: 24px; text-align: center;">
      ${customerName ? `Hi ${customerName},` : 'Hi there,'}
    </h2>

    <p style="text-align: center;">You have items in your cart. No rush - they'll be here when you're ready.</p>

    <div style="background-color: #f9faf8; padding: 20px; border-radius: 15px; margin: 25px 0;">
      ${itemsHtml}
      <div style="padding: 15px 0; font-weight: bold; display: flex; justify-content: space-between;">
        <span>Total</span>
        <span>${cartTotal}</span>
      </div>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${recoveryUrl}"
         style="display: inline-block; background-color: #1a2e1a; color: white; padding: 15px 30px;
                text-decoration: none; border-radius: 30px; font-size: 16px;">
        Complete Your Order
      </a>
    </div>

    <p style="text-align: center; color: #6b7a6b; font-size: 14px;">
      Same-day delivery available! Order before 2pm for delivery today.
    </p>
  </div>

  <div style="border-top: 1px solid #e5e7e3; padding: 20px; text-align: center; font-size: 12px; color: #6b7a6b;">
    <p>&copy; ${new Date().getFullYear()} Golden State Flower Shop. All rights reserved.</p>
    <p>
      <a href="https://goldenstateflowershop.com/unsubscribe?email=${encodeURIComponent(to)}"
         style="color: #6b7a6b;">Unsubscribe</a>
    </p>
  </div>
</body>
</html>
    `,
  });
}

/**
 * Referral invitation email
 */
export async function sendReferralInviteEmail(
  resend: Resend,
  params: BaseEmailParams & {
    referrerName: string;
    referralCode: string;
    discountAmount: string;
  }
) {
  const { to, referrerName, referralCode, discountAmount, env } = params;

  return resend.emails.send({
    from: getFromAddress(env),
    to,
    subject: `${referrerName} sent you ${discountAmount} off flowers!`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Georgia, serif; line-height: 1.6; color: #1a2e1a; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; padding: 30px 0; border-bottom: 1px solid #e5e7e3;">
    <h1 style="color: #1a2e1a; font-size: 28px; margin: 0;">Golden State Flower Shop</h1>
  </div>

  <div style="padding: 40px 20px; text-align: center;">
    <p style="font-size: 48px; margin: 0;">💐</p>

    <h2 style="color: #1a2e1a; font-size: 24px; margin: 20px 0;">
      ${referrerName} thinks you'd love us!
    </h2>

    <p>They've sent you ${discountAmount} off your first order at Golden State Flower Shop.</p>

    <div style="background: linear-gradient(135deg, #f9faf8 0%, #fff 100%); padding: 25px; border-radius: 15px;
                margin: 25px 0; border: 2px dashed #8b996f;">
      <p style="margin: 0; font-size: 14px; color: #6b7a6b; text-transform: uppercase; letter-spacing: 1px;">Your Referral Code</p>
      <p style="margin: 10px 0 0; font-size: 28px; font-weight: bold; color: #1a2e1a; letter-spacing: 3px;">${referralCode}</p>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a href="https://goldenstateflowershop.com/ca/san-francisco?ref=${referralCode}"
         style="display: inline-block; background-color: #1a2e1a; color: white; padding: 15px 30px;
                text-decoration: none; border-radius: 30px; font-size: 16px;">
        Claim Your ${discountAmount} Off
      </a>
    </div>

    <p style="color: #6b7a6b; font-size: 14px;">
      Same-day flower delivery throughout California. Fresh, beautiful arrangements crafted by local artisan florists.
    </p>
  </div>

  <div style="border-top: 1px solid #e5e7e3; padding: 20px; text-align: center; font-size: 12px; color: #6b7a6b;">
    <p>&copy; ${new Date().getFullYear()} Golden State Flower Shop. All rights reserved.</p>
  </div>
</body>
</html>
    `,
  });
}
