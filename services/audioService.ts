const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
const sounds: { [key: string]: { buffer: AudioBuffer | null, source: AudioBufferSourceNode | null, url: string, isLoading: boolean } } = {
    ambient: { buffer: null, source: null, url: 'https://archive.org/download/Dm-S-Ambiences/Dm-S-Ambiences_amb01.mp3', isLoading: false },
    click: { buffer: null, source: null, url: 'https://archive.org/download/classic-click/classic_click.mp3', isLoading: false },
    navigate: { buffer: null, source: null, url: 'https://archive.org/download/whoosh-sound-effect-3-versions/Whoosh%20Sound%20Effect%203%20versions%20Version%202.mp3', isLoading: false },
    success: { buffer: null, source: null, url: 'https://archive.org/download/success-sound-effect/SUCCESS%20SOUND%20EFFECT.mp3', isLoading: false },
    fail: { buffer: null, source: null, url: 'https://archive.org/download/sound-effect-twinkles/Sound%20Effect%20-%20Twinkles.mp3', isLoading: false },
    purchase: { buffer: null, source: null, url: 'https://archive.org/download/cash-register-sound-effect-2/Cash%20Register%20Sound%20Effect.mp3', isLoading: false },
};

async function loadSound(name: string) {
    if (sounds[name]?.buffer || sounds[name]?.isLoading) {
        return;
    }
    sounds[name].isLoading = true;
    try {
        const response = await fetch(sounds[name].url, { mode: 'cors' });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        sounds[name].buffer = audioBuffer;
    } catch(e) {
        console.warn(`Could not load or decode sound: ${name}. Audio will be skipped.`, e);
    } finally {
        sounds[name].isLoading = false;
    }
}

// Preload common sounds
loadSound('click');
loadSound('navigate');
loadSound('ambient');


export const playSound = (name: string, loop = false) => {
    (async () => {
        if (audioContext.state === 'suspended') {
            await audioContext.resume();
        }

        const sound = sounds[name];
        if (!sound) return;

        if (!sound.buffer && !sound.isLoading) {
           await loadSound(name);
        }
        
        if(!sound.buffer) {
            return;
        }
        
        // For non-looping sounds, we want to play it every time, so create a new source.
        if (sound.source && !loop) {
             sound.source.stop();
        }
        // For looping sound, if it's already playing, do nothing.
        else if (sound.source && loop) {
            return;
        }
        
        const source = audioContext.createBufferSource();
        source.buffer = sound.buffer;
        source.connect(audioContext.destination);
        source.loop = loop;
        source.start();

        if (loop) {
            sound.source = source;
        }
    })();
};

export const stopSound = (name: string) => {
    const sound = sounds[name];
    if (sound && sound.source) {
        sound.source.stop();
        sound.source = null;
    }
};