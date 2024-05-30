import React from 'react'

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';

import './DishItem.css';

const DishItem = (props) => {
  return (
    <li className='place-item'>
    <Card className='place-item__content'>
        <div className='place-item__info'>
            <h2>{props.name}</h2>
            <h3>{props.price} $</h3>
        </div>
        <div className='place-item__actions'>
            <Button to={`/places/${props.id}`}>Edit</Button>
            <Button danger>Delete</Button>
        </div>
    </Card>
</li> 
  )
}

export default DishItem
