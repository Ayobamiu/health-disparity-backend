const recommendationsAndTrendsResponseFormat = {
  type: "json_schema",
  json_schema: {
    name: "recommendation_response",
    schema: {
      $schema: "http://json-schema.org/draft-07/schema#",
      title: "RecommendationsAndTrends",
      type: "object",
      properties: {
        recommendations: {
          type: "object",
          properties: {
            foodAccess: {
              $ref: "#/definitions/AccessRecommendation",
            },
            housingAccess: {
              $ref: "#/definitions/AccessRecommendation",
            },
            employmentSupport: {
              $ref: "#/definitions/AccessRecommendation",
            },
            transportation: {
              $ref: "#/definitions/AccessRecommendation",
            },
            healthcareAccess: {
              $ref: "#/definitions/AccessRecommendation",
            },
            educationAccess: {
              $ref: "#/definitions/AccessRecommendation",
            },
            socialSupport: {
              $ref: "#/definitions/AccessRecommendation",
            },
            safetyInNeighborhood: {
              $ref: "#/definitions/AccessRecommendation",
            },
            digitalAccess: {
              $ref: "#/definitions/AccessRecommendation",
            },
          },
          additionalProperties: false,
        },
        trends: {
          type: "object",
          properties: {
            foodAccess: {
              $ref: "#/definitions/AccessTrends",
            },
            housingAccess: {
              $ref: "#/definitions/AccessTrends",
            },
            employmentSupport: {
              $ref: "#/definitions/AccessTrends",
            },
            transportation: {
              $ref: "#/definitions/AccessTrends",
            },
            healthcareAccess: {
              $ref: "#/definitions/AccessTrends",
            },
            educationAccess: {
              $ref: "#/definitions/AccessTrends",
            },
            socialSupport: {
              $ref: "#/definitions/AccessTrends",
            },
            safetyInNeighborhood: {
              $ref: "#/definitions/AccessTrends",
            },
            digitalAccess: {
              $ref: "#/definitions/AccessTrends",
            },
          },
          additionalProperties: false,
        },
      },
      required: ["recommendations", "trends"],
      definitions: {
        ResourceLink: {
          type: "object",
          properties: {
            title: {
              type: "string",
            },
            url: {
              type: "string",
              format: "uri",
            },
          },
          required: ["title", "url"],
        },
        AccessRecommendation: {
          type: "object",
          properties: {
            suggestion: {
              type: "string",
            },
            resourceLinks: {
              type: "array",
              items: {
                $ref: "#/definitions/ResourceLink",
              },
            },
          },
          required: ["suggestion", "resourceLinks"],
        },
        AccessTrends: {
          type: "object",
          properties: {
            past6Months: {
              type: "object",
              properties: {
                January: {
                  type: "number",
                },
                February: {
                  type: "number",
                },
                March: {
                  type: "number",
                },
                April: {
                  type: "number",
                },
                May: {
                  type: "number",
                },
                June: {
                  type: "number",
                },
              },
              required: [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
              ],
            },
            averageTrend: {
              type: "string",
            },
          },
          required: ["past6Months", "averageTrend"],
        },
      },
    },
  },
};

const disparityResponseFormat = {
  type: "json_schema",
  json_schema: {
    name: "recommendation_response",
    schema: {
      $schema: "http://json-schema.org/draft-07/schema#",
      type: "object",
      properties: {
        bloodPressure: {
          $ref: "#/definitions/Z_Disp",
        },
        glucose: {
          $ref: "#/definitions/Z_Disp",
        },
        bmi: {
          $ref: "#/definitions/Z_Disp",
        },
        additionalResources: {
          type: "array",
          items: {
            $ref: "#/definitions/ResourceLink",
          },
        },
      },
      required: ["bloodPressure", "glucose", "bmi", "additionalResources"],
      definitions: {
        Z_Disp: {
          type: "object",
          properties: {
            explanation: {
              type: "string",
            },
            comparison: {
              type: "string",
            },
            recommendation: {
              type: "string",
            },
            visualIndicators: {
              type: "string",
            },
            primaryColor: {
              type: "string",
              description: "This is the color that indicates the status.",
            },
            secondaryColor: {
              type: "string",
              description:
                "This is the color that complements the primaryColor.",
            },
            userValue: {
              type: "number",
            },
            nationalAverage: {
              type: "number",
            },
            category: {
              type: "string",
            },
          },
          required: [
            "explanation",
            "comparison",
            "recommendation",
            "visualIndicators",
            "primaryColor",
            "secondaryColor",
            "userValue",
            "nationalAverage",
            "category",
          ],
        },
        ResourceLink: {
          type: "object",
          properties: {
            title: {
              type: "string",
            },
            url: {
              type: "string",
              format: "uri",
            },
          },
          required: ["title", "url"],
        },
      },
    },
  },
};

module.exports = {
  recommendationsAndTrendsResponseFormat,
  disparityResponseFormat,
};
