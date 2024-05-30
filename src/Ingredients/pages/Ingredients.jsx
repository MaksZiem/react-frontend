import React from 'react'
import IngredientList from '../components/IngredientList'


const DUMMY_INGREDIENTS = [
    {
        id: 'i1',
        name: 'Salata',
        category: 'Vegetable'
    },
    {
        id: 'i2',
        name: 'Pomidor',
        category: 'Vegetable'
    },
    {
        id: 'i3',
        name: 'Ogórek',
        category: 'Vegetable'
    }
]

const Ingredients = () => {
  return (
    <IngredientList items={DUMMY_INGREDIENTS} />
  )
}

export default Ingredients
