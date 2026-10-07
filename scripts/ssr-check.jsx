const mediaStub = () => ({
  matches: false,
  addEventListener: () => {},
  removeEventListener: () => {},
  addListener: () => {},
  removeListener: () => {},
  onchange: null,
  dispatchEvent: () => false,
})

globalThis.window = {
  ...globalThis.window,
  addEventListener: () => {},
  removeEventListener: () => {},
  matchMedia: mediaStub,
  scrollY: 0,
  innerWidth: 1280,
  innerHeight: 800,
  scrollTo: () => {},
  getComputedStyle: () => ({ getPropertyValue: () => '' }),
  devicePixelRatio: 1,
  setTimeout: (fn, ms) => globalThis.setTimeout(fn, ms),
  clearTimeout: (id) => globalThis.clearTimeout(id),
}

globalThis.document = {
  documentElement: {
    classList: { toggle: () => {}, contains: () => true },
    style: {},
  },
  body: { style: {} },
  querySelector: () => null,
  getElementById: () => null,
  addEventListener: () => {},
  removeEventListener: () => {},
}

globalThis.requestAnimationFrame = (cb) => setTimeout(cb, 0)
globalThis.cancelAnimationFrame = () => {}
globalThis.SVGElement = class SVGElement {}
globalThis.HTMLElement = class HTMLElement {}
globalThis.Element = class Element {}
globalThis.Node = class Node {}
globalThis.NodeList = class NodeList {}
globalThis.IntersectionObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.matchMedia = mediaStub

const { renderToStaticMarkup } = await import('react-dom/server')
const { default: App } = await import('../src/App.jsx')
const data = await import('../src/data/menu.js')
const cart = await import('../src/lib/cart.js')

const failures = []

function assert(condition, label) {
  if (!condition) failures.push(label)
}

const html = renderToStaticMarkup(<App />)

assert(html.includes('Savor The'), 'hero headline')
assert(html.includes('Ultimate Fusion'), 'hero fusion line')
assert(html.includes('of BBQ, Chinese, Fast Food &amp; Pizza'), 'hero cuisines line')
assert(html.includes('Chicken Zinger Burger'), 'hero highlight card')
assert(html.includes('Fransico Special'), 'hero highlight card')
assert(html.includes('Chicken Malai Tikka'), 'hero highlight card')

assert(html.includes('id="pizza-corner"'), 'pizza corner section')
assert(html.includes('Signature Flavours'), 'pizza signature flavours')
assert(html.includes('Pizza Deals (1 to 10)'), 'pizza deals block')
assert(html.includes('Extra Toppings'), 'pizza toppings block')
assert(html.includes('Sides &amp; Signatures'), 'pizza sides block')
assert(html.includes('Seekh Kabab Flavour'), 'seekh kabab special')

assert(html.includes('Our Signature Menu'), 'menu section heading')
assert(html.includes('Bar B.Q'), 'category tab')
assert(html.includes('Rolls &amp; Reshmi'), 'category tab')
assert(html.includes('Chinese Favorites'), 'category tab')
assert(html.includes('Fast Food, Broast &amp; Grill'), 'category tab')
assert(!html.includes('>Fransico Pizza &amp; Sides<'), 'pizza must not be a menu tab')
assert(
  !html.includes('>Combo Deals (1 to 23)<'),
  'combo deals must not be a menu tab',
)

assert(html.includes('Combo Deals'), 'deals section')
assert(html.includes('Chicken Bihari Tikka'), 'default tab item')
assert(html.includes('1.5 Ltr Cold Drink'), 'combo deal 23')
assert(html.includes('5 Large Pizzas'), 'pizza deal 10')

assert(html.includes('0321-2121946'), 'direct call number')
assert(html.includes('0314-4551199'), 'primary whatsapp number')
assert(html.includes('0333-0226233'), 'easypaisa number')
assert(html.includes('Flat delivery charge of Rs. 100 applies to every order.'), 'delivery note')
assert(!/Free delivery/i.test(html), 'fabricated free delivery claim must be removed')
assert(html.includes('wa.me/923144551199'), 'whatsapp deep link')
assert(html.includes('tel:+923212121946'), 'tel deep link')

/* ---- Single customer-facing WhatsApp channel -------------------------- */
assert(
  !html.includes('0334-8415111'),
  'secondary operational whatsapp number must not be rendered to customers',
)
/* Hours are asserted against OPENING_HOURS rather than repeated literals, so
   the checks can never drift out of sync with the single source of truth. */
const hours = data.OPENING_HOURS
assert(
  html.includes(hours.summaryLong),
  `footer hours summary renders OPENING_HOURS.summaryLong (${hours.summaryLong})`,
)
for (const row of hours.schedule) {
  assert(html.includes(row.day), `hours row renders ${row.day}`)
  assert(html.includes(row.time), `hours row renders ${row.time}`)
}
assert(html.includes(hours.summary), `short hours summary renders (${hours.summary})`)
/* The short summary must not contradict the split schedule: it may only state
   an opening time, never a single unqualified closing time. */
assert(
  !hours.summary.includes('—'),
  'the short summary must not restate a closing time',
)
/* Because the two day groups close at different times, the long summary must
   carry a qualifying aside naming the later days. */
