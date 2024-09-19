import React from 'react'
import Button from '../../shared/components/FormElements/Button'
import MagazineDashboardItem from './MagazineDashboardItem'
import Card from '../../shared/components/UIElements/Card';


const MagazineDashboard = (props) => {
  

  if (props.ingredientTemplates.length === 0) {
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
    <>
    
    <ul className='grid-container'>
        {props.ingredientTemplates.map(ingredient => (
            <MagazineDashboardItem 
                key={ingredient.id}
                id={ingredient.id}
                name={ingredient.name}
                category={ingredient.category}
            />
        ))}
    </ul>
    
    </>
  )
}

export default MagazineDashboard
