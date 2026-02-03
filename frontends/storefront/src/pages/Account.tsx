import { useState } from 'react'
import { LogOut, User, MapPin, ShoppingBag } from 'lucide-react'

export default function Account() {
  const [tab, setTab] = useState('profile')

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">我的账户</h1>

      <div className="flex gap-8">
        {/* Sidebar */}
        <aside className="w-48 flex-shrink-0">
          <nav className="space-y-2">
            <button
              onClick={() => setTab('profile')}
              className={`w-full flex items-center gap-2 px-4 py-3 rounded-lg transition ${
                tab === 'profile' ? 'bg-secondary text-white' : 'hover:bg-gray-100'
              }`}
            >
              <User className="w-5 h-5" />
              个人信息
            </button>
            <button
              onClick={() => setTab('addresses')}
              className={`w-full flex items-center gap-2 px-4 py-3 rounded-lg transition ${
                tab === 'addresses' ? 'bg-secondary text-white' : 'hover:bg-gray-100'
              }`}
            >
              <MapPin className="w-5 h-5" />
              地址簿
            </button>
            <button
              onClick={() => setTab('orders')}
              className={`w-full flex items-center gap-2 px-4 py-3 rounded-lg transition ${
                tab === 'orders' ? 'bg-secondary text-white' : 'hover:bg-gray-100'
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              我的订单
            </button>
            <button className="w-full flex items-center gap-2 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition">
              <LogOut className="w-5 h-5" />
              退出登录
            </button>
          </nav>
        </aside>

        {/* Content */}
        <div className="flex-1">
          {tab === 'profile' && (
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold mb-6">个人信息</h2>
              <div className="space-y-4">
                <div>
                  <label className="block font-bold mb-2">名字</label>
                  <input type="text" defaultValue="张" className="w-full border rounded-lg px-4 py-2" />
                </div>
                <div>
                  <label className="block font-bold mb-2">姓氏</label>
                  <input type="text" defaultValue="三" className="w-full border rounded-lg px-4 py-2" />
                </div>
                <div>
                  <label className="block font-bold mb-2">邮箱</label>
                  <input type="email" defaultValue="user@example.com" className="w-full border rounded-lg px-4 py-2" />
                </div>
                <div>
                  <label className="block font-bold mb-2">电话</label>
                  <input type="tel" defaultValue="13800138000" className="w-full border rounded-lg px-4 py-2" />
                </div>
                <button className="bg-secondary text-white px-6 py-2 rounded-lg font-bold hover:bg-opacity-90 transition">
                  保存更改
                </button>
              </div>
            </div>
          )}

          {tab === 'addresses' && (
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold mb-6">地址簿</h2>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <p className="font-bold">默认地址</p>
                  <p className="text-gray-600">北京市朝阳区某街道 123 号</p>
                  <button className="text-secondary hover:underline mt-2">编辑</button>
                </div>
              </div>
              <button className="mt-6 bg-secondary text-white px-6 py-2 rounded-lg font-bold hover:bg-opacity-90 transition">
                添加新地址
              </button>
            </div>
          )}

          {tab === 'orders' && (
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold mb-6">我的订单</h2>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-bold">订单 #12345</p>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">已送达</span>
                  </div>
                  <p className="text-gray-600">2024-02-01 • 2 件商品 • ¥2,299</p>
                  <button className="text-secondary hover:underline mt-2">查看详情</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
