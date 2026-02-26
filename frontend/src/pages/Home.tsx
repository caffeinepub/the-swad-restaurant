import React from 'react';
import { Link } from '@tanstack/react-router';
import { useGetAllDishes } from '../hooks/useQueries';
import DishCard from '../components/DishCard';
import { Button } from '@/components/ui/button';
import { ShoppingBag, CalendarDays, BookOpen, ChevronRight, Flame } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const SPECIAL_OFFERS = [
  { title: '20% Off on Weekends', desc: 'Every Saturday & Sunday', icon: '🎉', color: 'from-saffron/20 to-gold/10' },
  { title: 'Festival Special', desc: 'Thali for ₹299 only', icon: '🪔', color: 'from-maroon/10 to-saffron/10' },
  { title: 'Family Combo', desc: 'Serves 4 at ₹999', icon: '👨‍👩‍👧‍👦', color: 'from-gold/20 to-cream/30' },
];

export default function Home() {
  const { data: dishes, isLoading } = useGetAllDishes();

  // Show first 6 dishes as "today's specials"
  const specials = dishes?.slice(0, 6) ?? [];

  return (
    <main className="page-enter">
      {/* Hero Banner */}
      <section className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
        <img
          src="/assets/generated/hero-banner.dim_1200x480.png"
          alt="Authentic Indian Cuisine"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-maroon/80 via-maroon/50 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 max-w-2xl">
          <p className="text-gold font-body text-sm uppercase tracking-widest mb-2">Authentic Indian Cuisine</p>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-cream leading-tight mb-3">
            Experience the<br />
            <span className="text-gradient-gold">True Taste</span> of Swad
          </h1>
          <p className="text-cream/80 font-body text-sm sm:text-base mb-6 max-w-sm">
            Handcrafted recipes passed down through generations, served with love.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/menu">
              <Button className="bg-saffron text-white hover:bg-saffron/90 font-body font-semibold shadow-lg">
                <ShoppingBag className="w-4 h-4 mr-2" /> Order Now
              </Button>
            </Link>
            <Link to="/book-table">
              <Button variant="outline" className="border-gold text-gold hover:bg-gold/10 font-body font-semibold">
                <CalendarDays className="w-4 h-4 mr-2" /> Book Table
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="bg-maroon py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-3 gap-3">
            {[
              { to: '/menu', icon: BookOpen, label: 'View Menu' },
              { to: '/menu', icon: ShoppingBag, label: 'Order Now' },
              { to: '/book-table', icon: CalendarDays, label: 'Book Table' },
            ].map(({ to, icon: Icon, label }) => (
              <Link key={label} to={to}>
                <div className="flex flex-col items-center gap-1 py-3 px-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors cursor-pointer">
                  <Icon className="w-5 h-5 text-gold" />
                  <span className="text-cream text-xs font-body font-medium text-center">{label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10">
        {/* Special Offers */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title flex items-center gap-2">
              <Flame className="w-5 h-5 text-saffron" /> Special Offers
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {SPECIAL_OFFERS.map((offer) => (
              <div
                key={offer.title}
                className={`bg-gradient-to-br ${offer.color} border border-gold/20 rounded-2xl p-4 flex items-center gap-4 card-hover`}
              >
                <span className="text-3xl">{offer.icon}</span>
                <div>
                  <p className="font-display font-semibold text-maroon text-sm">{offer.title}</p>
                  <p className="text-muted-foreground text-xs font-body">{offer.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Today's Special */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Today's Special</h2>
            <Link to="/menu" className="flex items-center gap-1 text-saffron text-sm font-body font-medium hover:underline">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="rounded-xl overflow-hidden">
                  <Skeleton className="h-44 w-full" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : specials.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="font-body">No dishes available yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {specials.map(dish => (
                <DishCard key={String(dish.id)} dish={dish} />
              ))}
            </div>
          )}
        </section>

        {/* Why Choose Us */}
        <section className="bg-gradient-to-br from-maroon/5 to-saffron/5 rounded-2xl p-6 border border-gold/20">
          <h2 className="section-title text-center mb-6">Why Choose The Swad?</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            {[
              { icon: '🌿', title: 'Fresh Ingredients', desc: 'Farm to table daily' },
              { icon: '👨‍🍳', title: 'Expert Chefs', desc: '20+ years experience' },
              { icon: '🚀', title: 'Fast Delivery', desc: '30 min guarantee' },
              { icon: '⭐', title: '4.8 Rating', desc: '10,000+ happy guests' },
            ].map(item => (
              <div key={item.title} className="space-y-2">
                <div className="text-3xl">{item.icon}</div>
                <p className="font-display font-semibold text-maroon text-sm">{item.title}</p>
                <p className="text-muted-foreground text-xs font-body">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
