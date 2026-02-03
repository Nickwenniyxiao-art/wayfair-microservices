import { Link } from 'react-router-dom'
import { ArrowRight, Leaf, Truck, Shield, RotateCcw } from 'lucide-react'
import ProductCard from '../components/ProductCard'

export default function Home() {
  const categories = [
    { id: 'furniture', name: '家具', description: '现代北欧家具' },
    { id: 'decor', name: '装饰', description: '家居装饰品' },
    { id: 'lighting', name: '照明', description: '照明灯具' },
    { id: 'kitchen', name: '厨房', description: '厨房用品' },
    { id: 'bedroom', name: '卧室', description: '卧室用品' },
    { id: 'bathroom', name: '浴室', description: '浴室用品' },
  ]

  const features = [
    {
      icon: Leaf,
      title: '可持续设计',
      description: '采用环保材料，致力于可持续发展',
    },
    {
      icon: Truck,
      title: '免费配送',
      description: '满 500 元免费配送，快速送达',
    },
    {
      icon: Shield,
      title: '品质保证',
      description: '所有产品均经过严格质量检查',
    },
    {
      icon: RotateCcw,
      title: '30 天退货',
      description: '不满意 30 天内无条件退货',
    },
  ]

  const featuredProducts = [
    { id: '1', name: '北欧简约书架', price: 1299, category: '家具', rating: 4.8 },
    { id: '2', name: '现代吊灯', price: 599, category: '照明', rating: 4.6 },
    { id: '3', name: '白色陶瓷花瓶', price: 299, category: '装饰', rating: 4.9 },
    { id: '4', name: '天然木质餐桌', price: 3999, category: '家具', rating: 4.7 },
  ]

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            北欧极简生活方式
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            精选全球优质家居用品，为您的家带来简洁、优雅的北欧风格
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-3 bg-teal-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-teal-700 transition transform hover:scale-105"
          >
            开始探索
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-lg mb-4">
                  <Icon className="w-8 h-8 text-teal-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">浏览分类</h2>
            <p className="text-gray-600 text-lg">发现您喜爱的家居风格</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className="group relative overflow-hidden rounded-lg bg-white border border-gray-200 hover:border-gray-300 transition"
              >
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-gray-200 group-hover:to-gray-300 transition flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🏠</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {category.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">热销商品</h2>
          <p className="text-gray-600 text-lg">精选最受欢迎的北欧风格家居用品</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-teal-600 font-semibold hover:text-teal-700 transition"
          >
            查看全部商品
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">加入我们的社区</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            订阅我们的新闻通讯，获取最新的产品发布、设计灵感和独家优惠
          </p>
          <div className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="输入您的邮箱地址"
              className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-teal-500"
            />
            <button className="px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition">
              订阅
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
