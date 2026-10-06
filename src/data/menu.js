export const CONTACT = {
  brand: 'Fransico',
  tagline: 'BBQ, Chinese, Fast Food & Pizza',
  slogan: "Fransico — It's All About Being Different",
  deliveryNote: 'Delivery charges apply based on location.',
  primaryCall: {
    label: 'Direct Call',
    display: '0321-2121946',
    tel: '+923212121946',
  },
  easyPaisa: {
    label: 'EasyPaisa',
    display: '0333-0226233',
    tel: '+923330226233',
  },
  /* Operational numbers. Only orderWhatsapp is customer-facing anywhere in
     the UI — the rest stay in data for the restaurant, not the customer. */
  whatsapp: [
    { display: '0314-2182556', tel: '+923142182556', wa: '923142182556' },
    { display: '0334-8415111', tel: '+923348415111', wa: '923348415111' },
  ],
}

export const DEFAULT_WHATSAPP = '923142182556'

const orderWhatsappEntry = CONTACT.whatsapp.find((entry) => entry.wa === DEFAULT_WHATSAPP)

/** The single customer-facing WhatsApp ordering channel. */
export const ORDER_WHATSAPP = {
  display: orderWhatsappEntry?.display ?? DEFAULT_WHATSAPP,
  wa: DEFAULT_WHATSAPP,
}

export const ORDER_MESSAGE_PREFIX = 'Assalamualaikum, I would like to place an order.'

export function whatsappLink(message, number = DEFAULT_WHATSAPP) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}

/* ==========================================================================
   OPENING HOURS — single source of truth.

   Hours genuinely differ by day, so they are shown as two ranges rather than
   one invented "open daily" block. Every other surface (header, mobile menu,
   footer) reads the summary from here so the timings can never disagree.
   ========================================================================== */
export const OPENING_HOURS = {
  schedule: [
    { day: 'Mon — Thu', time: '5:00 PM — 3:00 AM' },
    { day: 'Fri — Sun', time: '5:00 PM — 4:00 AM' },
  ],
  summary: 'Open every day from 5:00 PM',
  summaryLong: 'Open daily · 5:00 PM — 3:00 AM (Fri–Sun until 4:00 AM)',
}

