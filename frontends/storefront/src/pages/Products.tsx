import { useState } from 'react'
import { Filter } from 'lucide-react'

export default function Products() {
  const [filters, setFilters] = useState({
    category: '',
    priceRange: 'all',
    sort: 'newest',
  })

  const products = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: `产品 ${i + 1}`,
    price: Math.floor(Math.random() * 5000) + 100,
    image: '🏠',
    rating: Math.floor(Math.random() * 5) + 1,
  }))

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">所有产品</h1>

      <div className="flex gap-8">
        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-6">
              <Filter className="w-5 h-5" />
              <h2 className="font-bold text-lg">筛选</h2>
            </div>

            <div className="mb-6">
              <h3 className="font-bold mb-3">分类</h3>
              <select
                className="w-full border rounded-lg px-3 py-2"
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              >
                <option value="">全部</option>
                <option value="furniture">家具</option>
                <option value="decor">装饰</option>
                <option value="bedding">床上用品</option>
              </select>
            </div>

            <div className="mb-6">
              <h3 className="font-bold mb-3">价格范围</h3>
              <select
                className="w-full border rounded-lg px-3 py-2"
                value={filters.priceRange}
                onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
              >
                <option value="all">全部</option>
                <option value="0-500">¥0 - ¥500</option>
                <option value="500-1000">¥500 - ¥1000</option>
                <option value="1000-5000">¥1000 - ¥5000</option>
              </select>
            </div>

            <div>
              <h3 className="font-bold mb-3">排序</h3>
              <select
                className="w-full border rounded-lg px-3 py-2"
                value={filters.sort}
                onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
              >
                <option value="newest">最新</option>
                <option value="price-low">价格: 低到高</option>
                <option value="price-high">价格: 高到低</option>
                <option value="rating">评分</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                <div className="bg-gray-200 h-48 flex items-center justify-center">
                  <span className="text-6xl">{product.image}</span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-secondary">¥{product.price}</span>
                    <span className="text-yellow-500">⭐ {product.rating}</span>
                  </div>
                  <button className="w-full bg-secondary text-white py-2 rounded-lg hover:bg-opacity-90 transition">
                    加入购物车
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
