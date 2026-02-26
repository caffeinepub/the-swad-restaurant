import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Set "mo:core/Set";
import List "mo:core/List";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Nat32 "mo:core/Nat32";
import Char "mo:core/Char";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  include MixinStorage();

  // Include authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Types
  public type Dish = {
    id : Nat;
    name : Text;
    description : Text;
    price : Nat;
    category : Text; // "Starters", "Main Course", "Breads", etc.
    imageUrl : Text;
    isVeg : Bool;
    available : Bool;
  };

  public type Order = {
    id : Nat;
    user : Principal;
    items : [(Text, Nat, Nat)]; // (name, quantity, price)
    totalAmount : Nat;
    paymentMethod : Text; // "UPI", "Card", "Cash"
    status : Text; // "Pending", "Confirmed", etc.
    timestamp : Time.Time;
  };

  public type Reservation = {
    id : Nat;
    user : Principal;
    name : Text;
    phone : Text;
    date : Text;
    time : Text;
    guests : Nat;
    timestamp : Time.Time;
  };

  public type Review = {
    user : Principal;
    rating : Nat;
    comment : Text;
    timestamp : Time.Time;
  };

  public type Coupon = {
    code : Text;
    discount : Nat;
  };

  public type UserProfile = {
    name : Text;
    address : Text;
  };

  // Persistent state
  var nextDishId = 1;
  var nextOrderId = 1;
  var nextReservationId = 1;

  // Dishes
  let dishes = Map.empty<Nat, Dish>();
  let orders = Map.empty<Nat, Order>();
  let reservations = Map.empty<Nat, Reservation>();
  let reviews = List.empty<Review>();
  let coupons = Map.empty<Text, Coupon>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Dishes - public browsing, no auth needed
  public query ({ caller }) func getAllDishes() : async [Dish] {
    dishes.values().toArray();
  };

  public query ({ caller }) func getDishesByCategory(category : Text) : async [Dish] {
    dishes.values().toArray().filter(
      func(dish) {
        dish.category == category;
      }
    );
  };

  public query ({ caller }) func getVegDishes() : async [Dish] {
    dishes.values().toArray().filter(
      func(dish) {
        dish.isVeg;
      }
    );
  };

  // Admin: Add dish
  public shared ({ caller }) func addDish(
    name : Text,
    description : Text,
    price : Nat,
    category : Text,
    imageUrl : Text,
    isVeg : Bool,
    available : Bool,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Only admins can add dishes");
    };

    let dishId = nextDishId;
    nextDishId += 1;

    dishes.add(
      dishId,
      {
        id = dishId;
        name;
        description;
        price;
        category;
        imageUrl;
        isVeg;
        available;
      },
    );

    dishId;
  };

  // Admin: Edit dish
  public shared ({ caller }) func editDish(
    id : Nat,
    name : Text,
    description : Text,
    price : Nat,
    category : Text,
    imageUrl : Text,
    isVeg : Bool,
    available : Bool,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Only admins can edit dishes");
    };

    switch (dishes.get(id)) {
      case (null) { Runtime.trap("Dish not found") };
      case (?_) {
        dishes.add(
          id,
          {
            id;
            name;
            description;
            price;
            category;
            imageUrl;
            isVeg;
            available;
          },
        );
      };
    };
  };

  // Admin: Delete dish
  public shared ({ caller }) func deleteDish(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Only admins can delete dishes");
    };

    switch (dishes.get(id)) {
      case (null) { Runtime.trap("Dish not found") };
      case (?_) {
        dishes.remove(id);
      };
    };
  };

  // Orders
  public shared ({ caller }) func placeOrder(items : [(Text, Nat, Nat)], totalAmount : Nat, paymentMethod : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("You need to be logged in to place an order");
    };

    let orderId = nextOrderId;
    nextOrderId += 1;

    orders.add(
      orderId,
      {
        id = orderId;
        user = caller;
        items;
        totalAmount;
        paymentMethod;
        status = "Pending";
        timestamp = Time.now();
      },
    );

    orderId;
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Nat, status : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Only admins can update order status");
    };
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        orders.add(
          orderId,
          {
            id = order.id;
            user = order.user;
            items = order.items;
            totalAmount = order.totalAmount;
            paymentMethod = order.paymentMethod;
            status;
            timestamp = order.timestamp;
          },
        );
      };
    };
  };

  // Users can only view their own orders; admins can view any user's orders
  public query ({ caller }) func getUserOrders(user : Principal) : async [Order] {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own orders");
    };
    orders.values().toArray().filter(
      func(order) {
        order.user == user;
      }
    );
  };

  // Admin: Get all orders
  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Only admins can view all orders");
    };
    orders.values().toArray();
  };

  // Reservations
  public shared ({ caller }) func makeReservation(name : Text, phone : Text, date : Text, time : Text, guests : Nat) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("You need to be logged in to make a reservation");
    };

    let reservationId = nextReservationId;
    nextReservationId += 1;

    reservations.add(
      reservationId,
      {
        id = reservationId;
        user = caller;
        name;
        phone;
        date;
        time;
        guests;
        timestamp = Time.now();
      },
    );

    reservationId;
  };

  // Users can only view their own reservations; admins
  // can view any user's reservations
  public query ({ caller }) func getUserReservations(user : Principal) : async [Reservation] {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own reservations");
    };
    reservations.values().toArray().filter(
      func(reservation) {
        reservation.user == user;
      }
    );
  };

  // Reviews
  public shared ({ caller }) func submitReview(rating : Nat, comment : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("You need to be logged in to submit a review");
    };

    let review : Review = {
      user = caller;
      rating;
      comment;
      timestamp = Time.now();
    };

    reviews.add(review);
  };

  // Public: anyone can read reviews
  public query ({ caller }) func getAllReviews() : async [Review] {
    reviews.toArray();
  };

  // Coupons
  public shared ({ caller }) func addCoupon(code : Text, discount : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Only admins can add coupons");
    };

    coupons.add(
      code,
      {
        code;
        discount;
      },
    );
  };

  // Public: coupon validation needed during checkout for all users
  public query ({ caller }) func validateCoupon(code : Text) : async ?Coupon {
    coupons.get(code);
  };

  // Profiles
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Generate Unique Secret Code for Trusted Menu Verification
  let menuVerificationCodes = Map.empty<Text, Text>();

  func collectText(toCollect : Text) : Text {
    toCollect.concat("ABCDEFGHIJKLM");
  };

  func scrambleText(input : Text) : Text {
    input.map(
      func(char) {
        let upperChar = char.toNat32() - 32 : Nat32;
        Char.fromNat32(upperChar);
      }
    );
  };

  func checkSecretCode(secretCode : Text, inputText : Text) : (Bool, Text) {
    let expectedCode = scrambleText(collectText(secretCode));
    switch (menuVerificationCodes.get(secretCode)) {
      case (null) { (false, "Invalid code") };
      case (?savedCode) {
        if (inputText == expectedCode and savedCode == secretCode) {
          (true, "Verification successful! Welcome trusted menu reviewer.");
        } else {
          (false, "Verification failed, please try again.");
        };
      };
    };
  };

  public shared ({ caller }) func verifyMenuCode(code : Text, inputText : Text) : async (Bool, Text) {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can verify menu codes");
    };
    checkSecretCode(code, inputText);
  };

  public shared ({ caller }) func generateMenuCode() : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Only admins can generate codes");
    };

    let code = "dfdfdfd";
    menuVerificationCodes.add(code, code);
    code;
  };

  // Persist and retrieve images
  public shared ({ caller }) func storeImage(blob : Storage.ExternalBlob) : async Storage.ExternalBlob {
    blob;
  };
};
