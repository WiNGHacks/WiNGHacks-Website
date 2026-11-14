import React, { useState } from 'react';
import { FiMapPin } from 'react-icons/fi';

// Keep the map renderer separate so a building/3D view can be added here later.
// North facade coordinates: Library of Congress, HABS FL-393-B.
// https://tile.loc.gov/storage-services/master/pnp/habshaer/fl/fl0800/fl0819/data/fl0819data.pdf
export default function PortalLocation() {
  const [interactive, setInteractive] = useState(false);
  return <div className="portal-map">
    <div className="portal-map-destination"><FiMapPin aria-hidden="true" /><div><strong>Newell Hall</strong><span>1700 Stadium Road · University of Florida</span></div></div>
    <div className={`portal-map-viewport${interactive ? ' is-interactive' : ''}`} onMouseLeave={() => setInteractive(false)}>
    <button className="portal-map-toggle" type="button" aria-pressed={interactive} aria-controls="newell-map" onClick={() => setInteractive(current => !current)}>
      {interactive ? 'Lock map to scroll page' : 'Click to interact with map'}
    </button>
    <iframe
      id="newell-map"
      tabIndex={interactive ? 0 : -1}
      title="2D map zoomed in on Newell Hall with a location pin"
      src="https://www.openstreetmap.org/export/embed.html?bbox=-82.346583%2C29.648428%2C-82.343583%2C29.650228&layer=mapnik&marker=29.649328%2C-82.345083"
      loading="lazy"
      referrerPolicy="no-referrer"
    />
    </div>
    <a href="https://www.openstreetmap.org/?mlat=29.649328&mlon=-82.345083#map=19/29.649328/-82.345083" target="_blank" rel="noopener noreferrer">Open Newell Hall in a larger map</a>
  </div>;
}
