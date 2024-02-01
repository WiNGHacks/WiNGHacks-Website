import React, {forwardRef} from 'react'

const Schedule = ({}, ref) => {
  return (
    <div ref = {el => ref.current = { ...ref.current, schedule: el }} >
        <h1>Schedule</h1>
    </div>
  )
}

export default forwardRef(Schedule)