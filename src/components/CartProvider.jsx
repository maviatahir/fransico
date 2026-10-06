import { useCallback, useMemo, useReducer, useRef, useState } from 'react'

import { CartContext, cartReducer } from '../lib/cart'

export default function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { lines: [] })
  const [isCartOpen, setCartOpen] = useState(false)
  const openerRef = useRef(null)

  const add = useCallback((line) => dispatch({ type: 'add', line }), [])
  const increment = useCallback((key) => dispatch({ type: 'increment', key }), [])
  const decrement = useCallback((key) => dispatch({ type: 'decrement', key }), [])
  const remove = useCallback((key) => dispatch({ type: 'remove', key }), [])
  const clear = useCallback(() => dispatch({ type: 'clear' }), [])

  const openCart = useCallback(() => {
    openerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    setCartOpen(true)
  }, [])

  const closeCart = useCallback(() => setCartOpen(false), [])

  const value = useMemo(
    () => ({
      lines: state.lines,
      isCartOpen,
      add,
      increment,
      decrement,
      remove,
      clear,
      openCart,
      closeCart,
      openerRef,
    }),
    [state.lines, isCartOpen, add, increment, decrement, remove, clear, openCart, closeCart],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}