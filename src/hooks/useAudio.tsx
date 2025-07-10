import { useState, useEffect, useRef } from 'react';
import type { AudioData } from '../types/audio';

const useAudio = (): [
    AudioData,
    () => void,
    () => void,
    boolean,
    string | null
] => {
    const [audioData, setAudioData] = useState<AudioData>({
        dataArray: new Uint8Array(0),
        bufferLength: 0,
        isActive: false,
    });
    const [isRecording, setIsRecording] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    const startRecording = async () => {
        try {
            setError(null);

            // Initialize audio context if not already done
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext ||
                    (window as any).webkitAudioContext)();
            }

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;

            // Create analyzer and connect stream
            const audioContext = audioContextRef.current;
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 2048;
            analyser.smoothingTimeConstant = 0.8;

            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);

            // Store references
            analyserRef.current = analyser;
            sourceRef.current = source;

            // Create data array
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            setAudioData({
                dataArray,
                bufferLength,
                isActive: true,
            });

            setIsRecording(true);

            // Start animation loop
            const updateData = () => {
                if (!analyserRef.current) return;

                analyserRef.current.getByteFrequencyData(dataArray);

                setAudioData((prevData) => ({
                    ...prevData,
                    dataArray: dataArray.slice(0),
                }));

                animationFrameRef.current = requestAnimationFrame(updateData);
            };

            updateData();
        } catch (err) {
            console.error("Error accessing microphone:", err);
            setError("Could not access microphone. Please ensure you have granted permission.");
        }
    };

    const stopRecording = () => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }

        if (sourceRef.current) {
            sourceRef.current.disconnect();
            sourceRef.current = null;
        }

        if (mediaStreamRef.current) {
            const tracks = mediaStreamRef.current.getTracks();
            tracks.forEach((track) => track.stop());
            mediaStreamRef.current = null;
        }

        setAudioData({
            dataArray: new Uint8Array(0),
            bufferLength: 0,
            isActive: false,
        });

        setIsRecording(false);
    };

    useEffect(() => {
        startRecording()
        // Cleanup on unmount
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }

            if (sourceRef.current) {
                sourceRef.current.disconnect();
            }

            if (mediaStreamRef.current) {
                const tracks = mediaStreamRef.current.getTracks();
                tracks.forEach((track) => track.stop());
            }

            if (audioContextRef.current) {
                audioContextRef.current.close().catch(console.error);
            }
        };
    }, []);

    return [audioData, startRecording, stopRecording, isRecording, error];
};

export default useAudio;