import React from 'react';
import Card from '../../shared/components/UIElements/Card';
import { useNavigate } from 'react-router-dom';

const MagazineDashboardItem = (props) => {
    const navigate = useNavigate();

    const handleButtonClick = () => {
        // Navigate to the new route with the ingredient ID in the URL
        navigate(`/magazine/${props.name}`, {
            state: {
                name: props.name,
                category: props.category,
                id: props.id
            }
        });
    };

    return (
        <>
            <li>
                <Card className='place-item__content'>
                    <div className='place-item__info'>
                        <h2>{props.name}</h2>
                        <h3>{props.category}</h3>
                    </div>
                    <div className='place-item__actions'>
                        <button type="button" className='add-to-cart-button' onClick={handleButtonClick}>
                            Przejdź do składnika
                        </button>
                    </div>
                </Card>
            </li>
        </>
    );
};

export default MagazineDashboardItem;
