import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, ChevronRight, ChevronDown, Package } from 'lucide-react';
import logo from '../assets/images/SpeederLogo.png';
import productsData from '../data/products.json';

// Brand Colors
const BRAND = {
    primary: '#1a2e5a',    // Navy Blue
    accent: '#c41e3a',     // Crimson Red
    light: '#e8ecf4',      // Light Blue tint
};

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
    const [mobileProductsExpanded, setMobileProductsExpanded] = useState(false);
    const dropdownRef = useRef(null);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsOpen(false);
        setIsProductsDropdownOpen(false);
    }, [location]);

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProductsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <>
            {/* Navbar - White bg, Brand Navy text */}
            <nav
                className="fixed top-0 left-0 right-0 z-50 bg-white border-b"
                style={{ borderColor: BRAND.light, boxShadow: '0 2px 10px rgba(26, 46, 90, 0.08)' }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 md:h-20">
                        <Link to="/" className="flex items-center gap-3 shrink-0">
                            <img src={logo} alt="Speeder Network" className="h-10 md:h-12 w-auto object-contain" />
                        </Link>

                        {/* Desktop Nav - Brand Navy text */}
                        <div className="hidden lg:flex items-center gap-1">
                            {/* Home Link */}
                            <Link
                                to="/"
                                className="px-4 py-2 font-semibold text-sm rounded-lg transition-all duration-300"
                                style={location.pathname === '/'
                                    ? { backgroundColor: BRAND.accent, color: '#ffffff' }
                                    : { color: BRAND.primary }
                                }
                            >
                                Home
                            </Link>

                            {/* Products Dropdown */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsProductsDropdownOpen(!isProductsDropdownOpen)}
                                    className="flex items-center gap-1 px-4 py-2 font-semibold text-sm rounded-lg transition-all duration-300"
                                    style={location.pathname === '/products'
                                        ? { backgroundColor: BRAND.accent, color: '#ffffff' }
                                        : { color: BRAND.primary }
                                    }
                                >
                                    Products
                                    <ChevronDown className={`w-4 h-4 transition-transform ${isProductsDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Mega Menu Dropdown */}
                                {isProductsDropdownOpen && (
                                    <div
                                        className="absolute top-full left-0 mt-2 bg-white rounded-xl overflow-hidden"
                                        style={{
                                            boxShadow: '0 10px 40px rgba(26, 46, 90, 0.15)',
                                            border: `1px solid ${BRAND.light}`,
                                            minWidth: '320px',
                                            maxHeight: 'calc(100vh - 100px)',
                                            overflowY: 'auto'
                                        }}
                                    >
                                        {/* All Products Link */}
                                        <Link
                                            to="/products"
                                            className="flex items-center gap-3 px-4 py-3 font-semibold transition-colors"
                                            style={{
                                                borderBottom: `1px solid ${BRAND.light}`,
                                                color: BRAND.primary
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = BRAND.light}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                        >
                                            <Package className="w-5 h-5" />
                                            All Products
                                            <span className="ml-auto text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: BRAND.light }}>
                                                {productsData.products.length}
                                            </span>
                                        </Link>

                                        {/* Categories */}
                                        <div className="py-2">
                                            {productsData.categories.map((category) => {
                                                const productCount = productsData.products.filter(p => p.category === category.id).length;
                                                const hasSubcategories = category.subcategories && category.subcategories.length > 0;

                                                return (
                                                    <div key={category.id}>
                                                        <Link
                                                            to={`/products?category=${category.id}`}
                                                            className="flex items-center gap-3 px-4 py-2.5 font-medium transition-colors"
                                                            style={{ color: BRAND.primary }}
                                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = BRAND.light}
                                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                        >
                                                            {category.name}
                                                            <span className="ml-auto text-xs opacity-60">{productCount}</span>
                                                        </Link>

                                                        {/* Subcategories */}
                                                        {hasSubcategories && (
                                                            <div className="pl-4 pb-1">
                                                                {category.subcategories.map((sub) => (
                                                                    <Link
                                                                        key={sub.id}
                                                                        to={`/products?category=${category.id}&subcategory=${sub.id}`}
                                                                        className="flex items-center gap-2 px-4 py-1.5 text-sm transition-colors rounded"
                                                                        style={{ color: BRAND.text }}
                                                                        onMouseEnter={(e) => {
                                                                            e.currentTarget.style.backgroundColor = BRAND.light;
                                                                            e.currentTarget.style.color = BRAND.primary;
                                                                        }}
                                                                        onMouseLeave={(e) => {
                                                                            e.currentTarget.style.backgroundColor = 'transparent';
                                                                            e.currentTarget.style.color = BRAND.text;
                                                                        }}
                                                                    >
                                                                        <ChevronRight className="w-3 h-3 opacity-50" />
                                                                        {sub.name}
                                                                    </Link>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* About Us Link */}
                            <Link
                                to="/about"
                                className="px-4 py-2 font-semibold text-sm rounded-lg transition-all duration-300"
                                style={location.pathname === '/about'
                                    ? { backgroundColor: BRAND.accent, color: '#ffffff' }
                                    : { color: BRAND.primary }
                                }
                            >
                                About Us
                            </Link>

                            {/* Contact Link */}
                            <Link
                                to="/contact"
                                className="px-4 py-2 font-semibold text-sm rounded-lg transition-all duration-300"
                                style={location.pathname === '/contact'
                                    ? { backgroundColor: BRAND.accent, color: '#ffffff' }
                                    : { color: BRAND.primary }
                                }
                            >
                                Contact
                            </Link>
                        </div>

                        {/* Desktop CTA */}
                        <div className="hidden lg:flex items-center gap-4">
                            <a
                                href="tel:+967777540528"
                                className="flex items-center gap-2 text-sm font-semibold transition-colors"
                                style={{ color: BRAND.primary }}
                            >
                                <Phone className="w-4 h-4" />
                                +967 777 540 528
                            </a>
                            <Link
                                to="/contact"
                                className="px-5 py-2.5 text-sm font-semibold text-white rounded-lg transition-all hover:opacity-90"
                                style={{ backgroundColor: BRAND.accent }}
                            >
                                Get Quote
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsOpen(true)}
                            className="lg:hidden p-2 rounded-lg transition-colors"
                            style={{ color: BRAND.primary }}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Overlay */}
            {isOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsOpen(false)} />}

            {/* Mobile Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-72 max-w-[85vw] bg-white z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
                style={{ boxShadow: '-4px 0 20px rgba(26, 46, 90, 0.15)' }}
            >
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: BRAND.light }}>
                        <img src={logo} alt="Speeder Network" className="h-10 w-auto" />
                        <button onClick={() => setIsOpen(false)} className="p-2 rounded-lg" style={{ color: BRAND.primary }}>
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {/* Home Link */}
                        <Link
                            to="/"
                            className="flex items-center justify-between px-4 py-3.5 rounded-xl font-semibold transition-all"
                            style={location.pathname === '/'
                                ? { backgroundColor: BRAND.accent, color: '#ffffff' }
                                : { color: BRAND.primary }
                            }
                        >
                            Home
                            <ChevronRight className="w-4 h-4" style={{ opacity: location.pathname === '/' ? 1 : 0.5 }} />
                        </Link>

                        {/* Products Accordion */}
                        <div>
                            <button
                                onClick={() => setMobileProductsExpanded(!mobileProductsExpanded)}
                                className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl font-semibold transition-all"
                                style={location.pathname === '/products'
                                    ? { backgroundColor: BRAND.accent, color: '#ffffff' }
                                    : { color: BRAND.primary }
                                }
                            >
                                Products
                                <ChevronDown className={`w-4 h-4 transition-transform ${mobileProductsExpanded ? 'rotate-180' : ''}`} />
                            </button>

                            {mobileProductsExpanded && (
                                <div className="mt-1 ml-2 space-y-1" style={{ borderLeft: `2px solid ${BRAND.light}` }}>
                                    {/* All Products */}
                                    <Link
                                        to="/products"
                                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors"
                                        style={{ color: BRAND.primary }}
                                    >
                                        <Package className="w-4 h-4" />
                                        All Products
                                    </Link>

                                    {/* Categories */}
                                    {productsData.categories.map((category) => (
                                        <div key={category.id}>
                                            <Link
                                                to={`/products?category=${category.id}`}
                                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors"
                                                style={{ color: BRAND.text }}
                                            >
                                                {category.name}
                                            </Link>

                                            {/* Subcategories */}
                                            {category.subcategories && category.subcategories.length > 0 && (
                                                <div className="ml-4">
                                                    {category.subcategories.map((sub) => (
                                                        <Link
                                                            key={sub.id}
                                                            to={`/products?category=${category.id}&subcategory=${sub.id}`}
                                                            className="flex items-center gap-1 px-4 py-1.5 text-xs transition-colors"
                                                            style={{ color: BRAND.text, opacity: 0.8 }}
                                                        >
                                                            <ChevronRight className="w-3 h-3" />
                                                            {sub.name}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* About Us Link */}
                        <Link
                            to="/about"
                            className="flex items-center justify-between px-4 py-3.5 rounded-xl font-semibold transition-all"
                            style={location.pathname === '/about'
                                ? { backgroundColor: BRAND.accent, color: '#ffffff' }
                                : { color: BRAND.primary }
                            }
                        >
                            About Us
                            <ChevronRight className="w-4 h-4" style={{ opacity: location.pathname === '/about' ? 1 : 0.5 }} />
                        </Link>

                        {/* Contact Link */}
                        <Link
                            to="/contact"
                            className="flex items-center justify-between px-4 py-3.5 rounded-xl font-semibold transition-all"
                            style={location.pathname === '/contact'
                                ? { backgroundColor: BRAND.accent, color: '#ffffff' }
                                : { color: BRAND.primary }
                            }
                        >
                            Contact
                            <ChevronRight className="w-4 h-4" style={{ opacity: location.pathname === '/contact' ? 1 : 0.5 }} />
                        </Link>
                    </nav>

                    <div className="p-4 border-t space-y-3" style={{ borderColor: BRAND.light, backgroundColor: BRAND.light }}>
                        <a
                            href="tel:+967777540528"
                            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white font-semibold"
                            style={{ color: BRAND.primary, border: `1px solid ${BRAND.light}` }}
                        >
                            <Phone className="w-4 h-4" />
                            +967 777 540 528
                        </a>
                        <Link
                            to="/contact"
                            className="flex items-center justify-center w-full py-3 rounded-xl font-semibold text-white"
                            style={{ backgroundColor: BRAND.accent }}
                        >
                            Get a Quote
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;
