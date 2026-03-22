import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Square, Play } from 'lucide-react';

const AudioRecorder = ({ onRecordingComplete, maxDuration = 60 }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioURL, setAudioURL] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  
  const mediaRecorderRef = useRef(null);
  const audioRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const streamRef = useRef(null);

  // Request microphone permission
  const requestPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setPermissionGranted(true);
      streamRef.current = stream;
      return true;
    } catch (error) {
      console.error('Microphone permission denied:', error);
      return false;
    }
  };

  // Start recording
  const startRecording = async () => {
    if (!permissionGranted) {
      const granted = await requestPermission();
      if (!granted) return;
    }

    try {
      const stream = streamRef.current || await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        
        // Convert blob to base64 for API
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result;
          onRecordingComplete({
            blob,
            base64data,
            duration,
            url
          });
        };
        reader.readAsDataURL(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setDuration(prev => {
          if (prev >= maxDuration) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
      
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  // Pause/Resume recording
  const togglePause = () => {
    if (mediaRecorderRef.current) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        timerRef.current = setInterval(() => {
          setDuration(prev => {
            if (prev >= maxDuration) {
              stopRecording();
              return prev;
            }
            return prev + 1;
          });
        }, 1000);
      } else {
        mediaRecorderRef.current.pause();
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      }
      setIsPaused(!isPaused);
    }
  };

  // Play recorded audio
  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
    };
  }, [audioURL]);

  // Handle audio playback end
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.onended = () => setIsPlaying(false);
    }
  }, [audioURL]);

  return (
    <div className="audio-recorder">
      {/* Recording Controls */}
      <div className="flex items-center gap-4">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="p-4 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
            title="Start Recording"
          >
            <Mic size={24} />
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={togglePause}
              className="p-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full transition-colors"
              title={isPaused ? "Resume" : "Pause"}
            >
              {isPaused ? <Play size={20} /> : <Square size={20} />}
            </button>
            <button
              onClick={stopRecording}
              className="p-4 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors animate-pulse"
              title="Stop Recording"
            >
              <MicOff size={24} />
            </button>
          </div>
        )}

        {/* Timer */}
        <div className="text-lg font-mono">
          {formatTime(duration)}
          {maxDuration && ` / ${formatTime(maxDuration)}`}
        </div>

        {/* Recording Indicator */}
        {isRecording && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-red-500">
              {isPaused ? 'Paused' : 'Recording...'}
            </span>
          </div>
        )}
      </div>

      {/* Audio Playback */}
      {audioURL && (
        <div className="mt-4 p-4 bg-[var(--bg-secondary)] rounded-lg">
          <div className="flex items-center gap-4">
            <button
              onClick={togglePlayback}
              className="p-2 bg-brand-500 hover:bg-brand-600 text-white rounded-full transition-colors"
              title="Play Recording"
            >
              <Play size={20} />
            </button>
            <audio ref={audioRef} src={audioURL} className="hidden" />
            <div className="flex-1">
              <div className="text-sm text-[var(--text-secondary)]">
                Recording ready ({formatTime(duration)})
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Permission Message */}
      {!permissionGranted && !isRecording && (
        <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <p className="text-sm text-yellow-400">
            Microphone access is required for voice recording. Click the microphone button to grant permission.
          </p>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
