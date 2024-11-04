import React from 'react'

import Button from '../../../shared/components/FormElements/Button'
import DishItem from './DishItem'
import Card from '../../../shared/components/UIElements/Card';

import './DishList.css'

const DishList = (props) => {
    if (props.items.length === 0) {
        return (
            <div className='place-list center'>
                <Card>
                    <h2>No dishes found</h2>
                    <Button to='places/new'>Add dish</Button>
                </Card>
            </div>
        )
      }
    
      return (
        <ul className='grid-container3'>
            {props.items.map(dish => (
                <DishItem
                    key={dish.id}
                    id={dish.id}
                    name={dish.name}
                    image={dish.image || ''}
                    price={dish.price}
                    isAvailable={dish.isAvailable}
                    tableId={props.tableId}
                    onAddDish={props.onAddDish}
                />
            ))
            }
            {console.log(props.items)}
        </ul>
        
      )
}

export default DishList
