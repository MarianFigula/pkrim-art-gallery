import {ArtImage} from "../artImage/artImage";


export default function CartItem({artTitle,imgUrl, authorName, price, onClick}){


    return (
        <>
            <div className="cart-item mb-3">
                <div className="cart-art-info">
                    <div className="cart-image" onClick={onClick}>
                        <ArtImage imgUrl={imgUrl}/>
                    </div>
                    <div>
                        <h2>{artTitle}</h2>
                        <p>By {authorName}</p>
                    </div>
                </div>
                <div className="cart-art-management">
                    <h3 className="price">{price} €</h3>
                    <i className="bi bi-trash-fill"></i>
                </div>
            </div>
        </>
    )
}