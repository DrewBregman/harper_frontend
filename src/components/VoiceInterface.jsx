import React, { useState, useRef } from 'react';
import axios from 'axios';
import { updateForm } from '../api';

const VoiceInterface = ({ selectedCompanyId, onFormUpdate }) => {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState("");
  const [processingCommand, setProcessingCommand] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  // Start capturing audio
  const startListening = async () => {
    try {
      setIsListening(true);
      setStatus("Requesting microphone...");

      // Request permission + start audio
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstart = () => {
        setStatus("Recording...");
      };

      mediaRecorder.onstop = async () => {
        setIsListening(false);
        setStatus("Transcribing...");

        // Combine the chunks into a single Blob
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        chunksRef.current = [];

        // (Optional) If you have an OpenAI Whisper endpoint, call it. Example:
        try {
          const formData = new FormData();
          formData.append("file", audioBlob, "recording.webm");

          // e.g. POST to /forms/transcribe if you have that route
          const res = await axios.post("http://localhost:8000/forms/transcribe", formData, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          });

          const recognizedText = res.data.transcript || "";
          setTranscript(recognizedText);
          setStatus("Transcription complete. Review and send the command.");
        } catch (err) {
          console.error(err);
          setStatus("Error transcribing audio (fake or real).");
        }
      };

      mediaRecorder.start();
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setStatus("Could not access microphone.");
      setIsListening(false);
    }
  };

  // Stop capturing
  const stopListening = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
      setStatus("Stopping recording...");
    }
  };

  // Send the recognized text as a command
  const processCommand = async () => {
    if (!transcript.trim() || !selectedCompanyId) return;

    setProcessingCommand(true);
    setStatus("Processing command...");

    try {
      // Call the updateForm route (which includes your server-side state logic)
      // We pass the company ID and the transcript as the "command"
      const data = await updateForm(selectedCompanyId, transcript);
      // data.updatedFormData => new fields from the backend
      onFormUpdate && onFormUpdate(data.updatedFormData);
      setStatus(`Command executed: "${transcript}"`);
      setTranscript("");
    } catch (err) {
      console.error(err);
      setStatus("Error updating form. Please try again.");
    } finally {
      setProcessingCommand(false);
    }
  };

  return (
    <div className="voice-interface-container">
      <h2>Voice Command</h2>
      <p>Use natural language commands to edit the form. Speak clearly or type your command below.</p>

      <div>
        {!isListening ? (
          <button 
            onClick={startListening}
            disabled={processingCommand}
          >
            Start Recording
          </button>
        ) : (
          <button onClick={stopListening}>
            Stop
          </button>
        )}
      </div>

      <div style={{ marginTop: "1rem" }}>
        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Type your command or record your voice..."
          disabled={processingCommand}
          rows={3}
          cols={50}
        />
        <button 
          onClick={processCommand}
          disabled={processingCommand || !transcript.trim()}
          style={{ marginLeft: "1rem" }}
        >
          {processingCommand ? "Processing..." : "Send"}
        </button>
      </div>

      {status && (
        <div style={{ marginTop: "1rem", color: "blue" }}>
          {status}
        </div>
      )}

      <div style={{ marginTop: "1rem" }}>
        <h4>Example Commands</h4>
        <ul>
          <li>"Set the applicant's first name to John"</li>
          <li>"Change annual revenue to 5 million dollars"</li>
          <li>"Update the business entity type to Corporation"</li>
          <li>"Set the agency name to ABC Insurance"</li>
          <li>"Update the premises address to 123 Main Street, New York, NY 10001"</li>
          <li>"Set the policy effective date to January 1, 2026"</li>
        </ul>
      </div>
    </div>
  );
};

export default VoiceInterface;
