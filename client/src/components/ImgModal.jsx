import * as React from 'react';
import Box from '@mui/material/Box';

import Modal from '@mui/material/Modal';
//
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import useClipboard from "react-use-clipboard";
import { useState, useEffect } from "react";
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
       //
    const [textToCopy, setTextToCopy] = useState("");
    const [isCopied, setCopied] = useClipboard(textToCopy, {
        successDuration: 1000
    });

    const startListening = () => SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
    const { transcript,resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  

    if (!browserSupportsSpeechRecognition) {
        return null
    }




    const handleOpen = () => setOpen(true);
    const handleClose = () => { setOpen(false) ;SpeechRecognition.stopListening();setTextToCopy("");resetTranscript()};


 

    useEffect(() => {
        setTextToCopy(transcript)
    }, [transcript])

    return (
        <div>
            <button style={{ borderRadius: 3, cursor: "pointer", padding: 3, background: "blue", border: "none", color: "white", margin: 1 }}
             onClick={handleOpen}>▶ Speech to Text ✍︎</button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <p onClick={() => handleClose()} style={{ color: "red", display: "flex", justifyContent: "flex-end", cursor: "pointer" }}>x</p>


                    <div className="">
                        <h4 style={{ textAlign: "center" }}>Speech to Text Converter</h4>
                        <br />
                        <h5 style={{color:"blue",textAlign:"center"}}>Talk with me!</h5>

                        <div style={{ background: "white", height: 200 }}>
                            {textToCopy}
                        </div>
                        <br />
                        <div style={{ display: "flex", gap: 9 }}>

                            <button onClick={setCopied} style={{padding:2,borderRadius:3,border:"none",cursor:"pointer"}}>
                                {isCopied ? 'Copied!' : 'Copy'}
                            </button>
                            <button onClick={startListening} style={{padding:2,borderRadius:3,border:"none",cursor:"pointer"}} >Start Listening</button>
                            <button onClick={SpeechRecognition.stopListening} style={{padding:2,borderRadius:3,border:"none",cursor:"pointer"}} >Stop Listening</button>
                            <button onClick={() => { resetTranscript(); setTextToCopy("") }} style={{padding:2,borderRadius:3,border:"none",cursor:"pointer"}}>Clear</button>


                        </div>

                    </div>





                </Box>
            </Modal>
        </div>
    );
}
