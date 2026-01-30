'use client';

interface ValuePropStripProps {
  cutoffTime?: string;
}

export default function ValuePropStrip({ cutoffTime = '2:00 PM' }: ValuePropStripProps) {
  const valueProps = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Same-Day Delivery',
      description: `Order by ${cutoffTime}`,
    },
    {
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
      ),
      title: 'Fresh Flowers',
      description: 'Arranged today, delivered today',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Satisfaction Guaranteed',
      description: 'Full refund if not happy',
    },
  ];

  return (
    <div className="bg-white border-y border-cream-200">
      <div className="container-wide py-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
          {valueProps.map((prop, index) => (
            <div
              key={prop.title}
              className="flex items-center gap-3 justify-center sm:justify-start"
            >
              <div className="w-10 h-10 rounded-full bg-sage-100 text-sage-600 flex items-center justify-center flex-shrink-0">
                {prop.icon}
              </div>
              <div>
                <p className="font-medium text-forest-900 text-sm">
                  {prop.title}
                </p>
                <p className="text-xs text-forest-800/60">
                  {prop.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
