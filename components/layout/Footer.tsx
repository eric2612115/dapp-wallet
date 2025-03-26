export default function Footer() {
    return (
      <footer className="mt-auto py-6 px-4 border-t dark:border-border border-gray-200">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold text-text-primary dark:text-text-primary mb-4">DApp Wallet</h3>
              <p className="text-text-secondary dark:text-text-secondary">
                A secure multi-chain wallet with vault management, portfolio tracking, and multi-signature capabilities.
              </p>
            </div>
            <div>
              <h4 className="text-md font-medium text-text-primary dark:text-text-primary mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="/vaults" className="text-text-secondary hover:text-primary transition-colors">Vaults</a></li>
                <li><a href="/portfolio" className="text-text-secondary hover:text-primary transition-colors">Portfolio</a></li>
                <li><a href="/wallet" className="text-text-secondary hover:text-primary transition-colors">Wallet</a></li>
                <li><a href="/about" className="text-text-secondary hover:text-primary transition-colors">About</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-medium text-text-primary dark:text-text-primary mb-4">Connect</h4>
              <ul className="space-y-2">
                <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-primary transition-colors">Twitter</a></li>
                <li><a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-primary transition-colors">Discord</a></li>
                <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-primary transition-colors">GitHub</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t dark:border-border border-gray-200 text-center text-text-secondary text-sm">
            &copy; {new Date().getFullYear()} DApp Wallet. All rights reserved.
          </div>
        </div>
      </footer>
    );
  }