import littleLady_pic from '../pictures/littleLady.PNG'
import frogger_pic from '../pictures/Frogger.PNG'
import flier_pic from '../pictures/Flier.PNG'
//import React,{ useEffect, useState } from 'react'

// const[csvData, setCsvData] = useState([]);

// useEffect(() =>{
//     const csvUrl =  "https://docs.google.com/spreadsheets/d/e/2PACX-1vThvkGT_7AN8Z2gRah9O8Zx2KTvfwg1gIoEwlaza12JehfL-6ilYBgVvXaCZUQfqsWoj1AsZ_Oo7HmM/pub?output=csv"
//     axios.get(csvUrl)
//     .then((response) => {
//         const parsedCsvData = parseCSV(response.data);
//         setCsvData(parsedCsvData);
//         handleCsvData(parsedCsvData);
//         console.log(parsedCsvData);
//     })
//     .catch((error) => {
//         console.log()
//     });
// });

export const MemberList = [
    {
        id: "1",
        name: "Little Lady (she/her)",
        profile_pic: littleLady_pic,
        linkedIn: "https://www.linkedin.com/company/uf-winghacks/",
        major: "Computer Science",
        committee_position: "Co-director",
        committee_name: "Directors",
    },
    {
        id: "2",
        name: "Frogger",
        profile_pic: frogger_pic,
        linkedIn: "https://www.linkedin.com/company/uf-winghacks/",
        major: "Computer Science",
        committee_position: "Co-director",
        committee_name: "Directors",
    },
    {
        id: "3",
        name: "Flier",
        profile_pic: flier_pic,
        linkedIn: "https://www.linkedin.com/company/uf-winghacks/",
        major: "Computer Science",
        committee_position: "Committee Head",
        committee_name: "Awards",
    },
    {
        id: "4",
        name: "Flier 2",
        profile_pic: flier_pic,
        linkedIn: "https://www.linkedin.com/company/uf-winghacks/",
        major: "Computer Science",
        committee_position: "Committee Head",
        committee_name: "Awards",
    },
    {
        id: "5",
        name: "Flier3",
        profile_pic: flier_pic,
        linkedIn: "https://www.linkedin.com/company/uf-winghacks/",
        major: "Computer Science",
        committee_position: "Committee Head",
        committee_name: "Awards"
    }
]
