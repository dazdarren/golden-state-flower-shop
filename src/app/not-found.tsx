import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <span className="text-6xl mb-4 block">🌸</span>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>
        <p className="text-gray-600 mb-6 max-w-md">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
          Let&apos;s get you back to browsing beautiful flowers.
        </p>
        <Link
          href="/ca/san-francisco/"
          className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}
