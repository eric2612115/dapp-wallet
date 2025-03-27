// components/layout/Footer.tsx
export default function Footer() {
  return (
    <footer className="py-6 px-4 border-t border-gray-200 dark:border-dark-100 bg-white dark:bg-dark-300">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">DApp Wallet</h3>
            <p className="text-gray-600 dark:text-gray-300">
              A secure multi-chain wallet with vault management, portfolio tracking, and multi-signature capabilities.
            </p>
          </div>
          <div>
            <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/vaults" className="text-gray-600 dark:text-gray-300 hover:text-clay-500 dark:hover:text-clay-500 transition-colors">Vaults</a></li>
              <li><a href="/portfolio" className="text-gray-600 dark:text-gray-300 hover:text-clay-500 dark:hover:text-clay-500 transition-colors">Portfolio</a></li>
              <li><a href="/wallet" className="text-gray-600 dark:text-gray-300 hover:text-clay-500 dark:hover:text-clay-500 transition-colors">Wallet</a></li>
              <li><a href="/about" className="text-gray-600 dark:text-gray-300 hover:text-clay-500 dark:hover:text-clay-500 transition-colors">About</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Connect</h4>
            <ul className="space-y-2">
              <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-300 hover:text-clay-500 dark:hover:text-clay-500 transition-colors">Twitter</a></li>
              <li><a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-300 hover:text-clay-500 dark:hover:text-clay-500 transition-colors">Discord</a></li>
              <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-300 hover:text-clay-500 dark:hover:text-clay-500 transition-colors">GitHub</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-gray-200 dark:border-dark-100 text-center text-gray-500 dark:text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} DApp Wallet. All rights reserved.
        </div>
      </div>
    </footer>
  );
}