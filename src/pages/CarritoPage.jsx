import React from 'react'
import Header from '../components/layout/header'
import Footer from '../components/layout/footer'
import CarritoMainComponent from '../components/carritoMainComponent'

function CarritoPage({ cartItems, onUpdateQuantity, onRemoveItem, onClearCart }) {
  return (
    <>
    <Header
      cartItems={cartItems}
      onUpdateQuantity={onUpdateQuantity}
      onRemoveItem={onRemoveItem}
    />
    <CarritoMainComponent
    cartItems={cartItems}
        onUpdateQuantity={onUpdateQuantity}
        onRemoveItem={onRemoveItem}
        onClearCart={onClearCart}
    />
    <Footer/>
    </>
  )
}

export default CarritoPage