const closings = [...new Set(hours.schedule.map((row) => row.time.split('—')[1].trim()))]
if (closings.length > 1) {
  assert(
    /\([^)]*\)/.test(hours.summaryLong),
    'the long summary must qualify its closing time when day groups differ',
  )
}
assert(
  !html.includes('Daily 12:00 PM — 2:00 AM'),
  'old unqualified hours claim must be gone',
)

/* ---- Checkout asks for address only ----------------------------------- */
assert(!html.includes('Place Order via WhatsApp'), 'old checkout CTA copy must be gone')
assert(!html.includes('Payment Method'), 'payment selector must be removed')
assert(!html.includes('Your name'), 'name field must be removed')
assert(!html.includes('Order sent to WhatsApp'), 'must not claim the order was already sent')

/* ---- No duplicated menu/deal sections --------------------------------- */
assert(
  (html.match(/Combo Deals 1 — 23/g) ?? []).length === 1,
  'combo deal range heading rendered once',
)
assert(
  (html.match(/Pizza Deals \(1 to 10\)/g) ?? []).length === 1,
  'pizza deals heading rendered once',
)
assert(
  !html.includes('Combo Deals (1 to 23)</button>'),
  'combo deals must not appear as a menu tab button',
)
assert(
  !html.includes('Pizza Deals (1 to 10)</button>'),
  'pizza deals must not appear as a menu tab button',
)

/* ---- Copy must not regress into AI marketing ------------------------- */
for (const banned of [
  'Massive plates',
  'honest prices',
  'Packed hot',
  'freshly grilled perfection',
  'deals that actually save you money',
  'Charcoal-grilled legends',
  'legendary kitchen',
  'Budget Friendly',
  'Artisanal',
  'delicious items',
  'costs less than ordering',
  'party catering',
  'dine-in',
  'hot & fast',
  'BEST QUALITY',
  '100% HALAL',
  'FRESH & DELICIOUS',
]) {
  assert(!html.includes(banned), `marketing copy must not contain "${banned}"`)
}

const { readFileSync } = await import('node:fs')
const css = readFileSync(new URL('../src/index.css', import.meta.url), 'utf8')