function slug(value) {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/* ==========================================================================
   BAR B.Q
   ========================================================================== */
const BARBQ_ITEMS = [
  {
    name: 'Chicken Tikka',
    variants: [
      { label: 'Leg', price: 350 },
      { label: 'Chest', price: 400 },
    ],
  },
  {
    name: 'Chicken Bihari Tikka',
    variants: [
      { label: 'Leg', price: 380 },
      { label: 'Chest', price: 400 },
    ],
  },
  {
    name: 'Chicken Malai Tikka',
    variants: [
      { label: 'Leg', price: 380 },
      { label: 'Chest', price: 420 },
    ],
  },
  {
    name: 'Chicken Green Tikka',
    variants: [
      { label: 'Leg', price: 380 },
      { label: 'Chest', price: 420 },
    ],
  },
  { name: 'Chicken Boti', price: 550 },
  { name: 'Chicken Malai Boti', price: 550 },
  { name: 'Chicken Dhaga Kabab', price: 550 },
  { name: 'Chicken Kofta Kabab', price: 550 },
  { name: 'Chicken Reshmi Kabab', price: 550 },
  { name: 'Beef Bihari Boti', price: 550 },
  { name: 'Beef Gola Kabab', price: 550 },
  { name: 'Beef Dhaga Kabab', price: 550 },
  { name: 'Seekh Kabab', price: 550 },
]

/* ==========================================================================
   ROLLS & RESHMI
   ========================================================================== */
const ROLLS_GROUPS = [
  {
    title: 'Chicken Rolls',
    items: [
      { name: 'Chicken Chatni Roll', price: 180 },
      { name: 'Chicken Spicy Roll', price: 190 },
      { name: 'Chicken Mayo Garlic Roll', price: 220 },
      { name: 'Chicken Chilli Garlic Roll', price: 270 },
      { name: 'Chicken Cheese Roll', price: 270 },
      { name: 'Chicken Zinger Roll', price: 330 },
      { name: 'Chicken Jumbo Roll', price: 350 },
      { name: 'Chicken Jumbo Mayo Roll', price: 400 },
    ],
  },
  {
    title: 'Chicken Reshmi Rolls',
    items: [
      { name: 'Chicken Reshmi Roll', price: 220 },
      { name: 'Chicken Reshmi Cheese Roll', price: 290 },
    ],
  },
  {
    title: 'Chicken Malai Rolls',
    items: [
      { name: 'Chicken Malai Roll', price: 220 },
      { name: 'Chicken Malai Chilli Garlic Roll', price: 230 },
      { name: 'Chicken Malai Spicy Roll', price: 230 },
      { name: 'Chicken Malai Mayo Garlic Roll', price: 240 },
      { name: 'Chicken Malai Cheese Roll', price: 290 },
    ],
  },
  {
    title: 'Beef Rolls',
    items: [
      { name: 'Beef Roll', price: 220 },
      { name: 'Beef Chilli Garlic Roll', price: 220 },
      { name: 'Beef Spicy Roll', price: 230 },
      { name: 'Beef Mayo Garlic Roll', price: 240 },
      { name: 'Beef Cheese Roll', price: 290 },
      { name: 'Beef Jumbo Roll', price: 400 },
      { name: 'Beef Jumbo Mayo Roll', price: 450 },
    ],
  },
]

/* ==========================================================================
   CHINESE FAVORITES
   ========================================================================== */
const CHINESE_ITEMS = [
  { name: 'Vegetable Fried Rice', price: 449 },
  { name: 'Egg Fried Rice', price: 449 },
  { name: 'Vegetable Chowmein', price: 499 },
  { name: 'Chicken Fried Rice', price: 499 },
  { name: 'Chicken Chowmein', price: 499 },
  { name: 'Masala Crispy Rice', price: 499 },
  { name: 'Crispy Garlic Rice', price: 499 },
  { name: 'Chicken Masala Rice', price: 499 },
  { name: 'Chicken Vegetable & Rice', price: 549 },
  { name: 'Chicken B.B.Q Rice', price: 549 },
  { name: 'Bar B.Q Chowmein', price: 549 },
  { name: 'Chicken Shashlik & Rice', price: 599 },
  { name: 'Chicken Manchurian & Rice', price: 599 },
  { name: 'Chicken Jalfrezi & Rice', price: 599 },
  { name: 'Chicken White Shashlik & Rice', price: 649 },
  { name: 'Chicken Dry Chilli & Rice', price: 649 },
  { name: 'Singapuri Rice', price: 649 },
  { name: 'American Chopsuey', price: 649 },
  { name: 'Chinese Chopsuey', price: 649 },
  { name: 'Chinese Tikka Biryani', price: 669 },
]

/* ==========================================================================
   FAST FOOD, BROAST & GRILL
   ========================================================================== */
const FASTFOOD_GROUPS = [
  {
    title: 'Broast',
    items: [
      {
        name: 'Chicken Broast',
        variants: [
          { label: 'Qtr Leg', price: 470 },
          { label: 'Qtr Chest', price: 500 },
        ],
      },
      { name: 'Chicken Crispy Broast', price: 500 },
      { name: 'Chicken Special Masala Broast', price: 520 },
      { name: 'Chicken Mayo Garlic Broast', price: 550 },
    ],
  },
  {
    title: 'Burgers & Sandwiches',
    items: [
      { name: 'Chicken Burger', price: 370 },
      { name: 'Chicken Sandwich', price: 430 },
      { name: 'Chicken Zinger Burger', price: 420 },
      { name: 'Chicken Cheese Burger', price: 420 },
      { name: 'Chicken Cheese Sandwich', price: 480 },
      { name: 'Beef Burger', price: 420 },
      { name: 'Chicken Zinger Burger Spicy', price: 440 },
      { name: 'Chicken Zinger Burger Cheese', price: 470 },
      { name: 'Beef Cheese Burger', price: 470 },
      { name: 'B.B.Q Club Sandwich', price: 480 },
      { name: 'Zinger Club Sandwich', price: 550 },
      { name: 'Club Cheese Sandwich', price: 550 },
    ],
  },
  {
    title: 'Grill Items',
    items: [
      { name: 'Chicken Grill Burger', price: 520 },
      { name: 'Beef Grill Burger', price: 520 },
      { name: 'Grill Club Sandwich', price: 550 },
    ],
  },
]

/* ==========================================================================
   FRANSICO PIZZA & SIDES  (single unified home — see PizzaCorner section)
   ========================================================================== */
export const PIZZA_FLAVOURS = [
  'Fransico Special',
  'Malai',
  'Cheese Lover',
  'Super Supreme',
  'Pepperoni',
  'Fajita',
  'Hot Arabian',
  'Shawarma',
  'Creamy Shawarma',
  'Tikka',
  'Veggie Lover',
  'Creamy Supreme',
  'Afghani',
  'Creamy Fajita',
  'Creamy Tikka',
]

export const PIZZA_PRICES = {
  Small: 399,
  Regular: 749,
  Large: 1099,
}

export const PIZZA_SIZE_VARIANTS = Object.entries(PIZZA_PRICES).map(([label, price]) => ({
  label,
  price,
}))

export const PIZZA_TOPPINGS = [
  { name: 'Cheese', price: 150 },
  { name: 'Meat', price: 150 },
  { name: 'Vegetables', price: 150 },
]

export const SEEKH_KABAB_PIZZA = {
  name: 'Seekh Kabab Flavour',
  note: 'Not available in deal',
  variants: [
    { label: 'Regular', price: 995 },
    { label: 'Large', price: 1499 },
  ],
  toppings: PIZZA_TOPPINGS,
}

export const PIZZA_SIDES = [
  {
    name: 'Pizza Fries',
    variants: [
      { label: 'Small', price: 349 },
      { label: 'Large', price: 559 },
    ],
  },
  {
    name: 'Pasta',
    variants: [
      { label: 'Small', price: 349 },
      { label: 'Large', price: 559 },
    ],
  },
  { name: 'Stick-On', price: 649 },
  { name: 'Pizza Roll', price: 549 },
  { name: 'Lava Sandwich', price: 400 },
  { name: 'Calzone', price: 149 },
]

/* ==========================================================================
   COMBO DEALS (1 TO 23)
   ========================================================================== */
export const COMBO_DEALS = [
  { n: 1, desc: '1 Zinger Burger + 1 Half Sandwich + Fries & Coleslaw', price: 580 },
  { n: 2, desc: '1 Chicken Burger + 1 Half Sandwich + Fries & Coleslaw', price: 560 },
  { n: 3, desc: '1 Zinger Burger + 1 Chicken Roll + Fries & Coleslaw', price: 580 },
  {
    n: 4,
    desc: '1 Broast Qtr Leg + 1 Zinger Burger + Fries, Raita & Coleslaw',
    price: 810,
  },
  {
    n: 5,
    desc: '1 Broast Qtr Leg + 1 Half Sandwich + Fries, Raita & Coleslaw',
    price: 630,
  },
  { n: 6, desc: '1 Beef Burger + 1 Half Sandwich + Fries & Coleslaw', price: 560 },
  { n: 7, desc: '1 Beef Burger + 1 Mayo Roll + Fries & Coleslaw', price: 580 },
  {
    n: 8,
    desc: '1 Broast Qtr Leg + 1 Chicken Roll + Fries, Raita & Coleslaw',
    price: 650,
  },
  {
    n: 9,
    desc: '3 Tikka Leg + 1 Plate Kabab + 4 Paratha + Raita & Salad',
    price: 1730,
  },
  { n: 10, desc: '5 Broast Legs + 1.5 Ltr Bottle + Raita', price: 2400 },
  {
    n: 11,
    desc: '5 Broast Legs + 1 Zinger Burger + Fries, Raita & Coleslaw',
    price: 2600,
  },
  {
    n: 12,
    desc: '2 Broast Legs + 3 Tikka Legs + 4 Paratha + Salad & Raita',
    price: 2100,
  },
  { n: 13, desc: '1 BBQ Club Sandwich + 2 Mayo Rolls + Fries & Coleslaw', price: 849 },
  {
    n: 14,
    desc: '1 Broast Leg + 1 Zinger Burger + 1 Club Sandwich + Fries, Raita & Coleslaw',
    price: 1200,
  },
  {
    n: 15,
    desc: '1 Chicken Jalfrezi + 1 Dry Chilli Chicken with Rice',
    price: 1149,
  },
  { n: 16, desc: '1 Chowmein + 1 Manchurian with Rice', price: 999 },
  {
    n: 17,
    desc: '1 Shashlik with Rice + 1 White Chicken Chilli with Rice',
    price: 1049,
  },
  { n: 18, desc: '1 Singaporean Rice + 1 Shashlik with Rice', price: 1149 },
  {
    n: 19,
    desc: '2 Malai Tikka (Chest) + 1 Tikka Leg + 3 Paratha + Salad & Raita',
    price: 1330,
  },
  {
    n: 20,
    desc: '1 Plate Malai Boti + 1 Plate Chicken Boti + 3 Paratha + Raita Salad',
    price: 1200,
  },
  {
    n: 21,
    desc: '3 Broast Qtr Leg + 5 Zinger Burger + 1.5 Ltr Cold Drink',
    price: 3349,
  },
  {
    n: 22,
    desc: '3 Tikka Legs + 2 Tikka Chest + 8 Paratha + 1.5 Ltr Cold Drink',
    price: 2550,
  },
  {
    n: 23,
    desc: 'Half Plate Malai Boti + Half Plate Beef Boti + Half Plate Chicken Boti + Half Plate Seekh Kabab + Half Plate Dhaga Kabab + Half Plate Tikka Biryani + 1 Tikka Leg + 10 Paratha + 1.5 Ltr Cold Drink',
    price: 2799,
  },
]

/* ==========================================================================
   PIZZA EXCLUSIVE DEALS (1 TO 10)
   ========================================================================== */
export const PIZZA_DEALS = [
  { n: 1, desc: '1 Small Pizza + 300ml Drink', price: 449 },
  { n: 2, desc: '1 Regular Pizza + 300ml Drink', price: 799 },
  { n: 3, desc: '1 Regular Pizza + 1 Small Pizza', price: 999 },
  { n: 4, desc: '1 Large Pizza + 1 Litre Drink', price: 1199 },
  { n: 5, desc: '2 Regular Pizzas + 1 Litre Drink', price: 1499 },
  { n: 6, desc: '1 Large Pizza + 1 Regular Pizza', price: 1699 },
  { n: 7, desc: '3 Regular Pizzas', price: 1899 },
  { n: 8, desc: '2 Large Pizzas', price: 1949 },
  { n: 9, desc: '3 Large Pizzas', price: 2849 },
  { n: 10, desc: '5 Large Pizzas', price: 4499 },
]

/* ==========================================================================
   BROWSER TABS — food categories only.

   Deals are NOT menu categories. COMBO_DEALS are presented by DealsSection
   and PIZZA_DEALS by PizzaCorner; both stay searchable via ALL_ITEMS below.
   ========================================================================== */
export const MENU_CATEGORIES = [
  {
    id: 'barbq',
    label: 'Bar B.Q',
    short: 'Bar B.Q',
    emoji: '🍢',
    blurb: 'Skewers off the charcoal grill, cooked to order.',
    groups: [{ title: null, items: BARBQ_ITEMS }],
  },
  {
    id: 'rolls',
    label: 'Rolls & Reshmi',
    short: 'Rolls',
    emoji: '🌯',
    blurb: 'Rolled and pressed to order, with chicken, beef and malai options.',
    groups: ROLLS_GROUPS,
  },
  {
    id: 'chinese',
    label: 'Chinese Favorites',
    short: 'Chinese',
    emoji: '🥢',
    blurb: 'Fried rice, chowmein and biryani straight off the wok.',
    groups: [{ title: null, items: CHINESE_ITEMS }],
  },
  {
    id: 'fastfood',
    label: 'Fast Food, Broast & Grill',
    short: 'Fast Food',
    emoji: '🍔',
    blurb: 'Broast, burgers, sandwiches and grill items, fried fresh.',
    groups: FASTFOOD_GROUPS,
  },
]

/* ==========================================================================
   FLATTENED, ID-STABLE CATALOGUE
   ========================================================================== */
function decorate(items, prefix, category, categoryId, group = '') {
  return items.map((item) => ({
    ...item,
    id: `${prefix}-${slug(item.name)}`,
    category,
    categoryId,
    group,
    kind: 'item',
  }))
}

const menuItems = MENU_CATEGORIES.filter((category) => category.groups).flatMap((category) =>
  category.groups.flatMap((group) =>
    decorate(group.items, category.id, category.label, category.id, group.title ?? ''),
  ),
)

const pizzaItems = [
  ...decorate(
    PIZZA_FLAVOURS.map((flavour) => ({ name: flavour })),
    'pizza',
    'Fransico Pizza',
    'pizza',
  ).map((item) => ({
    ...item,
    variants: PIZZA_SIZE_VARIANTS,
    toppings: PIZZA_TOPPINGS,
  })),
  decorate([SEEKH_KABAB_PIZZA], 'pizza', 'Fransico Pizza', 'pizza', 'Fransico Pizza')[0],
  ...decorate(PIZZA_SIDES, 'pizza-side', 'Pizza Sides', 'pizza-side', 'Fransico Pizza'),
]

const comboItems = COMBO_DEALS.map((deal) => ({
  id: `combo-deal-${deal.n}`,
  name: `Deal ${deal.n}`,
  desc: deal.desc,
  price: deal.price,
  number: deal.n,
  category: 'Fast Food',
  categoryId: 'combo',
  kind: 'deal',
  flavour: 'Combo Deal',
}))

const pizzaDealItems = PIZZA_DEALS.map((deal) => ({
  id: `pizza-deal-${deal.n}`,
  name: `Pizza Deal ${deal.n}`,
  desc: deal.desc,
  price: deal.price,
  number: deal.n,
  category: 'Pizza Deals',
  categoryId: 'pizzadeals',
  kind: 'deal',
  flavour: 'Pizza Deal',
}))

/* Single source for the collections each section renders, so no component has
   to re-derive ids or re-filter the catalogue. */
export const MENU_ITEM_LIST = menuItems
export const PIZZA_FLAVOUR_ITEMS = pizzaItems.filter(
  (item) => item.categoryId === 'pizza' && item.variants?.length === 3 && item.toppings,
)
export const SEEKH_PIZZA_ITEM =
  pizzaItems.find((item) => item.id === 'pizza-seekh-kabab-flavour') ?? null
export const PIZZA_SIDE_ITEMS = pizzaItems.filter((item) => item.categoryId === 'pizza-side')
export const COMBO_DEAL_ITEMS = comboItems
export const PIZZA_DEAL_ITEMS = pizzaDealItems

export const ALL_ITEMS = [...menuItems, ...pizzaItems, ...comboItems, ...pizzaDealItems]

export const ITEMS_BY_ID = Object.fromEntries(ALL_ITEMS.map((item) => [item.id, item]))

/* ==========================================================================
   SEARCH GROUPS — one definition shared by the sort order and the search
   result headings, so a group can never be labelled twice or drift apart.
   ========================================================================== */
export const SEARCH_GROUPS = [
  ...MENU_CATEGORIES.map((category) => ({
    id: category.id,
    title: category.label,
    emoji: category.emoji,
  })),
  { id: 'combo', title: 'Combo Deals', emoji: '🏷️' },
  /* Pizza flavours and pizza sides are separate catalogue categories but read
     as one thing to a customer, so they share a title and the results view
     merges them into a single heading while keeping each item's own id. */
  { id: 'pizza', title: 'Fransico Pizza', emoji: '🍕' },
  { id: 'pizza-side', title: 'Fransico Pizza', emoji: '🍕' },
  { id: 'pizzadeals', title: 'Pizza Deals', emoji: '🍕' },
]

export const SEARCH_GROUP_BY_ID = Object.fromEntries(
  SEARCH_GROUPS.map((group) => [group.id, group]),
)

export const SEARCH_GROUP_ORDER = SEARCH_GROUPS.map((group) => group.id)

/* ==========================================================================
   SMART SEARCH
   Matches on name, category, group, variant labels and deal description.
   Numeric tokens match a deal number exactly so "deal 5" never hits "deal 15".
   ========================================================================== */
function buildSearchText(item) {
  const variantLabels = item.variants ? item.variants.map((v) => v.label).join(' ') : ''
  return [item.name, item.category, item.group, item.flavour, variantLabels, item.desc ?? '']
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}

const SEARCH_ENTRIES = ALL_ITEMS.map((item) => {
  const text = buildSearchText(item)
  return {
    item,
    text,
    textNoDigits: text.replace(/\d+/g, ' '),
  }
})

export function normaliseSearch(value) {
  return String(value ?? '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

export function searchMenu(rawQuery) {
  const query = normaliseSearch(rawQuery)
  const tokens = query.split(' ').filter(Boolean)
  if (!tokens.length) return []

  const matches = []

  for (const entry of SEARCH_ENTRIES) {
    let matched = true

    for (const token of tokens) {
      const isNumber = /^\d+$/.test(token)
      if (isNumber) {
        const exactNumber = entry.item.number === Number(token)
        if (!exactNumber && !entry.textNoDigits.includes(token)) {
          matched = false
          break
        }
        continue
      }

      if (!entry.text.includes(token)) {
        matched = false
        break
      }
    }

    if (matched) matches.push(entry.item)
  }

  return matches.sort((a, b) => {
    const aStarts = a.name.toLowerCase().startsWith(query) ? 0 : 1
    const bStarts = b.name.toLowerCase().startsWith(query) ? 0 : 1
    if (aStarts !== bStarts) return aStarts - bStarts
    const categoryDelta =
      SEARCH_GROUP_ORDER.indexOf(a.categoryId) - SEARCH_GROUP_ORDER.indexOf(b.categoryId)
    if (categoryDelta !== 0) return categoryDelta
    return a.name.length - b.name.length
  })
}

/* ==========================================================================
   HELPERS
   ========================================================================== */
const priceFormatter = new Intl.NumberFormat('en-PK')

export function formatPrice(value) {
  return `Rs. ${priceFormatter.format(value)}`
}

export function defaultVariant(item) {
  if (!item.variants?.length) return null
  return item.variants.find((variant) => variant.label === 'Regular') ?? item.variants[0]
}

export function unitPrice(item, variantLabel, toppings = []) {
  const base = variantLabel
    ? (item.variants?.find((variant) => variant.label === variantLabel)?.price ?? item.price)
    : item.price
  const toppingsTotal = toppings.reduce(
    (sum, topping) => sum + (PIZZA_TOPPINGS.find((t) => t.name === topping)?.price ?? 0),
    0,
  )
  return (base ?? 0) + toppingsTotal
}

/* ==========================================================================
   HOME PAGE CONTENT
   ========================================================================== */
export const HERO_HIGHLIGHTS = [
  {
    name: 'Chicken Zinger Burger',
    price: 420,
    emoji: '🍔',
    tag: 'Top Seller',
    hue: 'crimson',
    blurb: 'Crispy fillet, mayo, lettuce',
  },
  {
    name: 'Chicken Malai Tikka',
    price: 380,
    emoji: '🍢',
    tag: 'Charcoal',
    hue: 'gold',
    blurb: 'Creamy marinade, charcoal finish',
  },
  {
    name: 'Fransico Special',
    price: 749,
    emoji: '🍕',
    tag: 'Signature',
    hue: 'amber',
    blurb: 'Our house pizza, regular size',
  },
  {
    name: 'Chinese Tikka Biryani',
    price: 669,
    emoji: '🍚',
    tag: 'Chef’s Pick',
    hue: 'crimson',
    blurb: 'Long-grain rice, masala',
  },
  {
    name: 'Chicken Manchurian & Rice',
    price: 599,
    emoji: '🥢',
    tag: 'Wok Tossed',
    hue: 'gold',
    blurb: 'With rice and gravy',
  },
  {
    name: 'Seekh Kabab',
    price: 550,
    emoji: '🍢',
    tag: 'Grill',
    hue: 'amber',
    blurb: 'Minced, skewelled, grilled',
  },
]

/* Counts are derived from the catalogue so the figures can never overstate it. */
export const STATS = [
  { value: `${MENU_ITEM_LIST.length}+`, label: 'Dishes on the menu' },
  { value: `${COMBO_DEALS.length}`, label: 'Combo deals' },
  { value: `${PIZZA_DEALS.length}`, label: 'Pizza deals' },
  { value: `${MENU_CATEGORIES.length}`, label: 'Cuisines, one kitchen' },
]

export const CHEAPEST_COMBO = COMBO_DEALS.reduce((best, deal) =>
  deal.price < best.price ? deal : best,
)

export const CHEAPEST_PIZZA_DEAL = PIZZA_DEALS.reduce((best, deal) =>
  deal.price < best.price ? deal : best,
)

export const SEARCH_TRIGGERS = ['Malai Tikka', 'Zinger', 'Deal 5', 'Chowmein', 'Biryani']

export const FAQS = [
  {
    q: 'Do you deliver home?',
    a: `Yes. Fransico delivers across the town. ${CONTACT.deliveryNote} Call ${CONTACT.primaryCall.display} or send your order on WhatsApp to ${ORDER_WHATSAPP.display}.`,
  },
  {
    q: 'How do I place an order?',
    a: 'Add what you like to the cart, enter your delivery address, then continue to WhatsApp. Your order details are prepared for you to send — we confirm from there.',
  },
  {
    q: 'Are the combo deals customizable?',
    a: 'Usually. Mention any swaps you want in your order message and we will do our best to accommodate.',
  },
  {
    q: 'How is payment accepted?',
    a: `Cash on delivery, or EasyPaisa transfer to ${CONTACT.easyPaisa.display}. You can confirm the details on ${CONTACT.primaryCall.display}.`,
  },
  {
    q: 'Can I order the same dish in two sizes?',
    a: 'Yes. Pick one option, add it to the cart, then switch the option and add it again — each combination is kept as its own cart line.',
  },
]