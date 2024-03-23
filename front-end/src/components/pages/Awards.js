
import React,{forwardRef} from 'react'

const Awards = ({}, ref) => {
  return (
    <div ref={el => ref.current = { ...ref.current, awards: el }}>
      <div className="bg-black">
        <h1 className="text-7xl text-center text-blue-400">Awards</h1>
      </div>
    </div>
  )
}

export default forwardRef(Awards)

