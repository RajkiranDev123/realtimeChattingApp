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
    bgcolor: '#F0EAD6',

    boxShadow: 24,
    p: 1,
    borderRadius: 2,
    border: "none"
};

export default function ImgModal() {
    const [open, setOpen] = React.useState(false);
    const [wait, setWait] = React.useState(false);

    const [question, setQuestion] = React.useState("");
    const [ans, setAns] = React.useState("");



    const handleOpen = () => setOpen(true);
    const handleClose = () => { setOpen(false); setQuestion(""); setWait(false); setAns("") };

    //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

    async function query(data) {
      let  data1 = {
           response_format: "b64_json",
    prompt: "\"Astronaut riding a horse\"",
    model: "stabilityai/stable-diffusion-xl-base-1.0",
        }
        const response = await fetch(
            "https://router.huggingface.co/together/v1/images/generations",
            {
                headers: {
                    Authorization: "Bearer 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",
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify(
                    data1

                ),
            }
        );
        const result = await response.blob();
        // return result;
        console.log(88, result)

    }






    return (
        <div>
            <button style={{ borderRadius: 3, cursor: "pointer", padding: 3, background: "blue", border: "none", color: "white", margin: 1 }} onClick={handleOpen}>Generate Image 🧠</button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <p onClick={() => handleClose()} style={{ color: "grey", display: "flex", justifyContent: "flex-end", cursor: "pointer" }}>x</p>

                    <div>
                        <div style={{ overflowY: "scroll", height: 290, color: "grey", fontStyle: "italic" }}>
                            {wait && <p style={{ color: "grey" }}>Plz Wait...</p>}
                            {ans}

                        </div>

                        <input placeholder='type your question...' style={{ height: 30, width: "95%", borderRadius: 3, padding: 2, outline: "none", border: "none" }} value={question} type='text' onChange={(e) => setQuestion(e.target.value)} />
                        <div style={{ display: "flex", gap: 3, margin: 2 }}>
                            <button style={{ border: "none", padding: 2, cursor: "pointer", background: "red", color: "white", borderTopRightRadius: 7 }} onClick={query}>Generate</button>
                            <button style={{ border: "none", padding: 2, cursor: "pointer", background: "blue", color: "white", borderTopLeftRadius: 7 }} onClick={() => setQuestion("")}>Clear Question</button>
                            <button style={{ border: "none", padding: 2, cursor: "pointer", background: "blue", color: "white", borderRadius: 2 }} onClick={() => setAns("")}>Clear Msg</button>
                        </div>



                    </div>
                </Box>
            </Modal>
        </div>
    );
}
