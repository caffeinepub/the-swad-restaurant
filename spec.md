# Specification

## Summary
**Goal:** Build "The Swad Restaurant" full-stack web app — a premium Indian restaurant platform with menu browsing, online ordering, table reservations, user accounts, reviews, an admin panel, and a contact page, all styled with a saffron/maroon/gold warm theme.

**Planned changes:**

- **Theme & UI:** Apply saffron (#F28C28), maroon (#800000), and gold (#FFD700) palette with dark backgrounds, elegant serif headings, Indian motif accents, smooth transitions, and responsive layout.
- **Splash Screen:** Show restaurant logo, name "The Swad Restaurant", and tagline "Experience the True Taste of Swad"; auto-dismiss with fade-out after ~2.5 seconds.
- **Home Screen:** Hero banner with featured dish image and welcome message; horizontally scrollable "Today's Special" dish cards; "Order Now", "Book Table", and "View Menu" quick-action buttons.
- **Menu Screen:** Tab navigation for five categories (Starters, Main Course, Breads, Desserts, Beverages); Veg/Non-Veg toggle filter; dish cards with image, name, description, price, dietary indicator dot, and Add to Cart with quantity controls.
- **Shopping Cart:** Persistent session cart with item list, quantity adjustment, item removal, coupon code field (validated against backend), payment method selection (UPI, Card, Cash on Delivery), and order placement saving to backend.
- **Table Reservation:** Booking form (Name, Phone, Date, Time, Guests) with validation, backend save, and confirmation message.
- **User Account (Internet Identity):** Login/logout; profile page showing order history with status, saved delivery addresses (add/remove), and table reservation history. Guest users must log in before checkout.
- **Reviews & Ratings:** Authenticated users submit 1–5 star rating and text review; all reviews displayed in a scrollable list with stars, reviewer name, text, and date.
- **Contact & Location:** Restaurant address, opening hours, static Google Maps iframe, Call button (tel: link), WhatsApp button (wa.me link), and email address.
- **Admin Panel:** Protected by hardcoded admin principal; three tabs — Menu Management (add/edit/delete dishes with image URL), Order Management (view all orders, update status), Revenue Reports (total orders, total revenue, orders grouped by day).
- **Backend (single Motoko actor):** Stable storage for dishes (name, description, price, category, image URL, veg flag, availability), orders (items, total, payment method, user, status, timestamp), coupons (code, discount %), reservations (name, phone, date, time, guests, user), reviews (rating, text, user, timestamp), and user saved addresses. Seed sample dishes for all five categories and a sample coupon (SWAD10 = 10% off).
- **Static Assets:** Restaurant logo, hero banner, and one representative dish image per menu category.

**User-visible outcome:** Visitors can browse the full menu with category and dietary filters, add dishes to a cart, apply coupons, choose a payment method, and place orders. Authenticated users can reserve tables, view order and reservation history, manage saved addresses, and leave reviews. An admin can manage the menu, update order statuses, and view revenue reports. A splash screen and polished warm Indian theme greet every visitor.
