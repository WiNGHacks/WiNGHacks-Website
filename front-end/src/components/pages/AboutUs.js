import React, {forwardRef} from 'react'
import logos from '../pictures/WiNGHACKS_Logo_sansWings.png'

import wicse from '../pictures/org_logos/wicse_logo.png'
import csk from '../pictures/org_logos/csk_logo.png'
import gwc from '../pictures/org_logos/gwc_logo.jpeg'
import wece from '../pictures/org_logos/wece_logo.jpeg'
import wicys from '../pictures/org_logos/wicys_logo.jpeg'

import headshots from '../pictures/characters/littleLady.PNG'
import headshots2 from '../pictures/characters/Frogger.PNG'

const AboutUs = ({}, ref) => {

  const text = `
  WiNGHacks is the University of Florida’s (UF) first hackathon specifically created for women and nonbinary students. WiNgHacks gives Women and Nonbinary students the wings that uplift them in their technology journeys. During WiNgHacks, 200 attendees from both UF and neighboring schools will learn new skills, network with their peers, and create innovative projects. 
  The goal of our hackathon is to be a welcoming opportunity for learning and growth for underrepresented genders in the tech industry. Hackathons are great opportunities for students to learn new skills, network, and get a project on their resume, and we want to create an inclusive and welcoming environment for women and nonbinary students, especially those who are first-time hackers, to reap the benefits and opportunities that hackathons have. 

`;
  const committeeNames =["Main Organizers", "Awards", "Budget", "PR", "Merch", "Operations", "Sponsorship", "Tech-Support", "Website", "Workshop"];

  return (
    <div ref={el => ref.current = { ...ref.current, about: el }}>
      <div className='Page About'>
        <div className='mission-container'>
          <h1>WiNGHacks are the wings that uplift women, nonbinary people, and gender minorities.</h1>
          {/* <p>{text}</p> */}
        </div>
        <div className='who-we-are-container'>
          <div className='who-we-are-child-container'>
            <h2>Who we are</h2>
            <p>{text}</p>
          </div>
          <div className='who-we-are-child-container'>
            <div className='collaborators-container'>
              {/*MARIA-How to use variable to store the logos so don't have to repeat img every time?*/}
                <a href="https://ufwicse.com" target="_blank"><img  src={wicse} className='logo-who-we-are' alt='WiNGHacks WiCSE Logo'></img></a>
                <img  src={csk} className='logo-who-we-are' alt='WiNGHacks CSK Logo'></img>
                <img  src={gwc} className='logo-who-we-are' alt='WiNGHacks Girls Who Code Logo'></img>
                <img  src={wece} className='logo-who-we-are' alt='WiNGHacks Collaborator Logo'></img>
                <img  src={wicys} className='logo-who-we-are' alt='WiNGHacks Collaborator Logo'></img>
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

export default forwardRef(AboutUs)

