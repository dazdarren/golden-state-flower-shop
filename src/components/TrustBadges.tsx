'use client';

interface TrustBadgesProps {
  variant?: 'horizontal' | 'vertical' | 'compact';
  showPaymentMethods?: boolean;
  className?: string;
}

export default function TrustBadges({
  variant = 'horizontal',
  showPaymentMethods = true,
  className = '',
}: TrustBadgesProps) {
  const badges = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      label: 'Secure Checkout',
      description: '256-bit SSL encryption',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: 'Satisfaction Guaranteed',
      description: 'Or your money back',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      ),
      label: 'Fresh Guarantee',
      description: '7-day freshness promise',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      label: 'Customer Support',
      description: 'Mon-Sat, 8am-6pm',
    },
  ];

  if (variant === 'compact') {
    return (
      <div className={`flex items-center justify-center gap-6 text-xs text-forest-800/60 ${className}`}>
        <span className="flex items-center gap-1.5">
          <svg className="w-4 h-4 text-sage-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Secure Checkout
        </span>
        <span className="flex items-center gap-1.5">
          <svg className="w-4 h-4 text-sage-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Satisfaction Guaranteed
        </span>
        {showPaymentMethods && (
          <span className="flex items-center gap-2">
            <PaymentIcons size="sm" />
          </span>
        )}
      </div>
    );
  }

  if (variant === 'vertical') {
    return (
      <div className={`space-y-4 ${className}`}>
        {badges.map((badge, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="w-10 h-10 bg-sage-100 rounded-full flex items-center justify-center flex-shrink-0 text-sage-600">
              {badge.icon}
            </div>
            <div>
              <p className="font-medium text-forest-900 text-sm">{badge.label}</p>
              <p className="text-xs text-forest-800/60">{badge.description}</p>
            </div>
          </div>
        ))}
        {showPaymentMethods && (
          <div className="pt-4 border-t border-cream-200">
            <p className="text-xs text-forest-800/50 mb-2">We accept</p>
            <PaymentIcons />
          </div>
        )}
      </div>
    );
  }

  // Horizontal variant (default)
  return (
    <div className={className}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {badges.map((badge, index) => (
          <div key={index} className="flex flex-col items-center text-center p-4 bg-cream-50 rounded-xl border border-cream-200">
            <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center mb-3 text-sage-600">
              {badge.icon}
            </div>
            <p className="font-medium text-forest-900 text-sm">{badge.label}</p>
            <p className="text-xs text-forest-800/60 mt-1">{badge.description}</p>
          </div>
        ))}
      </div>
      {showPaymentMethods && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <span className="text-xs text-forest-800/50">We accept</span>
          <PaymentIcons />
        </div>
      )}
    </div>
  );
}

