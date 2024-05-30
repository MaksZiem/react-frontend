import React from 'react'

import Button from '../../shared/components/FormElements/Button'
import IngredientItem from './IngredientItem'
import Card from '../../shared/components/UIElements/Card';

import './IngredientList.css';

const IngredientList = (props) => {
  if (props.items.length === 0) {
    return (
        <div className='place-list center'>
            <Card>
                <h2>No places found. Maybe create one?</h2>
                <Button to='places/new'>Add place</Button>
            </Card>
        </div>
    )
  }

  return (
    <ul className='place-list'>
        {props.items.map(ingredient => (
            <IngredientItem 
                key={ingredient.id}
                id={ingredient.id}
                name={ingredient.name}
                category={ingredient.category}
            />
        ))}
    </ul>
  )
}

export default IngredientList
