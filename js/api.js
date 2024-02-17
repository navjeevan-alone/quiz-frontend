// const axios = require('axios');
import axios from 'axios';          
import fs from 'fs';
// const fs = require('fs');

// Replace your API Key here
const apiKey = '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';

const user_prompt = document.querySelector("#prompt-inp");
function createPrompt(topic) {
    return `Return a JSON object only. Create a quiz on ${topic}. Format: { quiz_title: ${topic}, quiz_id: random id with length 10, questions: [{ question: '', options: Array of 4 options, correct_answer: '' }] } // create similar 5 questions`;
}

export async function generateQuiz(prompt) {
    const headers = {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
    };

    const data = {
        model: 'gpt-3.5-turbo', // Adjust the model name as needed
        messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: prompt },
        ],
    };

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', data, { headers });
        const quizData = response.data;
        if (!quizData.choices || quizData.choices.length === 0) {
            console.log('No choices in response. Response might be an error or have unexpected format:', quizData);
            return null;
        }

        console.log('API Response:', quizData);
        const quizContentStr = quizData.choices[0].message.content.trim();

        if (quizContentStr) {
            try {
                const quizContentJson = JSON.parse(quizContentStr);
                saveContentAsJson(quizContentJson);
                return quizContentJson;
            } catch (error) {
                console.error('Error decoding JSON from content:', quizContentStr);
                return null;
            }
        } else {
            console.log('No content received from API.');
            return null;
        }
    } catch (error) {
        console.error('Error calling the API:', error);
        return null;
    }
}

function saveContentAsJson(contentJson) {
    fs.writeFile('quiz_output.json', JSON.stringify(contentJson, null, 4), (err) => {
        if (err) {
            console.error('Error writing file:', err);
        } else {
            console.log('File successfully written!');
        }
    });
}
window.domcot
// Example usage
const topic = user_prompt.value;
const prompt = createPrompt(topic);
generateQuiz(prompt).then((quizContentJson) => {
    if (quizContentJson) {
        saveContentAsJson(quizContentJson);
        console.log(quizContentJson);
    }
});
