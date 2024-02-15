// https://ant.design/components/collapse
import React, {forwardRef} from 'react'
import { Collapse } from 'antd';

const { Panel } = Collapse;

const text = `
  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Hac habitasse platea dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Enim sed faucibus turpis in eu mi. Porttitor lacus luctus accumsan tortor posuere.
`;

const items = [
  {
    key: '1',
    header: 'What\'s a hackathon?',
    content: "A hackathon is a 24 to 48-hour long “invention marathon” where students gather to create an original project. You can attend workshops, hear from people in the computer science field, network with fellow hackers and corporate representatives, all while creating a project you’re going to be proud of!",
  },
  {
    key: '2',
    header: 'What if I have no experience with coding or hackathons?',
    content: "No problem! WiNGHacks is the perfect place for students with any level of experience to create a coding project and learn new skills. We’ve purposefully designed WiNGHacks to offer an encouraging and supportive environment for first-time hackers. You’ll quickly learn new skills from our workshops and mentors.",
  },
  {
    key: '3',
    header: 'When do applications open?',
    content: "Applications open late February, 2024.",
  },
  {
    key: '4',
    header: "Who can attend? Is this event only for underrepresented people?",
    content: "We welcome any college student 18 years old and above to participate in WiNGHacks. It’s important to keep in mind that we are looking to create a welcoming and empowering space for women and non-binary students in tech.",
  },
  {
    key: '5',
    header: "How will hackers be accepted?",
    content: "Applicants will close a week and a half before the hackathon weekend. We will admit people up to our capacity of 200 hackers, with some on a waitlist. Hackers must RSVP Yes to attend and must check in in-person during the hackathon.",
  },
  {
    key: '6',
    header: "How do teams work? Can I register solo?",
    content: "Teams can have between 1 to 4 people. You can have your teammates in mind before the event, or you can find a team on our Discord or at our team formation social the morning of the hackathon!",
  },
  {
    key: '7',
    header: "Do I have to pay to participate?",
    content: "No, WiNGHacks is free! We will be covering your meals during the hours of the hackathon. Keep in mind we will not be reimbursing for transportation costs.",
  },
  {
    key: '8',
    header: "How do I register for a specific track?",
    content: "You can indicate your interest for a track on the hacker application, but you will only be entered into a track officially when you upload your project onto Devpost under that track."
  },
  {
    key: '9',
    header: "How can I get technical help during the hackathon?",
    content: "We will have mentors available to help you on-site and on our Discord server for the duration of the event. "
  },
  {
    key: '10',
    header: "What if I need to leave?",
    content: "You’re welcome to come and go to the Wertheim building as you please during the hacking hours of the hackathon. We recommend staying on site for a better community experience."
  },
  {
    key: '11',
    header: "How is the venue?",
    content: "The Wertheim building offers our hackers plenty of space to lounge, sleep, code, socialize, and even shower!"
  },
  {
    key: '12',
    header: "How will the projects get judged?",
    content: "On the morning of Sunday, we will set up a “science fair” style presentation to allow judges to walk around and hear your project demos. People’s Choice category will be based on the most voted project on Devpost. Then, the winning team for each category will be announced at the closing ceremony."
  },

];

const FAQ = React.FC = ({}, ref) => {
  const onChange = (key) => {
    // console.log(key);
  }

  return (
    <div ref = {el => ref.current = { ...ref.current, faq: el }}>
      <div className='margins FAQ'>
        <h1>FAQ</h1>
        <Collapse defaultActiveKey={['1']} onChange={onChange} className='faq-collapse-container' >
          {items.map(item => (
            <Panel key={item.key} header={"Q . " + item.header}>
              <div className='faq-collapse'>
                {item.content}
              </div>
              <br></br>
            </Panel>
          ))}
      </Collapse>
    </div>
  </div>
);
};

export default forwardRef(FAQ)