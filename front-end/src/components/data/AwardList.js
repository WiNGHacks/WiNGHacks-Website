import Best_Overall from '../pictures/characters/gifs/littleLady.gif';
import First_Flight from '../pictures/characters/gifs/flier.gif';
import Peoples_Choice from '../pictures/characters/gifs/penguin.gif';
import Best_WiNG from '../pictures/characters/gifs/frogger.gif';
import Best_Game from '../pictures/characters/gifs/mushwoom.gif';
import Best_XR from '../pictures/characters/gifs/draggin.gif';
import Sponsor_Placeholder from '../pictures/characters/gifs/seaButterfly.gif';
import infotech_award from '../pictures/sponsor_logo/infotech-logo.png'
import mongodb_award from '../pictures/bestuse_logo/mongodb.png'
import goDaddy_award from '../pictures/bestuse_logo/godaddy-registry.png'
import fidelity_award from '../pictures/bestuse_logo/fidelity.png'
import Congrats from '../pictures/2024_Awards/Congratulations.png'
import Switch from '../pictures/2025_Awards/switch.jpeg'
import headphones from '../pictures/2025_Awards/Headphones.jpeg'
import projector from '../pictures/2025_Awards/Projector.jpeg'
import screen from '../pictures/2025_Awards/Screen.jpeg'
import digital from '../pictures/2025_Awards/DigiCam.jpeg'
import genAI from '../pictures/2025_Awards/GenAI.jpeg'
import jbl from '../pictures/2025_Awards/JBL.jpeg'
import keyboard from '../pictures/2025_Awards/Keyboard.jpeg'
import m5go from '../pictures/2025_Awards/M5GO.jpeg'
import nord from '../pictures/2025_Awards/NordVPN.jpeg'
import plushie from '../pictures/2025_Awards/Plushie.jpeg'
import godaddy from '../pictures/2025_Awards/goDaddy.jpeg'

export const AwardList = [
    {
        id: "1",
        logo_image: Sponsor_Placeholder,
        winner_image: Congrats,
        title: "See you next year!",
        description:"Check out the projects on Devpost!",
        alt: "Congratulations WingHacks Winners!", 
        tag: 'BestUse',
        sponsored:"WiNGHacks Devpost",
        learnMore:"http://winghacks-2025.devpost.com/",
    },
    {
        
        id: "2",
        logo_image: Best_Overall,
        winner_image: Switch,
        title: "Best Overall Award",
        description:"Awarded to unparalleled excellence in a project's innovation and execution.",
        alt: 'Best Overall Award', 
        tag: 'General',
        sponsored:"Sponsored by JP Morgan Chase",
        learnMore:"https://www.jpmorganchase.com/",
    },
    {
        
        id: "3",
        logo_image: Best_Overall,
        winner_image: nord,
        title: "Best Overall Award",
        description:"Awarded to unparalleled excellence in a project's innovation and execution.",
        alt: 'Best Overall Award', 
        tag: 'General',
        sponsored:"Sponsored by NordVPN",
        learnMore:"https://nordvpn.com/hackathons",
    },
    {
        id: "4",
        logo_image: Peoples_Choice,
        winner_image: headphones,
        title: "People's Choice Award",
        description:"The project with the most community votes on DevPost",
        alt: "People's Choice Award", 
        tag: 'General',
        sponsored:"",
        learnMore:"",
    },
    {
        id: "5",
        logo_image: Best_WiNG,
        winner_image: projector,
        title: "Best WiNG Award",
        description:"Best tackles an issue related to women, non-binary, gender-nonconforming communities.",
        alt: "Best WiNG Award", 
        tag: 'Category',
        sponsored:"",
        learnMore:"",
    },
    {
        id: "6",
        logo_image: Best_Game,
        winner_image: screen,
        title: "Best Game Award",
        description:"Most innovative game designs, including  mechanics to narratives.",
        alt: "Best Game Award", 
        tag: 'Category',
        sponsored:"",
        learnMore:"",
    },
    {
        id: "7",
        logo_image: Best_XR,
        winner_image: jbl,
        title: "Best VR/XR Award",
        description:"Recognizes exceptional use of extended reality as a medium.",
        alt: "Best VR/XR Award", 
        tag: 'Category',
        sponsored:"Presented by Society of PC Building and GatorVR",
        learnMore:"",
    },
    {
        id: "8",
        logo_image: First_Flight,
        winner_image: digital,
        title: "First Flight Award",
        description:"Best project made by a team of ONLY first-time hackers.",
        alt: 'First Flight Award', 
        tag: 'General',
        sponsored:"",
        learnMore:"",
    },
    {
        id: "9",
        logo_image: infotech_award,
        winner_image: keyboard,
        title: "Best UI/UX Award",
        description:"Most inntuitive, visually appealing, and user-centered design that enhances user interaction, accessibility, and overall experience.",
        alt: "Best UI/UX Award", 
        tag: 'Sponsor',
        sponsored:"",
        learnMore:"",
    },
    {
        id: "10",
        logo_image: mongodb_award,
        winner_image: m5go,
        title: "Best Use of MongoDB",
        description:" Build a hack using MongoDB Atlas for a chance to win a M5GO IoT Starter Kit for you and each member of your team.",
        alt: "Best Use of MongoDB", 
        tag: 'BestUse',
        sponsored:"2025 WiNGHacks Prizes",
        learnMore:"https://hack.mlh.io/hackuf/prizes",
    },
    {
        id: "11",
        logo_image: goDaddy_award,
        winner_image: godaddy,
        title: "Best Domain Name from GoDaddy Registry",
        description:"Register your domain name with GoDaddy Registry for a chance to win a Hack from Home Kit.",
        alt: "Best Domain Name from GoDaddy Registry", 
        tag: 'BestUse',
        sponsored:"",
        learnMore:"",
    },
    {
        id: "12",
        logo_image: fidelity_award,
        winner_image: genAI,
        title: "Best Use of Gen AI",
        description:"Utilize publicly available Generative AI APIs (like those from OpenAI, Anthropic, Hugging Face, Llama, IBM Watson, or Google Gemini) to develop a unique and functional application.",
        alt: "Best Use of Gen AI sponsored by Gen AI.", 
        tag: 'BestUse',
        sponsored:"Sponsored by GenAI",
        learnMore:"",
    },
    // {
    //     id: "11",
    //     logo_image: starknet_award,
    //     title: "Best Use of Starknet",
    //     description:"Build a hack using Starknet for a chance to win a Starknet Care Package for Coders",
    //     alt: "Best Use of Starknet", 
    //     tag: 'BestUse',
    //     sponsored:"2024 WiNGHacks Prizes",
    //     learnMore:"https://hack.mlh.io/hackuf/prizes",
    // },
    // {
    //     id: "12",
    //     logo_image: taipy_award,
    //     winner_image: BreakingDownBias,
    //     title: "Best Use of Taipy",
    //     description:"Use Taipy in your hackathon project for a chance to win a set of Wireless Headphones for you and each of your team members and a chance to have your project featured on the Taipy website!",
    //     alt: "Best Use of Taipy", 
    //     tag: 'BestUse',
    //     sponsored:"2024 WiNGHacks Prizes",
    //     learnMore:"https://hack.mlh.io/hackuf/prizes",
    // },
    

]