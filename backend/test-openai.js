const { OpenAI } = require('openai'); // Nota: No es OpenAIApi, es OpenAI
require('dotenv').config();

console.log('API Key:', process.env.OPENAI_API_KEY);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Tu API Key de OpenAI
});

(async () => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'Hola, ¿cómo estás?' }],
    });

    console.log('Respuesta de OpenAI:', response.choices[0].message.content);
  } catch (error) {
    console.error('Error al comunicarse con OpenAI:', error.message);
  }
})();
