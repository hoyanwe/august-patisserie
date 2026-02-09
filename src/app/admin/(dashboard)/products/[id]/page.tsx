
'use client';

export const runtime = 'edge';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface Category {
    id: string;
    name: {
        en: string;
        zh: string;
    };
}

export default function ProductFormPage() {
    const router = useRouter();
    const params = useParams();
    const productId = params?.id as string;
    const isEdit = productId && productId !== 'new';

    const [formData, setFormData] = useState({
        name: {
            en: '',
            zh: ''
        },
        price: '',
        category: '',
        description: {
            en: '',
            zh: ''
        },
        image: '', // Keep for backward compatibility/main image
        images: [] as string[], // Array for multiple images
        isBestSeller: false,
    });
    const [activeTab, setActiveTab] = useState<'en' | 'zh'>('en');
    const [categories, setCategories] = useState<Category[]>([]);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchCategories();
        if (isEdit) {
            fetchProduct();
        }
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/admin/categories');
            const data = await res.json() as { categories: Category[] };
            setCategories(data.categories || []);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const fetchProduct = async () => {
        try {
            const res = await fetch(`/api/admin/products/${productId}`);
            const product = await res.json() as any;
            // Handle legacy data where images might not exist
            const images = product.images || (product.image ? [product.image] : []);

            // Handle legacy single-language data
            const name = typeof product.name === 'string'
                ? { en: product.name, zh: '' }
                : product.name;
            const description = typeof product.description === 'string'
                ? { en: product.description, zh: '' }
                : product.description;

            setFormData({
                name: name,
                price: product.price.toString(),
                category: product.category,
                description: description,
                image: product.image,
                images: images,
                isBestSeller: product.isBestSeller || false,
            });
        } catch (error) {
            console.error('Failed to fetch product:', error);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (formData.images.length >= 5) {
            alert('You can only upload up to 5 images.');
            return;
        }

        setUploading(true);
        const uploadData = new FormData();
        uploadData.append('file', file);

        try {
            const res = await fetch('/api/admin/upload', {
                method: 'POST',
                body: uploadData,
            });
            const data = await res.json() as { url: string; error?: string };

            // Add new image to array
            const newImages = [...formData.images, data.url];
            setFormData(prev => ({
                ...prev,
                images: newImages,
                image: newImages[0] // Always ensure 'image' is the first one
            }));
        } catch (error) {
            alert('Failed to upload image');
        } finally {
            setUploading(false);
            // Reset input
            e.target.value = '';
        }
    };

    const removeImage = (indexToRemove: number) => {
        const newImages = formData.images.filter((_, index) => index !== indexToRemove);
        setFormData(prev => ({
            ...prev,
            images: newImages,
            image: newImages[0] || '' // Update main image or empty if no images left
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const productData = {
            ...formData,
            price: parseFloat(formData.price),
        };

        try {
            const url = isEdit ? `/api/admin/products/${productId}` : '/api/admin/products';
            const method = isEdit ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData),
            });

            if (res.ok) {
                router.push('/admin/products');
            } else {
                alert('Failed to save product');
            }
        } catch (error) {
            alert('Failed to save product');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <h1 style={{
                fontSize: '2rem',
                marginBottom: '2rem',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-playfair)',
            }}>
                {isEdit ? 'Edit Product' : 'Add New Product'}
            </h1>

            <form onSubmit={handleSubmit} style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '12px',
                maxWidth: '800px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}>
                {/* Language Tabs */}
                <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
                    <button
                        type="button"
                        onClick={() => setActiveTab('en')}
                        style={{
                            padding: '0.5rem 1rem',
                            background: activeTab === 'en' ? 'var(--pastel-purple)' : 'white',
                            color: activeTab === 'en' ? 'var(--text-primary)' : '#666',
                            border: '2px solid var(--pastel-purple)',
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                        }}
                    >
                        English
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('zh')}
                        style={{
                            padding: '0.5rem 1rem',
                            background: activeTab === 'zh' ? 'var(--pastel-purple)' : 'white',
                            color: activeTab === 'zh' ? 'var(--text-primary)' : '#666',
                            border: '2px solid var(--pastel-purple)',
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                        }}
                    >
                        中文 (Chinese)
                    </button>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                        Product Name * {activeTab === 'en' ? '(English)' : '(中文)'}
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.name[activeTab]}
                        onChange={(e) => setFormData({ ...formData, name: { ...formData.name, [activeTab]: e.target.value } })}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '2px solid #e9ecef',
                            borderRadius: '8px',
                            fontSize: '1rem',
                        }}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                            Price (MYR) *
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            required
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '2px solid #e9ecef',
                                borderRadius: '8px',
                                fontSize: '1rem',
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                            Category *
                        </label>
                        <select
                            required
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '2px solid #e9ecef',
                                borderRadius: '8px',
                                fontSize: '1rem',
                            }}
                        >
                            <option value="">Select a category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {typeof cat.name === 'string' ? cat.name : (cat.name.en || cat.name.zh)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <input
                        type="checkbox"
                        id="isBestSeller"
                        checked={formData.isBestSeller}
                        onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                        style={{ width: '1.2rem', height: '1.2rem', cursor: 'pointer' }}
                    />
                    <label htmlFor="isBestSeller" style={{ fontWeight: '600', cursor: 'pointer', color: 'var(--color-pink)' }}>
                        ✨ Mark as Best Seller
                    </label>
                    <p style={{ fontSize: '0.85rem', color: '#888', margin: 0 }}>
                        Best sellers will be highlighted on the homepage.
                    </p>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                        Description * {activeTab === 'en' ? '(English)' : '(中文)'}
                    </label>
                    <textarea
                        required
                        value={formData.description[activeTab]}
                        onChange={(e) => setFormData({ ...formData, description: { ...formData.description, [activeTab]: e.target.value } })}
                        rows={4}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '2px solid #e9ecef',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            fontFamily: 'inherit',
                            resize: 'vertical',
                        }}
                    />
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                        Product Images (Max 5)
                    </label>

                    {/* Image Grid */}
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                        {formData.images.map((img, index) => (
                            <div key={index} style={{ position: 'relative', width: '100px', height: '100px' }}>
                                <img
                                    src={img}
                                    alt={`Product ${index + 1}`}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        borderRadius: '8px',
                                        border: '1px solid #ddd'
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    style={{
                                        position: 'absolute',
                                        top: '-8px',
                                        right: '-8px',
                                        background: 'red',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '24px',
                                        height: '24px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '12px'
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}

                        {/* Upload Button Placeholder */}
                        {formData.images.length < 5 && (
                            <label style={{
                                width: '100px',
                                height: '100px',
                                border: '2px dashed #ccc',
                                borderRadius: '8px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: uploading ? 'not-allowed' : 'pointer',
                                background: '#f8f9fa'
                            }}>
                                <span style={{ fontSize: '24px', color: '#aaa' }}>+</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={uploading}
                                    style={{ display: 'none' }}
                                />
                            </label>
                        )}
                    </div>

                    {uploading && <p style={{ color: 'var(--pastel-purple)', marginTop: '0.5rem' }}>Uploading...</p>}
                    <p style={{ fontSize: '0.85rem', color: '#888' }}>
                        {formData.images.length} / 5 images uploaded. The first image will be the main thumbnail.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        type="submit"
                        disabled={saving || uploading}
                        style={{
                            padding: '0.875rem 2rem',
                            background: saving ? '#ccc' : 'var(--pastel-purple)',
                            color: 'var(--text-primary)',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: saving ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {saving ? 'Saving...' : (isEdit ? 'Update Product' : 'Create Product')}
                    </button>
                    <a
                        href="/admin/products"
                        style={{
                            padding: '0.875rem 2rem',
                            background: '#e2e6ea',
                            color: 'var(--text-primary)',
                            textDecoration: 'none',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            fontWeight: '600',
                            display: 'inline-block',
                        }}
                    >
                        Cancel
                    </a>
                </div>
            </form>
        </div>
    );
}
