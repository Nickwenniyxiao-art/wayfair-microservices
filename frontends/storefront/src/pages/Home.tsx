import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function Home() {
  const categories = [
    { id: 1, name: '家具', image: '🛋️' },
    { id: 2, name: '装饰', image: '🖼️' },
    { id: 3, name: '床上用品', image: '🛏️' },
    { id: 4, name: '照明', image: '💡' },
    { id: 5, name: '厨房', image: '🍳' },
    { id: 6, name: '浴室', image: '🚿' },
  ]

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">欢迎来到 Wayfair</h1>
          <p className="text-xl mb-8">发现您梦想中的家居用品</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-white text-primary px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition"
          >
            开始购物
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">浏览分类</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to="/products"
              className="bg-gray-100 rounded-lg p-8 text-center hover:shadow-lg transition"
            >
              <div className="text-6xl mb-4">{category.image}</div>
              <h3 className="text-xl font-bold text-primary">{category.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">热销产品</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                <div className="bg-gray-200 h-48 flex items-center justify-center">
                  <span className="text-6xl">🏠</span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">产品 {i}</h3>
                  <p className="text-gray-600 mb-4">¥999.99</p>
                  <button className="w-full bg-secondary text-white py-2 rounded-lg hover:bg-opacity-90 transition">
                    加入购物车
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">特别优惠</h2>
          <p className="text-xl mb-8">新用户注册享受 10% 折扣</p>
          <button className="bg-accent text-white px-8 py-3 rounded-lg font-bold hover:bg-opacity-90 transition">
            立即注册
          </button>
        </div>
      </section>
    </div>
  )
}
