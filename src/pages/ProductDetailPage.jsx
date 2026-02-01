import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Download, FileText, Package, ArrowLeft, Play, Check } from 'lucide-react';
import productsData from '../data/products.json';

// Brand Colors
const BRAND = {
    primary: '#1a2e5a',
    accent: '#c41e3a',
    light: '#e8ecf4',
    text: '#334155',
    gradient: 'linear-gradient(135deg, #0f1c38 0%, #1a2e5a 50%, #2a4a7c 100%)',
};

const ProductDetailPage = () => {
    const { productId } = useParams();
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    // Find the product
    const product = productsData.products.find(p => p.id === productId);

    // Find category info
    const category = product ? productsData.categories.find(c => c.id === product.category) : null;
    const subcategory = product && category ? category.subcategories?.find(s => s.id === product.subcategory) : null;

    // Get related products (same category, excluding current)
    const relatedProducts = product
        ? productsData.products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4)
        : [];

    // Get images array (use main image if no images array)
    const images = product?.images || [product?.image];

    // Scroll to top on load
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [productId]);

    if (!product) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center" style={{ backgroundColor: '#f8fafc' }}>
                <div className="text-center">
                    <Package className="w-24 h-24 mx-auto mb-6" style={{ color: BRAND.light }} />
                    <h1 className="text-2xl font-bold mb-4" style={{ color: BRAND.primary }}>Product Not Found</h1>
                    <p className="mb-8" style={{ color: BRAND.text }}>The product you're looking for doesn't exist.</p>
                    <Link
                        to="/products"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90"
                        style={{ backgroundColor: BRAND.primary }}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Products
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20" style={{ backgroundColor: '#f8fafc' }}>
            {/* Breadcrumb */}
            <div className="bg-white border-b" style={{ borderColor: BRAND.light }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <nav className="flex items-center gap-2 text-sm flex-wrap">
                        <Link to="/" className="hover:underline" style={{ color: BRAND.text }}>Home</Link>
                        <ChevronRight className="w-4 h-4" style={{ color: BRAND.light }} />
                        <Link to="/products" className="hover:underline" style={{ color: BRAND.text }}>Products</Link>
                        {category && (
                            <>
                                <ChevronRight className="w-4 h-4" style={{ color: BRAND.light }} />
                                <Link
                                    to={`/products?category=${category.id}`}
                                    className="hover:underline"
                                    style={{ color: BRAND.text }}
                                >
                                    {category.name}
                                </Link>
                            </>
                        )}
                        {subcategory && (
                            <>
                                <ChevronRight className="w-4 h-4" style={{ color: BRAND.light }} />
                                <Link
                                    to={`/products?category=${category.id}&subcategory=${subcategory.id}`}
                                    className="hover:underline"
                                    style={{ color: BRAND.text }}
                                >
                                    {subcategory.name}
                                </Link>
                            </>
                        )}
                        <ChevronRight className="w-4 h-4" style={{ color: BRAND.light }} />
                        <span className="font-semibold" style={{ color: BRAND.primary }}>{product.name}</span>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div
                            className="relative aspect-square bg-white rounded-2xl overflow-hidden"
                            style={{
                                border: `1px solid ${BRAND.light}`,
                                boxShadow: '0 4px 20px rgba(26,46,90,0.08)'
                            }}
                        >
                            <img
                                src={images[selectedImageIndex]}
                                alt={product.name}
                                className="w-full h-full object-contain p-4"
                            />
                            {product.featured && (
                                <span
                                    className="absolute top-4 left-4 px-3 py-1 text-xs font-bold text-white uppercase rounded-full"
                                    style={{ backgroundColor: BRAND.accent }}
                                >
                                    Featured
                                </span>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-2">
                                {images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImageIndex(index)}
                                        className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden transition-all"
                                        style={{
                                            border: selectedImageIndex === index
                                                ? `3px solid ${BRAND.accent}`
                                                : `2px solid ${BRAND.light}`,
                                            opacity: selectedImageIndex === index ? 1 : 0.7
                                        }}
                                    >
                                        <img
                                            src={img}
                                            alt={`${product.name} ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        {/* Category Badge */}
                        <div className="flex items-center gap-2 flex-wrap">
                            {category && (
                                <span
                                    className="px-3 py-1 text-xs font-bold rounded-full"
                                    style={{ backgroundColor: BRAND.light, color: BRAND.primary }}
                                >
                                    {category.name}
                                </span>
                            )}
                            {subcategory && (
                                <span
                                    className="px-3 py-1 text-xs font-bold text-white rounded-full"
                                    style={{ backgroundColor: BRAND.primary }}
                                >
                                    {subcategory.name}
                                </span>
                            )}
                        </div>

                        {/* Title */}
                        <div>
                            <h1
                                className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2"
                                style={{ color: BRAND.primary }}
                            >
                                {product.name}
                            </h1>
                            <p className="text-lg" style={{ color: BRAND.text, opacity: 0.7 }}>
                                {product.nameAr}
                            </p>
                        </div>

                        {/* Description */}
                        <div
                            className="p-5 rounded-xl"
                            style={{ backgroundColor: BRAND.light }}
                        >
                            <p className="leading-relaxed" style={{ color: BRAND.text }}>
                                {product.description}
                            </p>
                        </div>

                        {/* Price */}
                        <div
                            className="text-xl font-bold"
                            style={{ color: BRAND.accent }}
                        >
                            {product.price}
                        </div>

                        {/* Download Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            {product.catalogUrl && (
                                <a
                                    href={product.catalogUrl}
                                    download
                                    className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white transition-all hover:opacity-90"
                                    style={{ backgroundColor: BRAND.primary }}
                                >
                                    <Download className="w-5 h-5" />
                                    Download Catalog
                                </a>
                            )}
                            {product.driversUrl && (
                                <a
                                    href={product.driversUrl}
                                    download
                                    className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold transition-all"
                                    style={{
                                        border: `2px solid ${BRAND.primary}`,
                                        color: BRAND.primary
                                    }}
                                >
                                    <FileText className="w-5 h-5" />
                                    Download Drivers
                                </a>
                            )}
                        </div>

                        {/* Video Link */}
                        {product.videoUrl && (
                            <a
                                href={product.videoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 font-semibold transition-colors hover:underline"
                                style={{ color: BRAND.accent }}
                            >
                                <Play className="w-5 h-5" />
                                Watch Product Video
                            </a>
                        )}

                        {/* Contact CTA */}
                        <div
                            className="p-5 rounded-xl"
                            style={{
                                background: BRAND.gradient,
                                boxShadow: '0 4px 20px rgba(26,46,90,0.2)'
                            }}
                        >
                            <p className="text-white mb-3">
                                Interested in this product? Contact us for pricing and availability.
                            </p>
                            <Link
                                to="/contact"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all hover:opacity-90"
                                style={{ backgroundColor: BRAND.accent, color: 'white' }}
                            >
                                Get a Quote
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Specifications */}
                {product.specifications && product.specifications.length > 0 && (
                    <div className="mt-12">
                        <h2
                            className="text-2xl font-bold mb-6"
                            style={{ color: BRAND.primary }}
                        >
                            Specifications
                        </h2>
                        <div
                            className="bg-white rounded-2xl p-6 md:p-8"
                            style={{
                                border: `1px solid ${BRAND.light}`,
                                boxShadow: '0 4px 20px rgba(26,46,90,0.06)'
                            }}
                        >
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {product.specifications.map((spec, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-3 p-3 rounded-xl"
                                        style={{ backgroundColor: BRAND.light }}
                                    >
                                        <Check
                                            className="w-5 h-5 flex-shrink-0 mt-0.5"
                                            style={{ color: BRAND.accent }}
                                        />
                                        <span style={{ color: BRAND.text }}>{spec}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-12">
                        <div className="flex items-center justify-between mb-6">
                            <h2
                                className="text-2xl font-bold"
                                style={{ color: BRAND.primary }}
                            >
                                Related Products
                            </h2>
                            <Link
                                to={`/products?category=${product.category}`}
                                className="font-semibold transition-colors hover:underline"
                                style={{ color: BRAND.accent }}
                            >
                                View All
                            </Link>
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((relatedProduct) => (
                                <Link
                                    key={relatedProduct.id}
                                    to={`/products/${relatedProduct.id}`}
                                    className="group bg-white rounded-xl overflow-hidden transition-all hover:shadow-lg"
                                    style={{
                                        border: `1px solid ${BRAND.light}`,
                                    }}
                                >
                                    <div className="aspect-square overflow-hidden">
                                        <img
                                            src={relatedProduct.images?.[0] || relatedProduct.image}
                                            alt={relatedProduct.name}
                                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3
                                            className="font-semibold line-clamp-2 mb-1"
                                            style={{ color: BRAND.primary }}
                                        >
                                            {relatedProduct.name}
                                        </h3>
                                        <p
                                            className="text-sm"
                                            style={{ color: BRAND.text, opacity: 0.7 }}
                                        >
                                            {relatedProduct.nameAr}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Back Button */}
                <div className="mt-12 pt-8" style={{ borderTop: `1px solid ${BRAND.light}` }}>
                    <Link
                        to="/products"
                        className="inline-flex items-center gap-2 font-semibold transition-colors hover:underline"
                        style={{ color: BRAND.primary }}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to All Products
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
