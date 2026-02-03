import { useParams } from 'react-router-dom'
import { ShoppingCart, Heart } from 'lucide-react'

export default function ProductDetail() {
  const { id } = useParams()
  const [quantity, setQuantity] = useState(1)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
          <span className="text-9xl">🏠</span>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-4">产品 {id}</h1>
          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-bold text-secondary">¥999.99</span>
            <span className="text-yellow-500">⭐⭐⭐⭐⭐ (128 评论)</span>
          </div>

          <p className="text-gray-600 mb-6">
            这是一个高质量的产品，采用优质材料制成。完美适合您的家居装饰。
          </p>

          <div className="mb-6">
            <h3 className="font-bold mb-3">产品详情</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• 尺寸: 200cm x 100cm x 80cm</li>
              <li>• 材料: 优质木材</li>
              <li>• 颜色: 棕色</li>
              <li>• 重量: 50kg</li>
            </ul>
          </div>

          <div className="mb-6">
            <label className="block font-bold mb-2">数量</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
              >
                -
              </button>
              <span className="text-xl font-bold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex gap-4">
            <button className="flex-1 bg-secondary text-white py-3 rounded-lg font-bold hover:bg-opacity-90 transition flex items-center justify-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              加入购物车
            </button>
            <button className="px-6 py-3 border border-secondary text-secondary rounded-lg font-bold hover:bg-gray-50 transition flex items-center justify-center gap-2">
              <Heart className="w-5 h-5" />
              收藏
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
