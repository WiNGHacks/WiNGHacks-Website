import React from 'react'

const Sponsors = () => {
  const onButtonClick = () => {
    const pdfUrl = "SponsorshipPacket.pdf";
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = "document.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <h1>Sponsors</h1>
      <button onClick ={onButtonClick}>Become a Sponsor</button>
      </div>
  )
}

export default Sponsors