import React from 'react';
import { createRoot } from 'react-dom/client';
import { act, Simulate } from 'react-dom/test-utils';
import { AnswersReview, ApplicationFields } from './ApplicationFields';

let root, container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

const sampleFields = [
  { key: 'firstName', section: 'Personal information', label: 'First name', type: 'text', required: true },
  { key: 'discord', section: 'Personal information', label: 'Discord username', type: 'text', required: true },
  { key: 'school', section: 'Education & experience', label: 'School', type: 'select', required: true },
  { key: 'schoolOther', section: 'Education & experience', label: 'Your school name', type: 'text' },
  { key: 'motivation', section: 'Short answers', label: 'Motivation', type: 'textarea', required: true },
];

test('AnswersReview keeps completed sections collapsed and expands incomplete sections', async () => {
  const onEdit = jest.fn();
  const answers = {
    // Personal information is incomplete (missing firstName, discord)
    school: 'University of Florida',
    motivation: 'I want to build great projects.',
  };

  await act(async () => {
    root.render(
      <AnswersReview
        fields={sampleFields}
        answers={answers}
        onEditSection={onEdit}
      />
    );
  });

  const headers = container.querySelectorAll('.application-accordion-header');
  expect(headers.length).toBe(3); // Personal information, Education & experience, Short answers

  // Incomplete section starts open
  expect(headers[0].getAttribute('aria-expanded')).toBe('true');
  expect(headers[0].textContent).toContain('(Incomplete)');
  // Should NOT have responses count text
  expect(headers[0].textContent).not.toContain('responses');

  // Completed sections start collapsed
  expect(headers[1].getAttribute('aria-expanded')).toBe('false');
  expect(headers[2].getAttribute('aria-expanded')).toBe('false');

  // Click first header to collapse
  await act(async () => {
    headers[0].click();
  });
  expect(headers[0].getAttribute('aria-expanded')).toBe('false');

  // Click second header (Education & experience) to expand
  await act(async () => {
    headers[1].click();
  });
  expect(headers[1].getAttribute('aria-expanded')).toBe('true');
  expect(container.textContent).toContain('University of Florida');
});

test('ApplicationFields renders required agreement with red asterisk and link for code of conduct', async () => {
  const agreementFields = [
    { key: 'codeOfConduct', section: 'Review & agreements', label: 'I agree to follow the event code of conduct.', type: 'checkbox', required: true },
    { key: 'sponsorConsent', section: 'Review & agreements', label: 'Share resume with sponsors.', type: 'checkbox', required: false },
  ];
  const onChange = jest.fn();

  await act(async () => {
    root.render(
      <ApplicationFields
        fields={agreementFields}
        answers={{}}
        onChange={onChange}
        errors={{ codeOfConduct: 'Please confirm this agreement.' }}
        codeOfConductUrl="https://static.mlh.io/docs/mlh-code-of-conduct.pdf"
      />
    );
  });

  // Verify * (Required) is rendered
  const reqTag = container.querySelector('.application-agreement-required');
  expect(reqTag).not.toBeNull();
  expect(reqTag.textContent).toContain('* (Required)');

  // Verify optional tag is rendered
  const optTag = container.querySelector('.application-agreement-optional');
  expect(optTag).not.toBeNull();
  expect(optTag.textContent).toContain('(Optional)');

  // Verify code of conduct link
  const link = container.querySelector('.application-link');
  expect(link).not.toBeNull();
  expect(link.getAttribute('href')).toBe('https://static.mlh.io/docs/mlh-code-of-conduct.pdf');
  expect(link.textContent).toBe('code of conduct');

  // Verify error is placed under checkbox
  const errorEl = container.querySelector('.application-checkbox-error');
  expect(errorEl).not.toBeNull();
  expect(errorEl.textContent).toContain('Please confirm this agreement.');
});

test('ApplicationFields enforces character limits and sanitizes user input', async () => {
  const fields = [
    { key: 'city', section: 'Personal information', label: 'City', type: 'text', maxLength: 200 },
    { key: 'graduationYear', section: 'Education & experience', label: 'Graduation year', type: 'text', maxLength: 4 },
    { key: 'githubUrl', section: 'Resume & links', label: 'GitHub', type: 'url', maxLength: 1000 },
    { key: 'motivation', section: 'Short answers', label: 'Motivation', type: 'textarea', maxLength: 2000 },
  ];
  const onChange = jest.fn();

  await act(async () => {
    root.render(
      <ApplicationFields
        fields={fields}
        answers={{ motivation: 'Hello world' }}
        onChange={onChange}
      />
    );
  });

  // Verify textarea character counter displays characters, not words
  const counter = container.querySelector('.application-char-count');
  expect(counter).not.toBeNull();
  expect(counter.textContent).toContain('11 / 2000 characters');

  // Verify graduationYear strips non-digits
  const yearInput = container.querySelector('#answer-graduationYear');
  act(() => {
    Simulate.change(yearInput, { target: { value: 'abcd2027xyz' } });
  });
  expect(onChange).toHaveBeenCalledWith('graduationYear', '2027');

  // Verify city strips newlines
  const cityInput = container.querySelector('#answer-city');
  act(() => {
    Simulate.change(cityInput, { target: { value: 'Gainesville\nFL' } });
  });
  expect(onChange).toHaveBeenCalledWith('city', 'GainesvilleFL');

  // Verify url trims whitespace
  const urlInput = container.querySelector('#answer-githubUrl');
  act(() => {
    Simulate.change(urlInput, { target: { value: '   https://github.com/myname   ' } });
  });
  expect(onChange).toHaveBeenCalledWith('githubUrl', 'https://github.com/myname');
});

test('AnswersReview does not render literal "0" for checkbox fields with maxLength 0 or null', async () => {
  const agreementFields = [
    { key: 'accurate', section: 'Review & agreements', label: 'I confirm that my answers are accurate.', type: 'checkbox', maxLength: 0, required: true },
    { key: 'codeOfConduct', section: 'Review & agreements', label: 'I agree to follow the event code of conduct.', type: 'checkbox', maxLength: 0, required: true },
    { key: 'sponsorConsent', section: 'Review & agreements', label: 'I allow WiNGHacks to share my resume.', type: 'checkbox', maxLength: null, required: false },
  ];

  await act(async () => {
    root.render(
      <AnswersReview
        fields={agreementFields}
        answers={{ accurate: true, codeOfConduct: true, sponsorConsent: false }}
      />
    );
  });

  const header = container.querySelector('.application-accordion-header');
  // Expand section if collapsed
  if (header && header.getAttribute('aria-expanded') === 'false') {
    await act(async () => {
      header.click();
    });
  }

  const dtElements = container.querySelectorAll('dt');
  expect(dtElements.length).toBe(3);
  dtElements.forEach(dt => {
    // Should never render a stray '0' from short-circuited JSX
    expect(dt.textContent).not.toMatch(/\*0/);
    expect(dt.textContent).not.toMatch(/recruiting\.0/);
    expect(dt.textContent).not.toMatch(/resume\.0/);
    expect(dt.textContent).not.toMatch(/conduct\.\*0/);
  });

  // Verify full review list has no stray 0s next to labels
  const listText = container.querySelector('.application-review-list').textContent;
  expect(listText).not.toContain('*0');
});
