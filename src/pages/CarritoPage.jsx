import React from 'react'
import Header from '../components/layout/header'
import Footer from '../components/layout/footer'
import CarritoMainComponent from '../components/carritoMainComponent'

function CarritoPage({ cartItems, onUpdateQuantity, onRemoveItem, onClearCart, currentUser, onUserLogin, onUserLogout }) {
  return (
    <>
    <Header
      cartItems={cartItems}
      onUpdateQuantity={onUpdateQuantity}
      onRemoveItem={onRemoveItem}
      currentUser={currentUser}
      onUserLogin={onUserLogin}
      onUserLogout={onUserLogout}
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