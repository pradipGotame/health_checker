import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const sessionOverview = z.object({
  warmUp: z.string(),
  mainWorkout: z.string(),
  coolDown: z.string(),
});

const TrainingTechniques = z.object({
  name: z.string(),
  description: z.string(),
  restPeriod: z.string().optional(),
  sets: z.number(),
  reps: z.number(),
  weight: z.number({
    description: "weight that matches users exercise level in Kg",
  }),
});

const supplementary = z.array(
  z.object({
    activity: z.string(),
    description: z.string(),
    sets: z.number(),
    reps: z.number(),
  })
);

const recovary = z.object({
  strategy: z.string(),
  description: z.string(),
});

const strength_suggestions = z.object({
  sessionOverview,
  techniques: TrainingTechniques,
  supplementary,
  recovary,
});

export async function getStrengthSuggestionsWithAi(user, workout) {
  console.log("suggestion", user, workout);
  const completion = await openai.beta.chat.completions.parse({
    model: "gpt-4o-mini-2024-07-18",
    temperature: 1,
    max_completion_tokens: 2048,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    messages: [
      {
        role: "system",
        content: `You are an expert personal training coach and exercise physiologist. Based on the provided user profile and workout details, generate a complete workout recommendation. Your response must be in strict JSON format with the following structure.
        Provide practical and safe suggestions tailored to the user's physical details and workout goals. Do not include any additional text outside of the JSON.`,
      },
      {
        role: "user",
        content: `User Information:
                - Age: ${user.age}
                - Goal: ${user.fitnessGoal}
                - Exercise Level: ${user.exerciseLevel}
                - sportsVenue: ${user.sportsVenue}
                - Gender: ${user.gender}
                - Weight: ${user.weight} kg
                - Height: ${user.height} cm

                Workout Details:
                - Workout Type: ${workout.type}
                - Main Activity: ${workout.activity}
                
                Using these details, please provide a complete workout session recommendation that includes training techniques, supplementary exercises, and recovery strategies.`,
      },
    ],
    response_format: zodResponseFormat(strength_suggestions, "suggestions"),
  });

  return completion.choices[0].message.parsed;
}

const CardioTechniques = z.object({
  name: z.string(),
  description: z.string(),
  restPeriod: z.string().optional(),
  total_duration: z.number({ description: "in minutes" }),
  total_distance: z.number({ description: "in meters" }),
});

const cardio_suggestions = z.object({
  sessionOverview,
  techniques: CardioTechniques,
  recovary,
});

export async function getCardioSuggestionsWithAi(user, workout) {
  console.log("suggestion", user, workout);
  const completion = await openai.beta.chat.completions.parse({
    model: "gpt-4o-mini-2024-07-18",
    temperature: 1,
    max_completion_tokens: 2048,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    messages: [
      {
        role: "system",
        content: `You are an expert personal training coach and exercise physiologist. Based on the provided user profile and workout details, generate a complete workout recommendation. Your response must be in strict JSON format with the following structure.
        Provide practical and safe suggestions tailored to the user's physical details and workout goals. Do not include any additional text outside of the JSON.`,
      },
      {
        role: "user",
        content: `User Information:
                - Age: ${user.age}
                - Goal: ${user.fitnessGoal}
                - Exercise Level: ${user.exerciseLevel}
                - sportsVenue: ${user.sportsVenue}
                - Gender: ${user.gender}
                - Weight: ${user.weight} kg
                - Height: ${user.height} cm

                Workout Details:
                - Workout Type: ${workout.type}
                - Main Activity: ${workout.activity}
                
                Using these details, please provide a complete workout session recommendation that includes training techniques, supplementary exercises, and recovery strategies.`,
      },
    ],
    response_format: zodResponseFormat(cardio_suggestions, "suggestions"),
  });

  return completion.choices[0].message.parsed;
}

const MobilityTechniques = z.object({
  name: z.string(),
  description: z.string(),
  restPeriod: z.string().optional(),
  sets: z.number(),
  reps: z.number(),
});

const mobility_suggestions = z.object({
  sessionOverview,
  techniques: MobilityTechniques,
  recovary,
});

export async function getMobilitySuggestionsWithAi(user, workout) {
  console.log("suggestion", user, workout);
  const completion = await openai.beta.chat.completions.parse({
    model: "gpt-4o-mini-2024-07-18",
    temperature: 1,
    max_completion_tokens: 2048,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    messages: [
      {
        role: "system",
        content: `You are an expert personal training coach and exercise physiologist. Based on the provided user profile and workout details, generate a complete workout recommendation. Your response must be in strict JSON format with the following structure.
        Provide practical and safe suggestions tailored to the user's physical details and workout goals. Do not include any additional text outside of the JSON.`,
      },
      {
        role: "user",
        content: `User Information:
                - Age: ${user.age}
                - Goal: ${user.fitnessGoal}
                - Exercise Level: ${user.exerciseLevel}
                - sportsVenue: ${user.sportsVenue}
                - Gender: ${user.gender}
                - Weight: ${user.weight} kg
                - Height: ${user.height} cm

                Workout Details:
                - Workout Type: ${workout.type}
                - Main Activity: ${workout.activity}
                
                Using these details, please provide a complete workout session recommendation that includes training techniques, supplementary exercises, and recovery strategies.`,
      },
    ],
    response_format: zodResponseFormat(mobility_suggestions, "suggestions"),
  });

  return completion.choices[0].message.parsed;
}
