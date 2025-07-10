import { useEffect, useState } from 'react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

function User({ setIsUserSpeaking, setIsAIResponding }: any) {
  const [autoListening, setAutoListening] = useState(false);
  const [silenceTimeout, setSilenceTimeout] = useState(null);
  const [lastTranscript, setLastTranscript] = useState("");

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const startListeningLoop = () => {
    setAutoListening(true);
    setLastTranscript("");
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true });
  };

  const stopListeningLoop = () => {
    setAutoListening(false);
    SpeechRecognition.stopListening();
    window.speechSynthesis.cancel();
    resetTranscript();
  };

  useEffect(() => {
    if (autoListening && listening && transcript !== lastTranscript) {
      if (silenceTimeout) clearTimeout(silenceTimeout);
      setIsUserSpeaking(true)
      const timeout: any = setTimeout(() => {
        const newSpeech = transcript.trim();
        if (newSpeech && newSpeech !== lastTranscript) {
          setLastTranscript(newSpeech);
          setIsUserSpeaking(false)
          setIsAIResponding(true);
        }
      }, 1500);

      setSilenceTimeout(timeout);
    }

    return () => {
      if (silenceTimeout) clearTimeout(silenceTimeout);
    };
  }, [transcript]);

  useEffect(() => {
    startListeningLoop();
  }, []);

  if (!browserSupportsSpeechRecognition) {
    return <p>Your browser does not support speech recognition.</p>;
  }

  return (
    <div>
      <div>User</div>
      <div>Transcript: {transcript} {listening}</div>
      <button onClick={startListeningLoop}>
        start
      </button>
      <button onClick={stopListeningLoop}>
        stop
      </button>
    </div>
  )
}

export default User