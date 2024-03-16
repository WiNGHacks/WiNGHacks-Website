import React, {useEffect, useState} from 'react'
import axios from "axios";
import Papa from 'papaparse';

const FetchResponse = ({ email, id, status}) => {
    const [csvData, setCsvData] = useState([]);
    const [applied, setApplied] = useState(false)


    const parseCSV = (csvText) => {
        const parsedData = Papa.parse(csvText, { header: true });
        const extractedData = parsedData.data.map(row => ({
            FirstName: row['First Name'],
            LastName: row['Last Name'],
            EmailAddress: row['Email Address'],
            Internal_Status: row['Internal_Status'],
            Public_Status: row['Public_Status']
        }));
        // console.log('Extraction completed');
        // console.log(extractedData); // Output the extracted data
        return extractedData
    
      };


     // Fetch Data from Google Sheet
    useEffect(() => {
        const csvUrl = process.env.REACT_APP_GOOGLE_SHEET_URL;
        axios.get(csvUrl)    // Use Axios to fetch the CSV data
        .then((response) => {
            // console.log(response.data)
            const parsedCsvData = parseCSV(response.data);        // Parse the CSV data into an array of objects
            setCsvData(parsedCsvData);
            // handleCsvData(parsedCsvData); 
      // Set the fetched data in the component's state
            // console.log(parsedCsvData);        // Now you can work with 'csvData' in your component's state.
        })
        .catch((error) => {
            console.error('Error fetching CSV data:', error);
        });
    }, []); 

    useEffect(() => {
        // console.log(csvData)
        csvData?.map((submissions) => {
            // console.log(submissions["Email Address"])
            let lowerCaseEmail = submissions.EmailAddress?.toLowerCase()
            // console.log(lowerCaseEmail)
            if (lowerCaseEmail === email && submissions.Public_Status !== status){
                if (status === "Not Applied"){
                    // console.log(status)
                    axios.put(`${process.env.REACT_APP_UPDATE_STATUS_API_URL}${id}`, 
                        {status: "Applied"}
                    )
                    .then((response) => {           
                        window.location.reload();

                    })

                
                }
                else if (submissions.Public_Status !== "" ){
                    axios.put(`${process.env.REACT_APP_UPDATE_STATUS_API_URL}${id}`, {status: submissions.Public_Status})
                    .then((response) => {
                        window.location.reload();
                    })
                    .catch((error) => {
                        console.log(error)
                    })
                
                }
               
            }
        })

    })


      

    return (
        <div></div>
    )
}

export default FetchResponse