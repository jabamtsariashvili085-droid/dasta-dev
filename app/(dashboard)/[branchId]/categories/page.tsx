'use client'

import { useState, useEffect, use } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Search, Pencil, Trash2, FolderTree, Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function CategoriesPage({ params }: { params: Promise<{ branchId: string }> }) {
    const { branchId } = use(params)
    const [categories, setCategories] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState<any>(null)

    // Form State
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [saving, setSaving] = useState(false)

    const supabase = createClient()

    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        setLoading(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Get company_id first
        const { data: companyUser } = await supabase
            .from('company_users')
            .select('company_id')
            .single()

        if (companyUser) {
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .eq('company_id', companyUser.company_id)
                .order('name')

            if (error) {
                toast.error('კატეგორიების ჩატვირთვა ვერ მოხერხდა')
            } else {
                setCategories(data || [])
            }
        }
        setLoading(false)
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            const { data: companyUser } = await supabase
                .from('company_users')
                .select('company_id')
                .single()

            if (!companyUser) throw new Error('კომპანია ვერ მოიძებნა')

            if (editingCategory) {
                const { error } = await supabase
                    .from('categories')
                    .update({ name, description })
                    .eq('id', editingCategory.id)
                if (error) throw error
                toast.success('კატეგორია განახლდა')
            } else {
                const { error } = await supabase
                    .from('categories')
                    .insert({
                        name,
                        description,
                        company_id: companyUser.company_id
                    })
                if (error) throw error
                toast.success('კატეგორია დაემატა')
            }

            setIsModalOpen(false)
            setEditingCategory(null)
            setName('')
            setDescription('')
            fetchCategories()
        } catch (error: any) {
            toast.error('შეცდომა: ' + error.message)
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('ნამდვილად გსურთ კატეგორიის წაშლა?')) return

        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', id)

        if (error) {
            toast.error('წაშლა ვერ მოხერხდა. შესაძლოა კატეგორია გამოიყენება პროდუქტებში.')
        } else {
            toast.success('კატეგორია წაიშალა')
            fetchCategories()
        }
    }

    const openEdit = (cat: any) => {
        setEditingCategory(cat)
        setName(cat.name)
        setDescription(cat.description || '')
        setIsModalOpen(true)
    }

    const filteredCategories = categories.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="animate-fade">
            <div className="page-header">
                <div>
                    <h2 className="page-title">კატეგორიები</h2>
                    <p className="page-subtitle">პროდუქციის ორგანიზება ჯგუფების მიხედვით</p>
                </div>

                <button
                    onClick={() => {
                        setEditingCategory(null)
                        setName('')
                        setDescription('')
                        setIsModalOpen(true)
                    }}
                    className="btn btn-primary"
                >
                    <Plus className="w-4 h-4 mr-2" /> ახალი კატეგორია
                </button>
            </div>

            {/* Table Section */}
            <div className="card no-padding">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            className="form-input pl-10"
                            placeholder="ძებნა..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="text-xs text-gray-400 font-medium">
                        სულ: {filteredCategories.length} კატეგორია
                    </div>
                </div>

                {loading ? (
                    <div className="p-20 flex flex-col items-center justify-center text-gray-400">
                        <Loader2 className="w-8 h-8 animate-spin mb-2" />
                        <span>იტვირთება...</span>
                    </div>
                ) : filteredCategories.length === 0 ? (
                    <div className="p-20 flex flex-col items-center justify-center text-gray-400 bg-gray-25/50">
                        <FolderTree className="w-12 h-12 mb-4 opacity-20" />
                        <p className="font-medium text-gray-500">კატეგორიები არ არის</p>
                        <p className="text-xs">დაამატეთ ახალი კატეგორია სამუშაოდ</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>დასახელება</th>
                                    <th>აღწერა</th>
                                    <th className="text-right">მოქმედება</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCategories.map((cat) => (
                                    <tr key={cat.id}>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
                                                    {cat.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-bold text-gray-700">{cat.name}</span>
                                            </div>
                                        </td>
                                        <td className="text-gray-500 max-w-md truncate">
                                            {cat.description || '-'}
                                        </td>
                                        <td>
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => openEdit(cat)}
                                                    className="btn-icon hover:bg-blue-50 hover:text-blue-600"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(cat.id)}
                                                    className="btn-icon hover:bg-red-50 hover:text-red-600"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Basic Modal Implementation */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/40 backdrop-blur-sm animate-fade">
                    <div className="card modal-sm w-full animate-slide-up shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900">
                                {editingCategory ? 'კატეგორიის რედაქტირება' : 'ახალი კატეგორია'}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="form-group">
                                <label className="form-label">დასახელება</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="მაგ: სასმელები"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">აღწერა (არასავალდებულო)</label>
                                <textarea
                                    className="form-input min-h-[100px] resize-none"
                                    placeholder="მოკლე აღწერა..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            <div className="flex gap-3 mt-8">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="btn btn-secondary flex-1"
                                >
                                    გაუქმება
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary flex-1"
                                    disabled={saving}
                                >
                                    {saving ? 'ინახება...' : 'შენახვა'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
