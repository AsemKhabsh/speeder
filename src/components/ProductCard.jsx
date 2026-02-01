import { Link } from 'react-router-dom';
import { ExternalLink, Video, Eye } from 'lucide-react';

// Brand Colors
const BRAND = {
    primary: '#1a2e5a',
    accent: '#c41e3a',
    light: '#e8ecf4',
    text: '#334155',      // Slate 700 for body text
    textLight: '#64748b', // Slate 500 for secondary
};

const ProductCard = ({ product, onViewDetails }) => {
    const formatCategory = (str) => {
        if (!str) return '';
        return str.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    };

    return (
        <Link
            to={`/products/${product.id}`}
            className="group bg-white rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 block"
            style={{
                border: `1px solid ${BRAND.light}`,
                boxShadow: '0 4px 20px rgba(26, 46, 90, 0.06)'
            }}
        >
            {/* Image */}
            <div className="relative aspect-square overflow-hidden" style={{ backgroundColor: '#f8fafc' }}>
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                />

                {/* Badges - Brand colors with white text */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.featured && (
                        <span
                            className="px-3 py-1 text-xs font-bold rounded-full text-white uppercase tracking-wide"
                            style={{ backgroundColor: BRAND.accent }}
                        >
                            Featured
                        </span>
                    )}
                    <span
                        className="px-3 py-1 text-xs font-bold rounded-full text-white uppercase tracking-wide"
                        style={{ backgroundColor: BRAND.primary }}
                    >
                        {formatCategory(product.subcategory || product.category)}
                    </span>
                </div>

                {/* Video Badge */}
                {product.videoUrl && (
                    <span
                        className="absolute top-3 right-3 w-10 h-10 rounded-full text-white flex items-center justify-center"
                        style={{ backgroundColor: BRAND.primary }}
                    >
                        <Video className="w-4 h-4" />
                    </span>
                )}

                {/* Hover Overlay */}
                <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center pb-6"
                    style={{ background: `linear-gradient(to top, ${BRAND.primary}ee, ${BRAND.primary}99, transparent)` }}
                >
                    <span
                        className="px-6 py-3 text-white font-semibold rounded-xl transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 flex items-center gap-2"
                        style={{ backgroundColor: BRAND.accent }}
                    >
                        <Eye className="w-4 h-4" />
                        View Details
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-3">
                {/* Title - Brand Primary color */}
                <h3
                    className="font-bold text-lg line-clamp-2 leading-snug transition-colors group-hover:opacity-80"
                    style={{ color: BRAND.primary }}
                >
                    {product.name}
                </h3>

                {/* Arabic Name */}
                <p className="text-sm font-arabic line-clamp-1" dir="rtl" style={{ color: BRAND.text }}>
                    {product.nameAr}
                </p>

                {/* Specs */}
                <div className="flex flex-wrap gap-1.5">
                    {product.specifications.slice(0, 2).map((spec, index) => (
                        <span
                            key={index}
                            className="text-xs px-2.5 py-1 rounded-md font-medium"
                            style={{ backgroundColor: BRAND.light, color: BRAND.text }}
                        >
                            {spec.split(':')[0]}
                        </span>
                    ))}
                    {product.specifications.length > 2 && (
                        <span
                            className="text-xs px-2.5 py-1 rounded-md font-semibold text-white"
                            style={{ backgroundColor: BRAND.primary }}
                        >
                            +{product.specifications.length - 2} more
                        </span>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3" style={{ borderTop: `1px solid ${BRAND.light}` }}>
                    <span className="font-bold text-lg" style={{ color: BRAND.accent }}>
                        {product.price}
                    </span>
                    {product.videoUrl && (
                        <span
                            className="flex items-center gap-1.5 text-xs font-semibold"
                            style={{ color: BRAND.primary }}
                        >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Demo
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;

