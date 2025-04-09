// src/components/Nav.js
import { Link } from 'react-router-dom';

export function Nav() {
  return (
    <nav className="flex items-center justify-between p-4 bg-black text-white">
      <div className="text-2xl font-bold">
        CRIPTO EXCHANGE
      </div>

      <div className="space-x-4">
        <Link to="/home" className="hover:text-gray-400">Home</Link>
        <Link to="/deposit" className="hover:text-gray-400">Deposit</Link>
        <Link to="/spot/BTC" className="hover:text-gray-400">Spot</Link>
      </div>
    </nav>
  );
}
