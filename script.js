// Select DOM elements
const chatInput = document.querySelector('.chat-input textarea');
const sendChatBtn = document.querySelector('.chat-input button');
const chatbox = document.querySelector('.chatbox');

// Your DeepAI API key
const API_KEY = "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"; // <-- Replace with your actual API key

// Function to create chat message elements
const createChatLi = (message, className) => {
  const chatLi = document.createElement('li');
  chatLi.classList.add('chat', className);
  chatLi.innerHTML = `<p>${message}</p>`;
  return chatLi;
};

// Function to generate chat response from OpenAI
const generateResponse = (userMessage, incomingChatLi) => {
  const messageElement = incomingChatLi.querySelector('p');

  fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a fashion expert assistant. Help users with fashion queries, style tips, clothing recommendations, and fashion trends.'
        },
        {
          role: 'user',
          content: userMessage
        }
      ],
      temperature: 0.7,
      max_tokens: 150
    })
  })
  .then(res => {
    if (!res.ok) {
      throw new Error('Network response was not ok');
    }
    return res.json();
  })
  .then(data => {
    // Remove the "Typing..." placeholder
    chatbox.removeChild(incomingChatLi);
    // Extract reply and display
    const reply = data.choices[0].message.content.trim();
    const botReplyLi = createChatLi(reply, 'chat-incoming');
    chatbox.appendChild(botReplyLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);
  })
  .catch((error) => {
    chatbox.removeChild(incomingChatLi);
    const errorMsg = createChatLi('Oops! Something went wrong. Please try again.', 'chat-incoming error');
    chatbox.appendChild(errorMsg);
    chatbox.scrollTo(0, chatbox.scrollHeight);
    console.error(error);
  });
};

// Handle user input
const handleChat = () => {
  const userMessage = chatInput.value.trim();
  if (!userMessage) return;

  // Add user's message to chat
  chatbox.appendChild(createChatLi(userMessage, 'chat-outgoing'));
  chatbox.scrollTo(0, chatbox.scrollHeight);
  chatInput.value = '';

  // Add "Typing..." placeholder
  const typingLi = createChatLi('Typing...', 'chat-incoming');
  chatbox.appendChild(typingLi);
  chatbox.scrollTo(0, chatbox.scrollHeight);

  // Call API with user's message
  generateResponse(userMessage, typingLi);
};

// Event listener for send button
sendChatBtn.addEventListener('click', handleChat);

// Optional: support pressing Enter key in textarea
chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleChat();
  }
});
