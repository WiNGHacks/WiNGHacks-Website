import React , {forwardRef} from 'react'
import ImageGallery from "react-image-gallery";

import bny from '../pictures/2025_Gallery/bny.JPG'
import codirectors from '../pictures/2025_Gallery/codirectors.JPG'
import committee from '../pictures/2025_Gallery/committee.JPG'
import committeehearts from '../pictures/2025_Gallery/committeehearts.JPG'
import food1 from '../pictures/2025_Gallery/food1.JPG'
import food2 from '../pictures/2025_Gallery/food2.JPG'
import hackers1 from '../pictures/2025_Gallery/hackers1.JPG'
import hackers2 from '../pictures/2025_Gallery/hackers2.JPG'
import hackers3 from '../pictures/2025_Gallery/hackers3.JPG'
import hackers4 from '../pictures/2025_Gallery/hackers4.JPG'
import jpmorgan from '../pictures/2025_Gallery/jpmorgan.JPG'
import judging1 from '../pictures/2025_Gallery/judging1.JPG'
import judging2 from '../pictures/2025_Gallery/judging2.JPG'
import judging3 from '../pictures/2025_Gallery/judging3.JPG'
import mentor from '../pictures/2025_Gallery/mentor.JPG'
import merch from '../pictures/2025_Gallery/merch.JPG'
import mlh from '../pictures/2025_Gallery/mlh.JPG'
import opening1 from '../pictures/2025_Gallery/opening1.JPG'
import opening2 from '../pictures/2025_Gallery/opening2.JPG'
import opening3 from '../pictures/2025_Gallery/opening3.JPG'
import photospot from '../pictures/2025_Gallery/photospot.jpg'
import prizes from '../pictures/2025_Gallery/prizes.JPG'
import website from '../pictures/2025_Gallery/website.JPG'
import workshop from '../pictures/2025_Gallery/workshop.JPG'


const images = [
    {
        original: committee,
        thumbnail: committee,
    },
    {
        original: prizes,
        thumbnail: prizes,
    },
    {
        original: opening1,
        thumbnail: opening1,
    },
    {
        original: codirectors,
        thumbnail: codirectors,
    },
    {
        original: hackers1,
        thumbnail: hackers1,
    },
    {
        original: mlh,
        thumbnail: mlh,
    },
    {
        original: food1,
        thumbnail: food1,
    },
    {
        original: hackers2,
        thumbnail: hackers2,
    },
    {
        original: photospot,
        thumbnail: photospot,
        originalHeight: "4000",
        thumbnailHeight: "60",
        thumbnailWidth: "10px",
    },
    {
        original: mentor,
        thumbnail: mentor,
    },
    {
        original: opening2,
        thumbnail: opening2,
    },
    {
        original: food2,
        thumbnail: food2,
    },
    {
        original: hackers3,
        thumbnail: hackers3,
    },
    {
        original: jpmorgan,
        thumbnail: jpmorgan,
    },
    {
        original: judging1,
        thumbnail: judging1,
    },
    {
        original: judging2,
        thumbnail: judging2,
    },
    {
        original: bny,
        thumbnail: bny,
    },
    {
        original: opening3,
        thumbnail: opening3,
    },
    {
        original: workshop,
        thumbnail: workshop,
    },
    {
        original: judging3,
        thumbnail: judging3,
    },
    {
        original: website,
        thumbnail: website,
    },
    {
        original: hackers4,
        thumbnail: hackers4,
    },
    {
        original: merch,
        thumbnail: merch,
    },
    {
        original: committeehearts,
        thumbnail: committeehearts,
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

  export default forwardRef(GalleryWall)