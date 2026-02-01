import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Grid3X3, LayoutList, X, ChevronDown, Package } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import productsData from '../data/products.json';

// Brand Colors
const BRAND = {
    primary: '#1a2e5a',
    accent: '#c41e3a',
    light: '#e8ecf4',
    text: '#334155',
    gradient: 'linear-gradient(135deg, #0f1c38 0%, #1a2e5a 50%, #2a4a7c 100%)',
};

// Filter Sidebar Component
const FilterSidebar = ({ categories, selectedCategory, selectedSubcategory, onCategoryChange, onSubcategoryChange, onClose, isMobile = false }) => {
    const handleCategoryClick = (categoryId) => {
        if (selectedCategory === categoryId) {
            onCategoryChange(null);
            onSubcategoryChange(null);
        } else {
            onCategoryChange(categoryId);
            onSubcategoryChange(null);
        }
    };

    return (
        <div className={`${isMobile ? '' : 'sticky top-28'}`}>
            {isMobile && (
                <div
                    className="flex items-center justify-between p-4 border-b bg-white"
                    style={{ borderColor: BRAND.light }}
                >
                    <h3 className="font-bold text-lg" style={{ color: BRAND.primary }}>Filters</h3>
                    <button onClick={onClose} className="p-2 rounded-lg" style={{ color: BRAND.primary }}>
                        <X className="w-5 h-5" />
                    </button>
                </div>
            )}

            <div className={`${isMobile ? 'p-4 bg-white' : ''} space-y-6`}>
                <div>
                    <h4 className="font-bold text-sm uppercase tracking-wider mb-3" style={{ color: BRAND.text }}>Categories</h4>
                    <div className="space-y-1">
                        <button
                            onClick={() => { onCategoryChange(null); onSubcategoryChange(null); }}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-semibold transition-all"
                            style={!selectedCategory
                                ? { backgroundColor: BRAND.primary, color: '#ffffff' }
                                : { color: BRAND.primary }
                            }
                        >
                            <Package className="w-5 h-5" />
                            All Products
                            <span className="ml-auto text-sm font-medium" style={{ opacity: 0.7 }}>
                                {productsData.products.length}
                            </span>
                        </button>

                        {categories.map((category) => {
                            const isActive = selectedCategory === category.id;
                            const productCount = productsData.products.filter(p => p.category === category.id).length;

                            return (
                                <div key={category.id}>
                                    <button
                                        onClick={() => handleCategoryClick(category.id)}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-semibold transition-all"
                                        style={isActive
                                            ? { backgroundColor: BRAND.accent, color: '#ffffff' }
                                            : { color: BRAND.primary }
                                        }
                                    >
                                        {category.name}
                                        <span className="ml-auto text-sm font-medium" style={{ opacity: 0.7 }}>
                                            {productCount}
                                        </span>
                                        {category.subcategories?.length > 0 && (
                                            <ChevronDown className={`w-4 h-4 transition-transform ${isActive ? 'rotate-180' : ''}`} />
                                        )}
                                    </button>

                                    {isActive && category.subcategories?.length > 0 && (
                                        <div className="ml-4 mt-1 space-y-1">
                                            <button
                                                onClick={() => onSubcategoryChange(null)}
                                                className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold transition-all"
                                                style={!selectedSubcategory
                                                    ? { backgroundColor: BRAND.light, color: BRAND.primary }
                                                    : { color: BRAND.text }
                                                }
                                            >
                                                All {category.name}
                                            </button>
                                            {category.subcategories.map((sub) => (
                                                <button
                                                    key={sub.id}
                                                    onClick={() => onSubcategoryChange(sub.id)}
                                                    className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold transition-all"
                                                    style={selectedSubcategory === sub.id
                                                        ? { backgroundColor: BRAND.primary, color: '#ffffff' }
                                                        : { color: BRAND.text }
                                                    }
                                                >
                                                    {sub.name}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProductsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || null);
    const [selectedSubcategory, setSelectedSubcategory] = useState(searchParams.get('subcategory') || null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Sync state with URL params when navigating from navbar
    useEffect(() => {
        const urlCategory = searchParams.get('category');
        const urlSubcategory = searchParams.get('subcategory');

        if (urlCategory !== selectedCategory) {
            setSelectedCategory(urlCategory);
        }
        if (urlSubcategory !== selectedSubcategory) {
            setSelectedSubcategory(urlSubcategory);
        }
    }, [searchParams]);

    useEffect(() => {
        const params = new URLSearchParams();
        if (selectedCategory) params.set('category', selectedCategory);
        if (selectedSubcategory) params.set('subcategory', selectedSubcategory);
        setSearchParams(params, { replace: true });
    }, [selectedCategory, selectedSubcategory, setSearchParams]);

    useEffect(() => {
        document.body.style.overflow = isFilterOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isFilterOpen]);

    const filteredProducts = useMemo(() => {
        let products = productsData.products;
        if (selectedCategory) products = products.filter(p => p.category === selectedCategory);
        if (selectedSubcategory) products = products.filter(p => p.subcategory === selectedSubcategory);
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            products = products.filter(p =>
                p.name.toLowerCase().includes(query) ||
                p.nameAr.includes(query) ||
                p.description.toLowerCase().includes(query)
            );
        }
        return products;
    }, [selectedCategory, selectedSubcategory, searchQuery]);

    const handleViewDetails = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const currentCategoryName = selectedCategory
        ? productsData.categories.find(c => c.id === selectedCategory)?.name
        : 'All Products';

    return (
        <div className="min-h-screen pt-20" style={{ backgroundColor: '#f8fafc' }}>
            {/* Header - White text on brand gradient */}
            <div className="py-16 md:py-20" style={{ background: BRAND.gradient }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={{ color: '#ffffff' }}>
                        Our Products
                    </h1>
                    <p className="max-w-2xl text-base md:text-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.9)' }}>
                        Explore our comprehensive catalog of premium networking equipment,
                        printers, and barcode scanners from leading manufacturers.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
                <div className="flex gap-8">
                    <aside className="hidden lg:block w-72 shrink-0">
                        <FilterSidebar
                            categories={productsData.categories}
                            selectedCategory={selectedCategory}
                            selectedSubcategory={selectedSubcategory}
                            onCategoryChange={setSelectedCategory}
                            onSubcategoryChange={setSelectedSubcategory}
                        />
                    </aside>

                    <main className="flex-1 min-w-0">
                        {/* Search Bar */}
                        <div
                            className="bg-white rounded-2xl p-4 md:p-5 mb-8"
                            style={{ border: `1px solid ${BRAND.light}`, boxShadow: '0 4px 20px rgba(26,46,90,0.06)' }}
                        >
                            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                                <button
                                    onClick={() => setIsFilterOpen(true)}
                                    className="lg:hidden inline-flex items-center justify-center gap-2 px-4 py-2.5 font-semibold rounded-xl transition-colors"
                                    style={{ border: `2px solid ${BRAND.primary}`, color: BRAND.primary }}
                                >
                                    <SlidersHorizontal className="w-4 h-4" />
                                    Filters
                                </button>

                                <div className="relative flex-1">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: BRAND.text }} />
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white focus:outline-none"
                                        style={{
                                            border: `2px solid ${BRAND.light}`,
                                            color: BRAND.primary,
                                        }}
                                    />
                                </div>

                                <div className="flex items-center gap-4">
                                    <span className="text-sm whitespace-nowrap hidden sm:block" style={{ color: BRAND.text }}>
                                        <span className="font-bold" style={{ color: BRAND.primary }}>{filteredProducts.length}</span> products
                                    </span>
                                    <div className="flex items-center gap-1 p-1 rounded-lg" style={{ backgroundColor: BRAND.light }}>
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            className="p-2.5 rounded-md transition-all"
                                            style={viewMode === 'grid' ? { backgroundColor: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' } : {}}
                                        >
                                            <Grid3X3 className="w-4 h-4" style={{ color: BRAND.primary }} />
                                        </button>
                                        <button
                                            onClick={() => setViewMode('list')}
                                            className="p-2.5 rounded-md transition-all"
                                            style={viewMode === 'list' ? { backgroundColor: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' } : {}}
                                        >
                                            <LayoutList className="w-4 h-4" style={{ color: BRAND.primary }} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {(selectedCategory || searchQuery) && (
                                <div className="flex items-center gap-2 mt-4 pt-4 flex-wrap" style={{ borderTop: `1px solid ${BRAND.light}` }}>
                                    <span className="text-sm font-medium" style={{ color: BRAND.text }}>Showing:</span>
                                    <span
                                        className="px-3 py-1 text-xs font-bold rounded-full text-white uppercase"
                                        style={{ backgroundColor: BRAND.primary }}
                                    >
                                        {currentCategoryName}
                                    </span>
                                    {selectedSubcategory && (
                                        <span
                                            className="px-3 py-1 text-xs font-bold rounded-full text-white uppercase"
                                            style={{ backgroundColor: BRAND.accent }}
                                        >
                                            {productsData.categories.find(c => c.id === selectedCategory)?.subcategories.find(s => s.id === selectedSubcategory)?.name}
                                        </span>
                                    )}
                                    {searchQuery && (
                                        <span className="px-3 py-1 text-xs font-semibold rounded-full" style={{ backgroundColor: BRAND.light, color: BRAND.primary }}>
                                            "{searchQuery}"
                                        </span>
                                    )}
                                    <button
                                        onClick={() => { setSelectedCategory(null); setSelectedSubcategory(null); setSearchQuery(''); }}
                                        className="text-sm font-bold ml-2"
                                        style={{ color: BRAND.accent }}
                                    >
                                        Clear all
                                    </button>
                                </div>
                            )}
                        </div>

                        {filteredProducts.length > 0 ? (
                            <div className={viewMode === 'grid'
                                ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'
                                : 'grid grid-cols-1 sm:grid-cols-2 gap-6'
                            }>
                                {filteredProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} onViewDetails={handleViewDetails} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-2xl" style={{ border: `1px solid ${BRAND.light}` }}>
                                <SlidersHorizontal className="w-16 h-16 mx-auto mb-4" style={{ color: BRAND.light }} />
                                <h3 className="text-xl font-bold mb-2" style={{ color: BRAND.primary }}>No products found</h3>
                                <p className="mb-6" style={{ color: BRAND.text }}>Try adjusting your filters or search query</p>
                                <button
                                    onClick={() => { setSelectedCategory(null); setSelectedSubcategory(null); setSearchQuery(''); }}
                                    className="px-6 py-3 text-white font-semibold rounded-xl"
                                    style={{ backgroundColor: BRAND.primary }}
                                >
                                    Reset Filters
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>

            {isFilterOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsFilterOpen(false)} />}

            <div
                className={`fixed top-0 left-0 h-full w-72 max-w-[85vw] bg-white z-50 transform transition-transform ${isFilterOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                style={{ boxShadow: '4px 0 20px rgba(26,46,90,0.15)' }}
            >
                <FilterSidebar
                    categories={productsData.categories}
                    selectedCategory={selectedCategory}
                    selectedSubcategory={selectedSubcategory}
                    onCategoryChange={(cat) => { setSelectedCategory(cat); }}
                    onSubcategoryChange={(sub) => { setSelectedSubcategory(sub); setIsFilterOpen(false); }}
                    onClose={() => setIsFilterOpen(false)}
                    isMobile={true}
                />
            </div>

            <ProductModal product={selectedProduct} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default ProductsPage;
