import axios from 'axios';
import React, {useState, useEffect} from 'react'
import Select from 'react-select'
import ClipLoader from "react-spinners/ClipLoader";
import MLHCoC from "./../../data/MLHCoC.pdf"


const RSVPForm = ({id, setAlreadyRSVP, firstName, lastName, setRSVPStatus}) => {
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
    const [shirtSize, setShirtSize] = useState("");
    const [selectedRSVP, setSelectedRSVP] = useState("");
    const [submitedClicked, setSubmitClicked] = useState(false)
    const [missingFormValue, setMissingFormValue] = useState(true);

    // Handle change function
    const handleRSVPChange = selectedRSVP => {
        setSelectedRSVP(selectedRSVP.value);
    };

    // Handle change function
    const handleShirtChange = shirtSize => {
        setShirtSize(shirtSize.value);
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
        { value: 'yes', label: 'Yes, I will be attending.' },
        { value: 'no', label: 'No, I choose to decline this offer and will not attend.' }
        ]
    
    const shirtSizeOption = [
        { value: '', label: 'Select...' },
        { value: 'XS', label: 'XS' },
        { value: 'S', label: 'S' },
        { value: 'M', label: 'M' },
        { value: 'L', label: 'L' },
        { value: 'XL', label: 'XL' },
        { value: 'XXL', label: 'XXL' },
        ]
    

    const updateAcceptance = async() => {
        // console.log()
        axios.put(`${process.env.REACT_APP_UPDATE_RSVP_API_URL}${id}`, {acceptedRSVP: selectedRSVP})
        .then((response) => {
            // console.log(response)
            setSelectedRSVP("")
            setAlreadyRSVP(true)
            setSubmitClicked(false)
            setRSVPStatus(selectedRSVP)
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
            mlhSendEmail: mlhSendEmail,
            shirtSize: shirtSize
        }
        // console.log(data)
        // console.log(headers)
        axios.post(process.env.REACT_APP_ADD_RSVP_TO_GOOGLE_SHEET, data, {headers})
        .then(response => {
            // console.log(response)
        })
        .catch((e) => {
            console.log(e)
        })
    }

    const submitRSVPForm = () => {
        setSubmitClicked(true)
        if (selectedRSVP === "yes"){
            const mealPref = mealPreference.join(', ')
            
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
                mlhSendEmail: mlhSendEmail,
                shirtSize: shirtSize
            }
            // console.log(data)
            axios.post(process.env.REACT_APP_ADD_RSVP_FORM, data)
            .then((response) => {
                // console.log(response)
                addRSVPToGoogleSheet()
                updateAcceptance()
                
            })
            .catch(e => {
                console.log(e)
            })
        }
        else if(selectedRSVP === "no"){
            // console.log(selectedRSVP)
            updateAcceptance()
        }
    }

    useEffect(() => {
        if(email && phoneNumber 
             && mealPreference.length > 0 
         && mlhAccept && shirtSize
            && selectedRSVP === "yes" && mlhShareData){
            setMissingFormValue(false)
        } 
        else if (selectedRSVP === "no"){
            setMissingFormValue(false)
        }
        else {setMissingFormValue(true)}
    })

    const [step, setStep] = useState(1);

    const nextStep = () => { setStep(step + 1); };

    const prevStep = () => { setStep(step - 1); };

    const rejectOffer = () => { setStep(5); };

    const returnToFirst = () => { setStep(1); };



  return (
    <div className='RSVP'>
        <form id="msform">
            <ul id="progressbar" className={step === 1 ? 'noDisplay' : ''}>
                <li className={step >= 1 ? 'active' : ''}>Account Setup</li>
                <li className={step >= 2 ? 'active' : ''}>Social Profiles</li>
                <li className={step >= 3 ? 'active' : ''}>Personal Details</li>
                <li className={step >= 4 ? 'active' : ''}>Submit</li>
            </ul>

            {/* Fieldsets */}
            <fieldset style={{ display: step === 1 ? 'block' : 'none' }}>
                {/* <h2 class="fs-title">Create your account</h2> */}
                <h1 className="fs-title congrats">Congratulations!</h1>
                <h3 className="fs-subtitle">You have been selected to participate in WiNGHacks 2024!<br/>
                    Please indicate your attendance as appropriate below.<br/>
                    Should you choose to attend, please fill out the rest of the RSVP form.</h3>
                <Select
                    placeholder="Your decision..."
                    value={selectedRSVP.value}
                    onChange={handleRSVPChange}
                    options={rsvpOption}
                    // isDisabled = {alreadyRSVP}
                    />  
                {selectedRSVP === "yes" ?
                    (<button type="button" className="next action-button" onClick={nextStep}>Next</button>)
                    : 
                    <button 
                        onClick={submitRSVPForm} 
                        className={missingFormValue ? "disabledButton-rsvp" : 'Button-rsvp' } 
                        align= "center" 
                        disabled={missingFormValue} > 
                        Submit RSVP
            </button>
                }
            </fieldset>

            <fieldset style={{ display: step === 2 ? 'block' : 'none' }}>
                <h2 className="fs-title">Contact Information</h2>
                <h3 className="fs-subtitle">We'll keep you updated on announcements!</h3>
                <input 
                        onChange={(e) => {setEmail(e.target.value)}}
                        type="email"
                        placeholder='Enter email'/> <br/>
                <input
                        onChange={(e) => {setPhoneNumber(e.target.value)}}
                        type="phoneNumber"
                        placeholder='Enter phone number'
                    />
                    
                    <br/>

                    

                <button type="button" className="previous action-button" onClick={prevStep}>Previous</button>
                <button type="button" className="next action-button" onClick={nextStep}>Next</button>
            </fieldset>
            <fieldset style={{ display: step === 3 ? 'block' : 'none' }}>
            <h2 className="fs-title">Shirt Size</h2>
                <Select
                    placeholder="Your shirt size..."
                    value={shirtSize.value}
                    onChange={handleShirtChange}
                    options={shirtSizeOption}
                    // isDisabled = {alreadyRSVP}
                    />  
                {/* {console.log(shirtSize)} */}

                
                <h2 className="fs-title">Meal Preferences</h2>
                <h3 className="fs-subtitle">Which meals would you prefer having? (Required)</h3>
                <div className="mealPref">
                    <div className="mealOption">
                        <input type="checkbox" id="option1" name="option1" value="Saturday Breakfast" onChange={handleMealPreferenceChange} />
                        <label htmlFor="option1">Saturday Breakfast</label>
                    </div>
                    <div className="mealOption">
                        <input type="checkbox" id="option2" name="option2" value="Saturday Lunch" onChange={handleMealPreferenceChange} />
                        <label htmlFor="option2">Saturday Lunch</label>
                    </div>
                    <div className="mealOption">
                        <input type="checkbox" id="option3" name="option3" value="Saturday Dinner" onChange={handleMealPreferenceChange} />
                        <label htmlFor="option3">Saturday Dinner</label>
                    </div>
                    <div className="mealOption">
                        <input type="checkbox" id="option4" name="option4" value="Sunday Breakfast/Brunch" onChange={handleMealPreferenceChange} />
                        <label htmlFor="option4">Sunday Breakfast/Brunch</label>
                    </div>
                    <div className="mealOption">
                        <input type="checkbox" id="option5" name="option5" value="I don't plan to eat at the venue" onChange={handleMealPreferenceChange} />
                        <label htmlFor="option5">I don't plan to eat at the venue</label>
                    </div>
                    <br/>

                    <div className='diet'>Please list any dietary restrictions as necessary. (Leave blank if N/A)</div>
            
                    <input
                        onChange={(e) => {setDietRestriction(e.target.value)}}
                        placeholder='Dietary restrictions'
                    />

                    
                </div>

                <button type="button" className="previous action-button" onClick={prevStep}>Previous</button>
                <button type="button" className="next action-button" onClick={nextStep}>Next</button>
                
            </fieldset>

            <fieldset style={{ display: step === 4 ? 'block' : 'none' }}>
                <h2 className="fs-title">Terms and Conditions</h2>
                <h3 className="fs-subtitle">You're almost done!</h3>
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
                    <br/>
                <button type="button" className="previous action-button" onClick={prevStep}>Previous</button>
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
            </fieldset>
            <p>*Inputted information is not saved until submit is clicked </p>
        </form>

        {/* <Select
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
                    </label>
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
                    {console.log(email)}
                    {console.log(phoneNumber)}
                    {console.log(remindSignedUp)}
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
        )} */}
    </div>
  )
}

export default RSVPForm