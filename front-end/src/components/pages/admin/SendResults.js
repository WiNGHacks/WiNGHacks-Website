import React, {useEffect, useState, useMemo} from 'react'
import axios from 'axios';
import Papa from 'papaparse';

import { useReactTable, flexRender, getCoreRowModel, getFilteredRowModel } from '@tanstack/react-table'
import IndeterminateCheckbox from "./IndeterminateCheckbox";

import ClipLoader from "react-spinners/ClipLoader";

const SendResults = () => {
    const [csvData, setCsvData] = useState([]);
    const [numEmails, setNumEmails] = useState(0);
    const [readyToSend, setReadyToSend] = useState(false);
    const [numAcceptedRSVP, setNumAcceptedRSVP] = useState(0)
    const [lastModified, setLastModified] = useState(null);

    const [rowSelection, setRowSelection] = useState({})
    const listSelected = []
    const [submitedClicked, setSubmitClicked] = useState(false)
    // const [listSelected, setListSelected] = useState([])
    const [columnFilters, setColumnFilters] = React.useState([]);

    // const parseCSV = (csvText) => {
    //     const rows = csvText.split(/\r?\n/); // Split CSV text into rows, handling '\r' characters
    //     // console.log(rows)
    //     // console.log(rows[0])
    //     // const headers = rows[0].split(','); // Extract headers (assumes the first row is the header row)
    //     const headers = rows[0].match(/(?<=^|,)(?:"(?:[^"]|"")*"|[^,"]*)/g);
    //     const data = []; // Initialize an array to store parsed data
      
    //     for (let i = 1; i < rows.length; i++) {
    //         // const rowData = rows[i].split(',').map(item => item.trim()); // Split the row, handling '\r' characters and trim whitespace
    //         // console.log("Row Data:", rowData);
    //         // console.log(rows[i])
    //         const rowData = rows[i].match(/(?<=^|,)(?:"(?:[^"]|"")*"|[^,"]*)/g).map(item => {
    //             // Remove surrounding double quotes and unescape double quotes
    //             // console.log(item)
    //             return item.replace(/^"|"$/g, '').replace(/""/g, '"');
    //         });

    //         // console.log(rowData)

    //         const rowObject = {}
    //         for (let j = 0; j < headers.length; j++) {
    //             // rowObject[headers[j]] = rowData[j];

    //             if (headers[j] === 'First Name' ||
    //             headers[j] === 'Last Name' ||
    //             headers[j] === 'Email Address' ||
    //             headers[j] === 'Internal_Status' ||
    //             headers[j] === 'Public_Status') {
    //                 rowObject[headers[j]] = rowData[j];
    //                 // console.log("Column:", headers[j], "Value:", rowData[j]);
    //             }
    //             // console.log("Column:", headers[j], "Value:", rowData[j]);
    //         }

    //         data.push(rowObject);
    //     }

    //     // console.log(data)
      
    //     return data;
    // };

    const parseCSV = (csvText) => {
        const parsedData = Papa.parse(csvText, { header: true });
        const extractedData = parsedData.data.map(row => ({
            FirstName: row['First Name'],
            LastName: row['Last Name'],
            EmailAddress: row['Email Address'],
            Internal_Status: row['Internal_Status'],
            Public_Status: row['Public_Status']
        }));
        console.log('Extraction completed');
        // console.log(extractedData); // Output the extracted data
        return extractedData
    }


    useEffect(() => {
        // Function to fetch data
        const fetchData = async () => {
            try {
                const csvUrl = process.env.REACT_APP_GOOGLE_SHEET_URL;
                const response = await axios.get(csvUrl);
                const parsedCsvData = parseCSV(response.data); // Assuming you have a parseCSV function
                const lastModifiedTime = response.headers['last-modified']; // Get the last modified timestamp from headers

                // Check if the data has been updated
                if (lastModifiedTime !== lastModified) {
                    setCsvData(parsedCsvData);
                    setNumEmails(parsedCsvData.length);
                    setLastModified(lastModifiedTime);
                }
            } catch (error) {
                console.error('Error fetching CSV data:', error);
            }
        };

        // Fetch data when component mounts
        fetchData();

        // Fetch data every interval (e.g., every 1 minute)
        const interval = setInterval(fetchData, 60000); // 60000 milliseconds = 1 minute

        // Clean up interval on component unmount
        return () => clearInterval(interval);
    }, [lastModified]); // Trigger effect when lastModified changes



    // const getAllResults = async() => {
    //     // console.log("Get All Results")
    //     const csvUrl = process.env.REACT_APP_GOOGLE_SHEET_URL;
    //     await axios.get(csvUrl)    // Use Axios to fetch the CSV data
    //     .then((response) => {
    //         const parsedCsvData = parseCSV(response.data);     
    //         setCsvData(parsedCsvData);
    //         setNumEmails(csvData.length)
    //         console.log(parsedCsvData)

    //         // const temp = parseCSV2(response.data)
    //         // console.log(temp)

    //     })
    //     .catch((error) => {
    //         console.error('Error fetching CSV data:', error);
    //     });

    //     // console.log(csvData)
    // }

    useEffect(() => {
        console.log(listSelected)
        if (listSelected.length !== 0) {
            setReadyToSend(true)
            setNumEmails(listSelected.length)
        }
        else if(listSelected.length === 0){
            setReadyToSend(false)
            setNumEmails(0)
        }
    }, [listSelected])

    // useEffect(() => {
    //     setNumEmails(csvData.length)
    //     if(numEmails > 0) {
    //         setReadyToSend(true)
    //     }
    // }, [csvData])

    // Iterate using useEffect that will seperate the CSVData into the different sections of the 
    // public Status: Accepted, declined, waitlisted

    const sendAllResults = async() => {
        setSubmitClicked(true)

        let sentEmail = 0 

        console.log(listSelected)
        listSelected.map((item) => {
            axios.post(process.env.REACT_APP_SEND_UPDATE_STATUS_EMAIL_URL, 
                {email: item.EmailAddress.trim(), updateStatus:item.Public_Status, firstName: item.FirstName }
            )
            .then((response) => {
       
                sentEmail = sentEmail + 1;
                // console.log(response)
                // alert("Emails were sent!")
                if (sentEmail === listSelected.length) {
                    setSubmitClicked(false)
                    alert(`${numEmails} emails have been sent`)
                }
            })
            .catch((error) => {
                console.log(error)
                alert("Error Emails not sent for: " + item.EmailAddress.trim())
            })
       
            
            
        })
    }

    const convertArrayOfJSONToCSV = (data) => {
        const csvRows = [];
        
        // Extract headers from the first object
        const headers = Object.keys(data[0]);
        csvRows.push(headers.join(','));
    
        // Extract values for each object and create CSV rows
        data.forEach((obj) => {
            const values = headers.map((header) => {
                // Escape double quotes and wrap values in double quotes
                const escapedValue = obj[header].toString().replace(/"/g, '""');
                return `"${escapedValue}"`;
            });
            csvRows.push(values.join(','));
        });
    
        // Join rows with newline characters
        return csvRows.join('\n');
    };

    // Function to download the generated CSV as a .csv file.
    const downloadCSV = (data, fileName) => {
        const blob = new Blob([data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', fileName + '.csv');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
   };

    const getAllRSVP = () => {
        axios.get(process.env.REACT_APP_GET_ALL_USERS_API_URL)
        .then((response) => {
            // console.log(response.data)
            const accepted = response.data
                .filter(obj => obj.hasOwnProperty('acceptedRSVP') && obj.acceptedRSVP === 'yes')
                .map(({ email, firstName, lastName, acceptedRSVP}) => ({ email, firstName, lastName, acceptedRSVP }));
            // console.log(accepted)
            setNumAcceptedRSVP(accepted.length)
            const csvData = convertArrayOfJSONToCSV(accepted)
            downloadCSV(csvData, "Accepted_RSVP_Applicants")
            
        })
        .catch(e => {
            console.log(e)
        })
    }

    const data = useMemo(() => csvData, [csvData])

    const columnsHeader = [
        {
            id: "select",
            header: ({ table }) => (
                <IndeterminateCheckbox
                {...{
                    checked: table.getIsAllRowsSelected(),
                    indeterminate: table.getIsSomeRowsSelected(),
                    onChange: table.getToggleAllRowsSelectedHandler(),
                }}
                />
            ),
            cell: ({ row }) => (
                <IndeterminateCheckbox
                {...{
                    checked: row.getIsSelected(),
                    disabled: !row.getCanSelect(),
                    indeterminate: row.getIsSomeSelected(),
                    onChange: row.getToggleSelectedHandler(),
                }}
                />
            ),
            },
        {
            header: "First Name",
            accessorKey: "FirstName"    
        },
        {
            header: "Last Name",
            accessorKey: "LastName"        
        },
        {
            header: "Email Address",
            accessorKey: "EmailAddress"        
        },
        {
            header: "Internal Status",
            accessorKey: "Internal_Status"        
        },
        {
            header: "Public Status",
            accessorKey: "Public_Status"        
        }
    ]

    const columns = useMemo(() => columnsHeader, [])


   const table = useReactTable({
        columns, 
        data, 
        // Select Row
        getCoreRowModel: getCoreRowModel(), 
        state: {
            rowSelection: rowSelection
        },
        onRowSelectionChange: setRowSelection,
        enableRowSelection: true,

        // Filter Row
    })
//    console.log(table)
 

  return (
    <div align="center" style={{width: "100%"}}> 
        <h1>Send Results</h1>
        {/* <iframe style={{width: "75%", height: "500px"}} src={process.env.REACT_APP_EMBEDDED_GOOGLE_SHEET_URL}></iframe> */}
     
        <div>

            <div>
                {/* <button onClick={getAllResults}>Show number of emails to Send</button>   */}

                <div className='email-send-scroll'>

                    <table >
                        <thead>
                        {table.getHeaderGroups().map((headerEl) => {
                            return (
                                <tr key={headerEl.id}>
                                    {headerEl.headers.map((columnEl) => {
                                    return (
                                        <th key={columnEl.id} colSpan={columnEl.colSpan}>
                                        {columnEl.isPlaceholder
                                            ? null
                                            : flexRender(
                                                columnEl.column.columnDef.header,
                                                columnEl.getContext()
                                            )}
                                        </th>
                                    );
                                    })}
                                </tr>
                                );
                        })}

                        </thead>
                        <tbody  >
                            {table.getRowModel().rows.map((rowEl) => {
                                return (
                                <tr key={rowEl.id}>
                                    {rowEl.getVisibleCells().map((cellEl) => {
                                    return (
                                        <td key={cellEl.id}>
                                        {flexRender(
                                            cellEl.column.columnDef.cell,
                                            cellEl.getContext()
                                        )}
                                        </td>
                                    );
                                    })}
                                </tr>
                                );
                            })}
                        </tbody>
                    </table>

                </div>


               
                <div>
                    <ul>
                    
                    {table.getSelectedRowModel().flatRows.map((el) => {
                        
                        
                        listSelected.push(el.original);
                        
                        // return <li key={el.id}>{JSON.stringify(el.original)}</li>;
                    })}
                    </ul>
                </div>
                <p>Send emails count: {numEmails}</p>
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
                            disabled = {!readyToSend}
                            onClick={sendAllResults} 
                            // className={rea? "disabledButton" : "submitBubble" }
                            align= "center" 
                        > 
                            Send emails count 
                        </button>
                    )}
                {/* <button disabled = {!readyToSend} onClick={sendAllResults}>
                    
                    
                    Send emails count 
                
                </button>  */}
                
            </div>
            <hr style={{width: "50%", marginTop: "2rem"}} />
                
            <button style = {{margin: "1rem"}} onClick={getAllRSVP}>Click to get all RSVP count: {numAcceptedRSVP} </button> 
        </div>
        

    </div>
  )
}

export default SendResults