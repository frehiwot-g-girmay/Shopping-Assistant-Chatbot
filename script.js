const chatInput = document.querySelector('.chat-input textarea');
const sendChatBtn = document.querySelector('.chat-input button');
const chatbox = document.querySelector('.chatbox');

const API_KEY = "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";

const createChatLi = (message, className) => {
  const chatLi = document.createElement('li');
  chatLi.classList.add('chat', className);
  chatLi.innerHTML = `<p>${message}</p>`;
  return chatLi;
};

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
          role: 'user',
          content: userMessage
        }
      ]
    })
  })
  .then(res => {
    if (!res.ok) {
      throw new Error('Network response was not ok');
    }
    return res.json();
  })
  .then(data => {
    // Remove "Typing..." message
    chatbox.removeChild(incomingChatLi);
    // Create bot reply
    const reply = data.choices[0].message.content.trim();
    const botReplyLi = createChatLi(reply, 'chat-incoming');
    chatbox.appendChild(botReplyLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);
  })
  .catch((error) => {
    chatbox.removeChild(incomingChatLi);
    const errorMsg = createChatLi('Oops! Something went wrong. Please try again!', 'chat-incoming error');
    chatbox.appendChild(errorMsg);
    chatbox.scrollTo(0, chatbox.scrollHeight);
  });
};

const handleChat = () => {
  const userMessage = chatInput.value.trim();
  if (!userMessage) return;

  // Add user message to chat
  chatbox.appendChild(createChatLi(userMessage, 'chat-outgoing'));
  chatbox.scrollTo(0, chatbox.scrollHeight);
  chatInput.value = '';

  // Add placeholder "Typing..."
  const typingLi = createChatLi('Typing...', 'chat-incoming');
  chatbox.appendChild(typingLi);
  chatbox.scrollTo(0, chatbox.scrollHeight);

  // Generate response with userMessage and the placeholder element
  generateResponse(userMessage, typingLi);
};

sendChatBtn.addEventListener('click', handleChat);
