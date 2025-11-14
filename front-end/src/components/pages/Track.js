import React, { forwardRef } from 'react'

const Track = ({}, ref) => {
  return (
    <div ref={el => ref.current = { ...ref.current, track: el }}>
      <div className='Page'>
        <h1>Track</h1>
        <p>To be updated.</p>
      </div>
    </div>
  )
}

export default forwardRef(Track)
