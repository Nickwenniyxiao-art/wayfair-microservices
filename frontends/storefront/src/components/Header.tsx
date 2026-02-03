import { Link } from 'react-router-dom'
import { ShoppingCart, User, Search } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-primary">
          Wayfair
        </Link>
        
        <div className="flex-1 mx-8">
          <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索商品..."
              className="flex-1 ml-2 bg-transparent outline-none"
            />
          </div>
        </div>

        <nav className="flex items-center gap-6">
          <Link to="/products" className="text-gray-700 hover:text-primary">
            商品
          </Link>
          <Link to="/cart" className="flex items-center gap-2 text-gray-700 hover:text-primary">
            <ShoppingCart className="w-5 h-5" />
            购物车
          </Link>
          <Link to="/account" className="flex items-center gap-2 text-gray-700 hover:text-primary">
            <User className="w-5 h-5" />
            账户
          </Link>
        </nav>
      </div>
    </header>
  )
}
