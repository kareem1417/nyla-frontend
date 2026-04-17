import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Tags, Plus, Trash2, UploadCloud, Image as ImageIcon } from 'lucide-react';

function AdminCategories() {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    const fetchCategories = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/categories');
            setCategories(data);
        } catch (error) {
            toast.error('Failed to fetch categories');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        try {
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            const { data } = await axios.post('http://localhost:5000/api/upload', formData, config);
            setImageUrl(data.url);
            toast.success('Category image uploaded! 📸');
        } catch (error) {
            console.error(error);
            toast.error('Image upload failed!');
        } finally {
            setUploading(false);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!name.trim()) return toast.error('Please enter a category name');
        if (!imageUrl.trim()) return toast.error('Please upload an image for the category');
        if (!description.trim()) return toast.error('Please enter a description');

        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };

            const { data } = await axios.post('http://localhost:5000/api/categories', { name, imageUrl, description }, config);

            setCategories([...categories, data]);
            setName('');
            setImageUrl('');
            setDescription('');
            toast.success('Category added successfully! ✨');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add category');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this category? Any products using it will lose their category classification.')) return;

        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };

            await axios.delete(`http://localhost:5000/api/categories/${id}`, config);

            setCategories(categories.filter((c) => c._id !== id));
            toast.success('Category deleted! 🗑️');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete category');
        }
    };

    if (isLoading) return <div className="text-center py-20 text-stone animate-pulse">Loading categories... 🏷️</div>;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-display text-ink flex items-center gap-2">
                    <Tags className="text-burgundy-800" /> Categories
                </h1>
                <div className="bg-[#FAF8F6] px-4 py-2 rounded-xl text-sm font-medium text-stone border border-petal-gray">
                    Total: <span className="text-burgundy-800">{categories.length}</span>
                </div>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-2xl border border-petal-gray shadow-sm">

                <form onSubmit={handleAdd} className="mb-10 pb-8 border-b border-petal-gray space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Category Name (e.g., Lip Care)"
                                className="w-full px-5 py-3.5 bg-[#FAF8F6] border border-petal-gray rounded-xl focus:outline-none focus:border-burgundy-800 transition-colors"
                            />
                        </div>

                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                placeholder="Image URL or Upload"
                                className="w-full px-5 py-3.5 bg-[#FAF8F6] border border-petal-gray rounded-xl focus:outline-none focus:border-burgundy-800 transition-colors pr-32"
                            />
                            <input type="file" id="cat-image" onChange={uploadFileHandler} className="hidden" accept="image/*" />
                            <label
                                htmlFor="cat-image"
                                className="absolute right-2 top-2 bottom-2 bg-white border border-petal-gray text-ink px-4 rounded-lg flex items-center gap-2 cursor-pointer hover:border-burgundy-800 transition-colors text-sm font-medium"
                            >
                                <UploadCloud size={16} /> {uploading ? '...' : 'Upload'}
                            </label>
                        </div>
                    </div>

                    <div>
                        <textarea
                            rows="2"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Short description for this category (e.g., Hydrating and nourishing lip care...)"
                            className="w-full px-5 py-3.5 bg-[#FAF8F6] border border-petal-gray rounded-xl focus:outline-none focus:border-burgundy-800 transition-colors resize-none"
                        ></textarea>
                    </div>

                    <div className="flex justify-between items-center">
                        {imageUrl && (
                            <div className="flex items-center gap-3 p-3 bg-[#FAF8F6] border border-petal-gray rounded-xl inline-block">
                                <span className="text-xs text-stone font-medium uppercase tracking-wider">Preview:</span>
                                <img src={imageUrl} alt="preview" className="h-12 w-12 rounded-lg object-cover border border-petal-gray" />
                            </div>
                        )}
                        <button type="submit" disabled={uploading} className="ml-auto bg-ink text-white px-8 py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-burgundy-800 transition-colors font-medium whitespace-nowrap disabled:opacity-50">
                            <Plus size={20} /> Add Category
                        </button>
                    </div>
                </form>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {categories.map((cat) => (
                        <div key={cat._id} className="group flex justify-between items-center p-4 bg-[#FAF8F6] border border-petal-gray rounded-xl hover:border-burgundy-800 hover:shadow-md transition-all">
                            <div className="flex items-center gap-4">
                                {cat.imageUrl ? (
                                    <img src={cat.imageUrl} alt={cat.name} className="w-14 h-14 rounded-lg object-cover bg-white border border-petal-gray shadow-sm" />
                                ) : (
                                    <div className="w-14 h-14 rounded-lg bg-white border border-petal-gray flex items-center justify-center text-petal-gray">
                                        <ImageIcon size={24} />
                                    </div>
                                )}
                                <div className="flex flex-col overflow-hidden">
                                    <span className="font-semibold text-ink text-lg truncate">{cat.name}</span>
                                    <span className="text-xs text-stone truncate">{cat.description || 'No description'}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => handleDelete(cat._id)}
                                className="text-stone hover:text-red-500 transition-colors p-2.5 bg-white rounded-lg border border-petal-gray opacity-100 md:opacity-0 group-hover:opacity-100 shadow-sm shrink-0"
                                title="Delete Category"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}

                    {categories.length === 0 && (
                        <div className="col-span-full text-center py-12 bg-[#FAF8F6] rounded-xl border border-dashed border-petal-gray">
                            <Tags className="mx-auto h-12 w-12 text-petal-gray mb-3" />
                            <p className="text-stone text-lg">No categories found.</p>
                            <p className="text-sm text-stone mt-1">Start adding your first product category above! ✨</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminCategories;