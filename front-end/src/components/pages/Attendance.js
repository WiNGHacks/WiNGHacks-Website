import React, { useState, useEffect, forwardRef } from 'react';

const Attendance = forwardRef((props, ref) => {
  return (
    <div ref={el => ref && (ref.current = { ...ref.current, attendance: el })} style={styles.container}>
      <div style={styles.box}>
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSdwnGfsvj-5Su6lTPg4DjihHmxrYzDqtKy-jWDQKhQskOm9OA/viewform?embedded=true"
          width="100%"
          height="1453"
          frameBorder="0"
          marginHeight="0"
          marginWidth="0"
          style={styles.iframe}
        >
          Loading…
        </iframe>
      </div>
    </div>
  );
});

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '3% 5%',
  },
  box: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '25px',
    boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
    width: '100%',
    maxWidth: '800px',
  },
  iframe: {
    borderRadius: '15px',
  },
};

export default Attendance;