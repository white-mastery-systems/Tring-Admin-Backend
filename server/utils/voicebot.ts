export let defaultSpeechToTextConfig = {
    "provider": "deepgram",
    "google": {
        "adaptation": true,
        "phrase_sets": [],
        "model": "short",
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
        "use_speaker_boost": false
    },
    "deepgram": {
        "voice": "aura-asteria-en"
    },
    "tring": {
        "api_key": "",
        "speaker": "jaya", // (dropdown values Jaya,Kevin,Sneha)
        "speed": 1, // (0 to 2)
        "sample_rate":  250
    }
}


export const updateVoicebotConfig = (config: any, provider: string, newConfig: any) => {
    // Update the provider
    config.provider = provider;

    // Update the specific provider configuration
    if (config[provider]) {
        delete newConfig.provider
        config[provider] = newConfig[provider];
    }

    return config;
}
