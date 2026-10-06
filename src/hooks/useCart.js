import { useContext, useMemo } from 'react'

import { CartContext, cartTotals } from '../lib/cart'

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart must be used inside <CartProvider>')
  }

  const totals = useMemo(() => cartTotals(context.lines), [context.lines])

  return { ...context, ...totals }
}

export default useCart