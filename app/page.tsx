'use client';

import { motion } from 'framer-motion';
import { Wallet, TrendingUp, Settings } from '@mui/icons-material';
import { useAccount } from 'wagmi';
import Link from 'next/link';

// Demo market data
const marketData = [
  { id: '1', name: 'Bitcoin', symbol: 'BTC', price: 83104.35, change: 0.97 },
  { id: '2', name: 'Ethereum', symbol: 'ETH', price: 1900.00, change: -0.50 },
  { id: '3', name: 'Solana', symbol: 'SOL', price: 126.67, change: 0.98 },
];

// Feature cards data
const features = [
  {
    title: 'Vaults',
    description: 'Secure your assets and earn yield',
    icon: <TrendingUp />,
    href: '/vaults',
  },
  {
    title: 'Portfolio',
    description: 'Track your assets across multiple chains',
    icon: <Wallet />,
    href: '/portfolio',
  },
  {
    title: 'Multi-Signature',
    description: 'Add extra security with multi-sig wallets',
    icon: <Settings />,
    href: '/wallet',
  },
];

export default function Home() {
  const { isConnected } = useAccount();
  // const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="mt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Secure Your <span className="text-primary">Digital Assets</span>
          </h1>
          <p className="text-text-secondary max-w-2xl mx-auto mb-8 text-lg">
            A modern multi-chain wallet with vault management, portfolio tracking, and multi-signature capabilities.
          </p>
          <div className="flex justify-center gap-4">
            {!isConnected ? (
              <button className="btn btn-primary">Connect Wallet</button>
            ) : (
              <Link href="/portfolio" className="btn btn-primary">
                View Portfolio
              </Link>
            )}
            <Link href="/about" className="btn btn-outline">
              Learn More
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Feature Cards */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={feature.href}>
                <div className="card h-full hover:shadow-md transition-shadow cursor-pointer">
                  <div className="text-primary mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-text-secondary">{feature.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Market Trends */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Market Trends</h2>
          <button className="text-primary flex items-center hover:underline">
            View All <TrendingUp className="ml-1" />
          </button>
        </div>
        <div className="card">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr>
                  <th className="py-3 px-4 text-left text-text-secondary">Asset</th>
                  <th className="py-3 px-4 text-right text-text-secondary">Price</th>
                  <th className="py-3 px-4 text-right text-text-secondary">24h Change</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {marketData.map((token) => (
                  <tr key={token.id} className="hover:bg-surface-hover">
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-surface-hover flex items-center justify-center text-primary mr-3">
                          {token.symbol.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium">{token.symbol}</div>
                          <div className="text-text-secondary text-sm">{token.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right font-medium">
                      ${token.price.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className={token.change > 0 ? 'text-accent-success' : 'text-accent-error'}>
                        {token.change > 0 ? '+' : ''}
                        {token.change}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}