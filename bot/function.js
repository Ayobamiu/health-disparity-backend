const { openai, aiModel } = require("./openaiConfig");
const { z } = require("zod");
const { zodFunction } = require("openai/helpers/zod");
const {
  disparityResponseFormat,
  recommendationsAndTrendsResponseFormat,
} = require("./data");

async function getHealthInsights(data) {
  const functionDef = {
    name: "getHealthInsights",
    description:
      "Get personalized health insights by comparing user's health metrics to national averages and providing recommendations.",
    parameters: {
      type: "object",
      properties: {
        age: { type: "string", description: "The age of the user" },
        gender: { type: "string", description: "The gender of the user" },
        city: {
          type: "string",
          description: "The city where the user resides",
        },
        state: { type: "string", description: "Two-letter state abbreviation" },
        ethnicity: { type: "string", description: "The ethnicity of the user" },
        bloodPressure: {
          type: "string",
          description: "The user's blood pressure",
        },
        glucose: { type: "string", description: "The user's glucose level" },
        bmi: { type: "string", description: "The user's BMI" },
      },
      required: [
        "age",
        "gender",
        "state",
        "ethnicity",
        "bloodPressure",
        "glucose",
        "bmi",
      ],
    },
  };

  // Ensure that the user's data is valid
  const userDataSchema = z.object({
    age: z.string(),
    gender: z.enum([
      "Man",
      "Woman",
      "Transgender Man",
      "Transgender Woman",
      "Non-Binary",
      "No Gender",
      "Other",
      "Prefer not to state",
    ]),
    city: z.string(),
    state: z.string(),
    ethnicity: z.string(),
    bloodPressure: z.string(),
    glucose: z.string(),
    bmi: z.string(),
  });

  userDataSchema.parse(data); // Validate incoming user data

  const tools = [
    {
      type: "function",
      function: functionDef,
    },
  ];

  // Prepare messages for OpenAI call
  const messages = [
    {
      role: "system",
      content:
        "You are a helpful health assistant. Provide insights by comparing the user's health metrics to national averages and offering personalized recommendations.",
    },
    {
      role: "user",
      content: `I want to compare my health data with national averages and get insights. Here is my data:
      - Age: ${data.age}
      - Gender: ${data.gender}
      - City: ${data.city}
      - State: ${data.state}
      - Ethnicity: ${data.ethnicity}
      - Blood Pressure: ${data.bloodPressure}
      - Glucose: ${data.glucose}
      - BMI: ${data.bmi}`,
    },
  ];

  const response = await openai.chat.completions.create({
    model: aiModel,
    messages: messages,
    tools: tools,
  });

  // OpenAI API's chat completions endpoint to send the tool call result back to the model
  const toolCallResponse = response.choices[0]?.finish_reason === "tool_calls";
  if (toolCallResponse) {
    const finalResponse = await openai.chat.completions.create({
      model: aiModel,
      messages: [
        ...messages,
        response.choices[0].message,
        {
          role: "tool",
          content: response.choices[0].message.content ?? "",
          tool_call_id: response.choices[0].message.tool_calls
            ? response.choices[0].message.tool_calls[0].id
            : "",
        },
      ],
      response_format: disparityResponseFormat,
    });
    const data = JSON.parse(finalResponse.choices[0].message.content ?? "");
    return data;
  }

  return null;
}

async function getResourcesRecommendations(data) {
  const Z_Parameters = z.object({
    state: z.string().describe("State where the user is located"),
    city: z.string().describe("City where the user is located"),
    employmentStatus: z.string().describe("User's employment status"),
    incomeLevel: z.string().describe("User's income level"),
    foodAccess: z
      .string()
      .describe("User's access to food (e.g., good, limited)"),
    transportation: z.string().describe("User's transportation situation"),
    housingAccess: z.string().describe("User's housing access"),
    educationAccess: z.string().describe("User's education access"),
    healthcareAccess: z.string().describe("User's access to healthcare"),
    socialSupport: z.string().describe("User's level of social support"),
    safetyInNeighborhood: z
      .string()
      .describe("User's perceived safety in their neighborhood"),
    digitalAccess: z
      .string()
      .describe("User's access to digital services (internet, etc.)"),
  });

  const tool = [
    zodFunction({
      parameters: Z_Parameters,
      name: "resourcesRecommendations",
      description:
        "Generates recommendations and visualizations based on user input for non-medical factors like food access, housing access, etc.",
    }),
  ];

  // Prepare messages for OpenAI call
  const messages = [
    {
      role: "system",
      content:
        "You are a helpful health assistant. Generates recommendations and visualizations based on user input for non-medical factors like food access, housing access, etc.",
    },
    {
      role: "user",
      content: `Generate recommendations and trend data for the following user input: 
      State: ${data.state}, 
      City: ${data.city}, 
      EmploymentStatus: ${data.employmentStatus}, 
      IncomeLevel: ${data.incomeLevel}, 
      FoodAccess: ${data.foodAccess}, 
      Transportation: ${data.transportation}, 
      HousingAccess: ${data.housingAccess}, 
      EducationAccess: ${data.educationAccess}, 
      HealthcareAccess: ${data.healthcareAccess}, 
      SocialSupport: ${data.socialSupport}, 
      SafetyInNeighborhood: ${data.safetyInNeighborhood}, 
      DigitalAccess: ${data.digitalAccess}.
      `,
    },
  ];

  const response = await openai.chat.completions.create({
    model: aiModel,
    messages: messages,
    tools: tool,
  });

  // OpenAI API's chat completions endpoint to send the tool call result back to the model
  const toolCallResponse = response.choices[0]?.finish_reason === "tool_calls";
  if (toolCallResponse) {
    const finalResponse = await openai.chat.completions.create({
      model: aiModel,
      messages: [
        ...messages,
        response.choices[0].message,
        {
          role: "tool",
          content: response.choices[0].message.content ?? "",
          tool_call_id: response.choices[0].message.tool_calls
            ? response.choices[0].message.tool_calls[0].id
            : "",
        },
      ],
      response_format: recommendationsAndTrendsResponseFormat,
    });

    const data = JSON.parse(finalResponse.choices[0].message.content ?? "");
    return data;
  }

  return null;
}

module.exports = {
  getHealthInsights,
  getResourcesRecommendations,
};
