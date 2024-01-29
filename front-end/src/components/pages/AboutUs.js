import React from 'react'
import logos from '../pictures/WiNGHACKS_Logo_sansWings.png'
import headshots from '../pictures/Little_lady.PNG'
import headshots2 from '../pictures/Frogger.PNG'



const text = `
  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Hac habitasse platea dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Enim sed faucibus turpis in eu mi. Porttitor lacus luctus accumsan tortor posuere.
`;
const committeeNames =["Main Organizers", "Awards", "Budget", "PR", "Merch", "Operations", "Sponsorship", "Tech-Support", "Website", "Workshop"];




const AboutUs = () => {
  return (
    <div>
      <div className='About'>
        <div className='mission-container'>
          <h1>Mission</h1>
          <p>{text}</p>
        </div>
        <div className='who-we-are-container'>
          <div className='who-we-are-child-container'>
            <h2>Who we are</h2>
            <p>{text}</p>
          </div>
          <div className='who-we-are-child-container'>
            <div className='collaborators-container'>
              {/*MARIA-How to use variable to store the logos so don't have to repeat img every time?*/}
                <img  src={logos} className='logo-who-we-are' alt='WiNGHacks Collaborator Logo'></img>
                <img  src={logos} className='logo-who-we-are' alt='WiNGHacks Collaborator Logo'></img>
                <img  src={logos} className='logo-who-we-are' alt='WiNGHacks Collaborator Logo'></img>
                <img  src={logos} className='logo-who-we-are' alt='WiNGHacks Collaborator Logo'></img>
                <img  src={logos} className='logo-who-we-are' alt='WiNGHacks Collaborator Logo'></img>
                <img  src={logos} className='logo-who-we-are' alt='WiNGHacks Collaborator Logo'></img>
            </div>
          
          </div>
        </div>
        <h2>Meet the Team</h2>
        <div className='team-container'>
            <div className='team-child-container'>
              <div className = 'btn-committee-names'>
              {/*MARIA-How to use committee name array so don't have to repeat button every time?*/}
                <button>Main Organizers</button>
                <button>Website</button>
                <button>Merch</button>
              </div>

            </div>
            <div className='team-child-container'>
              <div className = 'committeeMembers-container'>
                <img  src={headshots} className='headshot' alt='WiNGHacks member photo'></img>
                <img  src={headshots2} className='headshot' alt='WiNGHacks member photo'></img>
              </div>

            </div>
        </div>
      </div>
    </div>
  )
}

export default AboutUs

