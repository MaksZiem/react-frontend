import React from 'react'
import Button from '../../../shared/components/FormElements/Button'
import IngredientItem from './IngredientItem'
import Card from '../../../shared/components/UIElements/Card';
import IngredientWasteItem from './IngredientWasteItem';
// import './IngredientWasteList.css';

const IngredientWasteList = (props) => {
  

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
      <div className="place-list-form-placeholder-ingredient">
        <div className="ingredients-list-desc">
          <span className="item-name-ingredient">Nazwa</span>
          <span className="item-category">Średnie dzienne zużycie</span>
          <span className="item-category">Szansa na brak zapasów</span>
          <span className="item-category">Dni do wyczerpania zapasów</span>
        </div>
        </div>
    <ul className="place-list-form-ingredient">      
        {props.ingredientTemplates.map((ingredient, index) => (
            <IngredientWasteItem
                key={ingredient.id}
                daysUntilOutOfStock={ingredient.daysUntilOutOfStock}
                averageDailyUsage={ingredient.averageDailyUsage}
                shortageProbability={ingredient.shortageProbability}
                ingredientName={ingredient.ingredientName}
                isLast={index === props.ingredientTemplates.length - 1} 
            />
        ))}
    </ul>
    
    </>
  )
}

export default IngredientWasteList
