import React from 'react';
import Card from '../../shared/components/UIElements/Card';
import { useNavigate } from 'react-router-dom';
import './MagazineDashboardItem.css'

const MagazineDashboardItem = (props) => {
    const navigate = useNavigate();

    const handleButtonClick = () => {
        // Navigate to the new route with the ingredient ID in the URL
        navigate(`/magazine/${props.name}`, {
            state: {
                name: props.name,
                category: props.category,
                id: props.id,
                image: props.image
            }
        });
    };

    return (
        <>
            <li className='one-item'>
                <Card className='ingredient-item__content'>
                    <div className='ingredient-item__info'>
                        <h2>{props.name}</h2>
                        <h3>{props.category}</h3>
                        <img src={`http://localhost:8000/${props.image}`} className='ingredient-image' alt={props.name} />
                    </div>
                    <div className='ingredient-item__actions'>
                        <button type="button" className='ingredient-details-button ' onClick={handleButtonClick}>
                            Przejdź do składnika
                        </button>
                        <button type="button" className='delete-ingredient-template ' onClick={handleButtonClick}>
                            Usuń składnik
                        </button>
                    </div>
                </Card>
            </li>
        </>
    );
};

export default MagazineDashboardItem;
