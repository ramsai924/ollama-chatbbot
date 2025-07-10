import { useEffect, useState, useRef } from 'react';
import Visualizer from '../Visualizer';

interface AudioData {
    dataArray: Uint8Array;
    bufferLength: number;
    isActive: boolean;
}

function AIInterviewer() {
    const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
    const [text, setText] = useState<string>('A textbook is a book designed for instructional use, particularly in educational settings, to teach a specific subject or course. It provides a comprehensive overview of the subject matter, including explanations, examples, and sometimes exercises, to help students learn and understand the material. ');
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [rate, setRate] = useState(1);
    const [pitch, setPitch] = useState(1);
    const [volume, setVolume] = useState(1);
    const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    const [audioData, setAudioData] = useState<AudioData>({
        dataArray: new Uint8Array(0),
        bufferLength: 0,
        isActive: false,
    });

    useEffect(() => {
        const initializeAudio = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const context = new AudioContext();
                const source = context.createMediaStreamSource(stream);
                const analyserNode = context.createAnalyser();

                analyserNode.fftSize = 2048;
                source.connect(analyserNode);

                setAudioContext(context);

                const bufferLength = analyserNode.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);

                const updateData = () => {
                    if (!analyserNode || !isSpeaking) {
                        // Reset audio data when not speaking
                        setAudioData({
                            dataArray: new Uint8Array(0),
                            bufferLength: 0,
                            isActive: false,
                        });
                        return;
                    }

                    analyserNode.getByteFrequencyData(dataArray);
                    setAudioData({
                        dataArray,
                        bufferLength,
                        isActive: true,
                    });
                    requestAnimationFrame(updateData);
                };

                updateData();
            } catch (error) {
                console.error('Error accessing microphone:', error);
            }
        };

        initializeAudio();

        return () => {
            if (audioContext) {
                audioContext.close();
            }
        };
    }, [isSpeaking]);

    const handlePlay = () => {
        if (!text) return;

        if (isPaused) {
            window.speechSynthesis.resume();
            setIsPaused(false);
            setIsSpeaking(true);
            return;
        }

        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utteranceRef.current = utterance;

        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }

        utterance.rate = rate;
        utterance.pitch = pitch;
        utterance.volume = volume;


        utterance.onend = () => {
            setIsSpeaking(false);
            window.speechSynthesis.cancel();
        };

        utterance.onpause = () => {
            setIsPaused(true);
        };

        utterance.onresume = () => {
            setIsPaused(false);
        };

        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
    };

    useEffect(() => {
        const handleVoicesChanged = () => {
            const voices = window.speechSynthesis.getVoices();

            if (voices.length > 0) {
                const voiceSelected = voices.find(voice =>
                    voice.name.includes('Google UK English')
                );
                setSelectedVoice(voiceSelected || voices[0]);
            }
        };

        window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);

        handleVoicesChanged();

        return () => {
            window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
        };
    }, []);

    return (
        <div>
            <div>
                <Visualizer
                    audioData={audioData}
                    settings={{
                        colorTheme: 'ocean',
                        sensitivity: 1,
                        particleCount: 2000,
                        particleSize: 2,
                        baseRadius: 150,
                        rotationSpeed: 0.001,
                    }}
                    enabled={isSpeaking}
                />
            </div>
            <button
                onClick={handlePlay}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                {isSpeaking ? 'Stop' : 'Speak'}
            </button>
        </div>
    );
}

export default AIInterviewer;