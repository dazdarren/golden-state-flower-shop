/**
 * Newsletter Subscription API Endpoint
 *
 * POST /api/newsletter/subscribe
 * Body: { email: string, source?: string }
 */

import { createSupabaseClient, hasSupabaseCredentials, subscribeToNewsletter } from '../../lib/supabase';
import { createEmailClient, hasEmailCredentials, sendWelcomeEmail } from '../../lib/email';
import { successResponse, errorResponse, handleCors } from '../../lib/response';
import { z } from 'zod';

const subscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
  source: z.string().optional(),
  firstName: z.string().optional(),
});

export const onRequestOptions: PagesFunction<Env> = async () => {
  return handleCors();
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    // Parse and validate request body
    const body = await context.request.json();
    const result = subscribeSchema.safeParse(body);

    if (!result.success) {
      return errorResponse(result.error.errors[0].message);
    }

    const { email, source, firstName } = result.data;

    // Check if Supabase is configured
    if (!hasSupabaseCredentials(context.env)) {
      // In development, just return success
      console.log('Newsletter subscription (no Supabase):', email);
      return successResponse({
        message: 'Successfully subscribed to newsletter',
        email,
      });
    }

    // Create Supabase client and subscribe
    const supabase = createSupabaseClient(context.env);
    const subscriber = await subscribeToNewsletter(supabase, email, source || 'website');

    // Send welcome email if Resend is configured
    if (hasEmailCredentials(context.env)) {
      try {
        const resend = createEmailClient(context.env.RESEND_API_KEY);
        await sendWelcomeEmail(resend, {
          to: email,
          firstName,
          env: context.env,
        });
      } catch (emailError) {
        // Log but don't fail the subscription
        console.error('Failed to send welcome email:', emailError);
      }
    }

    return successResponse({
      message: 'Successfully subscribed to newsletter',
      email: subscriber.email,
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);

    if (error instanceof Error) {
      // Handle duplicate email gracefully
      if (error.message.includes('duplicate') || error.message.includes('unique')) {
        return successResponse({
          message: 'You are already subscribed',
          email: '',
        });
      }
      return errorResponse(error.message, 500);
    }

    return errorResponse('Failed to subscribe to newsletter', 500);
  }
};
