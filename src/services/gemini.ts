import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

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

export async function searchCarProblem(problem: string): Promise<SearchResult> {
  const model = "gemini-3-flash-preview";
  
  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        role: "user",
        parts: [{ text: `Ես ունեմ հետևյալ խնդիրը իմ ավտոմեքենայի հետ: "${problem}": 
        Խնդրում եմ բացատրել, թե ինչով կարող է պայմանավորված լինել այս խնդիրը և առաջարկել լուծումներ: 
        Պատասխանիր հայերենով: Օգտագործիր Google Search գործիքը՝ օգտակար հղումներ գտնելու համար:` }],
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
