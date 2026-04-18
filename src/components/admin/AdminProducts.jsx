import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useProductStore } from '../../services/productStore';
import { Edit2, Trash2, Plus, X, PackageOpen, Flame, UploadCloud } from 'lucide-react';
import toast from 'react-hot-toast';

function AdminProducts() {
    const { products, deleteProduct, createProduct, updateProduct, isLoading } = useProductStore();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [categories, setCategories] = useState([]);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        name: '', basePrice: '', category: '', imageUrl: '',
        description: '', ingredients: '', howToUse: '', size: '', variants: [],
        isBestSeller: false
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get('https://nyla-backend.onrender.com/api/categories');
                setCategories(data);
            } catch (error) {
                console.error("Failed to load categories", error);
                toast.error("Failed to load categories for dropdown");
            }
        };
        fetchCategories();
    }, []);

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formDataToUpload = new FormData();
        formDataToUpload.append('image', file);
        setUploading(true);

        try {
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            const { data } = await axios.post('https://nyla-backend.onrender.com/api/upload', formDataToUpload, config);

            setFormData({ ...formData, imageUrl: data.url });
            toast.success('Image uploaded successfully! 📸');
        } catch (error) {
            console.error(error);
            toast.error('Image upload failed!');
        } finally {
            setUploading(false);
        }
    };

    const handleAddVariant = () => {
        setFormData({ ...formData, variants: [...formData.variants, { id: Date.now().toString(), value: '', shadeColor: '#ff0000', stock: 0 }] });
    };

    const handleVariantChange = (index, field, val) => {
        const newVariants = [...formData.variants];
        newVariants[index][field] = val;
        setFormData({ ...formData, variants: newVariants });
    };

    const handleRemoveVariant = (index) => {
        const newVariants = formData.variants.filter((_, i) => i !== index);
        setFormData({ ...formData, variants: newVariants });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        const res = await deleteProduct(id);
        if (res.success) toast.success('Product deleted successfully 🗑️');
        else toast.error(res.message || 'Failed to delete product!');
    };

    const handleEditClick = (product) => {
        setEditingId(product._id);
        setFormData({
            name: product.name, basePrice: product.basePrice, category: product.category,
            imageUrl: product.imageUrl, description: product.description, ingredients: product.ingredients || '',
            howToUse: product.howToUse || '', size: product.size || '', variants: product.variants || [],
            isBestSeller: product.isBestSeller || false
        });
        setIsModalOpen(true);
    };

    const openAddModal = () => {
        setEditingId(null);
        setFormData({
            name: '', basePrice: '', category: '', imageUrl: '', description: '', ingredients: '',
            howToUse: '', size: '', variants: [], isBestSeller: false
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.category) return toast.error("Please select a category!");

        const productData = { ...formData, basePrice: Number(formData.basePrice) };

        let res;
        if (editingId) res = await updateProduct(editingId, productData);
        else res = await createProduct(productData);

        if (res.success) {
            toast.success(editingId ? 'Product updated! ✏️' : 'Product added! 🎉');
            setIsModalOpen(false);
        } else toast.error(res.message || 'Action failed!');
    };

    return (
        <div className="space-y-6 relative">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-display text-ink flex items-center gap-2">
                    <PackageOpen className="text-burgundy-800" /> Products
                </h1>
                <button onClick={openAddModal} className="bg-burgundy-800 text-white px-4 md:px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-ink transition-colors font-medium shadow-sm text-sm md:text-base">
                    <Plus size={18} /> <span className="hidden sm:inline">Add New Product</span><span className="sm:hidden">Add</span>
                </button>
            </div>

            <div className="bg-white border border-petal-gray rounded-2xl overflow-hidden shadow-sm">

                <div className="block md:hidden divide-y divide-petal-gray">
                    {products.map((product) => (
                        <div key={product._id} className="p-4 space-y-4 hover:bg-[#FAF8F6]/50 transition-colors">
                            <div className="flex gap-4 items-center">
                                <img src={product.imageUrl} alt={product.name} className="w-16 h-16 rounded-xl object-cover border border-petal-gray/50" />
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium text-ink text-sm truncate flex items-center gap-2">
                                        {product.name}
                                        {product.isBestSeller && (
                                            <Flame size={14} className="text-orange-500 fill-orange-500" />
                                        )}
                                    </div>
                                    <div className="text-xs text-stone">{product.category}</div>
                                    <div className="font-semibold text-burgundy-800 mt-1">{product.basePrice} EGP</div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <button onClick={() => handleEditClick(product)} className="p-2 text-stone hover:text-ink bg-[#FAF8F6] rounded-lg border border-petal-gray transition-colors"><Edit2 size={16} /></button>
                                    <button onClick={() => handleDelete(product._id)} className="p-2 text-red-500 hover:text-red-700 bg-red-50 rounded-lg border border-red-100 transition-colors"><Trash2 size={16} /></button>
                                </div>
                            </div>

                            <div className="bg-[#FAF8F6] p-3 rounded-lg border border-petal-gray text-sm">
                                <div className="text-xs text-stone font-medium mb-2 border-b border-petal-gray pb-1">Size: {product.size || '-'}</div>
                                {product.variants?.length > 0 ? (
                                    <div className="flex flex-col gap-2">
                                        {product.variants.map((v) => (
                                            <div key={v.id} className="flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: v.shadeColor }}></span>
                                                    <span className="text-ink text-xs">{v.value}</span>
                                                </div>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${v.stock <= 5 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                                    {v.stock} in stock
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <span className="text-xs text-stone italic">No shades added</span>
                                )}
                            </div>
                        </div>
                    ))}
                    {products.length === 0 && !isLoading && (
                        <div className="p-10 text-center text-sm text-stone italic">No products found.</div>
                    )}
                </div>

                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#FAF8F6] border-b border-petal-gray text-stone text-sm uppercase tracking-wider">
                                <th className="px-6 py-4 font-semibold">Image</th>
                                <th className="px-6 py-4 font-semibold">Product</th>
                                <th className="px-6 py-4 font-semibold">Price</th>
                                <th className="px-6 py-4 font-semibold">Inventory (Shades & Stock)</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-petal-gray">
                            {products.map((product) => (
                                <tr key={product._id} className="hover:bg-[#FAF8F6]/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <img src={product.imageUrl} alt={product.name} className="w-12 h-12 rounded-lg object-cover bg-petal-gray/20 border border-petal-gray" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-ink flex items-center gap-2">
                                            {product.name}
                                            {product.isBestSeller && (
                                                <span className="bg-orange-100 text-orange-700 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 border border-orange-200">
                                                    <Flame size={10} className="fill-current" /> Best Seller
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-xs text-stone">{product.category}</div>
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-burgundy-800">{product.basePrice} EGP</td>

                                    <td className="px-6 py-4">
                                        <div className="text-xs text-stone font-medium mb-1 border-b border-petal-gray pb-1 inline-block">Size: {product.size || '-'}</div>
                                        {product.variants?.length > 0 ? (
                                            <div className="flex flex-col gap-1.5 mt-1">
                                                {product.variants.map((v) => (
                                                    <div key={v.id} className="flex items-center gap-2 text-sm">
                                                        <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: v.shadeColor }}></span>
                                                        <span className="text-ink">{v.value}</span>
                                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${v.stock <= 5 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                                            {v.stock} in stock
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-xs text-stone italic">No variants</span>
                                        )}
                                    </td>

                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEditClick(product)} className="p-2 text-stone hover:text-ink hover:bg-white rounded-lg border border-transparent hover:border-petal-gray shadow-sm transition-all">
                                                <Edit2 size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(product._id)} className="p-2 text-stone hover:text-red-600 hover:bg-white rounded-lg border border-transparent hover:border-red-100 shadow-sm transition-all">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {products.length === 0 && !isLoading && (
                        <div className="p-20 text-center text-stone italic">No products found. Start by adding one!</div>
                    )}
                </div>

            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-[60] flex justify-center items-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in">
                        <div className="flex justify-between items-center p-4 md:p-6 border-b border-petal-gray sticky top-0 bg-white z-10">
                            <h2 className="text-lg md:text-xl font-display text-ink">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-stone hover:text-red-500 transition-colors bg-[#FAF8F6] p-2 rounded-full"><X size={20} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="sm:col-span-1">
                                    <label className="block text-sm font-medium text-ink mb-1">Product Name</label>
                                    <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full border border-petal-gray rounded-xl px-4 py-2.5 focus:outline-none focus:border-burgundy-800" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-ink mb-1">Category</label>
                                    <select required value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full border border-petal-gray rounded-xl px-4 py-2.5 focus:outline-none focus:border-burgundy-800 bg-white">
                                        <option value="" disabled>Select a Category...</option>
                                        {categories.map((cat) => <option key={cat._id} value={cat.name}>{cat.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-ink mb-1">Price (EGP)</label>
                                    <input type="number" required min="0" value={formData.basePrice} onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })} className="w-full border border-petal-gray rounded-xl px-4 py-2.5 focus:outline-none focus:border-burgundy-800" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-ink mb-1">Size</label>
                                    <input type="text" required value={formData.size} onChange={(e) => setFormData({ ...formData, size: e.target.value })} className="w-full border border-petal-gray rounded-xl px-4 py-2.5 focus:outline-none focus:border-burgundy-800" />
                                </div>
                            </div>

                            {/* 📸 الجزء الخاص برفع الصورة */}
                            <div className="bg-[#FAF8F6] p-4 rounded-xl border border-petal-gray">
                                <label className="block text-sm font-medium text-ink mb-2">Product Image</label>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <input
                                        type="text"
                                        placeholder="Enter image URL or upload file"
                                        required
                                        value={formData.imageUrl}
                                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                        className="flex-1 border border-petal-gray rounded-xl px-4 py-2.5 focus:outline-none focus:border-burgundy-800"
                                    />

                                    <div className="relative">
                                        <input
                                            type="file"
                                            id="image-upload"
                                            onChange={uploadFileHandler}
                                            className="hidden"
                                            accept="image/*"
                                        />
                                        <label
                                            htmlFor="image-upload"
                                            className="flex items-center justify-center gap-2 bg-white border border-petal-gray text-ink px-4 py-2.5 rounded-xl cursor-pointer hover:border-burgundy-800 transition-colors h-full w-full sm:w-auto"
                                        >
                                            <UploadCloud size={18} />
                                            <span className="text-sm font-medium">{uploading ? 'Uploading...' : 'Upload File'}</span>
                                        </label>
                                    </div>
                                </div>
                                {uploading && <p className="text-xs text-burgundy-800 mt-2 animate-pulse">Uploading image to secure cloud... please wait.</p>}
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-orange-50/50 rounded-xl border border-orange-100 hover:bg-orange-50 transition-colors">
                                <input type="checkbox" id="isBestSeller" checked={formData.isBestSeller} onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })} className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500 cursor-pointer" />
                                <label htmlFor="isBestSeller" className="text-sm font-semibold text-orange-800 cursor-pointer flex items-center gap-2 select-none"><Flame size={16} className="fill-orange-600 text-orange-600" /> Mark as Best Seller (Show on Homepage)</label>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium text-ink mb-1">Ingredients</label><textarea required rows="2" value={formData.ingredients} onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })} className="w-full border border-petal-gray rounded-xl px-4 py-2.5 focus:outline-none focus:border-burgundy-800 resize-none"></textarea></div>
                                <div><label className="block text-sm font-medium text-ink mb-1">How to use</label><textarea required rows="2" value={formData.howToUse} onChange={(e) => setFormData({ ...formData, howToUse: e.target.value })} className="w-full border border-petal-gray rounded-xl px-4 py-2.5 focus:outline-none focus:border-burgundy-800 resize-none"></textarea></div>
                            </div>

                            <div><label className="block text-sm font-medium text-ink mb-1">Description</label><textarea required rows="2" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full border border-petal-gray rounded-xl px-4 py-2.5 focus:outline-none focus:border-burgundy-800 resize-none"></textarea></div>

                            <div className="border-t border-petal-gray pt-4 mt-4">
                                <div className="flex justify-between items-center mb-3">
                                    <label className="block text-sm font-medium text-ink">Product Shades</label>
                                    <button type="button" onClick={handleAddVariant} className="text-xs md:text-sm bg-[#FAF8F6] border border-petal-gray text-ink px-3 py-1.5 rounded-lg hover:bg-petal-gray/30 transition-colors flex items-center gap-1"><Plus size={14} /> Add Shade</button>
                                </div>
                                <div className="space-y-2">
                                    {formData.variants.map((variant, index) => (
                                        <div key={variant.id || index} className="flex gap-2 items-center bg-[#FAF8F6] p-2 rounded-xl border border-petal-gray overflow-x-auto">
                                            <input type="text" required placeholder="Name" value={variant.value} onChange={(e) => handleVariantChange(index, 'value', e.target.value)} className="min-w-[100px] flex-1 border border-petal-gray rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-burgundy-800" />
                                            <input type="color" value={variant.shadeColor} onChange={(e) => handleVariantChange(index, 'shadeColor', e.target.value)} className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent p-0 flex-shrink-0" />
                                            <input type="number" required placeholder="Stock" min="0" value={variant.stock} onChange={(e) => handleVariantChange(index, 'stock', Number(e.target.value))} className="w-20 border border-petal-gray rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-burgundy-800" />
                                            <button type="button" onClick={() => handleRemoveVariant(index)} className="text-stone hover:text-red-500 p-1.5 rounded-lg transition-colors flex-shrink-0"><Trash2 size={18} /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-petal-gray mt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl font-medium text-stone hover:bg-[#FAF8F6] transition-colors">Cancel</button>
                                <button type="submit" disabled={isLoading || uploading} className="bg-burgundy-800 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-ink transition-colors disabled:opacity-50">
                                    {isLoading ? 'Saving...' : editingId ? 'Update' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminProducts;