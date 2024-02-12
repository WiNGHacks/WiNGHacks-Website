import React, {forwardRef} from 'react'

const Schedule = ({}, ref) => {
  return (
    <div ref = {el => ref.current = { ...ref.current, schedule: el }} >
        <div style={{paddingTop:"1rem", paddingBottom:"1rem"}} className='margins'>
          <h1 >Schedule</h1>
          <p>More information coming soon...</p>
        </div>
    </div>
  )
}

export default forwardRef(Schedule)