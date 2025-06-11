import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  height: 400,
  bgcolor: '#C0C0C0',

  boxShadow: 24,
  p: 1,
  borderRadius: 2,
  border: "none"
};

export default function AIModal() {
  const [open, setOpen] = React.useState(false);
  const [wait, setWait] = React.useState(false);

  const [question, setQuestion] = React.useState("");
  const [ans, setAns] = React.useState("");



  const handleOpen = () => setOpen(true);
  const handleClose = () => { setOpen(false); setQuestion(""); setWait(false); setAns("") };



  function ask() {
    setWait(true)
    let res = fetch("https://api.sarvam.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "api-subscription-key": import.meta.env.VITE_API_KEY,

        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "sarvam-m",
        "messages": [
          {
            "role": "user",
            "content": question
          }
        ]
      })
    })
    res.then(res => res?.json())
      .then(data => {
        console.log("aa", data)
        setAns(data?.choices[0]?.message?.content);
        setWait(false)
        setQuestion("")
      })
      .catch(e => {
        setAns("limit exceeded!");
        setWait(false)
      });
  }


  return (
    <div>
      <button style={{ borderRadius: 3, cursor: "pointer", padding: 3, background: "blue", border: "none", color: "white", margin: 1 }} onClick={handleOpen}>AI 🧠</button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <p onClick={() => handleClose()} style={{ color: "red", fontWeight: "bold", display: "flex", justifyContent: "flex-end", cursor: "pointer" }}>x</p>

          <div>
            <div style={{ overflowY: "scroll", height: 290, color: "grey", fontFamily: "monospace", background: "white", padding: 2, borderRadius: 3 }}>
              {wait && <p style={{ color: "grey" }}>Plz Wait...</p>}
              {ans}

            </div>

            <input placeholder='type your question...' style={{ height: 30, width: "95%", borderRadius: 3, padding: 2, outline: "none", border: "none", margin: 1 }} value={question} type='text' onChange={(e) => setQuestion(e.target.value)} />
            <div style={{ display: "flex", gap: 3, justifyContent: "center", marginTop: 3 }}>
              <button style={{ border: "none", padding: 2, cursor: "pointer", background: "red", color: "white", borderTopRightRadius: 7 }} onClick={ask}>Ask</button>
              <button style={{ border: "none", padding: 2, cursor: "pointer", background: "grey", color: "white", borderTopLeftRadius: 7 }} onClick={() => setQuestion("")}>Clear Question</button>
              <button style={{ border: "none", padding: 2, cursor: "pointer", background: "green", color: "white", borderRadius: 2 }} onClick={() => setAns("")}>Clear Msg</button>
            </div>



          </div>
        </Box>
      </Modal>
    </div>
  );
}
