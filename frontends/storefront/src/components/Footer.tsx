export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold mb-4">关于我们</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">公司简介</a></li>
              <li><a href="#" className="hover:text-white">联系我们</a></li>
              <li><a href="#" className="hover:text-white">招聘</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">帮助</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">常见问题</a></li>
              <li><a href="#" className="hover:text-white">配送信息</a></li>
              <li><a href="#" className="hover:text-white">退货政策</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">法律</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">隐私政策</a></li>
              <li><a href="#" className="hover:text-white">服务条款</a></li>
              <li><a href="#" className="hover:text-white">Cookie 政策</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">关注我们</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Facebook</a></li>
              <li><a href="#" className="hover:text-white">Twitter</a></li>
              <li><a href="#" className="hover:text-white">Instagram</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Wayfair Clone. 保留所有权利。</p>
        </div>
      </div>
    </footer>
  )
}
