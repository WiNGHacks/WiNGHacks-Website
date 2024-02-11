import React from 'react'

const CommitteeMemberItem = ({name, image, position, linkedIn}) =>{
    const alt_text = name + " profile picture";
    return(
        <div>
            <li>
                <figure>
                    <img src={image} alt = {alt_text}></img>
                    <figcaption>
                        <h3>{name}</h3>
                        <h4>{position}</h4>
                        <a target='_blank' href={linkedIn}>Let's Connect</a>
                    </figcaption>
                </figure>
            </li>
        </div>
    )

}

export default CommitteeMemberItem