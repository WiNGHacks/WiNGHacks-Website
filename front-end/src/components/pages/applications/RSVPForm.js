import axios from 'axios';
import React, {useState, useEffect} from 'react'
import Select from 'react-select'
import ClipLoader from "react-spinners/ClipLoader";
import MLHCoC from "./../../data/MLHCoC.pdf"


const RSVPForm = ({id, setAlreadyRSVP, firstName, lastName}) => {
    const [userId, setUserId] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [remindSignedUp, setRemindSignedUp] = useState(false);
    const [mealPreference, setMealPreference] = useState([]);
    const [dietRestriction, setDietRestriction] = useState("");
    const [merchOptIn, setMerchOptIn] = useState(false);
    const [mlhAccept, setMLHAccept] = useState(false);
    const [mlhShareData, setMLHShareData] = useState(false);
    const [mlhSendEmail, setMLHSendEmail] = useState(false);
    const [selectedRSVP, setSelectedRSVP] = useState("");
    const [submitedClicked, setSubmitClicked] = useState(false)
    const [missingFormValue, setMissingFormValue] = useState(true);

    // Handle change function
    const handleRSVPChange = selectedRSVP => {
        setSelectedRSVP(selectedRSVP.value);
    };


  const downloadPDF = () => {
    const pdfUrl = MLHCoC;
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = "MLH_Code_of_Conduct.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
   }

   const handleMealPreferenceChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
        setMealPreference([...mealPreference, value]);
    } else {
        setMealPreference(mealPreference.filter(pref => pref !== value));
    }
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
        const mealPref = mealPreference.join(', ')
        const data = {
            email: email,
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber,
            remindSignedUp: remindSignedUp,
            mealPreference: mealPref,
            dietRestriction: dietRestriction,
            mlhAccept: mlhAccept,
            mlhShareData: mlhShareData,
            mlhSendEmail: mlhSendEmail
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
        const mealPref = mealPreference.join(', ')
        setSubmitClicked(true)
        const data = {
            userId: id,
            firstName: firstName,
            lastName: lastName,
            email: email,
            phoneNumber: phoneNumber,
            remindSignedUp: remindSignedUp,
            mealPreference: mealPref,
            dietRestriction: dietRestriction,
            merchOptIn: merchOptIn,
            mlhAccept: mlhAccept,
            mlhShareData: mlhShareData,
            mlhSendEmail: mlhSendEmail
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
            && remindSignedUp && mealPreference.length > 0 
            && dietRestriction && mlhAccept 
            && selectedRSVP === "yes" && mlhShareData){
            setMissingFormValue(false)
        } 
        else if (selectedRSVP === "no"){
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
                    <label>
                        Meal preference (Required)
                        <br/>
                        <input type="checkbox" id="option1" name="option1" value="Saturday Breakfast" onChange={handleMealPreferenceChange}/>
                        <label for="option1">Saturday Breakfast</label><br/>

                        <input type="checkbox" id="option2" name="option2" value="Saturday Lunch" onChange={handleMealPreferenceChange}/>
                        <label for="option2">Saturday Lunch</label><br/>

                        <input type="checkbox" id="option3" name="option3" value="Saturday Dinner" onChange={handleMealPreferenceChange}/>
                        <label for="option3">Saturday Dinner</label><br/>

                        <input type="checkbox" id="option4" name="option4" value="Sunday Breakfast/Brunch" onChange={handleMealPreferenceChange}/>
                        <label for="option4">Sunday Breakfast/Brunch</label><br></br>

                        <input type="checkbox" id="option5" name="option5" value="I don't plan to eat at the venue" onChange={handleMealPreferenceChange}/>
                        <label for="option4">I don't plan to eat at the venue</label><br></br>
                        {console.log(mealPreference)}

                        {/* Hidden input field with the value set to the string of selected preferences */}
                        {/* <input type="hidden" id="mealPreference" name="mealPreference" value={mealPreference.join(', ')} /> */}
                    </label>
                    {/* <p/>
                    <input
                        onChange={(e) => {setMealPreference(e.target.value)}}
                        placeholder='Enter meal preference'
                    /> */}
                    <p/>
                    <input
                        onChange={(e) => {setDietRestriction(e.target.value)}}
                        placeholder='Do you have any dietary restrictions? (Leave blank if N/A)'
                    />
                    <p/>
                    <label>
                        <input 
                            type="checkbox" 
                            onChange={() => {setMLHAccept(!mlhAccept)}} 
                        />
                        &nbsp; I have read and agree to the 
                        <a target="_blank" rel="noopener noreferrer" style={{color: "blue"}} onClick={downloadPDF}> MLH Code of Conduct</a>. (Required)
                    </label>
                    <p/>
                    <label>
                        <input 
                            type="checkbox" 
                            onChange={() => {setMLHShareData(!mlhShareData)}} 
                        />
                        &nbsp; I authorize you to share my application/registration information with Major League Hacking for event administration, ranking, and MLH administration in-line with the 
                        <a target="_blank" rel="noopener noreferrer" href='https://mlh.io/privacy'> MLH Privacy Policy</a>. I further agree to the terms of both the 
                        <a target="_blank" rel="noopener noreferrer" href='https://github.com/MLH/mlh-policies/blob/main/contest-terms.md'> MLH Contest Terms and Conditions</a> and the 
                        <a target="_blank" rel="noopener noreferrer" href='https://mlh.io/privacy'> MLH Privacy Policy</a>. (Required)
                    </label>
                    <p/>
                    <label>
                        <input 
                            type="checkbox" 
                            onChange={() => {setMLHSendEmail(!mlhSendEmail)}} 
                        />
                        &nbsp; I authorize MLH to send me occasional emails about relevant events, career opportunities, and community announcements. (Optional)
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