import { Link } from 'react-router-dom'
import { ShoppingCart, User, Search, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* Top Navigation */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-gray-900 tracking-tight">
          Wayfair
        </Link>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex flex-1 mx-8">
          <div className="w-full relative">
            <input
              type="text"
              placeholder="搜索商品..."
              className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-600 focus:bg-white transition"
            />
            <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Right Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/account" className="flex items-center gap-2 text-gray-700 hover:text-teal-600 transition">
            <User className="w-5 h-5" />
            <span className="text-sm">账户</span>
          </Link>
          <Link to="/cart" className="flex items-center gap-2 text-gray-700 hover:text-teal-600 transition">
            <ShoppingCart className="w-5 h-5" />
            <span className="text-sm">购物车</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="w-6 h-6 text-gray-900" />
          ) : (
            <Menu className="w-6 h-6 text-gray-900" />
          )}
        </button>
      </div>

      {/* Category Navigation */}
      <nav className="hidden md:block border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-8 py-3">
          <Link to="/products" className="text-sm text-gray-700 hover:text-teal-600 transition font-medium">
            全部商品
          </Link>
          <Link to="/products?category=furniture" className="text-sm text-gray-700 hover:text-teal-600 transition font-medium">
            家具
          </Link>
          <Link to="/products?category=decor" className="text-sm text-gray-700 hover:text-teal-600 transition font-medium">
            装饰
          </Link>
          <Link to="/products?category=lighting" className="text-sm text-gray-700 hover:text-teal-600 transition font-medium">
            照明
          </Link>
          <Link to="/products?category=kitchen" className="text-sm text-gray-700 hover:text-teal-600 transition font-medium">
            厨房
          </Link>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-gray-50">
          <div className="px-4 py-4 space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="搜索商品..."
                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-600"
              />
              <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
            <nav className="space-y-2">
              <Link to="/products" className="block text-sm text-gray-700 hover:text-teal-600 py-2">
                全部商品
              </Link>
              <Link to="/products?category=furniture" className="block text-sm text-gray-700 hover:text-teal-600 py-2">
                家具
              </Link>
              <Link to="/products?category=decor" className="block text-sm text-gray-700 hover:text-teal-600 py-2">
                装饰
              </Link>
              <Link to="/account" className="block text-sm text-gray-700 hover:text-teal-600 py-2">
                账户
              </Link>
              <Link to="/cart" className="block text-sm text-gray-700 hover:text-teal-600 py-2">
                购物车
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
