import axios from 'axios';
import React, {useState, useEffect} from 'react'
import Select from 'react-select'
import ClipLoader from "react-spinners/ClipLoader";


const RSVPForm = ({id, setAlreadyRSVP, firstName, lastName}) => {
    const [userId, setUserId] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [remindSignedUp, setRemindSignedUp] = useState(false);
    const [mealPreference, setMealPreference] = useState("");
    const [dietRestriction, setDietRestriction] = useState("");
    const [merchOptIn, setMerchOptIn] = useState(false);
    const [mlhAccept, setMLHAccept] = useState(false);
    const [selectedRSVP, setSelectedRSVP] = useState("");
    const [submitedClicked, setSubmitClicked] = useState(false)
    const [missingFormValue, setMissingFormValue] = useState(true);

    // Handle change function
    const handleRSVPChange = selectedRSVP => {
        setSelectedRSVP(selectedRSVP.value);
    };

    const rsvpOption = [
        { value: '', label: 'Select...' },
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' }
        ]

    const updateAcceptance = () => {
        // console.log()
        axios.put(`${process.env.REACT_APP_UPDATE_RSVP_API_URL}${id}`, {acceptedRSVP: selectedRSVP})
        .then((response) => {
            console.log(response)
            setSelectedRSVP("")
            setAlreadyRSVP(true)
            setSubmitClicked(false)
        })
        .catch((error) => {
            console.log(error)
        })
    }

    const headers = {
        "Content-Type": "text/plain;charset=utf-8",
    }

    const addRSVPToGoogleSheet = () => {
        const data = {
            email: email,
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber,
            remindSignedUp: remindSignedUp,
            mealPreference: mealPreference,
            dietRestriction: dietRestriction,
            merchOptIn: merchOptIn,
            mlhAccept: mlhAccept
        }
        console.log(data)
        console.log(headers)
        axios.post(process.env.REACT_APP_ADD_RSVP_TO_GOOGLE_SHEET, data, {headers})
        .then(response => {
            console.log(response)
        })
        .catch((e) => {
            console.log(e)
        })
    }

    const submitRSVPForm = () => {
        setSubmitClicked(true)
        const data = {
            userId: id,
            firstName: firstName,
            lastName: lastName,
            email: email,
            phoneNumber: phoneNumber,
            remindSignedUp: remindSignedUp,
            mealPreference: mealPreference,
            dietRestriction: dietRestriction,
            merchOptIn: merchOptIn,
            mlhAccept: mlhAccept
        }
        console.log(data)
        axios.post(process.env.REACT_APP_ADD_RSVP_FORM, data)
        .then((response) => {
            console.log(response)
            addRSVPToGoogleSheet()
            updateAcceptance()
            
        })
        .catch(e => {
            console.log(e)
        })
    }

    useEffect(() => {
        if(email && phoneNumber 
            && remindSignedUp && mealPreference 
            && dietRestriction && merchOptIn
            && mlhAccept && selectedRSVP){
            setMissingFormValue(false)
        } 
        else {setMissingFormValue(true)}
    })

  return (
    <div>
        <Select
            placeholder="Your decision..."
            value={selectedRSVP.value}
            onChange={handleRSVPChange}
            options={rsvpOption}
            // isDisabled = {alreadyRSVP}
        />  

        {selectedRSVP === "yes" ?
            (
                <div>
                    <input
                        onChange={(e) => {setEmail(e.target.value)}}
                        type="email"
                        placeholder='Enter email'
                    />
                    <p/>
                    <input
                        onChange={(e) => {setPhoneNumber(e.target.value)}}
                        type="phoneNumber"
                        placeholder='Enter phone number'
                    />
                    <p/>
                    <label>
                        <input 
                            type="checkbox" 
                            onChange={() => {setRemindSignedUp(!remindSignedUp)}} 
                        />
                        I have signed up for the REMIND newsletter to get all  the latest updates about our events and activities!
                    </label>
                    <p/>
                    <input
                        onChange={(e) => {setMealPreference(e.target.value)}}
                        placeholder='Enter meal preference'
                    />
                    <p/>
                    <input
                        onChange={(e) => {setDietRestriction(e.target.value)}}
                        placeholder='Enter diet restriction'
                    />
                    <p/>
                    <label>
                        <input 
                            type="checkbox" 
                            onChange={() => {setMerchOptIn(!merchOptIn)}} 
                        />
                        I would like to Opt-In for merch!
                    </label>
                    <p/>
                    <label>
                        <input 
                            type="checkbox" 
                            onChange={() => {setMLHAccept(!mlhAccept)}} 
                        />
                        I agree and have read the MLH Agreement.
                    </label>
                    {/* {console.log(email)}
                    {console.log(phoneNumber)}
                    {console.log(remindSignedUp)} */}
                </div>
            
            ):(
                <div/>
            )

        }
        
        {submitedClicked?(
            <div>
                <button className="submitBubble" style={{  pointerEvents: "none"}} align= "center" disabled>
                    <ClipLoader 
                        color='black'
                        loading={submitedClicked}
                        size={10}
                        speedMultiplier ={1}
                        
                    />
                </button>
            </div>
        ):(
            <button 
                onClick={submitRSVPForm} 
                className={missingFormValue ? "disabledButton-rsvp" : 'Button-rsvp' } 
                align= "center" 
                disabled={missingFormValue} 
            > 
                Submit RSVP
            </button>
        )}
        {/* <button 
            className= {selectedRSVP === "" ? "disabledButton-rsvp" : 'Button-rsvp' } 
            disabled = {selectedRSVP === ""} 
            onClick={updateAcceptance}
        >
            Submit RSVP
        </button> */}

    </div>
  )
}

export default RSVPForm