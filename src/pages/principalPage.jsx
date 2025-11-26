import React from 'react'
import Header from '../components/layout/header'
import Body from '../components/layout/body'
import Footer from '../components/layout/footer'

function PrincipalPage({ cartItems, onAddToCart, onUpdateQuantity, onRemoveItem, currentUser, onUserLogin, onUserLogout }) {
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
      <Body onAddToCart={onAddToCart} />
      <Footer />
    </>
  )
}

export default PrincipalPage