// https://ant.design/components/collapse
import React from 'react'
import { Collapse } from 'antd';

const { Panel } = Collapse;

const text = `
  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Hac habitasse platea dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Enim sed faucibus turpis in eu mi. Porttitor lacus luctus accumsan tortor posuere.
`;

const items = [
  {
    key: '1',
    header: 'What\'s a hackathon?',
    content: <p>{text}</p>,
  },
  {
    key: '2',
    header: 'Who can attend?',
    content: <p>{text}</p>,
  },
  {
    key: '3',
    header: 'When will applications open & close?',
    content: <p>{text}</p>,
  },
  {
    key: '4',
    header: "Do I need to be a CS major or minor?",
    content: <p>{text}</p>,
  },
  {
    key: '5',
    header: "Does this cost money?",
    content: <p>{text}</p>,
  },
  {
    key: '6',
    header: "How do teams work?",
    content: <p>{text}</p>,
  },
  {
    key: '7',
    header: "I want to join the organizing team. Where can I apply?",
    content: <p>{text}</p>,
  },
  {
    key: '8',
    header: "Where can I find more info about opportunities and events?",
    content: <p>{text}</p>,
  },
];

const FAQ = React.FC = () => {
  const onChange = (key) => {
    console.log(key);
  }

  return (
    <div>
      <h1>FAQ</h1>
    <Collapse defaultActiveKey={['1']} onChange={onChange} 
              className='faq-collapse-container' >
      {items.map(item => (
        <Panel key={item.key} header={"Q . " + item.header}>
          <div className='faq-collapse'>
            A. {item.content}
          </div>
          <br></br>
        </Panel>
      ))}
    </Collapse>
  </div>
);
};

export default FAQ

