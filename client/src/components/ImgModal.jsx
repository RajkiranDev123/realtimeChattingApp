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
    height: 450,
    bgcolor: '#C0C0C0',

    boxShadow: 24,
    p: 1,
    borderRadius: 2,
    border: "none"
};

export default function ImgModal() {

    //ai
    const [wait, setWait] = React.useState(false);

    const [question, setQuestion] = React.useState("");
    const [ans, setAns] = React.useState("");



    //
    const [open, setOpen] = React.useState(false);
    //
    const [textToCopy, setTextToCopy] = useState("");
    const [isCopied, setCopied] = useClipboard(textToCopy, {
        successDuration: 1000
    });

    const startListening = () => SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
    const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();


    if (!browserSupportsSpeechRecognition) {
        return null
    }




    const handleOpen = () => setOpen(true);
    const handleClose = () => { setOpen(false); SpeechRecognition.stopListening(); setTextToCopy(""); resetTranscript();setAns("") };

    // call api
    function ask(trans) {
        // setWait(true)
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
                        "content": `Summarize the paragraph in point wise and not more than 3 points and dont use like the speaker etc and i need direct points and the paragraph is ${trans}`
                    }
                ]
            })
        })
        res.then(res => res?.json())
            .then(data => {
              
                setAns(data?.choices[0]?.message?.content);
                // setWait(false)
                // setQuestion("")
                // console.log("aaws",data?.choices[0]?.message?.content)
            })
            .catch(e => {
                setAns("limit exceeded!");
                // setWait(false)
            });
    }



    useEffect(() => {
        setTextToCopy(transcript)
    }, [transcript])

    return (
        <div>
            <button style={{ borderRadius: 3, cursor: "pointer", padding: 3, background: "blue", border: "none", color: "white", margin: 1 }}
                onClick={handleOpen}>▶ Speech to Text </button>
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
                        <h5 style={{ color: "blue", textAlign: "center" }}>Talk with me!</h5>

                        <div style={{ background: "white", height: 200 }}>
                            {textToCopy}
                        </div>

                        {ans &&<textarea  style={{width:"98%",margin: 2,height:40,outline:"none",border:"none",padding:2}} value={ans}></textarea>}
                 
                        <div onClick={()=> transcript && ask(transcript)}

    style={{color:"grey", padding: 3, borderRadius: 3, background: "white", fontFamily: "monospace", cursor:transcript?"pointer":"not-allowed",margin:3,textAlign:"center" }}>
                         Summarize in points using AI
                        </div>
                        <div style={{ textAlign: "center" }}>

                            <button onClick={setCopied} style={{ padding: 2, borderRadius: 3, border: "none", cursor: "pointer", marginRight: 4, background: "white" }}>
                                {isCopied ? 'Copied!' : 'Copy'}
                            </button>
                            <button onClick={startListening} style={{ padding: 2, borderRadius: 3, border: "none", cursor: "pointer", marginRight: 4 }} >Start Listening</button>
                            <button onClick={SpeechRecognition.stopListening} style={{ padding: 2, borderRadius: 3, border: "none", cursor: "pointer", marginRight: 4, background: "red", color: "white" }} >Stop Listening</button>
                            <button onClick={() => { resetTranscript(); setTextToCopy("");setAns("") }}
                                style={{ padding: 2, borderRadius: 3, border: "none", cursor: "pointer", marginRight: 4, color: "wheat", background: "green" }}>Clear</button>


                        </div>

                    </div>





                </Box>
            </Modal>
        </div>
    );
}
