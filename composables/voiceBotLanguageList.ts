
 export const useLanguageList = () => {
 const languageList = [
  {
    "label": "Afrikaans (South Africa)",
    "value": "af-ZA"
  },
  {
    "label": "Albanian (Albania)",
    "value": "sq-AL"
  },
  {
    "label": "Amharic (Ethiopia)",
    "value": "am-ET"
  },
  {
    "label": "Arabic (Algeria)",
    "value": "ar-DZ"
  },
  {
    "label": "Arabic (Bahrain)",
    "value": "ar-BH"
  },
  {
    "label": "Arabic (Egypt)",
    "value": "ar-EG"
  },
  {
    "label": "Arabic (Iraq)",
    "value": "ar-IQ"
  },
  {
    "label": "Arabic (Israel)",
    "value": "ar-IL"
  },
  {
    "label": "Arabic (Jordan)",
    "value": "ar-JO"
  },
  {
    "label": "Arabic (Kuwait)",
    "value": "ar-KW"
  },
  {
    "label": "Arabic (Lebanon)",
    "value": "ar-LB"
  },
  {
    "label": "Arabic (Mauritania)",
    "value": "ar-MR"
  },
  {
    "label": "Arabic (Morocco)",
    "value": "ar-MA"
  },
  {
    "label": "Arabic (Oman)",
    "value": "ar-OM"
  },
  {
    "label": "Arabic (Qatar)",
    "value": "ar-QA"
  },
  {
    "label": "Arabic (Saudi Arabia)",
    "value": "ar-SA"
  },
  {
    "label": "Arabic (State of Palestine)",
    "value": "ar-PS"
  },
  {
    "label": "Arabic (Syria)",
    "value": "ar-SY"
  },
  {
    "label": "Arabic (Tunisia)",
    "value": "ar-TN"
  },
  {
    "label": "Arabic (United Arab Emirates)",
    "value": "ar-AE"
  },
  {
    "label": "Arabic (Yemen)",
    "value": "ar-YE"
  },
  {
    "label": "Armenian (Armenia)",
    "value": "hy-AM"
  },
  {
    "label": "Azerbaijani (Azerbaijan)",
    "value": "az-AZ"
  },
  {
    "label": "Basque (Spain)",
    "value": "eu-ES"
  },
  {
    "label": "Bengali (Bangladesh)",
    "value": "bn-BD"
  },
  {
    "label": "Bengali (India)",
    "value": "bn-IN"
  },
  {
    "label": "Bosnian (Bosnia and Herzegovina)",
    "value": "bs-BA"
  },
  {
    "label": "Bulgarian (Bulgaria)",
    "value": "bg-BG"
  },
  {
    "label": "Burmese (Myanmar)",
    "value": "my-MM"
  },
  {
    "label": "Catalan (Spain)",
    "value": "ca-ES"
  },
  {
    "label": "Chinese (Simplified, China)",
    "value": "cmn-Hans-CN"
  },
  {
    "label": "Chinese (Simplified, Hong Kong)",
    "value": "cmn-Hans-HK"
  },
  {
    "label": "Chinese (Traditional, Taiwan)",
    "value": "cmn-Hant-TW"
  },
  {
    "label": "Chinese, Cantonese (Traditional Hong Kong)",
    "value": "yue-Hant-HK"
  },
  {
    "label": "Croatian (Croatia)",
    "value": "hr-HR"
  },
  {
    "label": "Czech (Czech Republic)",
    "value": "cs-CZ"
  },
  {
    "label": "Danish (Denmark)",
    "value": "da-DK"
  },
  {
    "label": "Dutch (Belgium)",
    "value": "nl-BE"
  },
  {
    "label": "Dutch (Netherlands)",
    "value": "nl-NL"
  },
  {
    "label": "English (Australia)",
    "value": "en-AU"
  },
  {
    "label": "English (Canada)",
    "value": "en-CA"
  },
  {
    "label": "English (Ghana)",
    "value": "en-GH"
  },
  {
    "label": "English (Hong Kong)",
    "value": "en-HK"
  },
  {
    "label": "English (India)",
    "value": "en-IN"
  },
  {
    "label": "English (Ireland)",
    "value": "en-IE"
  },
  {
    "label": "English (Kenya)",
    "value": "en-KE"
  },
  {
    "label": "English (New Zealand)",
    "value": "en-NZ"
  },
  {
    "label": "English (Nigeria)",
    "value": "en-NG"
  },
  {
    "label": "English (Pakistan)",
    "value": "en-PK"
  },
  {
    "label": "English (Philippines)",
    "value": "en-PH"
  },
  {
    "label": "English (Singapore)",
    "value": "en-SG"
  },
  {
    "label": "English (South Africa)",
    "value": "en-ZA"
  },
  {
    "label": "English (Tanzania)",
    "value": "en-TZ"
  },
  {
    "label": "English (United Kingdom)",
    "value": "en-GB"
  },
  {
    "label": "English (United States)",
    "value": "en-US"
  },
  {
    "label": "Estonian (Estonia)",
    "value": "et-EE"
  },
  {
    "label": "Filipino (Philippines)",
    "value": "fil-PH"
  },
  {
    "label": "Finnish (Finland)",
    "value": "fi-FI"
  },
  {
    "label": "French (Belgium)",
    "value": "fr-BE"
  },
  {
    "label": "French (Canada)",
    "value": "fr-CA"
  },
  {
    "label": "French (France)",
    "value": "fr-FR"
  },
  {
    "label": "French (Switzerland)",
    "value": "fr-CH"
  },
  {
    "label": "Galician (Spain)",
    "value": "gl-ES"
  },
  {
    "label": "Georgian (Georgia)",
    "value": "ka-GE"
  },
  {
    "label": "German (Austria)",
    "value": "de-AT"
  },
  {
    "label": "German (Germany)",
    "value": "de-DE"
  },
  {
    "label": "German (Switzerland)",
    "value": "de-CH"
  },
  {
    "label": "Greek (Greece)",
    "value": "el-GR"
  },
  {
    "label": "Gujarati (India)",
    "value": "gu-IN"
  },
  {
    "label": "Hebrew (Israel)",
    "value": "iw-IL"
  },
  {
    "label": "Hindi (India)",
    "value": "hi-IN"
  },
  {
    "label": "Hungarian (Hungary)",
    "value": "hu-HU"
  },
  {
    "label": "Icelandic (Iceland)",
    "value": "is-IS"
  },
  {
    "label": "Indonesian (Indonesia)",
    "value": "id-ID"
  },
  {
    "label": "Italian (Italy)",
    "value": "it-IT"
  },
  {
    "label": "Italian (Switzerland)",
    "value": "it-CH"
  },
  {
    "label": "Japanese (Japan)",
    "value": "ja-JP"
  },
  {
    "label": "Javanese (Indonesia)",
    "value": "jv-ID"
  },
  {
    "label": "Kannada (India)",
    "value": "kn-IN"
  },
  {
    "label": "Kazakh (Kazakhstan)",
    "value": "kk-KZ"
  },
  {
    "label": "Khmer (Cambodia)",
    "value": "km-KH"
  },
  {
    "label": "Kinyarwanda (Rwanda)",
    "value": "rw-RW"
  },
  {
    "label": "Korean (South Korea)",
    "value": "ko-KR"
  },
  {
    "label": "Lao (Laos)",
    "value": "lo-LA"
  },
  {
    "label": "Latvian (Latvia)",
    "value": "lv-LV"
  },
  {
    "label": "Lithuanian (Lithuania)",
    "value": "lt-LT"
  },
  {
    "label": "Macedonian (North Macedonia)",
    "value": "mk-MK"
  },
  {
    "label": "Malay (Malaysia)",
    "value": "ms-MY"
  },
  {
    "label": "Malayalam (India)",
    "value": "ml-IN"
  },
  {
    "label": "Marathi (India)",
    "value": "mr-IN"
  },
  {
    "label": "Mongolian (Mongolia)",
    "value": "mn-MN"
  },
  {
    "label": "Nepali (Nepal)",
    "value": "ne-NP"
  },
  {
    "label": "Norwegian Bokmål (Norway)",
    "value": "no-NO"
  },
  {
    "label": "Persian (Iran)",
    "value": "fa-IR"
  },
  {
    "label": "Polish (Poland)",
    "value": "pl-PL"
  },
  {
    "label": "Portuguese (Brazil)",
    "value": "pt-BR"
  },
  {
    "label": "Portuguese (Portugal)",
    "value": "pt-PT"
  },
  {
    "label": "Punjabi (Gurmukhi India)",
    "value": "pa-Guru-IN"
  },
  {
    "label": "Romanian (Romania)",
    "value": "ro-RO"
  },
  {
    "label": "Russian (Russia)",
    "value": "ru-RU"
  },
  {
    "label": "Serbian (Serbia)",
    "value": "sr-RS"
  },
  {
    "label": "Sinhala (Sri Lanka)",
    "value": "si-LK"
  },
  {
    "label": "Slovak (Slovakia)",
    "value": "sk-SK"
  },
  {
    "label": "Slovenian (Slovenia)",
    "value": "sl-SI"
  },
  {
    "label": "Southern Sotho (South Africa)",
    "value": "st-ZA"
  },
  {
    "label": "Spanish (Argentina)",
    "value": "es-AR"
  },
  {
    "label": "Spanish (Bolivia)",
    "value": "es-BO"
  },
  {
    "label": "Spanish (Chile)",
    "value": "es-CL"
  },
  {
    "label": "Spanish (Colombia)",
    "value": "es-CO"
  },
  {
    "label": "Spanish (Costa Rica)",
    "value": "es-CR"
  },
  {
    "label": "Spanish (Dominican Republic)",
    "value": "es-DO"
  },
  {
    "label": "Spanish (Ecuador)",
    "value": "es-EC"
  },
  {
    "label": "Spanish (El Salvador)",
    "value": "es-SV"
  },
  {
    "label": "Spanish (Guatemala)",
    "value": "es-GT"
  },
  {
    "label": "Spanish (Honduras)",
    "value": "es-HN"
  },
  {
    "label": "Spanish (Mexico)",
    "value": "es-MX"
  },
  {
    "label": "Spanish (Nicaragua)",
    "value": "es-NI"
  },
  {
    "label": "Spanish (Panama)",
    "value": "es-PA"
  },
  {
    "label": "Spanish (Paraguay)",
    "value": "es-PY"
  },
  {
    "label": "Spanish (Peru)",
    "value": "es-PE"
  },
  {
    "label": "Spanish (Puerto Rico)",
    "value": "es-PR"
  },
  {
    "label": "Spanish (Spain)",
    "value": "es-ES"
  },
  {
    "label": "Spanish (United States)",
    "value": "es-US"
  },
  {
    "label": "Spanish (Uruguay)",
    "value": "es-UY"
  },
  {
    "label": "Spanish (Venezuela)",
    "value": "es-VE"
  },
  {
    "label": "Sundanese (Indonesia)",
    "value": "su-ID"
  },
  {
    "label": "Swahili (Kenya)",
    "value": "sw-KE"
  },
  {
    "label": "Swahili (Tanzania)",
    "value": "sw-TZ"
  },
  {
    "label": "Swati (Latin, South Africa)",
    "value": "ss-Latn-ZA"
  },
  {
    "label": "Swedish (Sweden)",
    "value": "sv-SE"
  },
  {
    "label": "Tamil (India)",
    "value": "ta-IN"
  },
  {
    "label": "Tamil (Malaysia)",
    "value": "ta-MY"
  },
  {
    "label": "Tamil (Singapore)",
    "value": "ta-SG"
  },
  {
    "label": "Tamil (Sri Lanka)",
    "value": "ta-LK"
  },
  {
    "label": "Telugu (India)",
    "value": "te-IN"
  },
  {
    "label": "Thai (Thailand)",
    "value": "th-TH"
  },
  {
    "label": "Tsonga (South Africa)",
    "value": "ts-ZA"
  },
  {
    "label": "Tswana (Latin, South Africa)",
    "value": "tn-Latn-ZA"
  },
  {
    "label": "Turkish (Turkey)",
    "value": "tr-TR"
  },
  {
    "label": "Ukrainian (Ukraine)",
    "value": "uk-UA"
  },
  {
    "label": "Urdu (India)",
    "value": "ur-IN"
  },
  {
    "label": "Urdu (Pakistan)",
    "value": "ur-PK"
  },
  {
    "label": "Uzbek (Uzbekistan)",
    "value": "uz-UZ"
  },
  {
    "label": "Venda (South Africa)",
    "value": "ve-ZA"
  },
  {
    "label": "Vietnamese (Vietnam)",
    "value": "vi-VN"
  },
  {
    "label": "Xhosa (South Africa)",
    "value": "xh-ZA"
  },
  {
    "label": "Zulu (South Africa)",
    "value": "zu-ZA"
  }
]
  return { languageList }
}