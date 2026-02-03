import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Checkout() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (step < 3) {
      setStep(step + 1)
    } else {
      alert('订单已提交！')
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">结账</h1>

      {/* Progress Steps */}
      <div className="flex justify-between mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center flex-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              s <= step ? 'bg-secondary text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {s}
            </div>
            {s < 3 && <div className={`flex-1 h-1 mx-2 ${s < step ? 'bg-secondary' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">送货地址</h2>
            <div className="space-y-4">
              <input
                type="email"
                placeholder="邮箱"
                className="w-full border rounded-lg px-4 py-2"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="名字"
                  className="border rounded-lg px-4 py-2"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="姓氏"
                  className="border rounded-lg px-4 py-2"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </div>
              <input
                type="text"
                placeholder="地址"
                className="w-full border rounded-lg px-4 py-2"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
              <div className="grid grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="城市"
                  className="border rounded-lg px-4 py-2"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="州"
                  className="border rounded-lg px-4 py-2"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="邮编"
                  className="border rounded-lg px-4 py-2"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">配送方式</h2>
            <div className="space-y-3">
              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input type="radio" name="shipping" defaultChecked className="mr-3" />
                <div>
                  <p className="font-bold">标准配送</p>
                  <p className="text-gray-600">5-7 个工作日 - ¥50</p>
                </div>
              </label>
              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input type="radio" name="shipping" className="mr-3" />
                <div>
                  <p className="font-bold">快速配送</p>
                  <p className="text-gray-600">2-3 个工作日 - ¥100</p>
                </div>
              </label>
              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input type="radio" name="shipping" className="mr-3" />
                <div>
                  <p className="font-bold">次日配送</p>
                  <p className="text-gray-600">1 个工作日 - ¥200</p>
                </div>
              </label>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">支付信息</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="卡号"
                className="w-full border rounded-lg px-4 py-2"
                value={formData.cardNumber}
                onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="border rounded-lg px-4 py-2"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="CVV"
                  className="border rounded-lg px-4 py-2"
                  value={formData.cvv}
                  onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-4 mt-8">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="flex-1 border border-secondary text-secondary py-3 rounded-lg font-bold hover:bg-gray-50 transition"
            >
              上一步
            </button>
          )}
          <button
            type="submit"
            className="flex-1 bg-secondary text-white py-3 rounded-lg font-bold hover:bg-opacity-90 transition"
          >
            {step === 3 ? '提交订单' : '下一步'}
          </button>
        </div>
      </form>
    </div>
  )
}
