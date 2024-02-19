import React, {useEffect, useState} from 'react'
import axios from 'axios';

const SendResults = () => {
    const [csvData, setCsvData] = useState([]);
    const [numEmails, setNumEmails] = useState(0);
    const [readyToSend, setReadyToSend] = useState(false);

    const parseCSV = (csvText) => {
        const rows = csvText.split(/\r?\n/); // Split CSV text into rows, handling '\r' characters
        // console.log(rows)
        // console.log(rows[0])
        // const headers = rows[0].split(','); // Extract headers (assumes the first row is the header row)
        const headers = rows[0].match(/(?<=^|,)(?:"(?:[^"]|"")*"|[^,"]*)/g);
        const data = []; // Initialize an array to store parsed data
      
        for (let i = 1; i < rows.length; i++) {
            // const rowData = rows[i].split(',').map(item => item.trim()); // Split the row, handling '\r' characters and trim whitespace
            // console.log("Row Data:", rowData);
            const rowData = rows[i].match(/(?<=^|,)(?:"(?:[^"]|"")*"|[^,"]*)/g).map(item => {
                // Remove surrounding double quotes and unescape double quotes
                return item.replace(/^"|"$/g, '').replace(/""/g, '"').trim();
            });

            const rowObject = {}
            for (let j = 0; j < headers.length; j++) {
                rowObject[headers[j]] = rowData[j];
                // console.log("Column:", headers[j], "Value:", rowData[j]);
            }

            data.push(rowObject);
        }

        // console.log(data)
      
        return data;
    };

    const getAllResults = async() => {
        const csvUrl = process.env.REACT_APP_GOOGLE_SHEET_URL;
        await axios.get(csvUrl)    // Use Axios to fetch the CSV data
        .then((response) => {
            const parsedCsvData = parseCSV(response.data);     
            setCsvData(parsedCsvData);
            setNumEmails(csvData.length)

        })
        .catch((error) => {
            console.error('Error fetching CSV data:', error);
        });

        console.log(csvData)
    }

    useEffect(() => {
        setNumEmails(csvData.length)
        if(numEmails > 0) {
            setReadyToSend(true)
        }
    }, [csvData])

    const sendAllResults = async() => {
        // getAllResults()
        // console.log(csvData)

        csvData.map((item) => {
            if(item.Public_Status !== "") {
                console.log({Email: item["Email Address"], newStatus: item.Public_Status})
                axios.post(process.env.REACT_APP_SEND_UPDATE_STATUS_EMAIL_URL, 
                    {email: item["Email Address"], updateStatus:item.Public_Status, firstName: item["First Name"] }
                )
                .then((response) => {
                    console.log(response)
                    alert("Emails were sent!")
                })
                .catch((error) => {
                    console.log(error)
                    alert("Error Emails not sent!")
                })
            }
        })
    }


  return (
    <div align="center" style={{width: "100%"}}> 
        <h1>Send Results</h1>
        <iframe style={{width: "80%"}} src={process.env.REACT_APP_EMBEDDED_GOOGLE_SHEET_URL}></iframe>
        <div>
            {/* { readyToSend? 
            (
                <div>
                <button onClick={getAllResults}>Show number of emails to Send</button>  
                <p>Send emails count: {numEmails}</p>
                
                <button onClick={sendAllResults}>Send emails count: {numEmails} </button> 
                </div>
            ):(
                <div>
                <button onClick={getAllResults}>Show number of emails to Send</button>  
                <p>Send emails count: {numEmails}</p>
                <button disabled = {readyToSend}onClick={sendAllResults}>Send emails count: {numEmails} </button> 
                </div>
            )

            } */}

            <div>
                <button onClick={getAllResults}>Show number of emails to Send</button>  
                <p>Send emails count: {numEmails}</p>
                <button disabled = {!readyToSend} onClick={sendAllResults}>Send emails count: {numEmails} </button> 
                </div>
        </div>
        

    </div>
  )
}

export default SendResults