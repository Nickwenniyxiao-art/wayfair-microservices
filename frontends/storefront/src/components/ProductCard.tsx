import { Link } from 'react-router-dom'
import { ShoppingCart, Heart } from 'lucide-react'
import { useState } from 'react'

interface ProductCardProps {
  id: string
  name: string
  price: number
  image?: string
  rating?: number
  category?: string
}

export default function ProductCard({ id, name, price, image, rating, category }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)

  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 transition group">
      {/* Image Container */}
      <Link to={`/products/${id}`} className="block relative overflow-hidden bg-gray-100 aspect-square">
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-gray-200 group-hover:to-gray-300 transition">
          {image ? (
            <img src={image} alt={name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-6xl">🏠</span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        {category && (
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
            {category}
          </p>
        )}

        {/* Name */}
        <Link to={`/products/${id}`} className="block">
          <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-teal-600 transition">
            {name}
          </h3>
        </Link>

        {/* Rating */}
        {rating && (
          <div className="flex items-center gap-1 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`text-xs ${i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                  ★
                </span>
              ))}
            </div>
            <span className="text-xs text-gray-500">({rating.toFixed(1)})</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-bold text-gray-900">
            ¥{price.toFixed(2)}
          </span>
          <button
            onClick={() => setIsWishlisted(!isWishlisted)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <Heart
              className={`w-5 h-5 transition ${
                isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'
              }`}
            />
          </button>
        </div>

        {/* Add to Cart Button */}
        <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition">
          <ShoppingCart className="w-4 h-4" />
          加入购物车
        </button>
      </div>
    </div>
  )
}
