import React, { useEffect } from 'react'
import { useNavigate } from "react-router-dom";

const ApplicationForm = () => {

    let navigate = useNavigate()

    return (
        <div>
                <iframe 
                    src="https://docs.google.com/forms/d/e/1FAIpQLSeRDiFlg7Q_PpeeKp3sNttnm2NZug_kEd3iClboBDOO2oAwCw/viewform?embedded=true" 
                    width="640" 
                    height="382" 
                    frameborder="0" 
                    marginheight="0" 
                    marginwidth="0"
                >
                    Loading…
                    Hello
                </iframe>
        </div>
    )
}

export default ApplicationForm