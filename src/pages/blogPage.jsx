import React from 'react'
import Header from '../components/layout/header'
import Blog from '../components/layout/blog'
import Footer from '../components/layout/footer'

function blogPage({ cartItems, onUpdateQuantity, onRemoveItem }) {
  return (
    <>
    <Header
      cartItems={cartItems}
      onUpdateQuantity={onUpdateQuantity}
      onRemoveItem={onRemoveItem}
    />
    <Blog/>
    <Footer/>
    </>
  )
}

export default blogPage