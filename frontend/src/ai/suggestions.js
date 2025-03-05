import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const TrainingTechniques = z.object({
  progressive_overload: z.string(),
  tempo_control: z.string(),
  rest_periods: z.string(),
});

const supplementary = z.array(
  z.object({
    activity: z.string(),
    sets: z.number(),
    reps: z.number(),
  })
);

const recovary = z.object({
  warm_up: z.string(),
  cooldown: z.string(),
  rest_days: z.string(),
});

const strength_suggestions = z.object({
  techniques: TrainingTechniques,
  supplementary,
  recovary,
});

export async function getStrengthSuggestionsWithAi(user, workout) {
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
                - Goal: ${user.goal}
                - Exercise Level: ${user.exercise_level}
                - Gender: ${user.gender}
                - Weight: ${user.weight}
                - Height: ${user.height}

                Workout Details:
                - Workout Type: ${workout.type}
                - Main Activity: ${workout.activity}
                - Recommended Sets: ${workout.sets}
                - Recommended Reps: ${workout.reps}

            Using these details, please provide a complete workout session recommendation that includes training techniques, supplementary exercises, and recovery strategies.`,
      },
    ],
    response_format: zodResponseFormat(strength_suggestions, "suggestions"),
  });

  return completion.choices[0].message.parsed;
}
