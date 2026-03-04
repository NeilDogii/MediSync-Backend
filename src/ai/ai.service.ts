import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { GoogleGenAI } from '@google/genai';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
@Injectable()
export class AiService {
  async getMedicalAdvice(input: string) {
    if (!input) {
      throw new HttpException('Input is required', HttpStatus.BAD_REQUEST);
    }
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-preview',
        config: {
          responseJsonSchema: {
            type: 'object',
            properties: {
              causes: { type: 'string' },
              specialty: { type: 'string' },
            },
            required: ['causes', 'specialty'],
          },
          responseMimeType: 'application/json',
          systemInstruction: `You are a medical triage assistant. Your role is to analyze patient symptoms and provide:
              1. A brief, clear explanation of possible causes (2-3 sentences max)
              2. ONE recommended medical specialty from this exact list: CARDIOLOGY, DERMATOLOGY, NEUROLOGY, PEDIATRICS, RADIOLOGY, ONCOLOGY, ORTHOPEDICS, GYNECOLOGY, PSYCHIATRY, GENERAL_MEDICINE

              - Be concise and factual
              - Recommend the most appropriate specialty based on symptoms
              - If symptoms are general or unclear, recommend GENERAL_MEDICINE
              - Always emphasize that this is preliminary guidance and not a diagnosis
                  Important guidelines:
                    - Format your response as JSON: {"causes": "...", "specialty": "..."}`,
        },
        contents: `Patient describes their condition as: ${input}. Provide possible causes and recommend ONE medical specialty.`,
      });
      const StringifiedJson =
        response.candidates?.[0]?.content?.parts?.[0]?.text || null;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return StringifiedJson ? JSON.parse(StringifiedJson) : null;
    } catch (error) {
      throw new HttpException(
        'Error generating medical advice' + error,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
