import React,{ forwardRef} from 'react'
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import draggin from "../pictures/characters/draggin.png"
import { AwardList } from '../data/AwardList';




const Awards = ({}, ref) => {

    const responsive = {
        superLargeDesktop: {
          // the naming can be any, depends on you.
          breakpoint: { max: 4000, min: 1300 },
          items: 4,
          slidesToSlide: 2,
        },
        desktop: {
          breakpoint: { max: 1300, min: 1000 },
          items: 3,
        },
        tablet: {
          breakpoint: { max: 1000, min: 750 },
          items: 2,
        },
        mobile: {
          breakpoint: { max: 750, min: 0 },
          items: 1,
        },
      };

  return (
    <div ref={el => ref.current = { ...ref.current, about: el }}>
      <div className='Page Awards'>
        <h1>Awards</h1>
        <Carousel showDots={true} responsive={responsive}>
        {AwardList.map((award) => (

            <div className="card" key={award.id}>
                        
            <img className="product-image" src={award.logo_image} alt="product image" />
            <div className='content'>
                <h2 className='title'>Best Overall Award</h2>
                <p className='description'>Awarded to unparalleled excellence in a project's innovation and execution.</p>
                {/* <p>
                    <button>Add to Cart</button>
                </p> */}
            </div>
            </div>
            
            ))}
{/* 
<a key={sponsor.id} href={sponsor.url} target="_blank" rel="noopener noreferrer">
                <img src={sponsor.logo_image} alt={sponsor.alt} />
            </a> */}
        
        <div className="card">
            <img className="product-image" src={draggin} alt="product image" />
            <h2>Name</h2>
            <p className="price">Price</p>
            <p>Description</p>
            <p>
                <button>Add to Cart</button>
            </p>
        </div>
        <div className="card">
            <img className="product-image" src={draggin} width={100} alt="product image" />
            <h2>Name</h2>
            <p className="price">Price</p>
            <p>Description</p>
            <p>
                <button>Add to Cart</button>
            </p>
        </div>
        <div className="card">
            <img className="product-image" src={draggin} width={100} alt="product image" />
            <h2>Name</h2>
            <p className="price">Price</p>
            <p>Description</p>
            <p>
                <button>Add to Cart</button>
            </p>
        </div>
        <div className="card">
            <img className="product-image" src={draggin} width={100} alt="product image" />
            <h2>Name</h2>
            <p className="price">Price</p>
            <p>Description</p>
            <p>
                <button>Add to Cart</button>
            </p>
        </div>
        <div className="card">
            <img className="product-image" src={draggin} width={100} alt="product image" />
            <h2>Name</h2>
            <p className="price">Price</p>
            <p>Description</p>
            <p>
                <button>Add to Cart</button>
            </p>
        </div>
          
        </Carousel>
      </div>
    </div>
  )
}

export default forwardRef(Awards)