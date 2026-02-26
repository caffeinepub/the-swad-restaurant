import React, { useState } from 'react';
import { useGetAllDishes } from '../hooks/useQueries';
import DishCard from '../components/DishCard';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Toggle } from '@/components/ui/toggle';
import { Skeleton } from '@/components/ui/skeleton';
import { Leaf, Drumstick } from 'lucide-react';

const CATEGORIES = ['All', 'Starters', 'Main Course', 'Breads', 'Desserts', 'Beverages'];

export default function Menu() {
  const { data: allDishes = [], isLoading } = useGetAllDishes();
  const [vegFilter, setVegFilter] = useState<'all' | 'veg' | 'nonveg'>('all');

  const filterDishes = (category: string) => {
    let dishes = category === 'All' ? allDishes : allDishes.filter(d => d.category === category);
    if (vegFilter === 'veg') dishes = dishes.filter(d => d.isVeg);
    if (vegFilter === 'nonveg') dishes = dishes.filter(d => !d.isVeg);
    return dishes;
  };

  return (
    <main className="page-enter max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-maroon mb-2">Our Menu</h1>
        <div className="ornament-divider w-48 mx-auto">
          <span className="text-gold text-lg">✦</span>
        </div>
        <p className="text-muted-foreground font-body mt-2">Authentic flavors crafted with love</p>
      </div>

      {/* Veg / Non-Veg Filter */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <span className="text-sm font-body text-muted-foreground">Filter:</span>
        <div className="flex gap-2 bg-muted rounded-full p-1">
          {(['all', 'veg', 'nonveg'] as const).map(f => (
            <button
              key={f}
              onClick={() => setVegFilter(f)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-body font-medium transition-all ${
                vegFilter === f
                  ? f === 'veg'
                    ? 'bg-green-600 text-white shadow-sm'
                    : f === 'nonveg'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-maroon text-cream shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {f === 'veg' && <Leaf className="w-3.5 h-3.5" />}
              {f === 'nonveg' && <Drumstick className="w-3.5 h-3.5" />}
              {f === 'all' ? 'All' : f === 'veg' ? 'Veg' : 'Non-Veg'}
            </button>
          ))}
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs defaultValue="All">
        <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1 rounded-xl mb-6 w-full justify-start sm:justify-center">
          {CATEGORIES.map(cat => (
            <TabsTrigger
              key={cat}
              value={cat}
              className="rounded-lg font-body text-sm data-[state=active]:bg-maroon data-[state=active]:text-cream"
            >
              {cat}
            </TabsTrigger>
          ))}
        </TabsList>

        {CATEGORIES.map(cat => {
          const dishes = filterDishes(cat);
          return (
            <TabsContent key={cat} value={cat}>
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map(i => (
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
              ) : dishes.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-4xl mb-3">🍽️</p>
                  <p className="font-display text-lg text-muted-foreground">No dishes found</p>
                  <p className="text-sm text-muted-foreground font-body mt-1">Try changing your filter</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {dishes.map(dish => (
                    <DishCard key={String(dish.id)} dish={dish} />
                  ))}
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </main>
  );
}
