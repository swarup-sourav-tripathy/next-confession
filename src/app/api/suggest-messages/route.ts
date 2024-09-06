// import { GoogleGenerativeAI } from "@google/generative-ai";

// // Access your API key (see "Set up your API key" above)
// const genAI = new GoogleGenerativeAI("AIzaSyAjKNXOQggPju-5P-LU8ph4wt5HveJraM8");

// async function run() {
//     // For text-only input, use the gemini-pro model
//     const generationConfig = {
//         stopSequences: ["||"],
//         maxOutputTokens: 200,
//         temperature: 0.9,
//         topP: 0.1,
//         topK: 16,
//     };

//     const model = genAI.getGenerativeModel({ model: "gemini-pro", generationConfig });

//     const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";


//     // const result = await model.generateContent(prompt);
//     const response = await model.generateContentStream(prompt);

//     // const text = JSON.stringify(response)
//     // console.log(text);
//     // console.log(response.toString());
    


//     let text = ""; // Initialize an empty string to store the text chunks

//     // // Process the stream data chunk by chunk
//     for await (const chunk of response.stream) {
//         text += JSON.stringify(chunk); // Append each chunk to the text string

//     }

//     console.log(text);
    

// }

// run();


import {
    GoogleGenerativeAI,
    GoogleGenerativeAIResponseError,
  } from "@google/generative-ai";
  import { GoogleGenerativeAIStream, StreamingTextResponse } from "ai";
  import { NextResponse } from "next/server";
  
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  
  export async function POST(req: Request) {
    try {
      const prompt =
        "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";
  
      // Ask Google Generative AI for a streaming completion given the prompt
      const response = await genAI
        .getGenerativeModel({ model: "gemini-pro" })
        .generateContentStream({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
        });
  
      // Convert the response into a friendly text-stream
      const stream = GoogleGenerativeAIStream(response);

  
      // Respond with the stream
      return new StreamingTextResponse(stream);

    
      
    } catch (error) {
      if (error instanceof GoogleGenerativeAIResponseError) {
        const { name, message } = error;
        return NextResponse.json({ name, message });
      } else {
        // General error handling
        console.error("An unexpected error occurred:", error);
        throw error;
      }
    }
  }