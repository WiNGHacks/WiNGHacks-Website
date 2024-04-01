import React, { forwardRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Carousel from 'react-bootstrap/Carousel';

import Best_Overall from '../pictures/characters/gifs/Littlelady.gif';
import First_Flight from '../pictures/characters/gifs/flier.gif';
import Peoples_Choice from '../pictures/characters/gifs/penguin.gif';
import Best_WiNG from '../pictures/characters/gifs/frogger.gif';
import Best_Game from '../pictures/characters/gifs/mushwoom.gif';
import Best_XR from '../pictures/characters/gifs/draggin.gif';
import Sponsor_Placeholder from '../pictures/characters/gifs/seabutterfly.gif';


const Awards = ({}, ref) => {
  return (
    <div ref={el => ref.current = { ...ref.current, awards: el }}>
      <div className="Page">
        <h1>Awards</h1>
        <Carousel slide={true} wrap={false}>
          <Carousel.Item interval={1000}>
            <div className='carousel-item-container'>
              <Card style={{ height: '30rem',width: '18rem' }}>
                <Card.Img className='card-image' variant="top" src={Best_Overall}/>
                <Card.Body>
                  <Card.Title>Best Overall Award</Card.Title>
                  <Card.Text>
                    Awarded to unparalleled excellence in a project's innovation and execution.
                  </Card.Text>
                  <div className='awards-tag'>General</div>
                  {/* <Button style={{backgroundColor: '#00AFB9', borderColor: '#00AFB9'}} className="award-tags">General</Button> */}
                </Card.Body>
              </Card>
            </div>
            <div className='carousel-item-container'>
              <Card style={{  height: '30rem',width: '18rem'  }}>
                <Card.Img className='card-image' variant="top" src={First_Flight} />
                <Card.Body>
                  <Card.Title>First Flight Award </Card.Title>
                  <Card.Text>
                  Given to a team made up of only first-time hackers; shows exemplary performance in their first hackathon.
                  </Card.Text>
                  <div className='awards-tag'>General</div>
                </Card.Body>
              </Card>
            </div>
            <div className='carousel-item-container'>
              <Card style={{ height: '30rem',width: '18rem'  }}>
                <Card.Img className='card-image' variant="top" src={Peoples_Choice} />
                <Card.Body>
                  <Card.Title>People's Choice Award</Card.Title>
                  <Card.Text>
                  Voted on through DevPost during a set amount of time once the competition ends.
                  </Card.Text>
                  <div className='awards-tag'>General</div>
                </Card.Body>
              </Card>
            </div> 
          </Carousel.Item>
          <Carousel.Item interval={800}>
            <div className='carousel-item-container'>
            <Card style={{ height: '30rem',width: '18rem' }}>
                <Card.Img className='card-image' variant="top" src={Best_WiNG} />
                <Card.Body>
                  <Card.Title>Best WiNG Hack</Card.Title>
                  <Card.Text>
                  Best tackles an issue related to women, gender-nonconforming and/or marginalized communities.
                  </Card.Text>
                  <div className='awards-tag'>Category</div>
                </Card.Body>
              </Card>
            </div>
            <div className='carousel-item-container'>
              <Card style={{ height: '30rem',width: '18rem' }}>
                <Card.Img className='card-image' variant="top" src={Best_Game} />
                <Card.Body>
                  <Card.Title>Best Game Hack</Card.Title>
                  <Card.Text>
                  Most innovative game designs, including trailblazing mechanics to boundary-breaking narratives.                 
                  </Card.Text>
                  <div className='awards-tag'>Category</div>
                </Card.Body>
              </Card>
            </div>
            <div className='carousel-item-container'>
              <Card style={{height: '30rem',width: '18rem' }}>
                <Card.Img className='card-image' variant="top" src={Best_XR} />
                <Card.Body>
                  <Card.Title>Best XR Hack</Card.Title>
                  <Card.Text>
                  <h6 style={{fontSize: '0.7rem'}}>Supported by Society of PC Building and GatorVR </h6>               
                  Recognizes exceptional use of extended reality as a medium, pushing the boundaries of technological innovation. 
                  </Card.Text>
                  <div className='awards-tag'>Category</div>
                </Card.Body>
              </Card>
            </div>
          </Carousel.Item>
          <Carousel.Item interval={500}>
            <div className='carousel-item-container'>
              <Card style={{ height: '30rem',width: '18rem' }}>
                <Card.Img className='card-image' variant="top" src={Sponsor_Placeholder} />
                <Card.Body>
                  <Card.Title>Sponsor Challenge</Card.Title>
                  <Card.Text>
                  Coming Soon!                 
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
          </Carousel.Item>
        </Carousel>
      </div>
    </div>
  )
}

export default forwardRef(Awards);
