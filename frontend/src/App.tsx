import React, { useEffect, useState } from 'react';
import {
  createRouter,
  createRoute,
  createRootRoute,
  RouterProvider,
  Outlet,
  redirect,
} from '@tanstack/react-router';
import { CartProvider } from './context/CartContext';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';

import Navbar from './components/Navbar';
import ProfileSetupModal from './components/ProfileSetupModal';

import SplashScreen from './pages/SplashScreen';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import BookTable from './pages/BookTable';
import Profile from './pages/Profile';
import Reviews from './pages/Reviews';
import Contact from './pages/Contact';
import Admin from './pages/Admin';

import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';

// ─── Layout wrapper (Navbar + ProfileSetupModal) ──────────────────────────────
function AppLayout() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !isLoading && isFetched && userProfile === null;

  return (
    <>
      <Navbar />
      <Outlet />
      <ProfileSetupModal
        open={showProfileSetup}
        onComplete={() => {/* query invalidation handled inside modal */}}
      />
    </>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(
    typeof window !== 'undefined' ? window.location.hostname : 'the-swad-restaurant'
  );
  return (
    <footer className="bg-maroon text-cream/70 py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img
                src="/assets/generated/swad-logo.dim_256x256.png"
                alt="The Swad Restaurant"
                className="w-10 h-10 rounded-full object-cover border-2 border-gold/40"
              />
              <div>
                <p className="font-display text-gold font-bold text-sm">The Swad Restaurant</p>
                <p className="text-cream/50 text-xs font-body">Authentic Indian Cuisine</p>
              </div>
            </div>
            <p className="text-xs font-body leading-relaxed text-cream/60">
              Experience the True Taste of Swad — handcrafted recipes served with love since 2005.
            </p>
          </div>
          <div>
            <p className="font-display text-gold font-semibold text-sm mb-3">Quick Links</p>
            <ul className="space-y-1 text-xs font-body">
              {[
                { href: '/home', label: 'Home' },
                { href: '/menu', label: 'Menu' },
                { href: '/book-table', label: 'Book Table' },
                { href: '/reviews', label: 'Reviews' },
                { href: '/contact', label: 'Contact' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <a href={href} className="text-cream/60 hover:text-gold transition-colors">{label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-display text-gold font-semibold text-sm mb-3">Contact</p>
            <div className="space-y-1 text-xs font-body text-cream/60">
              <p>📍 123, MG Road, Connaught Place</p>
              <p>New Delhi – 110001</p>
              <p>📞 +91 12345 67890</p>
              <p>✉️ info@theswadrestaurant.com</p>
              <p>🕐 Mon–Sun: 11 AM – 11 PM</p>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-body text-cream/40">
          <p>© {year} The Swad Restaurant. All rights reserved.</p>
          <p>
            Built with{' '}
            <span className="text-red-400">♥</span>{' '}
            using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Page wrapper with footer ─────────────────────────────────────────────────
function PageWithFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}

// ─── Routes ───────────────────────────────────────────────────────────────────
const rootRoute = createRootRoute({
  component: () => (
    <PageWithFooter>
      <Outlet />
    </PageWithFooter>
  ),
});

const splashRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: SplashScreen,
});

const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'layout',
  component: AppLayout,
});

const homeRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/home',
  component: Home,
});

const menuRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/menu',
  component: Menu,
});

const cartRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/cart',
  component: Cart,
});

const bookTableRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/book-table',
  component: BookTable,
});

const profileRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/profile',
  component: Profile,
});

const reviewsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/reviews',
  component: Reviews,
});

const contactRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/contact',
  component: Contact,
});

const adminRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/admin',
  component: Admin,
});

const routeTree = rootRoute.addChildren([
  splashRoute,
  layoutRoute.addChildren([
    homeRoute,
    menuRoute,
    cartRoute,
    bookTableRoute,
    profileRoute,
    reviewsRoute,
    contactRoute,
    adminRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <CartProvider>
        <RouterProvider router={router} />
        <Toaster richColors position="top-right" />
      </CartProvider>
    </ThemeProvider>
  );
}
