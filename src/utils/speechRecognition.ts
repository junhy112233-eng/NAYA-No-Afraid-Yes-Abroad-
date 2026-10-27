// Web Speech API wrapper with auto-stop on silence, mic permission check, and fallback support

export interface SpeechRecognitionResultState {
  transcript: string;
  isFinal: boolean;
}

export function checkBrowserEnvironment() {
  const userAgent = navigator.userAgent || '';
  const isInAppBrowser = /KAKAOTALK|Instagram|FB_IAB|Line|NAVER/i.test(userAgent);
  const SpeechRecognitionClass =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const isSupported = Boolean(SpeechRecognitionClass);

  return {
    isSupported,
    isInAppBrowser,
    isChrome: /Chrome|CriOS/i.test(userAgent) && !/Edge|OPR|SamsungBrowser/i.test(userAgent),
  };
}

export async function requestMicPermission(): Promise<{ granted: boolean; error?: string }> {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    return { granted: false, error: '이 브라우저는 오디오 입력을 지원하지 않습니다.' };
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    // Stop tracks immediately so recognition can take over without conflict
    stream.getTracks().forEach((track) => track.stop());
    return { granted: true };
  } catch (err: any) {
    console.warn('getUserMedia permission error:', err);
    if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
      return {
        granted: false,
        error: '마이크 권한이 차단되어 있습니다. 브라우저 주소창 왼쪽 🔒 아이콘을 눌러 마이크를 허용해주세요.',
      };
    }
    if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
      return {
        granted: false,
        error: '연결된 마이크 장치를 찾을 수 없습니다. 마이크 연결을 확인해주세요.',
      };
    }
    return {
      granted: false,
      error: `마이크를 시작할 수 없습니다: ${err.message || '알 수 없는 오류'}`,
    };
  }
}

export class SpeechRecognitionManager {
  private recognition: any = null;
  private silenceTimer: any = null;
  private initialSilenceTimer: any = null;
  private isListening: boolean = false;
  private onTranscriptCallback: ((transcript: string, isFinal: boolean) => void) | null = null;
  private onErrorCallback: ((errorMessage: string) => void) | null = null;
  private onEndCallback: (() => void) | null = null;
  private latestTranscript: string = '';
  private hasReceivedSpeech: boolean = false;

  constructor() {
    this.initRecognition();
  }

  private initRecognition() {
    const SpeechRecognitionClass =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognitionClass) {
      try {
        this.recognition = new SpeechRecognitionClass();
        this.recognition.lang = 'en-US';
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 1;

        this.setupHandlers();
      } catch (e) {
        console.error('Failed to construct SpeechRecognition:', e);
      }
    }
  }

  private setupHandlers() {
    if (!this.recognition) return;

    this.recognition.onstart = () => {
      this.isListening = true;
      this.latestTranscript = '';
      this.hasReceivedSpeech = false;

      // Generous initial timeout (8 seconds) waiting for student to start speaking
      this.clearTimers();
      this.initialSilenceTimer = setTimeout(() => {
        if (this.isListening && !this.hasReceivedSpeech) {
          console.log('No speech detected within initial timeout, stopping.');
          this.stop();
        }
      }, 8000);
    };

    this.recognition.onresult = (event: any) => {
      let finalSegment = '';
      let interimSegment = '';

      for (let i = 0; i < event.results.length; ++i) {
        const item = event.results[i];
        if (item.isFinal) {
          finalSegment += (finalSegment ? ' ' : '') + item[0].transcript;
        } else {
          interimSegment += (interimSegment ? ' ' : '') + item[0].transcript;
        }
      }

      const fullText = (finalSegment + (interimSegment ? ' ' + interimSegment : '')).trim();

      if (fullText) {
        this.latestTranscript = fullText;
        this.hasReceivedSpeech = true;

        // Clear the initial timeout since student has spoken
        if (this.initialSilenceTimer) {
          clearTimeout(this.initialSilenceTimer);
          this.initialSilenceTimer = null;
        }

        // Notify caller of interim progress
        if (this.onTranscriptCallback) {
          this.onTranscriptCallback(fullText, false);
        }

        // Reset silence timer: stop automatically 2.0s after silence following speech
        this.clearSilenceTimer();
        this.silenceTimer = setTimeout(() => {
          if (this.isListening) {
            console.log('Silence detected after speech, stopping recognition.');
            this.stop();
          }
        }, 2000);
      }
    };

    this.recognition.onerror = (event: any) => {
      console.warn('Speech recognition error event:', event.error);
      this.clearTimers();

      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        this.onErrorCallback?.(
          '마이크 권한이 차단되었습니다. 브라우저 상단 주소창 🔒에서 마이크를 [허용]해주세요.'
        );
      } else if (event.error === 'no-speech') {
        // Will be treated as empty transcript in onend
      } else if (event.error === 'network') {
        this.onErrorCallback?.(
          '음성 인식 네트워크 연결이 원활하지 않습니다. 잠시 후 다시 시도하거나 직접 입력해 보세요.'
        );
      } else if (event.error === 'audio-capture') {
        this.onErrorCallback?.('마이크 연결을 확인해 주세요.');
      } else {
        this.onErrorCallback?.(`음성 인식 알림: ${event.error}`);
      }

      this.isListening = false;
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.clearTimers();

      const textToSend = this.latestTranscript.trim();
      if (this.onTranscriptCallback) {
        this.onTranscriptCallback(textToSend, true);
      }
      this.onEndCallback?.();
    };
  }

  private clearTimers() {
    this.clearSilenceTimer();
    if (this.initialSilenceTimer) {
      clearTimeout(this.initialSilenceTimer);
      this.initialSilenceTimer = null;
    }
  }

  private clearSilenceTimer() {
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }
  }

  public async start(
    onTranscript: (transcript: string, isFinal: boolean) => void,
    onError: (errorMessage: string) => void,
    onEnd: () => void
  ) {
    this.onTranscriptCallback = onTranscript;
    this.onErrorCallback = onError;
    this.onEndCallback = onEnd;

    // Check permission first via getUserMedia if available
    const perm = await requestMicPermission();
    if (!perm.granted) {
      onError(perm.error || '마이크 사용 권한이 필요합니다.');
      return;
    }

    if (!this.recognition) {
      this.initRecognition();
    }

    if (!this.recognition) {
      onError('이 브라우저에서는 음성 인식(Web Speech API)을 지원하지 않습니다. 구글 크롬을 권장합니다.');
      return;
    }

    if (this.isListening) {
      this.stop();
    }

    this.latestTranscript = '';
    this.hasReceivedSpeech = false;

    try {
      this.recognition.start();
    } catch (e: any) {
      console.warn('Recognition start exception, retrying reset:', e);
      // If already started or abort state, recreate instance
      this.initRecognition();
      try {
        this.recognition.start();
      } catch (err2: any) {
        onError('마이크를 시작하지 못했습니다. 잠시 후 다시 눌러주세요.');
      }
    }
  }

  public stop() {
    this.clearTimers();
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        // Ignore already stopped
      }
    }
    this.isListening = false;
  }

  public get active(): boolean {
    return this.isListening;
  }
}
