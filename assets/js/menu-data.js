/* Menu data for Kebab 99 N Pizza.
   Prices in AUD. `img` maps each item to a self-hosted photo in assets/img/.
   Exposed on window for the plain-script pages (no bundler). */
(function () {
  "use strict";

  var IMG = "assets/img/";

  // Size label sets. Items may override with their own `sizeLabels`.
  var SIZE_LABELS = {
    3: ["Reg", "Large", "Family"],
    5: ["Small", "Reg", "Large", "Jumbo", "Family"],
  };

  var MENU = [
    {
      id: "cat-kebabs",
      name: "Kebabs & Wraps",
      subtitle: "All kebabs come with lettuce, tomato, onion, meat & choice of two sauces.",
      items: [
        { id: "k-mixed", name: "Mixed Kebab", img: IMG + "kebab-mixed.jpg", price: 16.0 },
        { id: "k-chicken", name: "Chicken Kebab", img: IMG + "kebab-chicken.jpg", price: 16.0 },
        { id: "k-doner", name: "Doner Kebab", img: IMG + "kebab-mixed.jpg", price: 16.0 },
        { id: "k-yiros", name: "Yiros", desc: "Tomato, onion, meat & choice of two sauces.", img: IMG + "kebab-chicken.jpg", price: 17.5 },
        { id: "k-hsp-wrap", name: "HSP Wrap", desc: "Comes with chips and meat.", img: IMG + "snackpack.jpg", price: 17.5 },
        { id: "k-large-meal", name: "Large Kebab Meal", desc: "Large kebab, large chips, and large drink.", img: IMG + "kebab-mixed.jpg", price: 32.0 },
        { id: "k-small-meal", name: "Small Kebab Meal", desc: "Large kebab, small chips and small can.", img: IMG + "kebab-mixed.jpg", price: 25.0 },
        { id: "k-kids", name: "Kids Meal", desc: "5 nuggets, 1 small chips, 1 small juice.", img: IMG + "nuggets.jpg", price: 15.0 },
      ],
    },
    {
      id: "cat-plates",
      name: "Plates",
      subtitle: "Served with lettuce, tomato, onion, carrot, meat & rice.",
      items: [
        { id: "p-kebab-mixed", name: "Kebab Plate — Mixed", desc: "Rice, salad, bread.", img: IMG + "kebab-mixed.jpg", price: 24.9 },
        { id: "p-kebab-chicken", name: "Kebab Plate — Chicken", img: IMG + "kebab-chicken.jpg", price: 24.9 },
        { id: "p-kebab-doner", name: "Kebab Plate — Doner", img: IMG + "kebab-mixed.jpg", price: 24.9 },
        { id: "p-snack-mixed", name: "Snack Plate — Mixed", desc: "Rice, salad, chips.", img: IMG + "snackpack.jpg", price: 24.9 },
        { id: "p-snack-chicken", name: "Snack Plate — Chicken", img: IMG + "snackpack.jpg", price: 24.9 },
        { id: "p-snack-doner", name: "Snack Plate — Doner", img: IMG + "snackpack.jpg", price: 24.9 },
        { id: "p-lamb-2", name: "Lamb Chops Plate — 2pc", desc: "Rice & salad or rice & chips, choice of sauces.", img: IMG + "lamb.jpg", price: 26.0 },
        { id: "p-lamb-4", name: "Lamb Chops Plate — 4pc", img: IMG + "lamb.jpg", price: 42.0 },
      ],
    },
    {
      id: "cat-pizza",
      name: "Pizza",
      subtitle: 'Reg 11" · Large 13" · Family 15"',
      items: [
        { id: "z-bbq-chicken", name: "BBQ Chicken", desc: "BBQ base, marinated chicken, mushroom, capsicum, onion & mozzarella.", img: IMG + "pizza.jpg", sizes: [20.9, 24.9, 29.9] },
        { id: "z-peri", name: "Peri-Peri Chicken", desc: "Marinated chicken, spinach, roasted red capsicum & peri peri sauce.", img: IMG + "pizza.jpg", sizes: [20.9, 24.9, 29.9] },
        { id: "z-pepperoni", name: "Pepperoni", desc: "Pepperoni, mozzarella & oregano.", img: IMG + "pizza.jpg", sizes: [20.9, 24.9, 29.9] },
        { id: "z-bbq-meat", name: "BBQ Meat Lovers", desc: "Pepperoni, Turkish salami, kebab meat, chicken & BBQ sauce.", img: IMG + "pizza.jpg", sizes: [20.9, 24.9, 29.9] },
        { id: "z-supreme", name: "Supreme", desc: "Pepperoni, salami, onion, mushroom, olives & pineapple.", img: IMG + "pizza.jpg", sizes: [20.9, 24.9, 29.9] },
        { id: "z-margherita", name: "Margherita", desc: "Tomato base, mozzarella & oregano.", img: IMG + "pizza.jpg", sizes: [20.9, 24.9, 29.9] },
        { id: "z-veg", name: "Vegetarian", desc: "Feta, onion, mushroom, olives, pineapple & tomato.", img: IMG + "pizza.jpg", sizes: [20.9, 24.9, 29.9] },
        { id: "z-hawaiian", name: "Chicken Hawaiian", desc: "Marinated chicken, pineapple & cheese.", img: IMG + "pizza.jpg", sizes: [20.9, 24.9, 29.9] },
        { id: "z-garlic-cheesy", name: "Garlic Cheesy", desc: "Garlic base with mozzarella.", img: IMG + "pizza.jpg", sizes: [20.9, 24.9, 29.9] },
        { id: "z-prawn", name: "Prawn", desc: "Garlic base, mushroom, onion, capsicum, prawn & mozzarella.", img: IMG + "pizza.jpg", sizes: [20.9, 24.9, 29.9] },
        { id: "z-hsp-pizza", name: "H.S.P Pizza", desc: "Kebab meat, chips & choice of BBQ, garlic and hot chilli.", img: IMG + "pizza.jpg", sizes: [20.9, 24.9, 29.9] },
        { id: "z-seafood", name: "Seafood", desc: "Prawn, calamari, squid, rocket & mozzarella.", img: IMG + "pizza.jpg", sizes: [20.9, 24.9, 29.9] },
        { id: "z-tandoori", name: "Tandoori Chicken", desc: "Marinated chicken, spinach, capsicum & mint yogurt dressing.", img: IMG + "pizza.jpg", sizes: [20.9, 24.9, 29.9] },
        { id: "z-garlic-bread", name: "Garlic Bread", img: IMG + "pizza.jpg", price: 6.0 },
      ],
    },
    {
      id: "cat-pide",
      name: "Pide",
      subtitle: "All $21.90",
      items: [
        { id: "pd-chicken", name: "Chicken Pide", desc: "Marinated chicken, mushroom, onion, capsicum & mozzarella.", img: IMG + "pide.jpg", price: 21.9 },
        { id: "pd-mexican", name: "Mexican Pide", desc: "Marinated chicken, mushroom, onion, jalapenos & mozzarella.", img: IMG + "pide.jpg", price: 21.9 },
        { id: "pd-istanbul", name: "Istanbul Pide", desc: "Marinated chicken, baby spinach, mushroom, onion, pepperoni & mozzarella.", img: IMG + "pide.jpg", price: 21.9 },
        { id: "pd-veg", name: "Vegetarian Pide", desc: "Feta cheese, baby spinach & mozzarella.", img: IMG + "pide.jpg", price: 21.9 },
      ],
    },
    {
      id: "cat-deals",
      name: "Pizza Deals",
      subtitle: "1.25L drink included free on 2-pizza deals.",
      items: [
        { id: "d-large-combo", name: "Large Pizza + Large Chips + Large Drink", img: IMG + "pizza.jpg", price: 39.9 },
        { id: "d-family-combo", name: "Family Pizza + Large Chips + Large Drink", img: IMG + "pizza.jpg", price: 45.9 },
        { id: "d-2large", name: "2 Large Pizzas + 1.25L Drink + Garlic Bread", img: IMG + "pizza.jpg", price: 54.9 },
        { id: "d-2family", name: "2 Family Pizzas + 1.25L Drink + Garlic Bread", img: IMG + "pizza.jpg", price: 61.9 },
      ],
    },
    {
      id: "cat-snack-packs",
      name: "Snack Packs",
      subtitle: "Chicken / Doner / Mix / Falafel / Halloumi.",
      items: [
        { id: "s-snack-pack", name: "Snack Pack", desc: "Chips, meat, cheese & choice of two sauces.", img: IMG + "snackpack.jpg", sizes: [16, 20, 25, 30, 35] },
        { id: "s-rice-snack-pack", name: "Rice Snack Pack", desc: "Rice, meat, cheese & choice of two sauces.", img: IMG + "snackpack.jpg", sizes: [16, 20, 25, 30, 35] },
        { id: "s-healthy-box", name: "Healthy Box", desc: "Meat, lettuce, tomato, onion, carrots, tabouli & two sauces.", img: IMG + "salad.jpg", sizes: [20, 25, 30], sizeLabels: ["Reg", "Large", "Jumbo"] },
        { id: "s-nachos", name: "KJ Nachos", desc: "Corn chips, meat, cheese, sauces & tabouli.", img: IMG + "nachos.jpg", price: 20.0 },
        { id: "s-baked-potato", name: "Baked Potato", desc: "Garlic butter, cheese, meat, sauce, lettuce, tomato & onion.", img: IMG + "snackpack.jpg", price: 18.0 },
      ],
    },
    {
      id: "cat-burgers",
      name: "Burgers",
      items: [
        { id: "b-crispy", name: "Crispy Chicken Burger", desc: "Lettuce, tomato, onion, beetroot & burger sauce.", img: IMG + "burger.jpg", price: 13.0 },
        { id: "b-angus", name: "Angus Burger", desc: "Lettuce, tomato, onion, beetroot & burger sauce.", img: IMG + "burger.jpg", price: 15.0 },
        { id: "b-steak", name: "Steak Burger", desc: "Lettuce, tomato, onion, beetroot & burger sauce.", img: IMG + "burger.jpg", price: 16.0 },
        { id: "b-meal-deal", name: "Meal Deal Add-on", desc: "Adds chips & can to any burger.", img: IMG + "fries.jpg", price: 9.0 },
      ],
    },
    {
      id: "cat-sides",
      name: "Sides & Snacks",
      items: [
        { id: "sd-chips-reg", name: "Chips (Regular)", img: IMG + "fries.jpg", price: 12.0 },
        { id: "sd-chips-small", name: "Chips (Small)", img: IMG + "fries.jpg", price: 7.0 },
        { id: "sd-nuggets-5", name: "Nuggets (5pc)", img: IMG + "nuggets.jpg", price: 7.0 },
        { id: "sd-nuggets-10", name: "Nuggets (10pc)", img: IMG + "nuggets.jpg", price: 12.0 },
        { id: "sd-hashbrown", name: "Hash Brown", img: IMG + "fries.jpg", price: 2.0 },
        { id: "sd-tenders-2", name: "Chicken Tenders (2)", img: IMG + "nuggets.jpg", price: 5.0 },
        { id: "sd-tenders-5", name: "Chicken Tenders (5)", img: IMG + "nuggets.jpg", price: 10.0 },
        { id: "sd-lamb-1", name: "Lamb Chops (1pc)", img: IMG + "lamb.jpg", price: 10.0 },
        { id: "sd-lamb-2", name: "Lamb Chops (2pc)", img: IMG + "lamb.jpg", price: 19.0 },
        { id: "sd-lamb-3", name: "Lamb Chops (3pc)", img: IMG + "lamb.jpg", price: 27.0 },
      ],
    },
    {
      id: "cat-sweets",
      name: "Sweets & Extras",
      items: [
        { id: "sw-baklava", name: "Baklava", img: IMG + "baklava.jpg", price: 7.0 },
        { id: "sw-turkish-3", name: "Turkish Delights (3)", img: IMG + "baklava.jpg", price: 3.0 },
        { id: "sw-turkish-5", name: "Turkish Delights (5)", img: IMG + "baklava.jpg", price: 5.0 },
        { id: "ex-meat", name: "Extra Meat", img: IMG + "kebab-mixed.jpg", price: 3.9 },
        { id: "ex-halloumi", name: "Extra Halloumi", img: IMG + "snackpack.jpg", price: 2.5 },
        { id: "ex-avocado", name: "Extra Avocado", img: IMG + "salad.jpg", price: 2.0 },
        { id: "ex-cheese", name: "Extra Cheese", img: IMG + "pizza.jpg", price: 2.0 },
        { id: "ex-mushrooms", name: "Extra Mushrooms", img: IMG + "pizza.jpg", price: 1.5 },
        { id: "ex-pineapple", name: "Extra Pineapple", img: IMG + "pizza.jpg", price: 1.5 },
        { id: "ex-tabouli", name: "Extra Tabouli", img: IMG + "salad.jpg", price: 1.5 },
        { id: "ex-olives", name: "Extra Olives", img: IMG + "salad.jpg", price: 1.5 },
        { id: "ex-beetroot", name: "Extra Beetroot", img: IMG + "salad.jpg", price: 1.5 },
      ],
    },
  ];

  // Featured items for the home page (id references into MENU).
  var POPULAR = [
    { id: "k-mixed", name: "MIXED KEBAB", price: "FROM $16.00", img: IMG + "kebab-mixed.jpg", tilt: "tilt-n" },
    { id: "k-hsp-wrap", name: "HSP WRAP", price: "$17.50", img: IMG + "snackpack.jpg", tilt: "tilt-p" },
    { id: "z-bbq-meat", name: "BBQ MEAT LOVERS", price: "FROM $20.90", img: IMG + "pizza.jpg", tilt: "tilt-n" },
    { id: "p-lamb-2", name: "LAMB CHOPS", price: "FROM $10.00", img: IMG + "lamb.jpg", tilt: "tilt-p" },
  ];

  // ---- customization option groups -------------------------------------
  // type: "single" (choose one) or "multi" (choose any). Options may carry a
  // per-item `price` (added when selected). `freeLimit`+`extraPrice` price a
  // multi group where the first N are free (used for sauces).
  var OPTION_GROUPS = {
    bread: { id: "bread", label: "Bread", type: "single", required: true, options: [
      { id: "kebab-bread", label: "Kebab Bread" }, { id: "wrap", label: "Wrap" },
      { id: "roll", label: "Roll" }, { id: "turkish", label: "Turkish Bread" } ] },
    base: { id: "base", label: "Base", type: "single", required: true, options: [
      { id: "rice", label: "Rice" }, { id: "chips", label: "Chips" }, { id: "half", label: "Half Rice / Half Chips" } ] },
    meat: { id: "meat", label: "Meat Choice", type: "single", required: true, options: [
      { id: "chicken", label: "Chicken" }, { id: "doner", label: "Doner / Lamb" }, { id: "mixed", label: "Mixed" },
      { id: "falafel", label: "Falafel" }, { id: "halloumi", label: "Halloumi" } ] },
    salads: { id: "salads", label: "Salads", type: "multi", note: "Pick what you'd like — all free.", options: [
      { id: "lettuce", label: "Lettuce" }, { id: "tomato", label: "Tomato" }, { id: "onion", label: "Onion" },
      { id: "tabouli", label: "Tabouli" }, { id: "carrot", label: "Carrot" }, { id: "cabbage", label: "Cabbage" },
      { id: "pickles", label: "Pickles" } ] },
    sauces: { id: "sauces", label: "Sauces", type: "multi", freeLimit: 2, extraPrice: 1,
      note: "Choose up to 2 free · each extra +$1.00", options: [
      { id: "garlic", label: "Garlic" }, { id: "chilli", label: "Chilli" }, { id: "bbq", label: "BBQ" },
      { id: "hummus", label: "Hummus" }, { id: "tomato", label: "Tomato" }, { id: "sweet-chilli", label: "Sweet Chilli" },
      { id: "mayo", label: "Mayo" }, { id: "tahini", label: "Tahini" }, { id: "mint-yogurt", label: "Mint Yogurt" } ] },
    extras: { id: "extras", label: "Extras", type: "multi", options: [
      { id: "extra-meat", label: "Extra Meat", price: 3.9 }, { id: "cheese", label: "Cheese", price: 2 },
      { id: "halloumi", label: "Halloumi", price: 2.5 }, { id: "jalapenos", label: "Jalapeños", price: 1 },
      { id: "mushroom", label: "Mushroom", price: 1.5 }, { id: "avocado", label: "Avocado", price: 2 },
      { id: "pineapple", label: "Pineapple", price: 1.5 }, { id: "olives", label: "Olives", price: 1.5 },
      { id: "beetroot", label: "Beetroot", price: 1.5 } ] },
    toppings: { id: "toppings", label: "Add Toppings", type: "multi", options: [
      { id: "jalapenos", label: "Jalapeños", price: 1.5 }, { id: "mushroom", label: "Mushroom", price: 1.5 },
      { id: "pineapple", label: "Pineapple", price: 1.5 }, { id: "extra-cheese", label: "Extra Cheese", price: 2 },
      { id: "olives", label: "Olives", price: 1.5 }, { id: "onion", label: "Onion", price: 1 },
      { id: "capsicum", label: "Capsicum", price: 1.5 }, { id: "pepperoni", label: "Pepperoni", price: 2.5 } ] },
    burgerExtras: { id: "burgerExtras", label: "Extras", type: "multi", options: [
      { id: "cheese", label: "Cheese", price: 2 }, { id: "egg", label: "Egg", price: 2 },
      { id: "jalapenos", label: "Jalapeños", price: 1 }, { id: "extra-patty", label: "Extra Patty", price: 5 },
      { id: "meal", label: "Make it a Meal (chips + can)", price: 9 } ] },
  };

  // which groups apply to each category
  var CATEGORY_GROUPS = {
    "cat-kebabs": ["bread", "salads", "sauces", "extras"],
    "cat-plates": ["base", "salads", "sauces", "extras"],
    "cat-pizza": ["toppings"],
    "cat-pide": ["toppings"],
    "cat-deals": [],
    "cat-snack-packs": ["meat", "sauces", "extras"],
    "cat-burgers": ["salads", "sauces", "burgerExtras"],
    "cat-sides": [],
    "cat-sweets": [],
  };

  window.KEBAB = {
    MENU: MENU,
    SIZE_LABELS: SIZE_LABELS,
    POPULAR: POPULAR,
    OPTION_GROUPS: OPTION_GROUPS,
    CATEGORY_GROUPS: CATEGORY_GROUPS,
  };
})();
