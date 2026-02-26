import React, { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import {
  useIsCallerAdmin,
  useGetAllDishes,
  useGetAllOrders,
  useAddDish,
  useEditDish,
  useDeleteDish,
  useUpdateOrderStatus,
  useAddCoupon,
} from '../hooks/useQueries';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Plus,
  Edit2,
  Trash2,
  Loader2,
  ShieldAlert,
  BarChart3,
  UtensilsCrossed,
  ShoppingBag,
  Tag,
  TrendingUp,
  Package,
} from 'lucide-react';
import { toast } from 'sonner';
import type { Dish } from '../backend';
import LoginButton from '../components/LoginButton';

const CATEGORIES = ['Starters', 'Main Course', 'Breads', 'Desserts', 'Beverages'];

const ORDER_STATUSES = ['Pending', 'Confirmed', 'Preparing', 'Delivered', 'Cancelled'];

const STATUS_COLORS: Record<string, string> = {
  Pending: 'bg-amber-100 text-amber-700 border-amber-200',
  Confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
  Preparing: 'bg-orange-100 text-orange-700 border-orange-200',
  Delivered: 'bg-green-100 text-green-700 border-green-200',
  Cancelled: 'bg-red-100 text-red-700 border-red-200',
};

interface DishFormData {
  name: string;
  description: string;
  price: string;
  category: string;
  imageUrl: string;
  isVeg: boolean;
  available: boolean;
}

const EMPTY_DISH: DishFormData = {
  name: '',
  description: '',
  price: '',
  category: 'Starters',
  imageUrl: '',
  isVeg: true,
  available: true,
};

function formatDate(timestamp: bigint) {
  return new Date(Number(timestamp) / 1_000_000).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// ─── Dish Form ────────────────────────────────────────────────────────────────
interface DishFormProps {
  form: DishFormData;
  setForm: React.Dispatch<React.SetStateAction<DishFormData>>;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isEditing: boolean;
  isPending: boolean;
}

function DishForm({ form, setForm, onSubmit, onCancel, isEditing, isPending }: DishFormProps) {
  return (
    <form onSubmit={onSubmit} className="bg-muted/30 rounded-xl p-5 border border-border/50 space-y-4">
      <h3 className="font-display font-semibold text-maroon text-lg">
        {isEditing ? 'Edit Dish' : 'Add New Dish'}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Name *</Label>
          <Input
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="Dish name"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label>Price (₹) *</Label>
          <Input
            type="number"
            value={form.price}
            onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
            placeholder="e.g. 250"
            min="1"
            required
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Description</Label>
        <Textarea
          value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          placeholder="Describe the dish..."
          rows={2}
          className="resize-none"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Category *</Label>
          <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(c => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Image URL</Label>
          <Input
            value={form.imageUrl}
            onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))}
            placeholder="https://..."
          />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Switch
            id="isVeg"
            checked={form.isVeg}
            onCheckedChange={v => setForm(f => ({ ...f, isVeg: v }))}
          />
          <Label htmlFor="isVeg" className="cursor-pointer">
            {form.isVeg ? '🟢 Vegetarian' : '🔴 Non-Vegetarian'}
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            id="available"
            checked={form.available}
            onCheckedChange={v => setForm(f => ({ ...f, available: v }))}
          />
          <Label htmlFor="available" className="cursor-pointer">
            {form.available ? 'Available' : 'Unavailable'}
          </Label>
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <Button
          type="submit"
          disabled={isPending}
          className="bg-maroon text-cream hover:bg-maroon/90"
        >
          {isPending ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
          ) : (
            isEditing ? 'Update Dish' : 'Add Dish'
          )}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

