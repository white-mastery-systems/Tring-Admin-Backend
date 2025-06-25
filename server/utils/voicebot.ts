import { ecommerceVoiceInputPromptText } from "./voicebot-prompt-templates-texts/e-commerce/inbound";
import { ecommerceVoiceOutboundPromptText } from "./voicebot-prompt-templates-texts/e-commerce/outbound";
import { educationAndTrainingInboundPromptText } from "./voicebot-prompt-templates-texts/education-training/inbound";
import { educationAndTrainingOutboundPromptText } from "./voicebot-prompt-templates-texts/education-training/outbound";
import { energyAndUtilitiesVoiceInboundPromptText } from "./voicebot-prompt-templates-texts/energy-utilities/inbound";
import { energyAndUtilitiesVoiceOutboundPromptText } from "./voicebot-prompt-templates-texts/energy-utilities/outbound";
import { financeBankingVoiceInboundPromptText } from "./voicebot-prompt-templates-texts/finance-banking/inbound";
import { financeBankingVoiceOutboundPromptText } from "./voicebot-prompt-templates-texts/finance-banking/outbound";
import { governmentSectorsVoiceInboundPromptText } from "./voicebot-prompt-templates-texts/government-sectors/inbound";
import { governmentSectorsVoiceOutboundPromptText } from "./voicebot-prompt-templates-texts/government-sectors/outbound";
import { healthcareVoiceInboundPromptText } from "./voicebot-prompt-templates-texts/healthcare/inbound";
import { healthcareVoiceOutboundPromptText } from "./voicebot-prompt-templates-texts/healthcare/outbound";
import { hospitalityVoiceInboundPromptText } from "./voicebot-prompt-templates-texts/hospitality/inbound";
import { hospitalityVoiceOutboundPromptText } from "./voicebot-prompt-templates-texts/hospitality/outbound";
import { logisticsVoiceInboundPromptText } from "./voicebot-prompt-templates-texts/logistics/inbound";
import { logisticsVoiceOutboundPromptText } from "./voicebot-prompt-templates-texts/logistics/outbound";
import { realEstateVoiceInboundPromptText } from "./voicebot-prompt-templates-texts/real-estate/inbound";
import { realEstateVoiceOutboundPromptText } from "./voicebot-prompt-templates-texts/real-estate/outbound";
import { telecommunicationsVoiceInboundPromptText } from "./voicebot-prompt-templates-texts/telecommunications/inbound";
import { telecommunicationsVoiceOutboundPromptText } from "./voicebot-prompt-templates-texts/telecommunications/outbound";
import { travelVoiceInboundPromptText } from "./voicebot-prompt-templates-texts/travel/inbound";
import { travelVoiceOutboundPromptText } from "./voicebot-prompt-templates-texts/travel/outbound";
import { ecommerceVoiceInputPrompt } from "./voicebot-prompt-templates/e-commerce/inbound";
import { ecommerceVoiceOutboundPrompt } from "./voicebot-prompt-templates/e-commerce/outbound";
import { energyAndUtilitiesVoiceInboundPrompt } from "./voicebot-prompt-templates/energy-utilities/inbound";
import { energyAndUtilitiesVoiceOutboundPrompt } from "./voicebot-prompt-templates/energy-utilities/outbound";
import { financeBankingVoiceInboundPrompt } from "./voicebot-prompt-templates/finance-banking/inbound";
import { financeBankingVoiceOutboundPrompt } from "./voicebot-prompt-templates/finance-banking/outbound";
import { governmentSectorsVoiceInboundPrompt } from "./voicebot-prompt-templates/government-sectors/inbound";
import { governmentSectorsVoiceOutboundPrompt } from "./voicebot-prompt-templates/government-sectors/outbound";
import { healthcareVoiceInboundPrompt } from "./voicebot-prompt-templates/healthcare/inbound";
import { healthcareVoiceOutboundPrompt } from "./voicebot-prompt-templates/healthcare/outbound";
import { hospitalityVoiceInboundPrompt } from "./voicebot-prompt-templates/hospitality/inbound";
import { hospitalityVoiceOutboundPrompt } from "./voicebot-prompt-templates/hospitality/outbound";
import { logisticsVoiceInboundPrompt } from "./voicebot-prompt-templates/logistics/inbound";
import { logisticsVoiceOutboundPrompt } from "./voicebot-prompt-templates/logistics/outbound";
import { realEstateVoiceInboundPrompt } from "./voicebot-prompt-templates/real-estate/inbound";
import { realEstateVoiceOutboundPrompt } from "./voicebot-prompt-templates/real-estate/outbound";
import { telecommunicationsVoiceInboundPrompt } from "./voicebot-prompt-templates/telecommunications/inbound";
import { telecommunicationsVoiceOutboundPrompt } from "./voicebot-prompt-templates/telecommunications/outbound";
import { travelVoiceInboundPrompt } from "./voicebot-prompt-templates/travel/inbound";
import { travelVoiceOutboundPrompt } from "./voicebot-prompt-templates/travel/outbound";

