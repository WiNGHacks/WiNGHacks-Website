import React, { forwardRef } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { TrackList } from '../data/TrackList';

const Track = ({}, ref) => {
  const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 1300 }, items: 4, slidesToSlide: 2 },
    desktop:           { breakpoint: { max: 1300, min: 1000 }, items: 3 },
    tablet:            { breakpoint: { max: 1000, min: 750 },  items: 2 },
    mobile:            { breakpoint: { max: 750,  min: 0 },   items: 1 },
  };
  
  return (
    <div ref={el => ref.current = { ...ref.current, track: el }}>
      <div className='Page Track'>
        <h1>Tracks</h1>
        <Carousel responsive={responsive} showDots={true}>
          {TrackList.map(track => (
            <div className="card" key={track.id}>
              {track.icon && <img className="product-image" src={track.icon} alt={track.title} />}
              <div className="content">
                <h3 className="title">{track.title}</h3>
                <p className="description">{track.description}</p>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  )
}

export default forwardRef(Track)
