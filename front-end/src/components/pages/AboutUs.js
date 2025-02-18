
import React,{useState, useEffect, forwardRef} from 'react'
import logos from '../pictures/WiNGHacks_logo.png'

import CommitteeMemberItem from './CommitteeMemberItem.js'
import { MemberList } from '../data/MemberList.js'

import mushroom from "../pictures/characters/Mushwoom.PNG"

const AboutUs = ({}, ref) => {

  const text = 'The goal of our hackathon is to create a welcoming learning and growing environment for underrepresented genders in the tech industry. We hope to remove the barrier of entry to these events for many people, especially first-time hackers, and help them reap the many benefits that hackathons bring.'
  const committeeNames =["All", "Directors", "Awards", "PR", "Merch", "Operations", "Sponsorship", "Tech-support", "Website", "Workshop"]; 
  
  const [filterCommittee,setFilterCommittee] = useState("")  
  const updateFilterCommittee = (committeeName) => {
    setFilterCommittee(committeeName)
  }

  return (
    <div ref={el => ref.current = { ...ref.current, about: el }}>
      <div className='Page About'>
        <div className='mission-container'>
          <h1>WiNGHacks are the wings that uplift women, nonbinary people, and gender minorities.</h1>
        </div>
        <div className='who-we-are-container'>
          <div className='who-we-are-child-container'>
            <h2>Who We Are</h2>
            <p>
              <span style={{fontWeight: "bolder"}}>WiNGHacks</span> is the University of Florida (UF)'s first hackathon specifically created to uplift <span style={{fontWeight: "bolder"}}>W</span>omen, <span style={{fontWeight: "bolder"}}>N</span>on-binary and <span style={{fontWeight: "bolder"}}>G</span>ender-nonconforming students in their technology journey. During the 36 hours of WiNGHacks, 180 hackers will learn new skills, network with their peers, and create innovative projects for a chance to win category prizes.
            </p>
            <p>{text}</p>
          </div>
          <div className='who-we-are-child-container'>
            <a href= "https://www.instagram.com/winghacks/" target="_blank"><img  src={logos} className='logo-who-we-are' alt='WiNGHacks Collaborator Logo'></img></a>
          </div>
        </div>
        <h2>About the Event</h2>
        {/* <img src={mushroom} className='little-guy'/> */}
        <div className = "location-container">
          <div className = "location-child-container">
            <p>WiNGHacks will be hosted on February 7 - 9, 2025 at the <a style={{color: "#4da99e"}} href="https://maps.app.goo.gl/jM9GABPNd8B3tsis5" target="_blank">Newell Hall</a>. Hacking starts at 7 PM Friday and ends at 7 AM Sunday, for a total of 36 hours.</p>
          </div>
          <div className = "location-child-container">
          <div className="map">
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3467.4373091648654!2d-82.34754972446129!3d29.649081975125068!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88e8a302d12c18a5%3A0x514d5a7f4fe6619c!2sNewell%20Hall!5e0!3m2!1sen!2sus!4v1733197737438!5m2!1sen!2sus"  allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
          </div>
          </div>

        </div>
      
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
                  if (member.committee_name === filterCommittee) {
                     return   ( <div>
                     <CommitteeMemberItem  name={member.name} 
                     image={member.profile_pic} position={member.committee_position}
                    linkedIn = {member.linkedIn}/> 
                    </div>)
                  }
                  else if (filterCommittee === "All" || filterCommittee === "") {
                    return    ( <div>
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

