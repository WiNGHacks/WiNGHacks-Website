const countries = ['United States','Canada','Afghanistan','Albania','Algeria','American Samoa','Andorra','Angola','Antigua and Barbuda','Argentina','Armenia','Australia','Austria','Azerbaijan','Bahamas','Bahrain','Bangladesh','Barbados','Belarus','Belgium','Belize','Benin','Bermuda','Bhutan','Bolivia','Bosnia and Herzegovina','Botswana','Brazil','Brunei','Bulgaria','Burkina Faso','Burundi','Cambodia','Cameroon','Cape Verde','Central African Republic','Chad','Chile','China','Colombia','Comoros','Congo','Costa Rica','Croatia','Cuba','Cyprus','Czech Republic','Denmark','Djibouti','Dominica','Dominican Republic','Ecuador','Egypt','El Salvador','Equatorial Guinea','Eritrea','Estonia','Eswatini','Ethiopia','Fiji','Finland','France','Gabon','Gambia','Georgia','Germany','Ghana','Greece','Grenada','Guatemala','Guinea','Guinea-Bissau','Guyana','Haiti','Honduras','Hong Kong','Hungary','Iceland','India','Indonesia','Iran','Iraq','Ireland','Israel','Italy','Ivory Coast','Jamaica','Japan','Jordan','Kazakhstan','Kenya','Kiribati','Kosovo','Kuwait','Kyrgyzstan','Laos','Latvia','Lebanon','Lesotho','Liberia','Libya','Liechtenstein','Lithuania','Luxembourg','Madagascar','Malawi','Malaysia','Maldives','Mali','Malta','Marshall Islands','Mauritania','Mauritius','Mexico','Micronesia','Moldova','Monaco','Mongolia','Montenegro','Morocco','Mozambique','Myanmar','Namibia','Nauru','Nepal','Netherlands','New Zealand','Nicaragua','Niger','Nigeria','North Korea','North Macedonia','Norway','Oman','Pakistan','Palau','Palestine','Panama','Papua New Guinea','Paraguay','Peru','Philippines','Poland','Portugal','Puerto Rico','Qatar','Romania','Russia','Rwanda','Saint Kitts and Nevis','Saint Lucia','Saint Vincent and the Grenadines','Samoa','San Marino','São Tomé and Príncipe','Saudi Arabia','Senegal','Serbia','Seychelles','Sierra Leone','Singapore','Slovakia','Slovenia','Solomon Islands','Somalia','South Africa','South Korea','South Sudan','Spain','Sri Lanka','Sudan','Suriname','Sweden','Switzerland','Syria','Taiwan','Tajikistan','Tanzania','Thailand','Timor-Leste','Togo','Tonga','Trinidad and Tobago','Tunisia','Turkey','Turkmenistan','Tuvalu','Uganda','Ukraine','United Arab Emirates','United Kingdom','Uruguay','Uzbekistan','Vanuatu','Vatican City','Venezuela','Vietnam','Yemen','Zambia','Zimbabwe','Other'];
const universities = ['University of Florida','Florida State University','University of Central Florida','University of South Florida','Florida International University','University of Miami','Florida Atlantic University','Florida A&M University','Georgia Institute of Technology','University of Georgia','Massachusetts Institute of Technology','Stanford University','Harvard University','Carnegie Mellon University','University of Michigan','University of California, Berkeley','University of Illinois Urbana-Champaign','Purdue University','University of Texas at Austin','Cornell University','Columbia University','University of Pennsylvania','New York University','Princeton University','Yale University','Duke University','University of North Carolina at Chapel Hill','Virginia Tech','University of Virginia','Ohio State University','University of Washington','University of California, Los Angeles','University of Southern California','California Institute of Technology','Rice University','Emory University','Vanderbilt University','University of Wisconsin-Madison','University of Minnesota','University of Maryland','Rutgers University','Penn State University','Boston University','Northeastern University','University of Toronto','University of Waterloo','University of British Columbia','McGill University','Other'];
const pronounOptions = ['She/Her', 'He/Him', 'They/Them', 'She/They', 'He/They', 'Prefer not to answer', 'Prefer to self-describe'];
const fields = [
  ['firstName', 'Personal information', 'First name', 'text', 100, true],
  ['lastName', 'Personal information', 'Last name', 'text', 100, true],
  ['preferredName', 'Personal information', 'Preferred name', 'text', 100],
  ['pronouns', 'Personal information', 'Pronouns (optional)', 'select', 80, false, pronounOptions],
  ['pronounsOther', 'Personal information', 'Your pronouns', 'text', 200],
  ['discord', 'Personal information', 'Discord username', 'text', 200, true],
  ['city', 'Personal information', 'City', 'text', 200, true],
  ['country', 'Personal information', 'Country', 'select', 100, true, countries],
  ['school', 'Education & experience', 'School / university', 'select', 200, true, universities],
  ['schoolOther', 'Education & experience', 'Your school name', 'text', 200],
  ['degree', 'Education & experience', 'Level of study', 'select', 80, true, ['High school', 'Undergraduate', 'Graduate', 'Other']],
  ['major', 'Education & experience', 'Major / area of study', 'text', 200, true],
  ['graduationYear', 'Education & experience', 'Expected graduation year', 'text', 4, true],
  ['experience', 'Education & experience', 'Hackathon experience', 'select', 80, true, ['First hackathon', '1–3 hackathons', '4+ hackathons']],
  ['resumeUrl', 'Resume & links', 'Resume link (optional)', 'url', 1000],
  ['githubUrl', 'Resume & links', 'GitHub / code profile (optional)', 'url', 1000],
  ['portfolioUrl', 'Resume & links', 'Portfolio (optional)', 'url', 1000],
  ['linkedinUrl', 'Resume & links', 'LinkedIn (optional)', 'url', 1000],
  ['motivation', 'Short answers', 'What brings you to WiNGHacks, and what would you like to learn?', 'textarea', 2500, true],
  ['project', 'Short answers', 'Tell us about something you made, a problem you solved, or an idea you want to explore.', 'textarea', 2500, true],
  ['collaboration', 'Short answers', 'How would you contribute to an inclusive, supportive team?', 'textarea', 2500, true],
  ['accessibility', 'Short answers', 'Anything the organizers should know to support your participation? (optional)', 'textarea', 2000],
  ['accurate', 'Review & agreements', 'I confirm that my answers are accurate.', 'checkbox', null, true],
  ['codeOfConduct', 'Review & agreements', 'I agree to follow the event code of conduct.', 'checkbox', null, true],
  ['reviewConsent', 'Review & agreements', 'I consent to WiNGHacks organizers storing and reviewing my application and optional resume to administer this event.', 'checkbox', null, true],
  ['sponsorConsent', 'Review & agreements', 'I allow WiNGHacks to share my resume and contact details with event sponsors for recruiting.', 'checkbox', null, false],
].map(([key, section, label, type, maxLength, required = false, options]) => ({ key, section, label, type, maxLength, required, ...(options ? { options } : {}) }));
const season = process.env.APPLICATION_SEASON || '2027';
const statuses = ['pending', 'in_review', 'accepted', 'waitlisted', 'rejected'];
const maxResumeBytes = 512 * 1024;
const indexes = [
  { key: { season: 1, clerkUserId: 1 }, name: 'one_application_per_user_season', unique: true },
  { key: { season: 1, deletedAt: 1, state: 1, reviewStatus: 1, submittedAt: -1 }, name: 'review_queue' },
];
const answerProperties = Object.fromEntries(fields.map(f => [f.key, f.type === 'checkbox' ? { bsonType: 'bool' } : { bsonType: 'string', maxLength: f.maxLength }]));
const validator = { $jsonSchema: {
  bsonType: 'object', required: ['season', 'clerkUserId', 'profileId', 'email', 'answers', 'revision', 'state', 'createdAt', 'updatedAt', 'reviewStatus'],
  properties: {
    season: { bsonType: 'string' }, clerkUserId: { bsonType: 'string' }, profileId: { bsonType: 'objectId' }, email: { bsonType: 'string' },
    answers: { bsonType: 'object', additionalProperties: false, properties: answerProperties },
    revision: { bsonType: ['int', 'long', 'double'], minimum: 0 }, state: { enum: ['draft', 'submitted'] },
    reviewStatus: { enum: statuses }, createdAt: { bsonType: 'date' }, updatedAt: { bsonType: 'date' },
    deletedAt: { bsonType: ['date', 'null'] }, submittedAt: { bsonType: ['date', 'null'] },
    resume: { bsonType: ['object', 'null'], properties: { data: { bsonType: 'binData' }, size: { bsonType: ['int', 'double'], maximum: maxResumeBytes }, name: { bsonType: 'string' } } },
  }
} };
function validateAnswers(answers, complete = false) {
  const errors = {};
  if (!answers || Array.isArray(answers) || typeof answers !== 'object') return { _form: 'Answers must be an object.' };
  for (const key of Object.keys(answers)) if (!fields.some(f => f.key === key)) errors[key] = 'Unknown field.';
  for (const f of fields) {
    const value = answers[f.key];
    // schoolOther is conditionally required when school === 'Other'
    const isSchoolOtherReq = f.key === 'schoolOther' && answers.school === 'Other';
    // pronounsOther is conditionally required when pronouns === 'Prefer to self-describe'
    const isPronounsOtherReq = f.key === 'pronounsOther' && answers.pronouns === 'Prefer to self-describe';
    const isConditionallyRequired = isSchoolOtherReq || isPronounsOtherReq;
    if (value === undefined) { if (complete && (f.required || isConditionallyRequired)) errors[f.key] = 'Required.'; continue; }
    if (f.type === 'checkbox') { if (typeof value !== 'boolean' || (complete && f.required && !value)) errors[f.key] = 'Please confirm this agreement.'; continue; }
    if (typeof value !== 'string' || value.length > f.maxLength || /\u0000/.test(value)) { errors[f.key] = `Use text up to ${f.maxLength} characters.`; continue; }
    // Incomplete URLs and selections can be saved as drafts without losing work.
    if (!complete) continue;
    if ((f.required || isConditionallyRequired) && !value.trim()) errors[f.key] = 'Required.';
    if (value && f.options && !f.options.includes(value)) errors[f.key] = 'Choose an available option.';
    if (value && f.type === 'url') { try { const url = new URL(value.trim()); if (url.protocol !== 'https:' || url.username || url.password) throw Error(); } catch { errors[f.key] = 'Enter a full HTTPS URL without credentials.'; } }
    if (f.key === 'graduationYear' && value && !/^(20[2-9]\d|2100)$/.test(value.trim())) errors[f.key] = 'Enter a year between 2020 and 2100.';
  }
  return errors;
}
function publicApplication(doc, admin = false) {
  if (!doc) return null;
  const { resume, reviews, audit, submissionSnapshot, previousAnswers, ...rest } = doc;
  return { ...rest, resume: resume ? { name: resume.name, size: resume.size, sha256: resume.sha256 } : null,
    ...(admin ? { reviews: reviews || [], audit: audit || [], submissionSnapshot, previousAnswers } : {}) };
}
module.exports = { fields, season, statuses, indexes, validator, maxResumeBytes, validateAnswers, publicApplication };
