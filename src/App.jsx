import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { JsonEditor } from 'json-edit-react'
const { ReclaimClient } = window.module.exports;

function Claim() {
  const [claimResult, setClaimResult] = useState(null);
  const [proofGenerating, setProofGenerating] = useState(false);



  async function handleCreateClaim() {
    try {
        setClaimResult(null);
      setProofGenerating(true);
      const client = new ReclaimClient(
        import.meta.env.VITE_RECLAIM_APP_ID,
        import.meta.env.VITE_RECLAIM_APP_SECRET
      );

  
    const url = "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd";
    const claim = await client.zkFetch(url, {
      method: "GET",
      headers: {
          'Content-Type': 'application/json',
      },
      context: {
         // context added to the request (this will be included in the proof)
          contextAddress: "0x0",
          contextMessage: "eth_price"
      }
    }, {
      responseMatches: [{
          type: 'regex',
          value: 'ethereum":{"usd":(?<price>.*?)}}',
      }], 
    })
      setProofGenerating(false);
      setClaimResult(claim);
      toast.success('Claim created successfully!');
    } catch (error) {
      setProofGenerating(false);
      console.error("Error creating claim:", error);
      setClaimResult({ error: error.message });
      toast.error(`Error creating claim: ${error.message}`);
    }
  }


  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      boxSizing: 'border-box',
      textAlign: 'center'
    }}>
      <div style={{
        maxWidth: '800px',
        width: '100%',
        textAlign: 'center'
      }}>
        <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>zkFetch - Vite Example</h2>
       
        <button 
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            margin: '0 auto',
            display: 'block'
          }}
          onClick={handleCreateClaim} 
        >
          {proofGenerating ? 'Generating proof...' : 'Generate Proof'}
        </button>
       
        {claimResult && (
          <div style={{ marginTop: '20px', width: '100%', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '10px', textAlign: 'center' }}>Claim Result:</h3>
            <JsonEditor
              rootName="proof"
              className="p-4"
              data={(claimResult)}
              viewOnly={true}
              restrictEdit={true}
              restrictAdd={true}
              restrictDelete={true}
              restrictDrag={true}
              theme={"githubDark"}
              maxWidth={"100%"}
              minWidth={"100%"}
              style={{ margin: '0 auto' }}
            />
          </div>
        )}
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}

export default Claim;