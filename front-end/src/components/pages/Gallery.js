import React , {forwardRef} from 'react'
import ImageGallery from "react-image-gallery";



import jp1 from "../pictures/2024_Gallery/JP_Morgan_SponsorFair.jpg"
import jp2 from "../pictures/2024_Gallery/Chad_JP_Morgan_SponsorFair.jpg"
import opening_ceremony from "../pictures/2024_Gallery/Opening_Ceremony.jpg"
import savannah_sponsor from "../pictures/2024_Gallery/Savannah_SponsorFair.jpg"
import vr from "../pictures/2024_Gallery/VR_Demo.jpg"
import vr2 from "../pictures/2024_Gallery/VR_Demo2.jpg"
import hackers1 from "../pictures/2024_Gallery/Hackers_Opening.jpg"
import mlh from "../pictures/2024_Gallery/MLH_Swag.jpg"
import photobooth from "../pictures/2024_Gallery/Photobooth.jpg"
import awards from "../pictures/2024_Gallery/Awards.jpg"
import hackers2 from "../pictures/2024_Gallery/Hackers2.jpg"
import hackers3 from "../pictures/2024_Gallery/Hackers3.jpg"
import hackers4 from "../pictures/2024_Gallery/Hackers4.jpg"
import hackers5 from "../pictures/2024_Gallery/Hackers5.jpg"
import hackers6 from "../pictures/2024_Gallery/Hackers6.jpg"
import infot1 from "../pictures/2024_Gallery/Jillian_InfoTech.jpg"
import bnym from "../pictures/2024_Gallery/BNY_Mellon.jpg"

import mentors1 from "../pictures/2024_Gallery/Mentors1.jpg"
import mentors2 from "../pictures/2024_Gallery/Mentors2.jpg"
import mv from "../pictures/2024_Gallery/Maddie_Vy_Opening.jpg"
import mv2 from "../pictures/2024_Gallery/Maddie_Vy_Best_Founders_Ever.jpg"

import cami_react from "../pictures/2024_Gallery/React_Workshop_Cami.jpg"
import organizers from '../pictures/2024_Gallery/Organizers_Group.jpg'

const images = [
    
    {
        original: opening_ceremony,
        thumbnail: opening_ceremony,
    },
    {
        original: savannah_sponsor,
        thumbnail: savannah_sponsor,
    },
    {
        original: hackers6,
        thumbnail: hackers6,
    },
    {
        original: vr2,
        thumbnail: vr2,
    },
    {
        original: jp1,
        thumbnail: jp1,
        originalHeight: "4000",
        thumbnailHeight: "60",
        thumbnailWidth: "10px",
    },
    {
        original: photobooth,
        thumbnail: photobooth,
    },
    {
        original: awards,
        thumbnail: awards,
    },
    {
        original: mv,
        thumbnail: mv,
    },
    {
        original: mentors2,
        thumbnail: mentors2,
    },
    {
        original: infot1,
        thumbnail: infot1,
    },
    {
        original: mv2,
        thumbnail: mv2,
        originalHeight: "4000",
        thumbnailHeight: "60",
        thumbnailWidth: "10px",
    },
    {
        original: organizers,
        thumbnail: organizers,
    },
    {
        original: hackers4,
        thumbnail: hackers4,
    },
    {
        original: bnym,
        thumbnail: bnym,
        originalHeight: "4000",
        thumbnailHeight: "60",
        thumbnailWidth: "10px",
    },
    {
        original: hackers1,
        thumbnail: hackers1,
    },
    {
        original: vr,
        thumbnail: vr,
    },
    {
        original: hackers2,
        thumbnail: hackers2,
    },
    {
        original: jp2,
        thumbnail: jp2,
    },
    {
        original: mlh,
        thumbnail: mlh,
    },
    {
        original: cami_react,
        thumbnail: cami_react,
    },
    {
        original: hackers3,
        thumbnail: hackers3,
    },
    {
        original: mentors1,
        thumbnail: mentors1,
    },
    {
        original: hackers5,
        thumbnail: hackers5,
    },
  
]


const GalleryWall = ({}, ref) => {

  return (
    <div ref = {el => ref.current = { ...ref.current, gallerywall: el }}>
     <div className='margins Gallery' id="gallerywall">
        <ImageGallery items={images} 
                        autoPlay = "autoPlay"
                        showBullets = {true}
                        originalAlt = 'Gallery Image'
                        thumbnailAlt = 'Gallery Thumbnail Image'
        />
      </div>
    </div>
  )
}

// const GalleryWall = forwardRef((props, ref) => {
//     return (
//       <div className="margins Gallery" id="gallerywall" ref={ref}>
//         <ImageGallery items={images} autoPlay={true} showBullets={true} />
//       </div>
//     );
//   });

  export default forwardRef(GalleryWall)