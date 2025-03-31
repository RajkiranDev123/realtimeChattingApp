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
  bgcolor: 'background.paper',

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

  //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

  function ask() {
    setWait(true)
    let res = fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer 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",
        "HTTP-Referer": "https://www.webstylepress.com", // Optional. Site URL for rankings on openrouter.ai.
        "X-Title": "WebStylePress", // Optional. Site title for rankings on openrouter.ai.
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "deepseek/deepseek-r1:free",
        "messages": [
          {
            "role": "user",
            "content": question
          }
        ]
      })
    })
    res.then(res => res?.json())
      .then(data => { setAns(data?.choices[0]?.message?.reasoning); setWait(false) }).catch(e => { setAns("limit exceeded!"); setWait(false) });
  }


  return (
    <div>
      <button style={{ borderRadius: 3, cursor: "pointer", padding: 3, background: "blue", border: "none", color: "white", margin: 1 }} onClick={handleOpen}>AI</button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <p onClick={() => handleClose()} style={{ color: "grey", display: "flex", justifyContent: "flex-end", cursor: "pointer" }}>x</p>

          <div>
            <div style={{ overflowY: "scroll", height: 250 }}>
              {wait && <p style={{ color: "grey" }}>Plz Wait...</p>}
              {ans}

            </div>

            <input style={{ width: "95%", borderRadius: 3, padding: 2, outline: "none" }} value={question} type='text' onChange={(e) => setQuestion(e.target.value)} />
            <div style={{ display: "flex", justifyContent: "space-around", margin: 2 }}>
              <button style={{ border: "none", padding: 2, cursor: "pointer", background: "green", color: "white", borderRadius: 2 }} onClick={ask}>Ask</button>
              <button style={{ border: "none", padding: 2, cursor: "pointer", background: "blue", color: "white", borderRadius: 2 }} onClick={() => setQuestion("")}>Clear Question</button>
              <button style={{ border: "none", padding: 2, cursor: "pointer", background: "blue", color: "white", borderRadius: 2 }} onClick={() => setAns("")}>Clear Msg</button>
            </div>



          </div>
        </Box>
      </Modal>
    </div>
  );
}
