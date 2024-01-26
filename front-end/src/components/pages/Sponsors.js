import React, {useState} from 'react'

const Sponsors = () => {

  const [openPDF, setOpenPDF] = useState(false)

  const onButtonClick = () => {
    // const pdfUrl = "SponsorshipPacket.pdf";
    // const link = document.createElement("a");
    // link.href = pdfUrl;
    // link.download = "document.pdf";
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);

    setOpenPDF(!openPDF)


    
  };

  return (
    <div>
      <h1>Sponsors</h1>
      <button onClick ={onButtonClick}>Become a Sponsor</button>

      {openPDF? (<div><iframe src="SponsorshipPacket.pdf" width="100%" height="500px" /></div>):(<div></div>)}
      
      </div>
  )
}

export default Sponsors