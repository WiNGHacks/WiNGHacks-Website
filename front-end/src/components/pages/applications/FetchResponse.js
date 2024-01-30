import React, {useEffect, useState} from 'react'
import axios from "axios";

const FetchResponse = ({handleCsvData, email, id, status}) => {
    const [csvData, setCsvData] = useState([]);
    const [applied, setApplied] = useState(false)


     // Fetch Data from Google Sheet
    useEffect(() => {
        const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSIr7JGeg0yoJtahxs1zsx9SgOJjAqH8izxbkhox41YWDuMuBLwbTX54BOKlPBxzBtZPNQPWiRxveDW/pub?output=csv';
        axios.get(csvUrl)    // Use Axios to fetch the CSV data
        .then((response) => {
            const parsedCsvData = parseCSV(response.data);        // Parse the CSV data into an array of objects
            setCsvData(parsedCsvData);
            handleCsvData(parsedCsvData); 
      // Set the fetched data in the component's state
            console.log(parsedCsvData);        // Now you can work with 'csvData' in your component's state.
        })
        .catch((error) => {
            console.error('Error fetching CSV data:', error);
        });
    }, []); 

    useEffect(() => {
        console.log(csvData)
        csvData?.map((submissions) => {
            let lowerCaseEmail = submissions.Email.toLowerCase()
            if (lowerCaseEmail === email && submissions.Status !== status){
                if (status === "Not Applied"){
                    console.log(status)
                    axios.put(`${process.env.REACT_APP_UPDATE_STATUS_API_URL}${id}`, 
                        {status: "Applied"}
                    )
                    .then((response) => {
                        console.log(response.data.message)
                        console.log(response)
                        window.location.reload();
                    })
                }
                else if (submissions.Status !== "" ){
                    console.log(submissions)
                    axios.put(`${process.env.REACT_APP_UPDATE_STATUS_API_URL}${id}`, 
                        {status: submissions.Status}
                    )
                    .then((response) => {
                        console.log(response.data.message)
                        console.log(response)
                        window.location.reload();
    
                    })
                }
               
            }
        })

    })



    
    const parseCSV = (csvText) => {
        const rows = csvText.split(/\r?\n/); // Split CSV text into rows, handling '\r' characters
        const headers = rows[0].split(','); // Extract headers (assumes the first row is the header row)
        const data = []; // Initialize an array to store parsed data
      
        for (let i = 1; i < rows.length; i++) {
          const rowData = rows[i].split(','); // Split the row, handling '\r' characters
          const rowObject = {};
      
          for (let j = 0; j < headers.length; j++) {
            rowObject[headers[j]] = rowData[j];
          }
      
          data.push(rowObject);
        }
      
        return data;
      };
      

    return (
        <div></div>
    )
}

export default FetchResponse