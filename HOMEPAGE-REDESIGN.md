# WiNGHacks: a hackathon in the meadow

The homepage uses the marketing team's original airplane meadow, woodland landscape, mushroom, and gator artwork. Warm cream, forest green, peach, and lavender carry that world into the interface. The second iteration uses the existing Bubbl font for oversized, irregular lettering and a friendly sans serif for navigation and body copy. The landscape collage serves as a mood reference; it is not rendered as a collage on the page.

## Reference and revised direction

Reference: [Hack the North](https://hackthenorth.com/), inspected September 7, 2026. Its illustrated tabletop, oversized objects, chunky headings, and transition beneath the table make the page feel like a place to explore. WiNGHacks translates that approach into its own meadow artwork rather than borrowing the reference's assets.

The previous version's serif headlines, promotional slogans, and orderly panels felt too much like a product page. The revision makes the event name the hero, changes the tone to a student invitation, uses taped notes and curved scene boundaries, and places the marketing mascots in the landscape.

### Current readability and video revision

Applied the official Impeccable typography and craft guidance from https://github.com/pbakaus/impeccable. Impeccable is an agent design skill, not a React component library. Its launcher and automatic detector are not installed; the refinement used the documented fallback workflow and manual/browser checks. Existing artwork and playful display typography remain authoritative.

- The supplied airplane video now fills the hero. It is exported as a seamless 15.9-second forward-and-reverse loop, which keeps the airplane crisp at the join without a crossfade ghost. Its audio track is removed, the video is encoded as H.264, and MP4 metadata is moved to the front for progressive playback.
- A poster frame remains available when video cannot load or motion is reduced.
- The pause control pauses video and ambient motion. Video also pauses outside the viewport and when the browser tab is hidden. System reduced-motion preferences are honored before playback.
- Extra hero clouds, particles, mascots, and scroll transforms were removed so the supplied animation can carry the scene.
- The hero is reduced to the standalone event name, University of Florida affiliation, two compact date/location panels, and application and volunteer actions. A light video wash and opaque detail panels keep the essentials readable without enclosing the title in a card.
- Body text uses a consistent 17–18px scale, comfortable line spacing, and a maximum 65ch measure. Important details are at least 14px.
- FAQ, committee profiles, schedule, tracks, and about copy use stable, opaque reading surfaces and softer shadows.
- Arrow symbols and the pointed sparkle formerly used beside the wordmark have been removed throughout the homepage.

## Page journey

1. **Welcome:** illustrated hero, university affiliation, February 20–22, 2026 dates, Newell Hall location, and application and volunteer actions.
2. **About:** mission, intended community, beginner welcome, and past event format.
3. **Experience:** examples of past tracks, prize announcement status, and a project inspiration button.
4. **Weekend:** an interactive three-day overview, explicitly marked illustrative until the schedule is confirmed.
5. **Community:** captioned photographs from the 2024 event.
6. **Committee garden:** the existing roster, committee filters, flowers, and a persistent profile panel with LinkedIn links.
7. **Sponsors:** a sample of previous partners and a sponsorship contact CTA.
8. **FAQ:** experience, eligibility, cost, teams, packing, accessibility, dietary needs, dates, and venue.
9. **Get involved:** announcements, mentoring, and volunteering links.
10. **Footer:** contact, LinkedIn, and code of conduct.

## Interactions implemented

- **Blooming committee garden:** clicking, tapping, or keyboard-activating a flower grows it from its position into a centered bloom. Profile photos replace the illustrated faces in the field and appear larger inside the open flower. The profile includes the committee, name, role, and a LinkedIn icon. The modal stays open while the visitor reads it and closes with its button, Escape, or a backdrop click. Focus returns to the flower that opened it. Filters let visitors explore each committee. Two roster entries still use the source data's placeholder image until their portrait assets are added.
- **Seeds of inspiration:** a button cycles through project prompts without requiring an account or storing visitor data.
- **Weekend chapters:** day tabs reveal different stages of the event, including arrow-key navigation.
- **A friendly gator:** tapping the mascot reveals encouragement.
- **FAQ disclosures:** keyboard-accessible questions open in place.
- Responsive navigation, visible focus indicators, a skip link, and reduced-motion styling are included.

## Ideas for the next iteration

- **Paper-plane trail:** a small plane travels down a dotted route as visitors scroll. It pauses beside each section and doubles as a section navigator. Use a static route when reduced motion is requested.
- **A pocket field guide:** save selected workshops to an on-device itinerary after the schedule is confirmed. The schedule must still work without storage or animation.
- **Hidden garden friends:** discover three optional illustrated creatures for a small celebration. Essential information should always remain visible without playing.
- **A growing countdown:** a seedling gains leaves as the confirmed event approaches; keep a plain-text date and countdown alongside it.
- **Custom flower portraits:** commission a few petal/bud variants from marketing to replace the current CSS-animated SVG flowers and closely match the painted art.

## Before announcing the next edition

Confirm dates, duration, venue/address, application link and deadline, eligibility, costs and included meals, travel/parking, access arrangements, team rules, detailed schedule, judging criteria, tracks, prizes, sponsor roster, and committee roster. February 20–22, 2026 was the previous date in the source; it is not presented as an upcoming event.

The homepage preserves existing application and administrative routes. Its current CTA links to the established Instagram account because there is no confirmed next-edition application URL. No subscription form or automated email service has been invented.
