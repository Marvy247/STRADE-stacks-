export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Strade</h3>
            <p className="text-slate-600 text-sm">
              A decentralized marketplace built on Stacks blockchain.
              Buy and sell goods securely with smart contracts.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><a href="#" className="hover:text-slate-900">Marketplace</a></li>
              <li><a href="#" className="hover:text-slate-900">How it Works</a></li>
              <li><a href="#" className="hover:text-slate-900">FAQ</a></li>
              <li><a href="#" className="hover:text-slate-900">Support</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Community</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><a href="#" className="hover:text-slate-900">Discord</a></li>
              <li><a href="#" className="hover:text-slate-900">Twitter</a></li>
              <li><a href="#" className="hover:text-slate-900">GitHub</a></li>
              <li><a href="#" className="hover:text-slate-900">Blog</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 mt-8 pt-8 text-center text-sm text-slate-600">
          <p>&copy; 2024 Strade. Built on Stacks blockchain. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
