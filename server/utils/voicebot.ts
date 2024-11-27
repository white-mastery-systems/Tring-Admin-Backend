export let defaultSpeechToTextConfig = {     
    "provider": "deepgram",
    "google": {
        "adaptation": true,
        "phrase_sets": [],
        "model": "short",
        "recognizer": "",
        "amplification_factor": 2
    },
    "azure": {
        "phrase_list": [],
        "amplification_factor": 3,
    },
    "deepgram": {
        "model": "nova-2",
        "utterance_end_ms": "1000",
        "endpointing": 250,
        "keywords": [],
        "amplification_factor": 2,
    },
    "assemblyai": {
        "word_boost": [],
        "end_utterance_silence_threshold": 300,
        "amplification_factor": 2
    }
};

export let defaultTextToSpeechConfig = {
    "provider": "google",
    "google": {
        "name": "en-IN-Neural2-A",
        "speaking_rate": 1,
        "pitch": 1,
        "volume_gain_db": 0.5
    },
    "elevenlabs": {
        "api_key": "",
        "stability": 0.5,
        "similarity_boost": 1,
        "style": 0.5,
        "use_speaker_boost": false,
        "voice": "",
        "model": ""
    },
    "deepgram": {
        "voice": "aura-asteria-en"
    },
    "tring": {
        "api_key": "",
        "speaker": "", 
        "speed": 1, 
        "silence_pad":  250
    }
}


export const updateVoicebotConfig = (config: any, newConfig: any) => {
   // Deep copy the default configuration
    const defaultData = JSON.parse(JSON.stringify(config));

    // Merge updates into the deep copy
    for (const key in newConfig) {
        if (typeof newConfig[key] === "object" && newConfig[key] !== null) {
            // Merge nested objects
            defaultData[key] = { ...defaultData[key], ...newConfig[key] };
        } else {
            // Update simple keys
            defaultData[key] = newConfig[key];
        }
    }

    return defaultData;
}


