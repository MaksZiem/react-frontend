import React from 'react'
import DishList from '../components/DishList'

const DUMMY_DISHES = [
    {
        id: 'd1',
        name: 'Lasagne',
        price: 33
    },
    {
        id: 'd2',
        name: 'salata pomidorowa',
        price: 123
    },
    {
        id: 'd3',
        name: 'spaghetti',
        price: 44
    }
]

const Dishes = () => {
    return (
        <DishList items={DUMMY_DISHES} />
      )
}

export default Dishes;
