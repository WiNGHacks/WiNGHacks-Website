
import React,{useState, useEffect, forwardRef} from 'react'
import logos from '../pictures/WiNGHACKS_Logo_sansWings.png'

import wicse from '../pictures/org_logos/wicse_logo.png'
import csk from '../pictures/org_logos/csk_logo.png'
import gwc from '../pictures/org_logos/gwc_logo.jpeg'
import wece from '../pictures/org_logos/wece_logo.jpeg'
import wicys from '../pictures/org_logos/wicys_logo.jpeg'

import CommitteeMemberItem from './CommitteeMemberItem.js'
import { MemberList } from '../data/MemberList.js'

const AboutUs = ({}, ref) => {

  const text = 'The goal of our hackathon is to create a welcoming learning and growing environment for underrepresented genders in the tech industry. We hope to remove the barrier of entry to these events for many people, especially first-time hackers, and help them reap the many benefits that hackathons bring.'
  const text2 = 'This event is a joint effort by Women in Computer Science and Engineering (WiCSE), Girls Who Code, CS Kickstart, Women in Cybersecurity (WiCys), and Women in Electrical and Computer Engineering (WECE).'
  const committeeNames =["Directors", "Awards", "PR", "Merch", "Operations", "Sponsorship", "Tech-support", "Website", "Workshop"]; 
  
  const [filterCommittee,setFilterCommittee] = useState("")  
  const updateFilterCommittee = (committeeName) => {
    setFilterCommittee(committeeName)
  }

  return (
    <div ref={el => ref.current = { ...ref.current, about: el }}>
      <div className='Page About'>
        <div className='mission-container'>
          <h1>WiNGHacks are the wings that uplift women, nonbinary people, and gender minorities.</h1>
          {/* <p>{text}</p> */}
        </div>
        <div className='who-we-are-container'>
          <div className='who-we-are-child-container'>
            <h2>Who we Are</h2>
            <p>
              <span style={{fontWeight: "bolder"}}>WiNGHacks</span> is the University of Florida’s (UF) first hackathon specifically created to uplift <span style={{fontWeight: "bolder"}}>W</span>omen, <span style={{fontWeight: "bolder"}}>N</span>on-binary and <span style={{fontWeight: "bolder"}}>G</span>ender minority students in their technology journey. During the 36 hours of WiNGHacks, 200 hackers will learn new skills, network with their peers, and create innovative projects for a chance to win category prizes.
            </p>
            <p>{text}</p>
            <p>{text2}</p>
          </div>
          <div className='who-we-are-child-container'>
            <div className='collaborators-container'>
                <a href="https://ufwicse.com" target="_blank"><img  src={wicse} className='logo-who-we-are' alt='WiNGHacks WiCSE Logo'></img></a>
                <a href="https://www.instagram.com/uf.cskickstart/" target="_blank"><img  src={csk} className='logo-who-we-are' alt='WiNGHacks CSK Logo'></img></a>
                <a href="https://www.instagram.com/girlswhocodeuf/" target="_blank"><img  src={gwc} className='logo-who-we-are' alt='WiNGHacks Girls Who Code Logo'></img></a>
                <a href="https://www.instagram.com/wece_uf/" target="_blank"><img  src={wece} className='logo-who-we-are' alt='WiNGHacks Collaborator Logo'></img></a>
                <img  src={wicys} className='logo-who-we-are' alt='WiNGHacks Collaborator Logo'></img>
                <a href= "https://www.instagram.com/uf.winghacks?igsh=MTdiNThmbmdxNTIwcA==" target="_blank"><img  src={logos} className='logo-who-we-are' alt='WiNGHacks Collaborator Logo'></img></a>
            </div>
          
          </div>
        </div>
        <h2>About the Event</h2>
        <p>WiNGHacks will be hosted on April 5 - 7, 2024 at the Herbert Wertheim Building of Engineering Excellence. Hacking starts at 9 PM Friday and ends at 9 AM Sunday, for a total of 36 hours.</p>
        {/* <div className='info-container'>
          <b className='home-date'>April 5-7</b>
          <b className='home-location'>At the Herbert Wertheim Engineering Building</b>
      </div> */}
        <h2 style={{paddingTop: "3%"}}>Meet the Team</h2>
        <div className='team-container'>
            <div className='team-child-container-names'>
              <div className='btn-committee-names'>
                {committeeNames.map((committeeName, index) =>{
                  return <button onClick={() =>updateFilterCommittee(committeeName)}>{committeeName}</button>
                }
                )
                }
              </div>

            </div>
            <div className='team-child-container-members'>
              <ul className='members'>
                {MemberList.map((member, index) => {
                  if (filterCommittee === ""){
                    return   ( <div>
                      <CommitteeMemberItem  name={member.name} 
                      image={member.profile_pic} position={member.committee_position}
                     linkedIn = {member.linkedIn}/> 
                     </div>)
                  }
                  if (member.committee_name === filterCommittee) {
                     return   ( <div>
                     <CommitteeMemberItem  name={member.name} 
                     image={member.profile_pic} position={member.committee_position}
                    linkedIn = {member.linkedIn}/> 
                    </div>)
                  }
                  
                })}
              </ul>
              
            </div>
        </div>
      </div>
    </div>
  )
}

export default forwardRef(AboutUs)

