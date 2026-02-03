import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div>
            <h3 className="text-white text-lg font-bold mb-6">Wayfair</h3>
            <p className="text-sm leading-relaxed mb-6">
              为您的家带来北欧极简的生活方式，精选全球优质家居用品。
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-teal-500" />
                <span className="text-sm">400-123-4567</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-teal-500" />
                <span className="text-sm">support@wayfair.com</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-teal-500" />
                <span className="text-sm">北京市朝阳区</span>
              </div>
            </div>
          </div>

          {/* Shopping */}
          <div>
            <h4 className="text-white font-bold mb-6">购物</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/products" className="text-sm hover:text-teal-500 transition">
                  全部商品
                </Link>
              </li>
              <li>
                <Link to="/products?category=furniture" className="text-sm hover:text-teal-500 transition">
                  家具
                </Link>
              </li>
              <li>
                <Link to="/products?category=decor" className="text-sm hover:text-teal-500 transition">
                  装饰
                </Link>
              </li>
              <li>
                <Link to="/products?category=lighting" className="text-sm hover:text-teal-500 transition">
                  照明
                </Link>
              </li>
              <li>
                <Link to="/products?category=kitchen" className="text-sm hover:text-teal-500 transition">
                  厨房用品
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-bold mb-6">客户服务</h4>
            <ul className="space-y-3">
              <li>
                <Link to="#" className="text-sm hover:text-teal-500 transition">
                  关于我们
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm hover:text-teal-500 transition">
                  联系我们
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm hover:text-teal-500 transition">
                  配送信息
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm hover:text-teal-500 transition">
                  退货政策
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm hover:text-teal-500 transition">
                  常见问题
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-bold mb-6">法律</h4>
            <ul className="space-y-3">
              <li>
                <Link to="#" className="text-sm hover:text-teal-500 transition">
                  隐私政策
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm hover:text-teal-500 transition">
                  服务条款
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm hover:text-teal-500 transition">
                  Cookie 政策
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm hover:text-teal-500 transition">
                  用户协议
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          {/* Newsletter */}
          <div className="mb-8">
            <h4 className="text-white font-bold mb-4">订阅我们的新闻通讯</h4>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="输入您的邮箱地址"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-teal-500"
              />
              <button className="px-6 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition">
                订阅
              </button>
            </div>
          </div>

          {/* Bottom */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400">
              &copy; 2024 Wayfair. 保留所有权利。
            </p>
            <div className="flex items-center gap-6">
              <span className="text-sm text-gray-400">关注我们：</span>
              <div className="flex gap-4">
                <Link to="#" className="text-gray-400 hover:text-teal-500 transition">
                  Facebook
                </Link>
                <Link to="#" className="text-gray-400 hover:text-teal-500 transition">
                  Instagram
                </Link>
                <Link to="#" className="text-gray-400 hover:text-teal-500 transition">
                  Twitter
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
