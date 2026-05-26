import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#111827] text-gray-400 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <Link href="/" className="flex flex-col leading-none mb-3">
            <span className="text-2xl font-bold text-[#CC0000]">CKF</span>
            <span className="text-xs text-gray-500">Car Known Faults</span>
          </Link>
          <p className="text-sm text-gray-400 max-w-sm">
            Forum-sourced, community-verified known faults for every car make, model and variant.
            Know before you buy.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">Browse</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/makes" className="hover:text-white transition-colors">All Makes</Link></li>
            <li><Link href="/buyers-guides" className="hover:text-white transition-colors">Buyer's Guides</Link></li>
            <li><Link href="/mot-checks" className="hover:text-white transition-colors">MOT Pass Rates</Link></li>
            <li><Link href="/fault-codes" className="hover:text-white transition-colors">OBD-II Codes</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">Info</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-white transition-colors">About CKF</Link></li>
            <li><Link href="/press" className="hover:text-white transition-colors">Press & Media</Link></li>
            <li><Link href="/submit" className="hover:text-white transition-colors">Submit a Fault</Link></li>
            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 px-4 py-4 text-center text-xs text-gray-600">
        © {new Date().getFullYear()} Two Bit Digital Ltd · carknownfaults.com · All fault data is informational only
      </div>
    </footer>
  );
}