function parseTokens(selector) {
  const block = css.split(selector)[1]?.split('}')[0] ?? ''
  const tokens = {}
  for (const [, name, value] of block.matchAll(/--fr-([a-z0-9-]+):\s*(#[0-9a-f]{6})/gi)) {
    tokens[name] = value
  }
  return tokens
}

function channel(value) {
  const hex = value.replace('#', '')
  const n = parseInt(hex, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
}

function luminance(hex) {
  const [r, g, b] = channel(hex)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrast(foreground, background) {
  const a = luminance(foreground)
  const b = luminance(background)
  const [hi, lo] = a > b ? [a, b] : [b, a]
  return (hi + 0.05) / (lo + 0.05)
}

const light = parseTokens(':root')
const dark = parseTokens('.dark {')

for (const [themeName, tokens] of [
  ['light', light],
  ['dark', dark],
]) {
  for (const surface of ['bg', 'surface', 'surface-2', 'surface-muted']) {
    for (const text of ['text', 'text-secondary', 'text-muted', 'text-faint', 'gold-ink', 'crimson']) {
      const ratio = contrast(tokens[text], tokens[surface])
      assert(
        ratio >= 4.5,
        `${themeName} contrast ${text} on ${surface} = ${ratio.toFixed(2)}:1 (needs 4.5:1)`,
      )
    }
  }
}

const lightTheme = parseTokens(':root')
assert(lightTheme.bg === '#fafafa', `light bg token = ${lightTheme.bg}, expected #fafafa`)
assert(lightTheme.text === '#111827', `light text token = ${lightTheme.text}, expected #111827`)
assert(
  lightTheme['text-muted'] === '#4b5563',
  `light muted token = ${lightTheme['text-muted']}, expected #4b5563`,
)
assert(
  lightTheme['text-faint'] === '#5b6470',
  `light faint token = ${lightTheme['text-faint']}, expected #5b6470`,
)
assert(lightTheme.gold === '#d97706', `light gold token = ${lightTheme.gold}, expected #d97706`)
assert(lightTheme['gold-ink'] === '#b45309', 'light gold-ink token')
assert(lightTheme.crimson === '#d01c1c', `light crimson = ${lightTheme.crimson}, expected #d01c1c`)
assert(dark.bg === '#0f0f14', `dark bg token = ${dark.bg}, expected #0f0f14`)
/* The dark canvas is lifted ~2% off pure black and the depth ramp must stay
   monotonic, otherwise cards/stop losing their separation from the page. */
assert(dark['bg-deep'] === '#0d0d10', `dark bg-deep = ${dark['bg-deep']}, expected #0d0d10`)
/* bg-deep is deliberately the darkest step (it sinks the footer), then each
   surface layer lifts away from the canvas. */
const ramp = ['bg-deep', 'bg', 'surface-muted', 'surface'].map((key) => {
  const hex = dark[key]
  const n = Number.parseInt(hex.slice(1), 16)
  return (n >> 16) & 255
})
assert(
  ramp[0] < ramp[1] && ramp[1] < ramp[2] && ramp[2] < ramp[3],
  `dark depth ramp must increase monotonically, got ${ramp.join(' -> ')}`,
)
/* Pizza-deal red is a dedicated token so the rest of the crimson family is
   left alone. */
assert(
  lightTheme['pizza-red'] === '#cc1f1c',
  `light pizza-red = ${lightTheme['pizza-red']}, expected #cc1f1c`,
)
assert(
  dark['pizza-red'] === '#ec4a4a',
  `dark pizza-red = ${dark['pizza-red']}, expected #ec4a4a`,
)
assert(lightTheme.crimson === '#d01c1c', 'global light crimson unchanged by pizza-red')
assert(dark.crimson === '#f4585a', 'global dark crimson unchanged by pizza-red')
assert(dark.text === '#f3f4f6', `dark text token = ${dark.text}, expected #f3f4f6`)
assert(dark.gold === '#f59e0b', `dark gold token = ${dark.gold}, expected #f59e0b`)
assert(dark.crimson === '#f4585a', `dark crimson = ${dark.crimson}, expected #f4585a`)

assert(css.includes('cursor: pointer'), 'global cursor-pointer rule')
assert(css.includes('prefers-reduced-motion'), 'reduced motion support')

const appSource = [
  'src/App.jsx',
  'src/components/Header.jsx',
  'src/components/Hero.jsx',
  'src/components/MenuCard.jsx',
  'src/components/MenuSection.jsx',
  'src/components/DealCard.jsx',
  'src/components/FloatingBar.jsx',
  'src/components/ContactSection.jsx',
  'src/components/ui/Button.jsx',
]
  .map((file) => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8'))
  .join('\n')

const menuSectionSource = readFileSync(
  new URL('../src/components/MenuSection.jsx', import.meta.url),
  'utf8',
)

const dealCardSource = readFileSync(
  new URL('../src/components/DealCard.jsx', import.meta.url),
  'utf8',
)
assert(
  /from-pizza-red to-pizza-red-deep/.test(dealCardSource),
  'pizza deal badge uses the dedicated pizza-red gradient',
)
assert(
  !dealCardSource.includes('rose-700'),
  'pizza deal badge no longer borrows the unrelated rose-700 colour',
)

/* No hardcoded near-black ink on accent fills: it must come from the token so
   the dark-mode active category cannot regress into black-on-black. */
assert(
  !/text-\[#0b0b0e\]/.test(appSource),
  'no hardcoded #0b0b0e ink remains in components',
)
assert(
  css.includes('--color-ink-on-accent'),
  'ink-on-accent is exposed as a theme colour token',
)
/* The active menu tab must establish its own stacking context, otherwise the
   -z-10 gold indicator escapes behind the section background and disappears. */
assert(
  /relative isolate shrink-0/.test(menuSectionSource),
  'active menu tab creates a stacking context for its gold indicator',
)
assert(
  /isActive\s*\n\s*\?\s*'border-transparent text-ink-on-accent'/.test(menuSectionSource),
  'active menu tab uses the ink-on-accent token',
)

const drawerSource = css + readFileSync(
  new URL('../src/components/CartDrawer.jsx', import.meta.url),
  'utf8',
)
assert(
  drawerSource.includes('Enter your delivery address to continue'),
  'address helper text',
)
assert(drawerSource.includes('Delivery Address'), 'mandatory delivery address field')
assert(/aria-required="true"/.test(drawerSource), 'address field is marked required')
/* The CTA must be genuinely disabled, not merely validated on click. */
assert(
  /disabled=\{!addressValid \|\| ordered\}/.test(drawerSource),
  'whatsapp CTA is disabled for an invalid address or an already opened order',
)
assert(
  /This cart is still saved here until you\s+clear it\./.test(drawerSource),
  'opening WhatsApp keeps the order visible in the cart',
)
assert(
  /const addressValid = addressValue\.length >= ADDRESS_MIN/.test(drawerSource),
  'address validity is computed from a minimum length',
)
assert(drawerSource.includes('Continue to WhatsApp'), 'checkout CTA copy')
assert(
  !/setName|setPhone|setPayment|placeholder="Your name"/.test(drawerSource),
  'name, phone and payment state must be gone from the drawer',
)
assert(html.includes('cursor-pointer'), 'interactive elements use cursor-pointer')

const byId = Object.fromEntries(data.MENU_CATEGORIES.map((c) => [c.id, c]))

assert(data.MENU_CATEGORIES.length === 4, 'menu tab count = 4')
assert(
  JSON.stringify(data.MENU_CATEGORIES.map((c) => c.id)) ===
    JSON.stringify(['barbq', 'rolls', 'chinese', 'fastfood']),
  'menu tab ids',
)
assert(
  !data.MENU_CATEGORIES.some((c) => c.id === 'combo'),
  'combo deals must not be a menu tab',
)
assert(
  data.COMBO_DEALS.every((deal) => !data.MENU_CATEGORIES.includes(deal)),
  'combo deals live outside the tabbed menu',
)
assert(
  data.SEARCH_GROUP_ORDER.includes('combo') &&
    data.SEARCH_GROUP_ORDER.includes('pizza') &&
    data.SEARCH_GROUP_ORDER.includes('pizzadeals'),
  'combo and pizza groups remain searchable',
)

const bbq = byId.barbq.groups[0].items
assert(bbq.length === 13, `barbq item count = ${bbq.length}, expected 13`)
const bbqExpected = {
  'Chicken Tikka': [350, 400],
  'Chicken Bihari Tikka': [380, 400],
  'Chicken Malai Tikka': [380, 420],
  'Chicken Green Tikka': [380, 420],
  'Chicken Boti': [550],
  'Chicken Malai Boti': [550],
  'Chicken Dhaga Kabab': [550],
  'Chicken Kofta Kabab': [550],
  'Chicken Reshmi Kabab': [550],
  'Beef Bihari Boti': [550],
  'Beef Gola Kabab': [550],
  'Beef Dhaga Kabab': [550],
  'Seekh Kabab': [550],
}
for (const [name, prices] of Object.entries(bbqExpected)) {
  const item = bbq.find((entry) => entry.name === name)
  assert(item, `barbq missing ${name}`)
  const actual = item.variants ? item.variants.map((v) => v.price) : [item.price]
  assert(
    JSON.stringify(actual) === JSON.stringify(prices),
    `barbq price ${name}: got ${actual}, expected ${prices}`,
  )
}

const rollExpected = {
  'Chicken Rolls': {
    'Chicken Chatni Roll': 180,
    'Chicken Spicy Roll': 190,
    'Chicken Mayo Garlic Roll': 220,
    'Chicken Chilli Garlic Roll': 270,
    'Chicken Cheese Roll': 270,
    'Chicken Zinger Roll': 330,
    'Chicken Jumbo Roll': 350,
    'Chicken Jumbo Mayo Roll': 400,
  },
  'Chicken Reshmi Rolls': { 'Chicken Reshmi Roll': 220, 'Chicken Reshmi Cheese Roll': 290 },
  'Chicken Malai Rolls': {
    'Chicken Malai Roll': 220,
    'Chicken Malai Chilli Garlic Roll': 230,
    'Chicken Malai Spicy Roll': 230,
    'Chicken Malai Mayo Garlic Roll': 240,
    'Chicken Malai Cheese Roll': 290,
  },
  'Beef Rolls': {
    'Beef Roll': 220,
    'Beef Chilli Garlic Roll': 220,
    'Beef Spicy Roll': 230,
    'Beef Mayo Garlic Roll': 240,
    'Beef Cheese Roll': 290,
    'Beef Jumbo Roll': 400,
    'Beef Jumbo Mayo Roll': 450,
  },
}
for (const [groupTitle, items] of Object.entries(rollExpected)) {
  const group = byId.rolls.groups.find((entry) => entry.title === groupTitle)
  assert(group, `rolls missing group ${groupTitle}`)
  for (const [name, price] of Object.entries(items)) {
    const item = group.items.find((entry) => entry.name === name)
    assert(item, `rolls missing ${groupTitle} / ${name}`)
    assert(item?.price === price, `rolls price ${name}: got ${item?.price}, expected ${price}`)
  }
}

const chineseExpected = {
  'Vegetable Fried Rice': 449,
  'Egg Fried Rice': 449,
  'Vegetable Chowmein': 499,
  'Chicken Fried Rice': 499,
  'Chicken Chowmein': 499,
  'Masala Crispy Rice': 499,
  'Crispy Garlic Rice': 499,
  'Chicken Masala Rice': 499,
  'Chicken Vegetable & Rice': 549,
  'Chicken B.B.Q Rice': 549,
  'Bar B.Q Chowmein': 549,
  'Chicken Shashlik & Rice': 599,
  'Chicken Manchurian & Rice': 599,
  'Chicken Jalfrezi & Rice': 599,
  'Chicken White Shashlik & Rice': 649,
  'Chicken Dry Chilli & Rice': 649,
  'Singapuri Rice': 649,
  'American Chopsuey': 649,
  'Chinese Chopsuey': 649,
  'Chinese Tikka Biryani': 669,
}
const chinese = byId.chinese.groups[0].items
assert(chinese.length === 20, `chinese item count = ${chinese.length}, expected 20`)
for (const [name, price] of Object.entries(chineseExpected)) {
  const item = chinese.find((entry) => entry.name === name)
  assert(item, `chinese missing ${name}`)
  assert(item?.price === price, `chinese price ${name}: got ${item?.price}, expected ${price}`)
}

const fastFood = Object.fromEntries(byId.fastfood.groups.map((g) => [g.title, g.items]))
const broastExpected = {
  'Chicken Crispy Broast': 500,
  'Chicken Special Masala Broast': 520,
  'Chicken Mayo Garlic Broast': 550,
}
for (const [name, price] of Object.entries(broastExpected)) {
  const item = fastFood.Broast.find((entry) => entry.name === name)
  assert(item?.price === price, `broast price ${name}: got ${item?.price}, expected ${price}`)
}
const broast = fastFood.Broast.find((entry) => entry.name === 'Chicken Broast')
assert(
  JSON.stringify(broast?.variants.map((v) => [v.label, v.price])) ===
    JSON.stringify([
      ['Qtr Leg', 470],
      ['Qtr Chest', 500],
    ]),
  'Chicken Broast variants',
)

const burgerExpected = {
  'Chicken Burger': 370,
  'Chicken Sandwich': 430,
  'Chicken Zinger Burger': 420,
  'Chicken Cheese Burger': 420,
  'Chicken Cheese Sandwich': 480,
  'Beef Burger': 420,
  'Chicken Zinger Burger Spicy': 440,
  'Chicken Zinger Burger Cheese': 470,
  'Beef Cheese Burger': 470,
  'B.B.Q Club Sandwich': 480,
  'Zinger Club Sandwich': 550,
  'Club Cheese Sandwich': 550,
}
assert(
  fastFood['Burgers & Sandwiches'].length === 12,
  `burger count = ${fastFood['Burgers & Sandwiches'].length}, expected 12`,
)
for (const [name, price] of Object.entries(burgerExpected)) {
  const item = fastFood['Burgers & Sandwiches'].find((entry) => entry.name === name)
  assert(item?.price === price, `burger price ${name}: got ${item?.price}, expected ${price}`)
}

assert(data.PIZZA_FLAVOURS.length === 15, `pizza flavours = ${data.PIZZA_FLAVOURS.length}`)
assert(data.PIZZA_PRICES.Small === 399, 'pizza small price')
assert(data.PIZZA_PRICES.Regular === 749, 'pizza regular price')
assert(data.PIZZA_PRICES.Large === 1099, 'pizza large price')
assert(data.SEEKH_KABAB_PIZZA.variants[0].price === 995, 'seekh regular price')
assert(data.SEEKH_KABAB_PIZZA.variants[1].price === 1499, 'seekh large price')
assert(data.PIZZA_TOPPINGS.every((t) => t.price === 150), 'topping prices')
assert(data.PIZZA_SIDES.length === 6, 'pizza sides count')

const pizzaFlavourItems = data.ALL_ITEMS.filter(
  (i) => i.categoryId === 'pizza' && i.variants?.length === 3 && i.toppings,
)
assert(pizzaFlavourItems.length === 15, `pizza catalogue flavours = ${pizzaFlavourItems.length}`)
for (const flavour of data.PIZZA_FLAVOURS) {
  const item = pizzaFlavourItems.find((i) => i.name === flavour)
  assert(item, `pizza catalogue missing flavour ${flavour}`)
  assert(item?.id && !item.id.includes('undefined'), `pizza flavour id invalid for ${flavour}`)
  assert(item?.variants.length === 3, `pizza flavour ${flavour} must offer 3 sizes`)
}
assert(
  data.ALL_ITEMS.every((i) => i.id && i.name),
  'every catalogue item has a valid id and name',
)
assert(
  new Set(data.ALL_ITEMS.map((i) => i.id)).size === data.ALL_ITEMS.length,
  'catalogue item ids must be unique',
)

assert(data.COMBO_DEALS.length === 23, `combo deals = ${data.COMBO_DEALS.length}, expected 23`)
const comboExpected = [
  [1, 580], [2, 560], [3, 580], [4, 810], [5, 630], [6, 560], [7, 580], [8, 650],
  [9, 1730], [10, 2400], [11, 2600], [12, 2100], [13, 849], [14, 1200], [15, 1149],
  [16, 999], [17, 1049], [18, 1149], [19, 1330], [20, 1200], [21, 3349], [22, 2550],
  [23, 2799],
]
for (const [n, price] of comboExpected) {
  const deal = data.COMBO_DEALS.find((entry) => entry.n === n)
  assert(deal?.price === price, `combo ${n} price: got ${deal?.price}, expected ${price}`)
}

assert(data.PIZZA_DEALS.length === 10, `pizza deals = ${data.PIZZA_DEALS.length}, expected 10`)
const pizzaDealExpected = [
  [1, 449], [2, 799], [3, 999], [4, 1199], [5, 1499],
  [6, 1699], [7, 1899], [8, 1949], [9, 2849], [10, 4499],
]
for (const [n, price] of pizzaDealExpected) {
  const deal = data.PIZZA_DEALS.find((entry) => entry.n === n)
  assert(deal?.price === price, `pizza deal ${n} price: got ${deal?.price}, expected ${price}`)
}

assert(data.formatPrice(1099) === 'Rs. 1,099', 'price formatting')

const zingerHits = data.searchMenu('Zinger')
assert(zingerHits.length > 0, 'search finds zinger')
assert(
  zingerHits.some((i) => i.name === 'Chicken Zinger Burger'),
  'search spans fast food items',
)
assert(
  data.searchMenu('Malai Tikka').some((i) => i.name === 'Chicken Malai Tikka'),
  'search finds bbq items',
)
assert(data.searchMenu('Cheese Lover').length > 0, 'search reaches pizza flavours')
assert(data.searchMenu('Deal 5').some((i) => i.number === 5), 'search reaches combo deals')
assert(data.searchMenu('').length === 0, 'empty search returns nothing')
assert(data.normaliseSearch('  ZINGER  ') === 'zinger', 'search normalisation')

const malaiTikka = data.ITEMS_BY_ID['barbq-chicken-malai-tikka']
assert(malaiTikka, 'malai tikka is in the catalogue index')

const legLine = cart.buildLine(malaiTikka, { variant: 'Leg' })
const chestLine = cart.buildLine(malaiTikka, { variant: 'Chest' })
assert(legLine.key !== chestLine.key, 'variants produce distinct cart lines')
assert(legLine.unitPrice === 380, `leg line price = ${legLine.unitPrice}, expected 380`)
assert(chestLine.unitPrice === 420, `chest line price = ${chestLine.unitPrice}, expected 420`)

const pizzaBase = pizzaFlavourItems[0]
const plain = cart.buildLine(pizzaBase, { variant: 'Regular' })
const topped = cart.buildLine(pizzaBase, { variant: 'Regular', toppings: ['Cheese'] })
assert(plain.key !== topped.key, 'toppings produce distinct cart lines')
assert(plain.unitPrice === 749, `plain pizza price = ${plain.unitPrice}, expected 749`)
assert(topped.unitPrice === 899, `pizza price with topping = ${topped.unitPrice}, expected 899`)
assert(
  cart.lineLabel(topped) === `${pizzaBase.name} (Regular) + Cheese`,
  'line label includes variant and toppings',
)

let state = { lines: [] }
state = cart.cartReducer(state, { type: 'add', line: plain })
state = cart.cartReducer(state, { type: 'add', line: legLine })
state = cart.cartReducer(state, { type: 'add', line: topped })
state = cart.cartReducer(state, { type: 'add', line: legLine })
state = cart.cartReducer(state, { type: 'increment', key: topped.key })

assert(state.lines.length === 3, `cart line count = ${state.lines.length}, expected 3`)
assert(
  state.lines.find((l) => l.key === legLine.key)?.qty === 2,
  'adding the same line increments qty instead of duplicating',
)
assert(
  state.lines.find((l) => l.key === topped.key)?.qty === 2,
  'increment raises qty',
)

const totals = cart.cartTotals(state.lines)
const expectedSubtotal = 749 + 380 * 2 + 899 * 2
assert(totals.count === 5, `item count = ${totals.count}, expected 5`)
assert(cart.cartItemCount(state.lines) === 5, 'cartItemCount matches')
assert(
  totals.subtotal === expectedSubtotal,
  `subtotal = ${totals.subtotal}, expected ${expectedSubtotal}`,
)
assert(totals.deliveryCharge === 100, 'non-empty cart includes one fixed delivery charge')
assert(
  totals.total === expectedSubtotal + 100,
  `grand total = ${totals.total}, expected ${expectedSubtotal + 100}`,
)
assert(totals.deliveryCharge === data.DELIVERY_CHARGE, 'cart delivery fee matches shared fee constant')

state = cart.cartReducer(state, { type: 'decrement', key: legLine.key })
state = cart.cartReducer(state, { type: 'decrement', key: legLine.key })
assert(!state.lines.find((l) => l.key === legLine.key), 'decrement to zero removes the line')
state = cart.cartReducer(state, { type: 'remove', key: topped.key })
assert(!state.lines.find((l) => l.key === topped.key), 'remove drops the line')
state = cart.cartReducer(state, { type: 'clear' })
assert(state.lines.length === 0, 'clear empties the cart')
const emptyTotals = cart.cartTotals(state.lines)
assert(emptyTotals.deliveryCharge === 0 && emptyTotals.total === 0, 'empty cart has no delivery charge')

const message = cart.buildOrderMessage({
  lines: [
    cart.buildLine(malaiTikka, { variant: 'Leg' }),
    cart.buildLine(pizzaBase, { variant: 'Regular', toppings: ['Cheese', 'Meat'] }),
  ],
  address: 'House 12, Street 4, Model Town, Lahore',
})

assert(message.startsWith('FRANSICO — ORDER REQUEST'), 'order message header')
assert(message.includes('Delivery Address\nHouse 12, Street 4, Model Town, Lahore'), 'address line')
assert(message.includes('Order Details'), 'order header')
assert(message.includes('Items Subtotal: Rs. 1,429'), 'items subtotal row')
assert(message.includes('Delivery Charges: Rs. 100 (Fixed)'), 'WhatsApp message includes fixed delivery charge')
assert(message.includes('Grand Total: Rs. 1,529'), 'WhatsApp grand total includes delivery')
assert(
  message.includes(`Grand Total: ${data.formatPrice(1429 + data.DELIVERY_CHARGE)}`),
  'WhatsApp grand total is calculated from subtotal plus one delivery fee',
)
assert(!message.includes('Order Total'), 'old ambiguous total label is removed')
assert(!message.includes('Total Amount'), 'must not call it a final payable total')
assert(
  message.includes(`• 1x ${malaiTikka.name} (Leg) — Rs. 380`),
  'WhatsApp item line uses the full product name and selected variant',
)
assert(
  message.includes(`• 1x ${pizzaBase.name} Pizza (Regular) + Cheese + Meat — Rs. 1,049`),
  'pizza line adds Pizza after its full name and preserves size and toppings',
)
assert(!message.includes('[Bar B.Q]'), 'WhatsApp product lines omit category labels')

const malaiBoti = data.ALL_ITEMS.find((item) => item.name === 'Chicken Malai Boti')
const malaiPizza = data.ALL_ITEMS.find((item) => item.name === 'Malai' && item.categoryId === 'pizza')
const seekhPizza = data.SEEKH_PIZZA_ITEM
const malaiRoll = data.ALL_ITEMS.find((item) => item.name === 'Chicken Malai Roll')
const comboDeal = data.ITEMS_BY_ID['combo-deal-20']
const pizzaDeal = data.ITEMS_BY_ID['pizza-deal-1']
assert(
  comboDeal?.name === 'Combo Deal 20' && comboDeal.id === 'combo-deal-20',
  'combo deal catalogue record has cart-ready name and identity',
)
const getCategoryItem = (categoryId, name) =>
  data.MENU_CATEGORIES.find((category) => category.id === categoryId)?.groups
    .flatMap((group) => group.items)
    .find((item) => item.name === name)
const chatniRoll = getCategoryItem('rolls', 'Chicken Chatni Roll')
const chineseRice = getCategoryItem('chinese', 'Chicken Fried Rice')
const zingerBurger = getCategoryItem('fastfood', 'Chicken Zinger Burger')
assert(
  malaiBoti &&
    malaiPizza &&
    seekhPizza &&
    malaiRoll &&
    comboDeal &&
    pizzaDeal &&
    chatniRoll &&
    chineseRice &&
    zingerBurger,
  'context examples exist',
)
assert(
  [chatniRoll, chineseRice, zingerBurger].every((item) => item.id),
  'items used by the category tabs have stable ids',
)

const contextMessage = cart.buildOrderMessage({
  lines: [
    cart.buildLine(malaiTikka, { variant: 'Chest' }),
    cart.buildLine(malaiBoti),
    cart.buildLine(malaiRoll),
    cart.buildLine(malaiPizza, { variant: 'Large' }),
    cart.buildLine(seekhPizza, { variant: 'Regular' }),
    cart.buildLine(comboDeal),
    cart.buildLine(pizzaDeal),
  ],
  address: 'Model Town, Lahore',
})
assert(
  contextMessage.includes('• 1x Chicken Malai Tikka (Chest) — Rs. 420'),
  'BBQ item uses its full name and selected variant',
)
assert(
  contextMessage.includes('• 1x Chicken Malai Boti — Rs. 550'),
  'BBQ boti uses its full product name',
)
assert(
  contextMessage.includes('• 1x Chicken Malai Roll — Rs. 220'),
  'roll uses its full product name without extra category info',
)
assert(
  contextMessage.includes('• 1x Malai Pizza (Large) — Rs. 1,099'),
  'same-name pizza is identified by adding Pizza after its full name',
)
assert(
  contextMessage.includes('• 1x Seekh Kabab Flavour Pizza (Regular) — Rs. 995'),
  'Seekh Kabab pizza also gets the Pizza suffix',
)
assert(
  contextMessage.includes('• 1x Combo Deal 20 — Rs. 1,200'),
  'combo deal message uses its cart-ready name',
)
assert(
  contextMessage.includes('• 1x Pizza Deal 1 — Rs. 449'),
  'pizza deal message uses only its type and number',
)
assert(!contextMessage.includes('1 Plate Malai Boti'), 'WhatsApp deals omit long descriptions')
assert(!contextMessage.includes('[Fransico Pizza]'), 'WhatsApp pizza lines omit category labels')
assert(
  cart.lineLabel(cart.buildLine(comboDeal)) === 'Combo Deal 20',
  'combo deal has a visible cart label',
)

let mixedOrderState = { lines: [] }
mixedOrderState = cart.cartReducer(mixedOrderState, {
  type: 'add',
  line: cart.buildLine(chatniRoll),
})
assert(
  mixedOrderState.lines.length === 1 && mixedOrderState.lines[0].qty === 1,
  'adding one roll creates one cart line with quantity one',
)
mixedOrderState = cart.cartReducer(mixedOrderState, {
  type: 'add',
  line: cart.buildLine(chineseRice),
})
assert(
  mixedOrderState.lines.length === 2 &&
    mixedOrderState.lines[0].itemId !== mixedOrderState.lines[1].itemId &&
    mixedOrderState.lines.every((line) => line.qty === 1),
  'adding a Chinese item after a roll creates a second independent cart line',
)
for (const item of [malaiTikka, pizzaBase, zingerBurger]) {
  mixedOrderState = cart.cartReducer(mixedOrderState, {
    type: 'add',
    line: cart.buildLine(item, { variant: item === malaiTikka ? 'Chest' : item === pizzaBase ? 'Regular' : null }),
  })
}
const mixedOrder = cart.buildOrderMessage({
  lines: mixedOrderState.lines,
  address: 'Model Town, Lahore',
})
assert(mixedOrderState.lines.length === 5, 'adding a mixed order keeps all five distinct cart lines')
assert(
  mixedOrderState.lines.find((line) => line.itemId === chatniRoll.id)?.qty === 1,
  'a single Chatni Roll stays quantity one in a mixed order',
)
assert(
  (mixedOrder.match(/• 1x /g) ?? []).length === 5,
  'WhatsApp message preserves one line for each mixed-order item',
)
assert(
  mixedOrder.includes('• 1x Chicken Chatni Roll — Rs. 180'),
  'mixed order contains the single Chatni Roll with its full name',
)
assert(
  mixedOrder.includes('• 1x Chicken Fried Rice — Rs. 499'),
  'mixed order retains the Chinese item by its full name',
)
assert(
  mixedOrder.includes('• 1x Chicken Malai Tikka (Chest) — Rs. 420'),
  'mixed order retains the BBQ item by its full name',
)
assert(
  mixedOrder.includes(`• 1x ${pizzaBase.name} Pizza (Regular) — Rs. 749`),
  'mixed order retains the pizza with its Pizza suffix',
)
assert(
  mixedOrder.includes('• 1x Chicken Zinger Burger — Rs. 420'),
  'mixed order retains the fast-food item by its full name',
)

/* A multi-quantity line must show the line total, not the unit price. */
const bulk = cart.buildOrderMessage({
  lines: [cart.buildLine(malaiTikka, { variant: 'Leg', qty: 2 })],
  address: 'Model Town, Lahore',
})
assert(
  bulk.includes(`• 2x ${malaiTikka.name} (Leg) — Rs. 760`),
  'quantity line shows full product name, variant and line total',
)
assert(bulk.includes('Items Subtotal: Rs. 760'), 'bulk subtotal matches quantity line total')
assert(bulk.includes('Grand Total: Rs. 860'), 'bulk grand total includes delivery charge once')
assert(message.includes('Please confirm my order'), 'confirmation request')
assert(!message.includes('undefined'), 'order message has no undefined values')

/* Checkout only collects an address, so the message must not carry the
   removed fields — and must contain no decorative emoji. */
assert(!message.includes('Customer Name'), 'no name in order message')
assert(!message.includes('Contact Number'), 'no phone in order message')
assert(!message.includes('Payment Method'), 'no payment method in order message')
assert(!/\p{Extended_Pictographic}/u.test(message), 'order message contains no emoji')
assert(!/^-{10,}/m.test(message), 'order message has no divider runs')
assert(!message.includes('🍔'), 'legacy burger emoji removed')
assert(!message.includes('🍕'), 'legacy pizza emoji removed')

const single = cart.buildOrderMessage({
  lines: [legLine],
  address: 'Model Town, Lahore',
})
assert(single.includes('Delivery Address\nModel Town, Lahore'), 'address always present')

/* Every searchable item must have one stable id. */
const ids = data.ALL_ITEMS.map((item) => item.id)
assert(new Set(ids).size === ids.length, 'searchable item ids are unique')
const tabItems = data.MENU_CATEGORIES.flatMap((category) =>
  category.groups.flatMap((group) => group.items),
)
const tabItemIds = tabItems.map((item) => item.id)
assert(tabItems.every((item) => item.id && item.categoryId), 'category tab items have stable identities')
assert(
  new Set(tabItemIds).size === tabItemIds.length,
  'category tab React keys are unique across all menu groups',
)

const addableItems = [
  ...tabItems,
  ...data.PIZZA_FLAVOUR_ITEMS,
  data.SEEKH_PIZZA_ITEM,
  ...data.PIZZA_SIDE_ITEMS,
  ...data.COMBO_DEAL_ITEMS,
  ...data.PIZZA_DEAL_ITEMS,
].filter(Boolean)
const addableIds = addableItems.map((item) => item.id)
assert(
  addableItems.every((item) => data.ITEMS_BY_ID[item.id] === item),
  'every menu, pizza and deal card uses its canonical catalogue record',
)
assert(
  new Set(addableIds).size === addableIds.length,
  'all add-to-cart surfaces have unique item identities across sections',
)
assert(
  addableItems.length === data.ALL_ITEMS.length &&
    addableIds.every((id) => data.ITEMS_BY_ID[id]),
  'all searchable catalogue records appear exactly once across add-to-cart surfaces',
)

let fullCatalogCart = { lines: [] }
for (const item of addableItems) {
  fullCatalogCart = cart.cartReducer(fullCatalogCart, {
    type: 'add',
    line: cart.buildLine(item, { variant: item.variants?.[0]?.label ?? null }),
  })
}
assert(
  fullCatalogCart.lines.length === addableItems.length &&
    fullCatalogCart.lines.every((line) => line.qty === 1),
  'adding every item from every section creates one independent cart line per item',
)

assert(
  data.ALL_ITEMS.every((item) => typeof item.name === 'string' && item.name.length > 0),
  'every searchable item is named',
)

/* Search must never surface the same item twice. */
for (const term of ['pizza', 'zinger', 'deal', 'chowmein']) {
  const results = data.searchMenu(term)
  const resultIds = results.map((item) => item.id)
  assert(new Set(resultIds).size === resultIds.length, `search "${term}" has no duplicate results`)
}

/* Every searchable item must belong to a group the results view renders,
   and no two groups may share a title (they are merged into one heading). */
const groupIds = new Set(data.SEARCH_GROUP_ORDER)
for (const item of data.ALL_ITEMS) {
  assert(groupIds.has(item.categoryId), `item "${item.name}" has no search group`)
}

/* Pizza flavours and sides are separate catalogue categories that render under
   one customer-facing heading, so both must be searchable. */
assert(data.SEARCH_GROUPS.some((g) => g.id === 'pizza-side'), 'pizza sides have a search group')
assert(
  data.searchMenu('pizza fries').some((item) => item.categoryId === 'pizza-side'),
  'pizza sides are searchable',
)
assert(data.searchMenu('stick on').length > 0, 'a pizza side matches its own name')
assert(data.PIZZA_SIDE_ITEMS.length > 0, 'pizza sides are exposed to the Pizza Corner view')

console.log(`rendered bytes: ${html.length}`)
if (failures.length) {
  console.error(`FAILED (${failures.length}):`)
  for (const failure of failures) console.error(`  - ${failure}`)
  process.exit(1)
}
console.log('ALL SMOKE + DATA CHECKS PASSED')