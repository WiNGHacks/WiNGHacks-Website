import Gemini from '../pictures/bestuse_logo/gemini.png';
import Solana from '../pictures/bestuse_logo/solana.png';
import DigitalOcean from '../pictures/bestuse_logo/DigitalOcean.png';
import ElevenLabs from '../pictures/bestuse_logo/ElevenLabs.png';
import MongoDB from '../pictures/bestuse_logo/mongodb.png';
import Godzilla from '../pictures/characters/2026_characters/zilla_ipad.png';
import Ray from '../pictures/characters/2026_characters/ray_wave.png';
// import twocents from '../pictures/sponsor_logo/twocents-logo.png';
// import dsi from '../pictures/sponsor_logo/dsi-logo.jpg';
import Dragon from '../pictures/characters/2026_characters/drago_sit.png';
import Spirit from '../pictures/characters/2026_characters/spirit_shell.png';
import Starfish from '../pictures/characters/2026_characters/starfish.png';
import Fairy from '../pictures/characters/2026_characters/IMG_1551.png';

export const TrackList = [
  {
    id: 1,
    title: 'Best Overall',
    description: "Awarded to unparalleled excellence in a project's innovation and execution",
    icon: Dragon, 
  },
  {
    id: 2,
    title: 'FinTech Track (Sponsored by Twocents)',
    description: 'Awarded to a project that creatively explores financial technology, especially using new tools or ideas',
    note: 'Note: Hackers must download and register for Twocents to be eligible for consideration',
    // icon: twocents,
  },
  {
    id: 3,
    title: 'AI Track (Sponsored by DSI)',
    description: 'Awarded to projects that demonstrate clear novelty and technical depth in AI/ML, with emphasis on non-trivial implementations and good coding conventions',
    // icon: dsi,
  },
  {
    id: 4,
    title: 'First Flight',
    description: 'Given to a team made up of only first-time hackers; shows exemplary performance in their first hackathon.',
    icon: Fairy, // Starfish
  },
  {
    id: 5,
    title: 'WiNG Track',
    description: 'Best tackles an issue related to women, gender-nonconforming and/or marginalized communities.',
    icon: Ray,
  },
  {
    id: 6,
    title: 'Best UI/UX',
    description: 'Most intuitive, visually appealing, and user-centered designs that enhance user interaction, accessibility, and overall experience',
    icon: Starfish, // Dragon
  },
  {
    id: 7,
    title: 'Game Track',
    description: 'Most innovative game designs, including trailblazing mechanics to boundary breaking narratives.',
    icon: Spirit,
  },
  {
    id: 8,
    title: 'Education Track',
    description: 'Recognizes a project that improves learning or educational access through technology.',
    icon: Godzilla,
  },
  {
    id: 9,
    title: 'Best Use of Gemini API',
    description: "It’s time to push the boundaries of what's possible with AI using Google Gemini. Check out the Gemini API to build AI-powered apps that make your friends say WHOA.",
    note: 'MLH Award',
    icon: Gemini,
  },
  {
    id: 10,
    title: 'Best Use of Solana',
    description: "The world of development is evolving fast and Solana is leading the charge with a network built to handle all of your infrastructure needs. Forget high fees and slow confirmations, it’s time to build applications that are fast, efficient, and scalable. Harness Solana's core advantages like blazing fast execution and near-zero transaction costs to make your hackathon ideas become real world projects. With Solana, the possibilities are endless.",
    note: 'MLH Award',
    icon: Solana,
  },
  {
    id: 11,
    title: 'Best Use of DigitalOcean',
    description: 'DigitalOcean offers a reliable and easy-to-use cloud platform for every stage of your project. Leverage core services like Droplets, Managed Databases, and App Platform to build, deploy, and scale your application effortlessly. Building with AI? DigitalOcean Gradient™ AI enables you to build, train, and deploy machine learning models, including access to GPU infrastructure and serverless inference!',
    note: 'MLH Award',
    icon: DigitalOcean,
  },
  {
    id: 12,
    title: 'Best Use of ElevenLabs',
    description: "Deploy natural, human-sounding audio with ElevenLabs. Create realistic, dynamic, and emotionally expressive voices for any project, from interactive AI companions to narrated stories and voice-enabled apps. ElevenLabs will empower you to build rich, immersive experiences without the need for actors or complex audio production, using simply the power of AI.",
    note: 'MLH Award',
    icon: ElevenLabs,
  },
  {
    id: 13,
    title: 'Best Use of MongoDB Atlas',
    description: "MongoDB Atlas takes the leading modern database and makes it accessible in the cloud! Get started with a $50 credit for students or sign up for the Atlas free forever tier (no credit card required). Along with a suite of services and functionalities, you'll have everything you need to manage all of your data, and you can get a headstart with free resources from MongoDB University!",
    note: 'MLH Award',
    icon: MongoDB,
  },
];