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
  height:400,
  bgcolor: 'background.paper',

  boxShadow: 24,
  p: 1,
  borderRadius:2,
  border:"none"
};

export default function AIModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
          <p onClick={()=>setOpen(false)} style={{color:"grey",display:"flex",justifyContent:"flex-end",cursor:"pointer"}}>x</p>
        </Box>
      </Modal>
    </div>
  );
}
