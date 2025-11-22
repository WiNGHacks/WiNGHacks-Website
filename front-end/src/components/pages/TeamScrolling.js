import React,{useState, useEffect, forwardRef} from 'react'
import logos from '../pictures/WiNGHacks_logo.png'

import CommitteeMemberItem from './CommitteeMemberItem.js'
import { MemberList } from '../data/MemberList.js'

export default function TeamScrolling() {
    const committeeNames =["All", "Directors", "Awards", "PR", "Merch", "Operations", "Sponsorship", "Tech-support", "Website", "Workshop"]; 
      
      const [filterCommittee,setFilterCommittee] = useState("")  
      const updateFilterCommittee = (committeeName) => {
        setFilterCommittee(committeeName)
      }
    

    return (
        <div>
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
    )
}