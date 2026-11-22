const path = require('node:path');
const { createHash } = require('node:crypto');
const { MongoClient, ObjectId } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });
dotenv.config({ path: path.resolve(__dirname, '..', '.env.development.local'), override: true });

const { fields, season } = require('../applications/definition');
const { prepareApplications } = require('../applications/storage');

const people = [
  ['Avery', 'Morgan', 'pending', 'University of Florida', 'Computer Science', 'First hackathon'],
  ['Jordan', 'Lee', 'pending', 'University of Central Florida', 'Digital Arts and Sciences', '1–3 hackathons'],
  ['Taylor', 'Nguyen', 'pending', 'Florida International University', 'Information Technology', 'First hackathon'],
  ['Morgan', 'Patel', 'accepted', 'University of Florida', 'Computer Engineering', '1–3 hackathons'],
  ['Riley', 'Garcia', 'accepted', 'Florida State University', 'Data Science', '4+ hackathons'],
  ['Cameron', 'Kim', 'accepted', 'University of South Florida', 'Cybersecurity', 'First hackathon'],
  ['Quinn', 'Williams', 'waitlisted', 'Georgia Institute of Technology', 'Computer Science', '4+ hackathons'],
  ['Skyler', 'Brown', 'waitlisted', 'Florida A&M University', 'Information Systems', '1–3 hackathons'],
  ['Parker', 'Davis', 'rejected', 'University of Miami', 'Software Engineering', 'First hackathon'],
  ['Reese', 'Martinez', 'rejected', 'Florida Atlantic University', 'Computer Science', '1–3 hackathons'],
];

const profileStatus = { pending: 'Applied', accepted: 'Accepted', waitlisted: 'Waitlisted', rejected: 'Rejected' };

function answersFor(person, index) {
  const [firstName, lastName, , school, major, experience] = person;
  const values = {
    firstName,
    lastName,
    preferredName: index % 3 === 0 ? firstName.slice(0, 3) : '',
    pronouns: ['They/Them', 'She/Her', 'He/They'][index % 3],
    pronounsOther: '',
    discord: `${firstName.toLowerCase()}${index + 1}`,
    city: ['Gainesville', 'Orlando', 'Tampa', 'Miami', 'Tallahassee'][index % 5],
    country: 'United States',
    school,
    schoolOther: '',
    degree: index === 7 ? 'Graduate' : 'Undergraduate',
    major,
    graduationYear: String(2027 + (index % 4)),
    experience,
    resumeUrl: '',
    githubUrl: `https://github.com/winghacks-mock-${index + 1}`,
    portfolioUrl: index % 2 ? `https://example.com/mock-${index + 1}` : '',
    linkedinUrl: '',
    motivation: `I want to meet supportive builders, learn from mentors, and explore a new technical area. This is mock application ${index + 1} for development testing.`,
    project: `I built a small community project that helps students find campus resources and practice collaborating across different technical backgrounds.`,
    collaboration: `I listen carefully, document decisions, ask teammates what support they need, and make space for everyone to contribute.`,
    accessibility: index % 4 === 0 ? 'A quiet workspace would help me focus during longer work sessions.' : '',
    accurate: true,
    codeOfConduct: true,
    reviewConsent: true,
    sponsorConsent: index % 2 === 0,
  };
  return Object.fromEntries(fields.map(field => [field.key, values[field.key]]));
}

async function run() {
  const databaseUrl = new URL(process.env.DB_URI);
  const databaseName = databaseUrl.pathname.replace(/^\//, '');
  if (databaseName !== 'hackathon_dev' || process.env.EXPECTED_DB_NAME !== 'hackathon_dev') {
    throw new Error('Development seed refused: database must be hackathon_dev.');
  }
  if (!process.env.EXPECTED_DB_HOST || databaseUrl.hostname !== process.env.EXPECTED_DB_HOST) {
    throw new Error('Development seed refused: database host does not match EXPECTED_DB_HOST.');
  }

  const client = new MongoClient(process.env.DB_URI, { serverSelectionTimeoutMS: 10000 });
  try {
    await client.connect();
    const db = client.db();
    await prepareApplications(db);
    const reviewer = await db.collection('users').findOne({ admin: true, clerkUserId: { $type: 'string' } });
    const pdf = Buffer.from('%PDF-1.4\n1 0 obj<</Type/Catalog>>endobj\nMock WiNGHacks development resume\n%%EOF');
    const now = Date.now();

    for (let index = 0; index < people.length; index += 1) {
      const [firstName, lastName, reviewStatus] = people[index];
      const clerkUserId = `dev_seed_hacker_${String(index + 1).padStart(2, '0')}`;
      const email = `mock${String(index + 1).padStart(2, '0')}@winghacks.test.edu`;
      const submittedAt = new Date(now - (people.length - index) * 60 * 60 * 1000);
      const userResult = await db.collection('users').findOneAndUpdate(
        { clerkUserId },
        { $set: { firstName, lastName, email, admin: false, status: profileStatus[reviewStatus], acceptedRSVP: reviewStatus === 'accepted' ? ['n/a', 'yes', 'no'][index % 3] : 'n/a' }, $setOnInsert: { _id: new ObjectId() } },
        { upsert: true, returnDocument: 'after' },
      );
      const answers = answersFor(people[index], index);
      const review = reviewer && reviewStatus !== 'pending' ? [{ reviewer: reviewer.clerkUserId, score: null, notes: `Mock ${reviewStatus} decision for interface testing.`, updatedAt: submittedAt }] : [];
      const audit = reviewer && reviewStatus !== 'pending' ? [{ at: submittedAt, actor: reviewer.clerkUserId, type: 'review', reason: `Seeded ${reviewStatus} decision.` }] : [];
      await db.collection('applications').updateOne(
        { season, clerkUserId },
        { $set: {
          season, clerkUserId, profileId: userResult._id, email, answers,
          state: 'submitted', reviewStatus, revision: 1, createdAt: submittedAt,
          updatedAt: submittedAt, submittedAt, deletedAt: null, reviews: review, audit,
          resume: { name: `${firstName}-${lastName}-resume.pdf`, size: pdf.length, data: pdf, sha256: createHash('sha256').update(pdf).digest('hex') },
          submissionSnapshot: { answers, resume: { name: `${firstName}-${lastName}-resume.pdf`, sha256: createHash('sha256').update(pdf).digest('hex') } },
        } },
        { upsert: true },
      );
    }

    const summary = await db.collection('applications').aggregate([
      { $match: { season, clerkUserId: /^dev_seed_hacker_/ } },
      { $group: { _id: '$reviewStatus', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]).toArray();
    console.log(JSON.stringify({ database: db.databaseName, season, seededUsers: people.length, applicationsByStatus: summary }, null, 2));
  } finally {
    await client.close();
  }
}

run().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
