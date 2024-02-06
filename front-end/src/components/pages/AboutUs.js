import React from 'react'
import logos from '../pictures/WiNGHACKS_Logo_sansWings.png'

import wicse from '../pictures/org_logos/wicse_logo.png'
import csk from '../pictures/org_logos/csk_logo.png'
import gwc from '../pictures/org_logos/gwc_logo.jpeg'
import wece from '../pictures/org_logos/wece_logo.jpeg'
import wicys from '../pictures/org_logos/wicys_logo.jpeg'
import CommitteeMemberItem from './CommitteeMemberItem.js'
import { MemberList } from '../../data/MemberList'
import $ from 'jquery'


const AboutUs = () => {
  const text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Hac habitasse platea dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Enim sed faucibus turpis in eu mi. Porttitor lacus luctus accumsan tortor posuere.`;
  const committeeNames =["Organizers", "Awards", "PR", "Merch", "Operations", "Sponsorship", "Tech-Support", "Website", "Workshop"]; 

  $(() => {
    $(".btn-committee-names").find("a").on(function (e){
      {/*retrieves value from data-filter */}
      var theFilter = $(this).data('filter');
      e.preventDefault();
      {/*MARIA ATTEMPT TO MAKE BUTTON HOVER COLOR TO STICK*/}
      $(".btn-committee-names").find("a").removeClass("active");
      $(this).addClass("active");

      {/*Only show members in a specific committee*/}
      $(".members").find("li").show();
      $(".members").find("li").not(theFilter).hide();


    });
  });


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
                <img  src={wicse} className='logo-who-we-are' alt='WiNGHacks WiCSE Logo'></img>
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
                {committeeNames.map ( (committeeName, index ) => {
                  const filter = "group" + committeeName
                  return <button id = {index}><a data-filter = {filter}>{committeeName}</a></button>
              })}
              </div>
            </div>
            <div className='team-child-container'>
              <ul className='members'>
                {MemberList.map((member, index) => {
                  const filter = "group" + member.committee_name
                  return <CommitteeMemberItem id= {index} className = {filter} name={member.name} 
                  major={member.major}  image={member.profile_pic} position={member.committee_position}
                  linkedIn = {member.linkedIn}/>
                })}
              </ul>
              
            </div>
        </div>
      </div>
    </div>
  )
}

export default AboutUs

