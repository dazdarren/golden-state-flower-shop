'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface ConfirmationContentProps {
  basePath: string;
  cityName: string;
}

export default function ConfirmationContent({
  basePath,
  cityName,
}: ConfirmationContentProps) {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order') || 'Unknown';

  return (
    <div className="container-narrow text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent-100 mb-6">
        <span className="text-4xl">✓</span>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Order Confirmed!
      </h1>

      <p className="text-lg text-gray-600 mb-2">
        Thank you for your order. Your flowers are on their way!
      </p>

      <p className="text-gray-900 font-medium mb-8">
        Order Number: <span className="font-mono">{orderId}</span>
      </p>

      <div className="card p-6 text-left max-w-md mx-auto mb-8">
        <h2 className="font-semibold text-gray-900 mb-4">What happens next?</h2>
        <ol className="space-y-3 text-sm text-gray-600">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold">
              1
            </span>
            <span>
              You&apos;ll receive an email confirmation shortly with your order details.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold">
              2
            </span>
            <span>
              A local {cityName} florist will carefully prepare your arrangement.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold">
              3
            </span>
            <span>
              Your flowers will be delivered on your selected date.
            </span>
          </li>
        </ol>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href={basePath} className="btn-primary">
          Back to Home
        </Link>
        <Link href={`${basePath}/flowers/birthday`} className="btn-outline">
          Continue Shopping
        </Link>
      </div>

      <p className="text-sm text-gray-500 mt-8">
        Questions about your order? Contact us at support@goldenstateflowershop.com
      </p>
    </div>
  );
}
