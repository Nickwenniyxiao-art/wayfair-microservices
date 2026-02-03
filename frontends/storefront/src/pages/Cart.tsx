import { Link } from 'react-router-dom'
import { Trash2, Plus, Minus } from 'lucide-react'

export default function Cart() {
  const cartItems = [
    { id: 1, name: '产品 1', price: 999, quantity: 1 },
    { id: 2, name: '产品 2', price: 1299, quantity: 2 },
  ]

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = 50
  const tax = Math.round(subtotal * 0.1)
  const total = subtotal + shipping + tax

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">购物车</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          {cartItems.length > 0 ? (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-md p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="bg-gray-200 w-24 h-24 rounded-lg flex items-center justify-center text-4xl">
                      🏠
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{item.name}</h3>
                      <p className="text-gray-600">¥{item.price}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="font-bold w-24 text-right">¥{item.price * item.quantity}</span>
                    <button className="text-red-500 hover:bg-red-50 p-2 rounded">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">购物车为空</p>
              <Link to="/products" className="text-secondary hover:underline">
                继续购物
              </Link>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 h-fit">
          <h2 className="text-xl font-bold mb-4">订单摘要</h2>
          <div className="space-y-3 mb-4 pb-4 border-b">
            <div className="flex justify-between">
              <span>小计</span>
              <span>¥{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>运费</span>
              <span>¥{shipping}</span>
            </div>
            <div className="flex justify-between">
              <span>税费</span>
              <span>¥{tax}</span>
            </div>
          </div>
          <div className="flex justify-between text-xl font-bold mb-6">
            <span>总计</span>
            <span className="text-secondary">¥{total}</span>
          </div>
          <Link
            to="/checkout"
            className="w-full bg-secondary text-white py-3 rounded-lg font-bold hover:bg-opacity-90 transition block text-center"
          >
            结账
          </Link>
        </div>
      </div>
    </div>
  )
}
