import React from 'react'
import Header from '../components/layout/header'
import Footer from '../components/layout/footer'
import BuscadorProductos from '../components/BuscadorProductos'
import CardsComponent from '../components/CardsComponent'

function productosPage({ onAddToCart, cartItems, onUpdateQuantity, onRemoveItem }) {
    return (
        <>
            <Header 
                cartItems={cartItems}
                onUpdateQuantity={onUpdateQuantity}
                onRemoveItem={onRemoveItem}
            />
            <BuscadorProductos onAddToCart={onAddToCart} />
            <CardsComponent onAddToCart={onAddToCart} />
            <Footer/>
        </>
    )
}

export default productosPage