function PaymentIcons({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const iconClass = size === 'sm' ? 'h-5' : 'h-6';

  return (
    <div className="flex items-center gap-2">
      {/* Visa */}
      <svg className={iconClass} viewBox="0 0 50 35" fill="none">
        <rect width="50" height="35" rx="4" fill="#1A1F71"/>
        <path d="M21.5 23H19L20.7 12H23.2L21.5 23Z" fill="white"/>
        <path d="M30.8 12.2C30.3 12 29.5 11.8 28.5 11.8C26 11.8 24.2 13.1 24.2 15C24.2 16.4 25.5 17.2 26.5 17.7C27.5 18.2 27.9 18.5 27.9 19C27.9 19.7 27.1 20 26.3 20C25.2 20 24.6 19.8 23.7 19.4L23.3 19.2L22.9 22C23.6 22.3 24.8 22.6 26.1 22.6C28.8 22.6 30.5 21.3 30.5 19.3C30.5 18.2 29.8 17.3 28.3 16.6C27.4 16.1 26.8 15.8 26.8 15.3C26.8 14.8 27.4 14.3 28.5 14.3C29.4 14.3 30.1 14.5 30.5 14.7L30.8 14.8L31.2 12.2H30.8Z" fill="white"/>
        <path d="M35.9 12H34C33.4 12 33 12.2 32.7 12.8L28.9 23H31.6L32.1 21.4H35.4L35.7 23H38.1L35.9 12ZM32.9 19.2C33.2 18.4 34.3 15.4 34.3 15.4C34.3 15.4 34.5 14.8 34.7 14.4L34.9 15.3C34.9 15.3 35.5 18.1 35.6 18.7H32.9V19.2Z" fill="white"/>
        <path d="M17.8 12L15.3 19.5L15 18C14.5 16.4 13 14.6 11.3 13.7L13.6 23H16.3L20.5 12H17.8Z" fill="white"/>
        <path d="M13.4 12H9.2L9.1 12.2C12.3 13 14.4 15.4 15 18L14.3 13C14.2 12.3 13.8 12 13.4 12Z" fill="#F9A533"/>
      </svg>

      {/* Mastercard */}
      <svg className={iconClass} viewBox="0 0 50 35" fill="none">
        <rect width="50" height="35" rx="4" fill="#F5F5F5"/>
        <circle cx="19" cy="17.5" r="9" fill="#EB001B"/>
        <circle cx="31" cy="17.5" r="9" fill="#F79E1B"/>
        <path d="M25 10.5C27.1 12.2 28.5 14.7 28.5 17.5C28.5 20.3 27.1 22.8 25 24.5C22.9 22.8 21.5 20.3 21.5 17.5C21.5 14.7 22.9 12.2 25 10.5Z" fill="#FF5F00"/>
      </svg>

      {/* Amex */}
      <svg className={iconClass} viewBox="0 0 50 35" fill="none">
        <rect width="50" height="35" rx="4" fill="#006FCF"/>
        <path d="M10 17.5L12.5 12H15L18 17.5L15 23H12.5L10 17.5Z" fill="white"/>
        <path d="M18 12H21L24 17.5L21 23H18L21 17.5L18 12Z" fill="white"/>
        <path d="M24 12H30V14H26V16H30V18H26V21H30V23H24V12Z" fill="white"/>
        <path d="M31 12H35L37 15L39 12H43L39 17.5L43 23H39L37 20L35 23H31L35 17.5L31 12Z" fill="white"/>
      </svg>

      {/* Apple Pay */}
      <svg className={iconClass} viewBox="0 0 50 35" fill="none">
        <rect width="50" height="35" rx="4" fill="#000"/>
        <path d="M15.2 11.8C14.6 12.5 13.7 13 12.8 12.9C12.7 12 13.1 11 13.6 10.4C14.2 9.7 15.1 9.2 15.9 9.2C16 10.2 15.7 11.1 15.2 11.8ZM15.9 13.1C14.7 13 13.6 13.8 13 13.8C12.4 13.8 11.4 13.1 10.5 13.1C9.2 13.2 8 13.9 7.4 15.1C6 17.5 7.1 21 8.5 22.9C9.2 23.9 10 25 11.1 24.9C12 24.9 12.4 24.3 13.5 24.3C14.6 24.3 15 24.9 15.9 24.9C17 24.9 17.7 23.9 18.4 22.9C19.2 21.8 19.5 20.7 19.5 20.6C19.5 20.6 17.5 19.8 17.5 17.5C17.5 15.5 19.1 14.6 19.2 14.5C18.2 13.1 16.7 13 15.9 13.1Z" fill="white"/>
        <path d="M25.6 10.5C28 10.5 29.6 12.1 29.6 14.5C29.6 17 28 18.6 25.5 18.6H23.1V22.7H21.3V10.5H25.6ZM23.1 17H25.2C26.8 17 27.7 16.1 27.7 14.5C27.7 13 26.8 12.1 25.2 12.1H23.1V17Z" fill="white"/>
        <path d="M30.3 20C30.3 18.3 31.6 17.2 33.8 17.1L36.3 16.9V16.1C36.3 14.9 35.5 14.2 34.2 14.2C33 14.2 32.2 14.8 32 15.8H30.4C30.5 14 32 12.7 34.3 12.7C36.6 12.7 38.1 14 38.1 16V22.7H36.4V21.1H36.3C35.8 22.2 34.6 22.9 33.3 22.9C31.5 22.9 30.3 21.7 30.3 20ZM36.3 19.1V18.3L34.1 18.5C32.9 18.6 32.2 19.1 32.2 19.9C32.2 20.8 32.9 21.3 34 21.3C35.4 21.3 36.3 20.4 36.3 19.1Z" fill="white"/>
        <path d="M39.6 25.5V24C39.8 24 40.1 24.1 40.4 24.1C41.2 24.1 41.7 23.7 42 22.8L42.2 22.2L38.6 12.9H40.5L43.1 20.7H43.2L45.8 12.9H47.7L43.9 23.1C43.1 25.3 42.2 25.9 40.5 25.9C40.2 25.9 39.8 25.9 39.6 25.5Z" fill="white"/>
      </svg>
    </div>
  );
}

export { PaymentIcons };