// ─── Main Admin Component ─────────────────────────────────────────────────────
export default function Admin() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: dishes = [], isLoading: dishesLoading } = useGetAllDishes();
  const { data: orders = [], isLoading: ordersLoading } = useGetAllOrders();

  const addDish = useAddDish();
  const editDishMutation = useEditDish();
  const deleteDish = useDeleteDish();
  const updateStatus = useUpdateOrderStatus();
  const addCoupon = useAddCoupon();

  const [showDishForm, setShowDishForm] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [dishForm, setDishForm] = useState<DishFormData>(EMPTY_DISH);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState('');

  const openAddForm = () => {
    setEditingDish(null);
    setDishForm(EMPTY_DISH);
    setShowDishForm(true);
  };

  const openEditForm = (dish: Dish) => {
    setEditingDish(dish);
    setDishForm({
      name: dish.name,
      description: dish.description,
      price: String(Number(dish.price)),
      category: dish.category,
      imageUrl: dish.imageUrl,
      isVeg: dish.isVeg,
      available: dish.available,
    });
    setShowDishForm(true);
  };

  const handleDishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishForm.name || !dishForm.price || !dishForm.category) {
      toast.error('Please fill required fields');
      return;
    }
    try {
      if (editingDish) {
        await editDishMutation.mutateAsync({
          id: editingDish.id,
          ...dishForm,
          price: BigInt(dishForm.price),
        });
        toast.success('Dish updated!');
      } else {
        await addDish.mutateAsync({
          ...dishForm,
          price: BigInt(dishForm.price),
        });
        toast.success('Dish added!');
      }
      setShowDishForm(false);
      setEditingDish(null);
      setDishForm(EMPTY_DISH);
    } catch {
      toast.error('Failed to save dish');
    }
  };

  const handleDeleteDish = async (id: bigint) => {
    try {
      await deleteDish.mutateAsync(id);
      toast.success('Dish deleted');
    } catch {
      toast.error('Failed to delete dish');
    }
  };

  const handleStatusChange = async (orderId: bigint, status: string) => {
    try {
      await updateStatus.mutateAsync({ orderId, status });
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleAddCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode || !couponDiscount) {
      toast.error('Please fill coupon fields');
      return;
    }
    try {
      await addCoupon.mutateAsync({
        code: couponCode.toUpperCase(),
        discount: BigInt(couponDiscount),
      });
      toast.success(`Coupon ${couponCode.toUpperCase()} added!`);
      setCouponCode('');
      setCouponDiscount('');
    } catch {
      toast.error('Failed to add coupon');
    }
  };

  // Revenue stats
  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.totalAmount), 0);
  const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;

  // Group orders by date for report
  const ordersByDate = orders.reduce<Record<string, typeof orders>>((acc, order) => {
    const date = formatDate(order.timestamp);
    if (!acc[date]) acc[date] = [];
    acc[date].push(order);
    return acc;
  }, {});

  // ── Not logged in ──
  if (!identity) {
    return (
      <main className="page-enter max-w-lg mx-auto px-4 py-16 text-center">
        <div className="bg-card rounded-2xl p-8 shadow-card border border-border/50">
          <ShieldAlert className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold text-maroon mb-2">Admin Panel</h2>
          <p className="text-muted-foreground font-body mb-6">
            Please login to access the admin panel
          </p>
          <LoginButton />
        </div>
      </main>
    );
  }

  // ── Loading admin check ──
  if (adminLoading) {
    return (
      <main className="page-enter max-w-4xl mx-auto px-4 py-8">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="space-y-3">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
        </div>
      </main>
    );
  }

  // ── Not admin ──
  if (!isAdmin) {
    return (
      <main className="page-enter max-w-lg mx-auto px-4 py-16 text-center">
        <div className="bg-card rounded-2xl p-8 shadow-card border border-border/50">
          <ShieldAlert className="w-16 h-16 text-destructive/60 mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold text-maroon mb-2">Access Denied</h2>
          <p className="text-muted-foreground font-body">
            You don't have permission to access the admin panel.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="page-enter max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-maroon rounded-xl flex items-center justify-center">
          <ShieldAlert className="w-5 h-5 text-cream" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-maroon">Admin Panel</h1>
          <p className="text-muted-foreground text-sm font-body">Manage your restaurant</p>
        </div>
      </div>

      <Tabs defaultValue="menu">
        <TabsList className="bg-muted/50 p-1 rounded-xl mb-6 flex flex-wrap h-auto gap-1">
          <TabsTrigger
            value="menu"
            className="data-[state=active]:bg-maroon data-[state=active]:text-cream font-body"
          >
            <UtensilsCrossed className="w-4 h-4 mr-1.5" /> Menu Management
          </TabsTrigger>
          <TabsTrigger
            value="orders"
            className="data-[state=active]:bg-maroon data-[state=active]:text-cream font-body"
          >
            <ShoppingBag className="w-4 h-4 mr-1.5" /> Order Management
          </TabsTrigger>
          <TabsTrigger
            value="coupons"
            className="data-[state=active]:bg-maroon data-[state=active]:text-cream font-body"
          >
            <Tag className="w-4 h-4 mr-1.5" /> Coupons
          </TabsTrigger>
          <TabsTrigger
            value="revenue"
            className="data-[state=active]:bg-maroon data-[state=active]:text-cream font-body"
          >
            <BarChart3 className="w-4 h-4 mr-1.5" /> Revenue Reports
          </TabsTrigger>
        </TabsList>

        {/* ── Menu Management ── */}
        <TabsContent value="menu" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground font-body text-sm">
              {dishes.length} dish{dishes.length !== 1 ? 'es' : ''} in menu
            </p>
            {!showDishForm && (
              <Button
                onClick={openAddForm}
                className="bg-maroon text-cream hover:bg-maroon/90"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-1" /> Add Dish
              </Button>
            )}
          </div>

          {showDishForm && (
            <DishForm
              form={dishForm}
              setForm={setDishForm}
              onSubmit={handleDishSubmit}
              onCancel={() => { setShowDishForm(false); setEditingDish(null); }}
              isEditing={!!editingDish}
              isPending={addDish.isPending || editDishMutation.isPending}
            />
          )}

          {dishesLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
            </div>
          ) : dishes.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-2xl border border-border/50">
              <UtensilsCrossed className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="font-display text-lg text-muted-foreground">No dishes yet</p>
              <p className="text-sm text-muted-foreground font-body mt-1">Add your first dish to get started</p>
            </div>
          ) : (
            <div className="space-y-2">
              {dishes.map(dish => (
                <div
                  key={String(dish.id)}
                  className="bg-card rounded-xl p-4 border border-border/50 flex items-center gap-4"
                >
                  <img
                    src={dish.imageUrl || `/assets/generated/dish-${dish.category.toLowerCase().replace(' ', '')}.dim_600x400.png`}
                    alt={dish.name}
                    className="w-14 h-14 rounded-lg object-cover shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/generated/dish-maincourse.dim_600x400.png';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-display font-semibold text-foreground text-sm">{dish.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${dish.isVeg ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {dish.isVeg ? 'Veg' : 'Non-Veg'}
                      </span>
                      {!dish.available && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                          Unavailable
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground font-body">{dish.category} • ₹{Number(dish.price)}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditForm(dish)}
                      className="border-maroon/30 text-maroon hover:bg-maroon/5 h-8 w-8 p-0"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-destructive/30 text-destructive hover:bg-destructive/5 h-8 w-8 p-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Dish</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{dish.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteDish(dish.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ── Order Management ── */}
        <TabsContent value="orders" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground font-body text-sm">
              {orders.length} total order{orders.length !== 1 ? 's' : ''}
            </p>
          </div>

          {ordersLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-2xl border border-border/50">
              <ShoppingBag className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="font-display text-lg text-muted-foreground">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {[...orders].reverse().map(order => (
                <div
                  key={String(order.id)}
                  className="bg-card rounded-xl p-4 border border-border/50"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="font-display font-semibold text-foreground">
                        Order #{String(order.id)}
                      </p>
                      <p className="text-xs text-muted-foreground font-body">
                        {formatDate(order.timestamp)} • {order.paymentMethod}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${STATUS_COLORS[order.status] ?? 'bg-muted text-muted-foreground'}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm font-body text-muted-foreground mb-3">
                    {order.items.map(([name, qty]) => `${name} ×${qty}`).join(', ')}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-maroon font-body">₹{Number(order.totalAmount)}</span>
                    <Select
                      value={order.status}
                      onValueChange={v => handleStatusChange(order.id, v)}
                    >
                      <SelectTrigger className="w-36 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ORDER_STATUSES.map(s => (
                          <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ── Coupons ── */}
        <TabsContent value="coupons" className="space-y-4">
          <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50 max-w-md">
            <h3 className="font-display font-semibold text-maroon text-lg mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5 text-saffron" /> Add Coupon Code
            </h3>
            <form onSubmit={handleAddCoupon} className="space-y-4">
              <div className="space-y-1.5">
                <Label>Coupon Code *</Label>
                <Input
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="e.g. SWAD10"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>Discount Percentage *</Label>
                <Input
                  type="number"
                  value={couponDiscount}
                  onChange={e => setCouponDiscount(e.target.value)}
                  placeholder="e.g. 10 (for 10% off)"
                  min="1"
                  max="100"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={addCoupon.isPending}
                className="w-full bg-maroon text-cream hover:bg-maroon/90"
              >
                {addCoupon.isPending ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Adding...</>
                ) : (
                  <><Plus className="w-4 h-4 mr-2" /> Add Coupon</>
                )}
              </Button>
            </form>
            <div className="mt-4 p-3 bg-muted/50 rounded-lg text-xs font-body text-muted-foreground">
              <p className="font-medium text-foreground mb-1">💡 Tip</p>
              <p>Try adding <strong>SWAD10</strong> for 10% off or <strong>WELCOME20</strong> for 20% off new customers.</p>
            </div>
          </div>
        </TabsContent>

        {/* ── Revenue Reports ── */}
        <TabsContent value="revenue" className="space-y-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              {
                label: 'Total Orders',
                value: orders.length,
                icon: ShoppingBag,
                color: 'text-blue-600',
                bg: 'bg-blue-50',
              },
              {
                label: 'Total Revenue',
                value: `₹${totalRevenue.toLocaleString('en-IN')}`,
                icon: TrendingUp,
                color: 'text-green-600',
                bg: 'bg-green-50',
              },
              {
                label: 'Delivered',
                value: deliveredOrders,
                icon: Package,
                color: 'text-maroon',
                bg: 'bg-maroon/10',
              },
              {
                label: 'Pending',
                value: pendingOrders,
                icon: BarChart3,
                color: 'text-amber-600',
                bg: 'bg-amber-50',
              },
            ].map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className="bg-card rounded-xl p-4 border border-border/50 shadow-card">
                <div className={`w-10 h-10 ${bg} rounded-lg flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <p className="font-display font-bold text-xl text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground font-body mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          <Separator />

          {/* Orders by Date */}
          <div>
            <h3 className="font-display font-semibold text-maroon text-lg mb-4">Orders by Date</h3>
            {ordersLoading ? (
              <div className="space-y-3">
                {[1, 2].map(i => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
              </div>
            ) : Object.keys(ordersByDate).length === 0 ? (
              <div className="text-center py-8 bg-card rounded-2xl border border-border/50">
                <BarChart3 className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-muted-foreground font-body text-sm">No order data yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(ordersByDate)
                  .sort(([a], [b]) => b.localeCompare(a))
                  .map(([date, dayOrders]) => {
                    const dayRevenue = dayOrders.reduce((sum, o) => sum + Number(o.totalAmount), 0);
                    return (
                      <div key={date} className="bg-card rounded-xl p-4 border border-border/50">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-display font-semibold text-foreground text-sm">{date}</p>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-muted-foreground font-body">
                              {dayOrders.length} order{dayOrders.length !== 1 ? 's' : ''}
                            </span>
                            <span className="font-bold text-maroon font-body text-sm">
                              ₹{dayRevenue.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {dayOrders.map(o => (
                            <span
                              key={String(o.id)}
                              className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_COLORS[o.status] ?? 'bg-muted text-muted-foreground'}`}
                            >
                              #{String(o.id)} {o.status}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}
