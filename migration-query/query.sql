UPDATE chatbot.chats 
SET mode = 'preview'
WHERE metadata->>'mode' = 'preview';
