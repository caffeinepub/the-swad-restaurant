import React, { useState } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { useCart } from '../context/CartContext';
import { useIsCallerAdmin } from '../hooks/useQueries';
import LoginButton from './LoginButton';
import { ShoppingCart, Menu, X, UtensilsCrossed, Home, BookOpen, CalendarDays, Star, Phone, Settings } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const navLinks = [
  { to: '/home', label: 'Home', icon: Home },
  { to: '/menu', label: 'Menu', icon: BookOpen },
  { to: '/book-table', label: 'Book Table', icon: CalendarDays },
  { to: '/reviews', label: 'Reviews', icon: Star },
  { to: '/contact', label: 'Contact', icon: Phone },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems } = useCart();
  const { data: isAdmin } = useIsCallerAdmin();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-maroon shadow-maroon">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/home" className="flex items-center gap-2 shrink-0">
            <img
              src="/assets/generated/swad-logo.dim_256x256.png"
              alt="The Swad Restaurant"
              className="w-10 h-10 rounded-full object-cover border-2 border-gold/60"
            />
            <div className="hidden sm:block">
              <p className="font-display text-gold font-bold text-base leading-tight">The Swad</p>
              <p className="text-cream/70 text-xs leading-tight font-body">Restaurant</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`px-3 py-1.5 rounded-md text-sm font-body font-medium transition-colors ${
                  isActive(to)
                    ? 'bg-gold/20 text-gold'
                    : 'text-cream/80 hover:text-cream hover:bg-white/10'
                }`}
              >
                {label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className={`px-3 py-1.5 rounded-md text-sm font-body font-medium transition-colors ${
                  isActive('/admin')
                    ? 'bg-gold/20 text-gold'
                    : 'text-cream/80 hover:text-cream hover:bg-white/10'
                }`}
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <Link to="/cart" className="relative p-2 text-cream hover:text-gold transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-saffron text-white text-xs border-0 rounded-full">
                  {totalItems}
                </Badge>
              )}
            </Link>
            <Link to="/profile" className="hidden sm:flex p-2 text-cream hover:text-gold transition-colors">
              <UtensilsCrossed className="w-5 h-5" />
            </Link>
            <div className="hidden sm:block">
              <LoginButton />
            </div>
            <button
              className="md:hidden p-2 text-cream"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-maroon border-t border-white/10 px-4 pb-4 pt-2 space-y-1">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-body font-medium transition-colors ${
                isActive(to)
                  ? 'bg-gold/20 text-gold'
                  : 'text-cream/80 hover:text-cream hover:bg-white/10'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
          <Link
            to="/profile"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-body font-medium text-cream/80 hover:text-cream hover:bg-white/10"
          >
            <UtensilsCrossed className="w-4 h-4" />
            My Account
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-body font-medium text-cream/80 hover:text-cream hover:bg-white/10"
            >
              <Settings className="w-4 h-4" />
              Admin
            </Link>
          )}
          <div className="pt-2">
            <LoginButton />
          </div>
        </div>
      )}
    </header>
  );
}
