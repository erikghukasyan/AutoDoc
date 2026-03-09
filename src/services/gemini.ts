import { GoogleGenAI, Type } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

function getAI() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Gemini API key is missing. Please set GEMINI_API_KEY in your environment.");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

export interface SearchResult {
  text: string;
  links: { uri: string; title: string }[];
}

export interface VinResult {
  text: string;
  links: { uri: string; title: string }[];
}

export interface MaintenanceResult {
  text: string;
  oilChange: string;
  brakePads: string;
  majorService: string;
}

export interface MapResult {
  text: string;
  places: { uri: string; title: string }[];
}

export interface AppraisalResult {
  status: 'deal' | 'fair' | 'overpriced';
  estimatedValue: string;
  analysis: string;
  confidence: number;
}

export async function searchCarProblem(problem: string): Promise<SearchResult> {
  const ai = getAI();
  const model = "gemini-3-flash-preview";
  
  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        role: "user",
        parts: [{ text: `Ես ունեմ հետևյալ խնդիրը իմ ավտոմեքենայի հետ: "${problem}": 
        Խնդրում եմ տրամադրել մանրամասն վերլուծություն՝
        1. Ինչով կարող է պայմանավորված լինել այս խնդիրը (հնարավոր պատճառներ)
        2. Ինչպես կարելի է լուծել այն (քայլ առ քայլ հրահանգներ)
        3. Կարևոր տեղեկություններ տվյալ մեքենայի կամ համակարգի վերաբերյալ
        4. Գտիր և տրամադրիր YouTube-ի կամ այլ օգտակար տեսանյութերի հղումներ, որոնք ցույց են տալիս լուծումը:
        
        Պատասխանիր հայերենով: Օգտագործիր Google Search գործիքը՝ ճշգրիտ տեղեկություններ և տեսանյութերի հղումներ գտնելու համար:` }],
      }
    ],
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const text = response.text || "Ցավոք, պատասխան չհաջողվեց գտնել:";
  const links = response.candidates?.[0]?.groundingMetadata?.groundingChunks
    ?.filter(chunk => chunk.web)
    ?.map(chunk => ({
      uri: chunk.web!.uri,
      title: chunk.web!.title || chunk.web!.uri
    })) || [];

  return { text, links };
}

export async function checkVin(vin: string): Promise<VinResult> {
  const ai = getAI();
  const model = "gemini-3-flash-preview";
  
  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        role: "user",
        parts: [{ text: `Խնդրում եմ տրամադրել մանրամասն տեղեկատվություն հետևյալ VIN կոդով ավտոմեքենայի վերաբերյալ: "${vin}": 
        Ինձ անհրաժեշտ է՝
        1. Մեքենայի տեխնիկական տվյալները (մոդել, տարեթիվ, շարժիչ և այլն)
        2. Հնարավոր recall-ներ (հետկանչեր)
        3. Մեքենայի պատմության վերաբերյալ հասանելի տեղեկություններ
        Պատասխանիր հայերենով: Օգտագործիր Google Search գործիքը՝ ճշգրիտ տվյալներ գտնելու համար:` }],
      }
    ],
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const text = response.text || "VIN կոդի վերաբերյալ տեղեկատվություն չգտնվեց:";
  const links = response.candidates?.[0]?.groundingMetadata?.groundingChunks
    ?.filter(chunk => chunk.web)
    ?.map(chunk => ({
      uri: chunk.web!.uri,
      title: chunk.web!.title || chunk.web!.uri
    })) || [];

  return { text, links };
}

export async function calculateMaintenance(modelName: string, year: string, mileage: string): Promise<MaintenanceResult> {
  const ai = getAI();
  const model = "gemini-3-flash-preview";
  
  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        role: "user",
        parts: [{ text: `Խնդրում եմ տրամադրել սպասարկման ժամանակացույց հետևյալ մեքենայի համար.
        Մոդել: ${modelName}
        Տարեթիվ: ${year}
        Վազք: ${mileage} կմ
        
        Ինձ անհրաժեշտ է իմանալ՝
        1. Երբ փոխել յուղը
        2. Երբ փոխել արգելակային կոլոդկաները
        3. Երբ կատարել մեծ սպասարկում (Major Maintenance)
        4. Այլ կարևոր խորհուրդներ այս վազքի համար
        
        Պատասխանիր հայերենով:` }],
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          text: { type: Type.STRING, description: "Մանրամասն բացատրություն և խորհուրդներ" },
          oilChange: { type: Type.STRING, description: "Յուղի փոխման հաջորդ ժամկետը կամ վազքը" },
          brakePads: { type: Type.STRING, description: "Արգելակների ստուգման/փոխման ժամկետը" },
          majorService: { type: Type.STRING, description: "Մեծ սպասարկման ժամկետը" }
        },
        required: ["text", "oilChange", "brakePads", "majorService"]
      }
    }
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    return {
      text: response.text || "Սպասարկման տվյալներ չհաջողվեց հաշվարկել:",
      oilChange: "Տվյալ չկա",
      brakePads: "Տվյալ չկա",
      majorService: "Տվյալ չկա"
    };
  }
}

export async function findNearbyServices(lat: number, lng: number): Promise<MapResult> {
  const ai = getAI();
  const model = "gemini-2.5-flash";
  
  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        role: "user",
        parts: [{ text: "Գտիր մոտակա ավտոսպասարկման կենտրոնները (ավտոսերվիսներ) և տուր դրանց ցանկը:" }],
      }
    ],
    config: {
      tools: [{ googleMaps: {} }],
      toolConfig: {
        retrievalConfig: {
          latLng: {
            latitude: lat,
            longitude: lng
          }
        }
      }
    },
  });

  const text = response.text || "Մոտակա սերվիսներ չգտնվեցին:";
  const places = response.candidates?.[0]?.groundingMetadata?.groundingChunks
    ?.filter(chunk => chunk.maps)
    ?.map(chunk => ({
      uri: chunk.maps!.uri,
      title: chunk.maps!.title || "Ավտոսերվիս"
    })) || [];

  return { text, places };
}

export async function appraiseCarPrice(
  make: string,
  modelName: string,
  year: string,
  mileage: string,
  condition: string,
  offeredPrice: string
): Promise<AppraisalResult> {
  const ai = getAI();
  const model = "gemini-3-flash-preview";
  
  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        role: "user",
        parts: [{ text: `Գնահատիր հետևյալ մեքենայի գինը և ասա՝ արդյոք այն արդար է, թե ոչ:
        Մակնիշ: ${make}
        Մոդել: ${modelName}
        Տարեթիվ: ${year}
        Վազք: ${mileage} կմ
        Վիճակ: ${condition}
        Առաջարկվող գին: $${offeredPrice}
        
        Վերլուծիր շուկայական միջին գները և տուր պատասխան JSON ֆորմատով:` }],
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          status: { type: Type.STRING, enum: ['deal', 'fair', 'overpriced'], description: "Գնի կարգավիճակը" },
          estimatedValue: { type: Type.STRING, description: "Գնահատված շուկայական արժեքը (օրինակ՝ $15,000 - $17,000)" },
          analysis: { type: Type.STRING, description: "Մանրամասն վերլուծություն հայերենով" },
          confidence: { type: Type.NUMBER, description: "Վստահության մակարդակը (0-1)" }
        },
        required: ["status", "estimatedValue", "analysis", "confidence"]
      }
    }
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    throw new Error("Գնահատումը ձախողվեց:");
  }
}
