'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'react-hot-toast'
import { X, Package, Save, Loader2, Image as ImageIcon } from 'lucide-react'

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  product: any
  categories: any[]
  onSuccess: () => void
}

export default function ProductModal({ isOpen, onClose, product, categories, onSuccess }: ProductModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    barcode: '',
    category_id: '',
    purchase_price: 0,
    retail_price: 0,
    wholesale_price: 0,
    vip_price: 0,
    min_price: 0,
    current_stock: 0,
    min_stock: 5,
    unit: 'ცალი',
    vat_rate: 18,
    image_url: '',
    status: 'active'
  })

  const supabase = createClient()

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        sku: product.sku || '',
        barcode: product.barcode || '',
        category_id: product.category_id || '',
        purchase_price: product.purchase_price || 0,
        retail_price: product.retail_price || 0,
        wholesale_price: product.wholesale_price || 0,
        vip_price: product.vip_price || 0,
        min_price: product.min_price || 0,
        current_stock: product.current_stock || 0,
        min_stock: product.min_stock || 5,
        unit: product.unit || 'ცალი',
        vat_rate: product.vat_rate || 18,
        image_url: product.image_url || '',
        status: product.status || 'active'
      })
    } else {
      setFormData({
        name: '',
        sku: '',
        barcode: '',
        category_id: categories[0]?.id || '',
        purchase_price: 0,
        retail_price: 0,
        wholesale_price: 0,
        vip_price: 0,
        min_price: 0,
        current_stock: 0,
        min_stock: 5,
        unit: 'ცალი',
        vat_rate: 18,
        image_url: '',
        status: 'active'
      })
    }
  }, [product, categories, isOpen])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      const { data: companyUser } = await supabase
        .from('company_users')
        .select('company_id')
        .single()

      if (!companyUser) throw new Error('კომპანია ვერ მოიძებნა')

      const payload = {
        ...formData,
        company_id: companyUser.company_id,
        updated_at: new Date()
      }

      if (product) {
        const { error } = await supabase
          .from('products')
          .update(payload)
          .eq('id', product.id)
        if (error) throw error
        toast.success('პროდუქტი განახლდა')
      } else {
        const { error } = await supabase
          .from('products')
          .insert(payload)
        if (error) throw error
        toast.success('პროდუქტი დაემატა')
      }

      onSuccess()
      onClose()
    } catch (error: any) {
      toast.error('შეცდომა: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-fade overflow-y-auto">
      <div className="card modal-lg w-full max-h-[90vh] flex flex-col animate-slide-up shadow-2xl relative my-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 flex-none bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-50 text-brand-600 rounded-lg">
              <Package className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              {product ? 'პროდუქტის რედაქტირება' : 'ახალი პროდუქტი'}
            </h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar bg-gray-25/30">
          {/* Basic Info Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">ძირითადი მონაცემები</h4>
              
              <div className="form-group">
                <label className="form-label">პროდუქტის დასახელება</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">SKU (არტიკული)</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={formData.sku}
                    onChange={(e) => setFormData({...formData, sku: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">ბარკოდი</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={formData.barcode}
                    onChange={(e) => setFormData({...formData, barcode: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">კატეგორია</label>
                  <select 
                    className="form-input form-select"
                    value={formData.category_id}
                    onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                    required
                  >
                    <option value="">აირჩიეთ...</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">ზომის ერთეული</label>
                  <select 
                    className="form-input form-select"
                    value={formData.unit}
                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                  >
                    <option value="ცალი">ცალი</option>
                    <option value="კგ">კგ</option>
                    <option value="ლიტრი">ლიტრი</option>
                    <option value="მეტრა">მეტრა</option>
                    <option value="შეფუთვა">შეფუთვა</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Price Section */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">ფასები და მარაგი</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">თვითღირებულება (₾)</label>
                  <input 
                    type="number" step="0.01" className="form-input" 
                    value={formData.purchase_price}
                    onChange={(e) => setFormData({...formData, purchase_price: Number(e.target.value)})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">საცალო ფასი (₾)</label>
                  <input 
                    type="number" step="0.01" className="form-input" 
                    value={formData.retail_price}
                    onChange={(e) => setFormData({...formData, retail_price: Number(e.target.value)})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">საბითუმო ფასი (₾)</label>
                  <input 
                    type="number" step="0.01" className="form-input" 
                    value={formData.wholesale_price}
                    onChange={(e) => setFormData({...formData, wholesale_price: Number(e.target.value)})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">VIP ფასი (₾)</label>
                  <input 
                    type="number" step="0.01" className="form-input" 
                    value={formData.vip_price}
                    onChange={(e) => setFormData({...formData, vip_price: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                <div className="form-group">
                  <label className="form-label">არსებული მარაგი</label>
                  <input 
                    type="number" className="form-input bg-brand-25/30 font-bold" 
                    value={formData.current_stock}
                    onChange={(e) => setFormData({...formData, current_stock: Number(e.target.value)})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">მინიმალური მარაგი</label>
                  <input 
                    type="number" className="form-input" 
                    value={formData.min_stock}
                    onChange={(e) => setFormData({...formData, min_stock: Number(e.target.value)})}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Additional Settings */}
          <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">დამატებითი</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label className="form-label">სურათის URL</label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="text" className="form-input pl-10" 
                      placeholder="https://example.com/image.jpg"
                      value={formData.image_url}
                      onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">სტატუსი</label>
                <div className="flex gap-4 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" name="status" value="active" 
                      checked={formData.status === 'active'}
                      onChange={() => setFormData({...formData, status: 'active'})} 
                    />
                    <span className="text-sm">აქტიური</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" name="status" value="inactive" 
                      checked={formData.status === 'inactive'}
                      onChange={() => setFormData({...formData, status: 'inactive'})} 
                    />
                    <span className="text-sm text-gray-500">პასიური</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t border-gray-100 flex-none bg-white sticky bottom-0 z-10">
            <button 
              type="button"
              onClick={onClose}
              className="btn btn-secondary px-8"
            >
              გაუქმება
            </button>
            <button 
              type="submit" 
              className="btn btn-primary px-12"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  შენახვა
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
