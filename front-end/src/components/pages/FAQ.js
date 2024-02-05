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
    content: <p>A hackathon is an “invention marathon” where students gather to create an original project. You can attend workshops, hear from people in the computer science field, and network with students and companies!
    </p>,
  },
  {
    key: '2',
    header: 'What if I have no experience with coding or hackathons?',
    content: <p>No problem! WiNGHacks is the perfect place for any student with any level of experience to create a coding project and learn new skills. We’ve purposefully designed WiNGHacks to offer an encouraging and supportive environment. You’ll quickly learn new skills from our workshops and from mentors.
    </p>,
  },
  {
    key: '3',
    header: 'When do applications open?',
    content: <p>Applications open [DATE HERE]</p>,
  },
  {
    key: '4',
    header: "Who can attend? Is this event only for underrepresented people?",
    content: <p>We welcome any college student 18 years old or above to participate in WiNGHacks. It’s important to keep in mind that we are looking to create a welcoming and empowering space for women and non-binary students in tech. 
    </p>,
  },
  {
    key: '5',
    header: "How will mentorship work?",
    content: <p>We will have mentors available to help you on-site and on our Discord server for the duration of our event. </p>,
  },
  {
    key: '6',
    header: "How will hackers be accepted?",
    content: <p>Applicants will be accepted on a rolling basis until our capacity of 200 is reached. However, hackers must be present in-person during the hackathon. </p>,
  },
  {
    key: '7',
    header: "I want to join the organizing team. Where can I apply?",
    content: <p>Applicants will be accepted on a rolling basis until our capacity of 200 is reached. However, hackers must be present in-person during the hackathon. </p>,
  },
  {
    key: '8',
    header: "How do teams work? Can I register solo?",
    content: <p>Teams can have between 1 to 4 people. You can have your teammates in mind before the event, or you can find a team on our Discord or at our team formation social the morning of the hackathon!</p>,
  },
  {
    key: '9',
    header: "Do I have to pay to participate?",
    content: <p>No! WiNGHacks is free! We will be covering meals, but keep in mind we will not be reimbursing for transportation costs. </p>
  },
  {
    key: '10',
    header: "What will I eat?",
    content: <p>We’ll be providing all meals on Saturday, and breakfast on Sunday. We’ll also have small snacks available throughout the hackathon. 
    </p>
  },
];

const FAQ = React.FC = ({}, ref) => {
  const onChange = (key) => {
    console.log(key);
  }

  return (
    <div ref = {el => ref.current = { ...ref.current, faq: el }}>
      <div className='FAQ'>
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