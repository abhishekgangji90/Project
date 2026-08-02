import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  English: {
    translation: {
      "header": {
        "title": "AgriMitra AI",
        "subtitle": "AI Agriculture Advisor",
        "dashboard": "Dashboard",
        "cropAnalysis": "Crop Analysis",
        "fertilizer": "Fertilizer",
        "cropAdvisory": "Crop Advisory",
        "voiceChat": "Voice Chat",
        "logout": "Logout",
        "login": "Login",
        "register": "Register"
      },
      "dashboard": {
        "newConversation": "New Conversation",
        "selectConversation": "Select a conversation from the sidebar or start a new one.",
        "typeMessage": "Type your message...",
        "conversations": "Conversations"
      },
      "fertilizer": {
        "title": "Fertilizer Recommendation",
        "subtitle": "Get AI-powered sustainable fertilizer guidance for your crops.",
        "cropProfile": "Crop & Soil Profile",
        "cropName": "Crop Name *",
        "soilType": "Soil Type",
        "location": "Location *",
        "growthStage": "Growth Stage",
        "soilTestValues": "Soil Test Values (N-P-K, pH)",
        "availableFertilizer": "Available Fertilizers (Optional)",
        "getRecommendation": "Get Recommendation",
        "recommendationResult": "Recommendation Result",
        "nutrientRequirements": "Nutrient Requirements",
        "fertilizerGuidance": "Fertilizer Guidance",
        "applicationTiming": "Application Timing",
        "applicationMethod": "Application Method",
        "precautions": "Precautions",
        "soilHealth": "Soil Health & Sustainability",
        "history": "Previous Recommendations"
      },
      "advisory": {
        "title": "Crop Advisory System",
        "subtitle": "Get actionable crop care advice in English, Hindi, or Marathi based on your local conditions.",
        "cropProfile": "Crop Profile",
        "sowingDate": "Sowing Date *",
        "currentStage": "Current Stage",
        "symptoms": "Observed Symptoms (Optional)",
        "weatherConditions": "Current Weather (Optional)",
        "getAdvisory": "Get Advisory",
        "advisoryReport": "Advisory Report",
        "cropCare": "Crop Care",
        "irrigation": "Irrigation",
        "diseasePrevention": "Disease Prevention",
        "pestPrevention": "Pest Management",
        "nutrientGuidance": "Nutrient Guidance",
        "harvestPrep": "Harvest Preparation",
        "history": "Previous Advisories"
      },
      "voice": {
        "title": "Voice Assistant",
        "subtitle": "Speak to AgriMitra AI in your local language and listen to its advice.",
        "listening": "Listening...",
        "processing": "Processing...",
        "ready": "Ready",
        "tapToSpeak": "Tap to speak",
        "tapToStop": "Tap to stop recording",
        "replay": "Replay Last Response",
        "tapMic": "Tap the microphone to start speaking"
      },
      "common": {
        "loading": "Loading...",
        "errorRequired": "Please fill in all required fields."
      }
    }
  },
  Hindi: {
    translation: {
      "header": {
        "title": "एग्रीमित्रा एआई",
        "subtitle": "कृषि सलाहकार",
        "dashboard": "डैशबोर्ड",
        "cropAnalysis": "फसल विश्लेषण",
        "fertilizer": "उर्वरक (खाद)",
        "cropAdvisory": "फसल सलाह",
        "voiceChat": "वॉयस चैट",
        "logout": "लॉग आउट",
        "login": "लॉग इन",
        "register": "रजिस्टर करें"
      },
      "dashboard": {
        "newConversation": "नई बातचीत",
        "selectConversation": "साइडबार से बातचीत चुनें या नई शुरू करें।",
        "typeMessage": "अपना संदेश टाइप करें...",
        "conversations": "बातचीत"
      },
      "fertilizer": {
        "title": "उर्वरक अनुशंसा",
        "subtitle": "अपनी फसलों के लिए एआई-संचालित उर्वरक मार्गदर्शन प्राप्त करें।",
        "cropProfile": "फसल और मिट्टी प्रोफ़ाइल",
        "cropName": "फसल का नाम *",
        "soilType": "मिट्टी का प्रकार",
        "location": "स्थान *",
        "growthStage": "विकास का चरण",
        "soilTestValues": "मिट्टी परीक्षण मूल्य (N-P-K, pH)",
        "availableFertilizer": "उपलब्ध उर्वरक (वैकल्पिक)",
        "getRecommendation": "अनुशंसा प्राप्त करें",
        "recommendationResult": "अनुशंसा परिणाम",
        "nutrientRequirements": "पोषक तत्वों की आवश्यकताएं",
        "fertilizerGuidance": "उर्वरक मार्गदर्शन",
        "applicationTiming": "आवेदन का समय",
        "applicationMethod": "आवेदन विधि",
        "precautions": "सावधानियां",
        "soilHealth": "मिट्टी का स्वास्थ्य और स्थिरता",
        "history": "पिछली अनुशंसाएं"
      },
      "advisory": {
        "title": "फसल सलाह प्रणाली",
        "subtitle": "अपनी स्थानीय परिस्थितियों के आधार पर कार्रवाई योग्य फसल देखभाल सलाह प्राप्त करें।",
        "cropProfile": "फसल प्रोफ़ाइल",
        "sowingDate": "बुवाई की तारीख *",
        "currentStage": "वर्तमान चरण",
        "symptoms": "देखे गए लक्षण (वैकल्पिक)",
        "weatherConditions": "वर्तमान मौसम (वैकल्पिक)",
        "getAdvisory": "सलाह प्राप्त करें",
        "advisoryReport": "सलाह रिपोर्ट",
        "cropCare": "फसल देखभाल",
        "irrigation": "सिंचाई",
        "diseasePrevention": "रोग निवारण",
        "pestPrevention": "कीट प्रबंधन",
        "nutrientGuidance": "पोषक तत्व मार्गदर्शन",
        "harvestPrep": "फसल की तैयारी",
        "history": "पिछली सलाह"
      },
      "voice": {
        "title": "वॉयस असिस्टेंट",
        "subtitle": "एग्रीमित्रा एआई से बात करें और सलाह सुनें।",
        "listening": "सुन रहा है...",
        "processing": "प्रसंस्करण हो रहा है...",
        "ready": "तैयार",
        "tapToSpeak": "बोलने के लिए टैप करें",
        "tapToStop": "रिकॉर्डिंग रोकने के लिए टैप करें",
        "replay": "पिछली प्रतिक्रिया फिर से चलाएं",
        "tapMic": "बोलना शुरू करने के लिए माइक्रोफ़ोन टैप करें"
      },
      "common": {
        "loading": "लोड हो रहा है...",
        "errorRequired": "कृपया सभी आवश्यक फ़ील्ड भरें।"
      }
    }
  },
  Marathi: {
    translation: {
      "header": {
        "title": "ॲग्रीमित्रा एआय",
        "subtitle": "कृषी सल्लागार",
        "dashboard": "डॅशबोर्ड",
        "cropAnalysis": "पीक विश्लेषण",
        "fertilizer": "खत",
        "cropAdvisory": "पीक सल्ला",
        "voiceChat": "व्हॉईस चॅट",
        "logout": "लॉग आउट",
        "login": "लॉग इन",
        "register": "नोंदणी करा"
      },
      "dashboard": {
        "newConversation": "नवीन संभाषण",
        "selectConversation": "संभाषण निवडा किंवा नवीन सुरू करा.",
        "typeMessage": "तुमचा संदेश टाइप करा...",
        "conversations": "संभाषणे"
      },
      "fertilizer": {
        "title": "खत शिफारस",
        "subtitle": "पिकांसाठी एआय-आधारित खत मार्गदर्शन मिळवा.",
        "cropProfile": "पीक आणि माती माहिती",
        "cropName": "पिकाचे नाव *",
        "soilType": "मातीचा प्रकार",
        "location": "स्थान *",
        "growthStage": "वाढीचा टप्पा",
        "soilTestValues": "माती परीक्षण मूल्य (N-P-K, pH)",
        "availableFertilizer": "उपलब्ध खते (ऐच्छिक)",
        "getRecommendation": "शिफारस मिळवा",
        "recommendationResult": "शिफारस परिणाम",
        "nutrientRequirements": "पोषक तत्वांची आवश्यकता",
        "fertilizerGuidance": "खत मार्गदर्शन",
        "applicationTiming": "खत देण्याची वेळ",
        "applicationMethod": "खत देण्याची पद्धत",
        "precautions": "काळजी",
        "soilHealth": "मातीचे आरोग्य आणि शाश्वतता",
        "history": "मागील शिफारसी"
      },
      "advisory": {
        "title": "पीक सल्ला प्रणाली",
        "subtitle": "तुमच्या स्थानिक परिस्थितीनुसार पिकाच्या काळजीविषयी सल्ला मिळवा.",
        "cropProfile": "पीक माहिती",
        "sowingDate": "पेरणीची तारीख *",
        "currentStage": "सध्याचा टप्पा",
        "symptoms": "लक्षणे (ऐच्छिक)",
        "weatherConditions": "सध्याचे हवामान (ऐच्छिक)",
        "getAdvisory": "सल्ला मिळवा",
        "advisoryReport": "सल्ला अहवाल",
        "cropCare": "पिकाची काळजी",
        "irrigation": "सिंचन",
        "diseasePrevention": "रोग प्रतिबंध",
        "pestPrevention": "कीटक व्यवस्थापन",
        "nutrientGuidance": "पोषक तत्व मार्गदर्शन",
        "harvestPrep": "काढणीची तयारी",
        "history": "मागील सल्ले"
      },
      "voice": {
        "title": "व्हॉईस असिस्टंट",
        "subtitle": "ॲग्रीमित्रा एआय शी बोला आणि सल्ला ऐका.",
        "listening": "ऐकत आहे...",
        "processing": "प्रक्रिया करत आहे...",
        "ready": "तयार",
        "tapToSpeak": "बोलण्यासाठी टॅप करा",
        "tapToStop": "रेकॉर्डिंग थांबवण्यासाठी टॅप करा",
        "replay": "मागील उत्तर पुन्हा प्ले करा",
        "tapMic": "बोलणे सुरू करण्यासाठी मायक्रोफोनवर टॅप करा"
      },
      "common": {
        "loading": "लोड होत आहे...",
        "errorRequired": "कृपया सर्व आवश्यक माहिती भरा."
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "English", // Default language
    fallbackLng: "English",
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
