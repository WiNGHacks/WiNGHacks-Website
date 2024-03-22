
import React,{ forwardRef} from 'react'

const Awards = ({}, ref) => {

  return (
    <div ref={el => ref.current = { ...ref.current, about: el }}>
      <div className='Page awards'>
        <h1>Awards</h1>
      </div>
    </div>
  )
}

export default forwardRef(Awards)

