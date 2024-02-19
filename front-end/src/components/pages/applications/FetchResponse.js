import React, {useEffect, useState} from 'react'
import axios from "axios";
import * as XLSX from 'xlsx';

const FetchResponse = ({ email, id, status}) => {
    const [csvData, setCsvData] = useState([]);
    const [applied, setApplied] = useState(false)


    const parseCSV = (csvText) => {
        const rows = csvText.split(/\r?\n/); // Split CSV text into rows, handling '\r' characters
        // console.log(rows)
        // console.log(rows[0])
        // const headers = rows[0].split(','); // Extract headers (assumes the first row is the header row)
        const headers = rows[0].match(/(?<=^|,)(?:"(?:[^"]|"")*"|[^,"]*)/g);
        const data = []; // Initialize an array to store parsed data
      
        for (let i = 1; i < rows.length; i++) {
            // const rowData = rows[i].split(',').map(item => item.trim()); // Split the row, handling '\r' characters and trim whitespace

            const rowData = rows[i].match(/(?<=^|,)(?:"(?:[^"]|"")*"|[^,"]*)/g).map(item => {
                // Remove surrounding double quotes and unescape double quotes
                return item.replace(/^"|"$/g, '').replace(/""/g, '"').trim();
            });
            // console.log("Row Data:", rowData);
            const rowObject = {};
    
            for (let j = 0; j < headers.length; j++) {
                rowObject[headers[j]] = rowData[j];
                // console.log("Column:", headers[j], "Value:", rowData[j]);
            }

            data.push(rowObject);
        }

        // console.log(data)
      
        return data;
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
            console.log(parsedCsvData);        // Now you can work with 'csvData' in your component's state.
        })
        .catch((error) => {
            console.error('Error fetching CSV data:', error);
        });
    }, []); 

    useEffect(() => {
        console.log(csvData)
        csvData?.map((submissions) => {
            // console.log(submissions["Email Address"])
            let lowerCaseEmail = submissions["Email Address"]?.toLowerCase()
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