export let defaultSpeechToTextConfig = {     
    "provider": "deepgram",
    "google": {
        "adaptation": true,
        "phrase_sets": [],
        "model": "short",
        "recognizer": "",
        "amplification_factor": 2
    },
    "deepgram": {
        "model": "nova-3",
        "utterance_end_ms": "1000",
        "endpointing": 300,
        "keywords": [],
        "amplification_factor": 2,
    }
};

export let defaultTextToSpeechConfig = {
    "provider": "google",
    "integratedTtsProvider": "google",
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
      "speed": 1,
      "model": ""
    },
    "deepgram": {
      "voice": "aura-2-asteria-en",
      "model": "aura-2"
    },
    "tring": {
      "api_key": "",
      "speaker": "", 
      "speed": 1, 
      "silence_pad":  250
    },
    "cartesia": {
      "model": "",
      "speed": "fast",
      "voice": "",
      "api_key": "",
      "version": "2024-06-10"
    },
    "neuphonic": {
      "voice": "",
      "speed": 1.0,
      "api_key": ""
    },
    "rime": {
      "model": "",
      "voice" : "",
      "api_key": "",
      "speed_alpha": 1.0,
      "reduce_latency": false,
      "repetition_penalty": 1.5,
      "temperature": 0.5,
      "top_p": 0.5,
      "max_tokens": 1200
    },
    "smallestai": {
      "model": "",
      "voice": "",
      "api_key": "",
      "speed": 1.0,
      "consistency": 0.5,
      "similarity": 0.1,
      "enhancement": 1.0
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

export const getInboundPromptByIndustryType = ({ industryType, name, role, goal, companyName, knowledgeBase }: {
  industryType: string,
  name: string,
  role: string,
  goal: string,
  companyName: string,
  knowledgeBase: string
}) => {
    let inboundPrompt
    let outboundPrompt
    switch(industryType) {
      case "real-estate": 
        inboundPrompt = realEstateVoiceInboundPrompt({ name, role, goal, companyName, knowledgeBase })
        outboundPrompt = realEstateVoiceOutboundPrompt({ name, role, goal, companyName, knowledgeBase })
        break

      case "e-commerce":
        inboundPrompt = ecommerceVoiceInputPrompt({ name, role, goal, companyName, knowledgeBase })
        outboundPrompt = ecommerceVoiceOutboundPrompt({ name, role, goal, companyName, knowledgeBase })
        break
      
      case "finance-banking":
        inboundPrompt = financeBankingVoiceInboundPrompt({ name, role, goal, companyName, knowledgeBase })
        outboundPrompt = financeBankingVoiceOutboundPrompt({ name, role, goal, companyName, knowledgeBase })
        break
      
      case "healthcare":
        inboundPrompt = healthcareVoiceInboundPrompt({ name, role, goal, companyName, knowledgeBase })
        outboundPrompt = healthcareVoiceOutboundPrompt({ name, role, goal, companyName, knowledgeBase })
        break

      case "hospitality":
        inboundPrompt = hospitalityVoiceInboundPrompt({ name, role, goal, companyName, knowledgeBase })
        outboundPrompt = hospitalityVoiceOutboundPrompt({ name, role, goal, companyName, knowledgeBase })
        break
    
      case "telecommunications":
        inboundPrompt = telecommunicationsVoiceInboundPrompt({ name, role, goal, companyName, knowledgeBase })
        outboundPrompt = telecommunicationsVoiceOutboundPrompt({ name, role, goal, companyName, knowledgeBase })
        break

      case "travel":
        inboundPrompt = travelVoiceInboundPrompt({ name, role, goal, companyName, knowledgeBase })
        outboundPrompt = travelVoiceOutboundPrompt({ name, role, goal, companyName, knowledgeBase })
        break

      case "energy-utilities":
        inboundPrompt = energyAndUtilitiesVoiceInboundPrompt({ name, role, goal, companyName, knowledgeBase })
        outboundPrompt = energyAndUtilitiesVoiceOutboundPrompt({ name, role, goal, companyName, knowledgeBase })
        break

      case "government-sectors":
        inboundPrompt = governmentSectorsVoiceInboundPrompt({ name, role, goal, companyName, knowledgeBase })
        outboundPrompt = governmentSectorsVoiceOutboundPrompt({ name, role, goal, companyName, knowledgeBase })
        break
      
      case "logistics":
        inboundPrompt = logisticsVoiceInboundPrompt({ name, role, goal, companyName, knowledgeBase })
        outboundPrompt = logisticsVoiceOutboundPrompt({ name, role, goal, companyName, knowledgeBase })
        break

      case "education-training":
        inboundPrompt = educationAndTrainingInboundPrompt({ name, role, goal, companyName, knowledgeBase })
        outboundPrompt = educationAndTrainingOutboundPrompt({ name, role, goal, companyName, knowledgeBase })
        break
    }

    return {
      inboundPrompt,
      outboundPrompt
    }
}

export const getVoicebotPromptTextByIndustryType = ({ industryType, name, role, goal, companyName, knowledgeBase }: {
  industryType: string,
  name: string,
  role: string,
  goal: string,
  companyName: string,
  knowledgeBase: string
}) => {
    let inboundPrompt = ""
    let outboundPrompt = ""
    switch(industryType) {
      case "real-estate": 
        inboundPrompt = realEstateVoiceInboundPromptText({ name, role, goal, companyName, knowledgeBase })
        outboundPrompt = realEstateVoiceOutboundPromptText({ name, role, goal, companyName, knowledgeBase })
        break

      case "e-commerce":
        inboundPrompt = ecommerceVoiceInputPromptText({ name, role, goal, companyName, knowledgeBase })
        outboundPrompt = ecommerceVoiceOutboundPromptText({ name, role, goal, companyName, knowledgeBase })
        break
      
      case "finance-banking":
        inboundPrompt = financeBankingVoiceInboundPromptText({ name, role, goal, companyName, knowledgeBase })
        outboundPrompt = financeBankingVoiceOutboundPromptText({ name, role, goal, companyName, knowledgeBase })
        break
      
      case "healthcare":
        inboundPrompt = healthcareVoiceInboundPromptText({ name, role, goal, companyName, knowledgeBase })
        outboundPrompt = healthcareVoiceOutboundPromptText({ name, role, goal, companyName, knowledgeBase })
        break

      case "hospitality":
        inboundPrompt = hospitalityVoiceInboundPromptText({ name, role, goal, companyName, knowledgeBase })
        outboundPrompt = hospitalityVoiceOutboundPromptText({ name, role, goal, companyName, knowledgeBase })
        break
    
      case "telecommunications":
        inboundPrompt = telecommunicationsVoiceInboundPromptText({ name, role, goal, companyName, knowledgeBase })
        outboundPrompt = telecommunicationsVoiceOutboundPromptText({ name, role, goal, companyName, knowledgeBase })
        break

      case "travel":
        inboundPrompt = travelVoiceInboundPromptText({ name, role, goal, companyName, knowledgeBase })
        outboundPrompt = travelVoiceOutboundPromptText({ name, role, goal, companyName, knowledgeBase })
        break

      case "energy-utilities":
        inboundPrompt = energyAndUtilitiesVoiceInboundPromptText({ name, role, goal, companyName, knowledgeBase })
        outboundPrompt = energyAndUtilitiesVoiceOutboundPromptText({ name, role, goal, companyName, knowledgeBase })
        break

      case "government-sectors":
        inboundPrompt = governmentSectorsVoiceInboundPromptText({ name, role, goal, companyName, knowledgeBase })
        outboundPrompt = governmentSectorsVoiceOutboundPromptText({ name, role, goal, companyName, knowledgeBase })
        break
      
      case "logistics":
        inboundPrompt = logisticsVoiceInboundPromptText({ name, role, goal, companyName, knowledgeBase })
        outboundPrompt = logisticsVoiceOutboundPromptText({ name, role, goal, companyName, knowledgeBase })
        break

      case "education-training":
        inboundPrompt = educationAndTrainingInboundPromptText({ name, role, goal, companyName, knowledgeBase })
        outboundPrompt = educationAndTrainingOutboundPromptText({ name, role, goal, companyName, knowledgeBase })
        break
    }

    return {
      inboundPrompt,
      outboundPrompt
    }
}
