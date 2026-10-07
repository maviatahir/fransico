import { createContext } from 'react'

import { DELIVERY_CHARGE, PIZZA_TOPPINGS, formatPrice, ITEMS_BY_ID } from '../data/menu'

export const CartContext = createContext(null)

export const MAX_QTY = 20

/**
 * A line is uniquely identified by item + selected option + toppings, so
 * "Chicken Tikka (Leg)" and "Chicken Tikka (Chest)" stay separate line items.
 */
export function buildLine(item, { variant = null, toppings = [], qty = 1 } = {}) {
  const unit = item.variants?.find((option) => option.label === variant)
  const toppingsTotal = toppings.reduce(
    (sum, topping) =>
      sum + (PIZZA_TOPPINGS.find((entry) => entry.name === topping)?.price ?? 0),
    0,
  )
  const price = (unit ? unit.price : (item.price ?? 0)) + toppingsTotal

  return {
    key: [item.id, variant ?? 'default', [...toppings].sort().join('+') || 'none'].join('::'),
    itemId: item.id,
    name: item.name,
    category: item.category,
    categoryId: item.categoryId,
    kind: item.kind,
    number: item.number,
    variant,
    toppings: [...toppings],
    unitPrice: price,
    qty: Math.min(Math.max(qty, 1), MAX_QTY),
  }
}

export function lineLabel(line, name = line.name) {
  const parts = [name]
  if (line.variant) parts.push(`(${line.variant})`)
  if (line.toppings.length) parts.push(`+ ${line.toppings.join(' + ')}`)
  return parts.join(' ')
}

function orderLineLabel(line) {
  if (line.kind === 'deal') {
    return line.name
  }

  const name = line.categoryId === 'pizza' ? `${line.name} Pizza` : line.name
  return lineLabel(line, name)
}

export function addLine(cart, line) {
  const existing = cart.find((entry) => entry.key === line.key)
  if (existing) {
    return cart.map((entry) =>
      entry.key === line.key ? { ...entry, qty: Math.min(entry.qty + 1, MAX_QTY) } : entry,
    )
  }
  return [...cart, line]
}

export function incrementLine(cart, key) {
  return cart.map((entry) =>
    entry.key === key ? { ...entry, qty: Math.min(entry.qty + 1, MAX_QTY) } : entry,
  )
}

export function decrementLine(cart, key) {
  return cart
    .map((entry) => (entry.key === key ? { ...entry, qty: entry.qty - 1 } : entry))
    .filter((entry) => entry.qty > 0)
}

export function removeLine(cart, key) {
  return cart.filter((entry) => entry.key !== key)
}

export function cartTotals(cart) {
  const subtotal = cart.reduce((sum, line) => sum + line.unitPrice * line.qty, 0)
  const count = cart.reduce((sum, line) => sum + line.qty, 0)
  const deliveryCharge = count > 0 ? DELIVERY_CHARGE : 0

  return {
    count,
    subtotal,
    deliveryCharge,
    total: subtotal + deliveryCharge,
  }
}

export function cartReducer(state, action) {
  switch (action.type) {
    case 'add':
      return { ...state, lines: addLine(state.lines, action.line) }
    case 'increment':
      return { ...state, lines: incrementLine(state.lines, action.key) }
    case 'decrement':
      return { ...state, lines: decrementLine(state.lines, action.key) }
    case 'remove':
      return { ...state, lines: removeLine(state.lines, action.key) }
    case 'clear':
      return { ...state, lines: [] }
    default:
      return state
  }
}

/**
 * Builds the WhatsApp order message.
 *
 * Address is the only customer detail the checkout collects, so it is the only
 * one included here. No emoji, no decorative dividers — just something a real
 * customer would type.
 *
 *   FRANSICO — ORDER REQUEST
 *
 *   Delivery Address
 *   House 12, Block A
 *
 *   Order Details
 *   • 2x Chicken Tikka (Chest) — Rs. 800
 *   • 1x Malai Pizza (Regular) — Rs. 749
 *   • 1x Combo Deal 4 — Rs. 810
 *
 *   Items Subtotal: Rs. 1,510
 *   Delivery Charges: Rs. 100 (Fixed)
 *
 *   Grand Total: Rs. 1,610
 *
 *   Please confirm my order and delivery time.
 */
export function buildOrderMessage({ lines, address }) {
  const subtotal = lines.reduce((sum, line) => sum + line.unitPrice * line.qty, 0)
  const deliveryCharge = lines.length > 0 ? DELIVERY_CHARGE : 0
  const grandTotal = subtotal + deliveryCharge

  const body = lines.map((line) => {
    const lineTotal = line.unitPrice * line.qty
    return `• ${line.qty}x ${orderLineLabel(line)} — ${formatPrice(lineTotal)}`
  })

  return [
    '*FRANSICO — ORDER REQUEST*',
    '',
    '*Order Details*',
    ...body,
    '',
    '*Delivery Address*',
    address,
    '',
    `_Items Subtotal: ${formatPrice(subtotal)}_`,
    `_Delivery Charges: ${formatPrice(deliveryCharge)}_`,
    `*Grand Total: ${formatPrice(grandTotal)}*`,
    '',
    '_Please confirm my order and delivery time._',
  ].join('\n')
}

export function cartItemCount(cart) {
  return cart.reduce((sum, line) => sum + line.qty, 0)
}

export function cartFromItems(cart) {
  return cart.map((line) => ({ ...line, item: ITEMS_BY_ID[line.itemId] }))
}