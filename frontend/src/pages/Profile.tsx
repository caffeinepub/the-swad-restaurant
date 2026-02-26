import React, { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useGetUserOrders, useGetUserReservations, useSaveCallerUserProfile } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { User, ShoppingBag, CalendarDays, MapPin, LogIn, Loader2, Edit2, Check, X } from 'lucide-react';
import LoginButton from '../components/LoginButton';
import { toast } from 'sonner';

const STATUS_COLORS: Record<string, string> = {
  Pending: 'bg-amber-100 text-amber-700 border-amber-200',
  Confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
  Preparing: 'bg-orange-100 text-orange-700 border-orange-200',
  Delivered: 'bg-green-100 text-green-700 border-green-200',
  Cancelled: 'bg-red-100 text-red-700 border-red-200',
};

function formatDate(timestamp: bigint) {
  return new Date(Number(timestamp) / 1_000_000).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
}

export default function Profile() {
  const { identity } = useInternetIdentity();
  const { data: profile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: orders = [], isLoading: ordersLoading } = useGetUserOrders();
  const { data: reservations = [], isLoading: resLoading } = useGetUserReservations();
  const saveProfile = useSaveCallerUserProfile();

  const [editingProfile, setEditingProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editAddress, setEditAddress] = useState('');

  const startEdit = () => {
    setEditName(profile?.name ?? '');
    setEditAddress(profile?.address ?? '');
    setEditingProfile(true);
  };

  const saveEdit = async () => {
    if (!editName.trim()) { toast.error('Name is required'); return; }
    await saveProfile.mutateAsync({ name: editName.trim(), address: editAddress.trim() });
    setEditingProfile(false);
    toast.success('Profile updated!');
  };

  if (!identity) {
    return (
      <main className="page-enter max-w-lg mx-auto px-4 py-16 text-center">
        <div className="bg-card rounded-2xl p-8 shadow-card border border-border/50">
          <LogIn className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold text-maroon mb-2">My Account</h2>
          <p className="text-muted-foreground font-body mb-6">Login to view your orders, reservations, and profile</p>
          <LoginButton />
        </div>
      </main>
    );
  }

  return (
    <main className="page-enter max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-display text-3xl font-bold text-maroon mb-6">My Account</h1>

      <Tabs defaultValue="profile">
        <TabsList className="bg-muted/50 p-1 rounded-xl mb-6">
          <TabsTrigger value="profile" className="data-[state=active]:bg-maroon data-[state=active]:text-cream font-body">
            <User className="w-4 h-4 mr-1.5" /> Profile
          </TabsTrigger>
          <TabsTrigger value="orders" className="data-[state=active]:bg-maroon data-[state=active]:text-cream font-body">
            <ShoppingBag className="w-4 h-4 mr-1.5" /> Orders
          </TabsTrigger>
          <TabsTrigger value="reservations" className="data-[state=active]:bg-maroon data-[state=active]:text-cream font-body">
            <CalendarDays className="w-4 h-4 mr-1.5" /> Reservations
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
            {profileLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-maroon/10 flex items-center justify-center">
                      <User className="w-8 h-8 text-maroon" />
                    </div>
                    <div>
                      <h2 className="font-display text-xl font-bold text-foreground">{profile?.name ?? 'Guest'}</h2>
                      <p className="text-muted-foreground text-sm font-body">
                        {identity.getPrincipal().toString().slice(0, 20)}...
                      </p>
                    </div>
                  </div>
                  {!editingProfile && (
                    <Button variant="outline" size="sm" onClick={startEdit} className="border-maroon text-maroon hover:bg-maroon/5">
                      <Edit2 className="w-4 h-4 mr-1" /> Edit
                    </Button>
                  )}
                </div>

                {editingProfile ? (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label>Name</Label>
                      <Input value={editName} onChange={e => setEditName(e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Delivery Address</Label>
                      <Input value={editAddress} onChange={e => setEditAddress(e.target.value)} placeholder="Enter your delivery address" />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={saveEdit} disabled={saveProfile.isPending} className="bg-maroon text-cream hover:bg-maroon/90">
                        {saveProfile.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4 mr-1" /> Save</>}
                      </Button>
                      <Button variant="outline" onClick={() => setEditingProfile(false)}>
                        <X className="w-4 h-4 mr-1" /> Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-xl">
                      <MapPin className="w-4 h-4 text-saffron mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground font-body mb-0.5">Delivery Address</p>
                        <p className="text-sm font-body">{profile?.address || 'No address saved'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders">
          {ordersLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-2xl border border-border/50">
              <ShoppingBag className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="font-display text-lg text-muted-foreground">No orders yet</p>
              <p className="text-sm text-muted-foreground font-body mt-1">Your order history will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {[...orders].reverse().map(order => (
                <div key={String(order.id)} className="bg-card rounded-xl p-4 shadow-card border border-border/50">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-display font-semibold text-foreground">Order #{String(order.id)}</p>
                      <p className="text-xs text-muted-foreground font-body">{formatDate(order.timestamp)}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${STATUS_COLORS[order.status] ?? 'bg-muted text-muted-foreground'}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="text-sm font-body text-muted-foreground mb-2">
                    {order.items.map(([name, qty]) => `${name} ×${qty}`).join(', ')}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{order.paymentMethod}</span>
                    <span className="font-bold text-maroon font-body">₹{Number(order.totalAmount)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Reservations Tab */}
        <TabsContent value="reservations">
          {resLoading ? (
            <div className="space-y-3">
              {[1, 2].map(i => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
            </div>
          ) : reservations.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-2xl border border-border/50">
              <CalendarDays className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="font-display text-lg text-muted-foreground">No reservations yet</p>
              <p className="text-sm text-muted-foreground font-body mt-1">Book a table to see your reservations here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {[...reservations].reverse().map(res => (
                <div key={String(res.id)} className="bg-card rounded-xl p-4 shadow-card border border-border/50">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-display font-semibold text-foreground">Booking #{String(res.id)}</p>
                    <Badge variant="outline" className="border-maroon text-maroon text-xs">Confirmed</Badge>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm font-body">
                    <div><p className="text-xs text-muted-foreground">Name</p><p className="font-medium">{res.name}</p></div>
                    <div><p className="text-xs text-muted-foreground">Date</p><p className="font-medium">{res.date}</p></div>
                    <div><p className="text-xs text-muted-foreground">Time</p><p className="font-medium">{res.time}</p></div>
                    <div><p className="text-xs text-muted-foreground">Guests</p><p className="font-medium">{String(res.guests)}</p></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </main>
  );
}
