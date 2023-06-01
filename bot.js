const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const express = require('express');
const app = express();
const token = ' //YOU SHOULD ENTER YOUR TOKEN\\';
const omdbApiKey = '//YOU SHOULD ENTER YOUR API KEY\\';

const bot = new TelegramBot(token, { polling: true });
bot.on("message", async (msg) => {
  msg.text= msg.text.toLowerCase();
  const chatId = msg.chat.id;
  const userInput = msg.text;
  
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${userInput}&appid=ea05f0b6617d998492f421c4335d3bba`
    );
    const data = response.data;
    const weather = data.weather[0].description;
    const temperature = data.main.temp - 273.15;
    const city = data.name;
    const humidity = data.main.humidity;
    const pressure = data.main.pressure;
    const windSpeed = data.wind.speed;
    const message = `The weather in ${city} is ${weather} with a temperature of ${temperature.toFixed(2)}°C. The humidity is ${humidity}%, the pressure is ${pressure}hPa, and the wind speed is ${windSpeed}m/s.`;
      
    bot.sendMessage(chatId, message);
  } catch (error) {
    
  }
});

bot.onText(/\/movie (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const movieTitle = match[1];
  var a=1;
  try {
    const response = await axios.get('http://www.omdbapi.com/', {
      params: {
        apikey: omdbApiKey,
        t: movieTitle,
      },
    });

    const movie = response.data;
    if (movie.Response === 'False') {
      bot.sendMessage(chatId, 'Movie not found. Please try again.');
    } else {
      const releaseDate = movie.Released;
      bot.sendMessage(chatId, `The release date for ${movieTitle} is ${releaseDate}`);
    }
  } catch (error) {
    console.error('Error occurred while fetching movie details:', error);
    bot.sendMessage(chatId, 'Sorry, something went wrong.');
  }
});
if(a==0){
const { Configuration, OpenAIApi } = require('openai');
const botToken = '//YOU SHOULD ENTER YOUR TOKEN\\';

const openaiApiKey = '//YOU SHOULD ENTER YOUR API KEY\\';




const configuration = new Configuration({
  apiKey: openaiApiKey,
});
const openai = new OpenAIApi(configuration);


bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text;
  console.log(msg.chat);
  console.log(msg.text);
  try {
    
    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: messageText,
      max_tokens:450,
      temperature: 0,
      top_p:0.5,
    });

    const generatedMessage = completion.data.choices[0].text.trim();
    // console.log(generatedMessage);
    bot.sendMessage(chatId, generatedMessage);
  } catch (error) {
    console.error('Error:', error.message);
    bot.sendMessage(chatId, 'An error occurred while processing your message. Please try again later.');
  }
});
}

