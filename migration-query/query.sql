UPDATE chatbot.chats
SET
    mode = 'preview'
WHERE
    metadata ->> 'mode' = 'preview';

UPDATE chatbot.chats
SET
    updated_at = created_at
WHERE
    updated_at = '2024-09-13 04:56:10.456897'

UPDATE chatbot.analytics
SET
    updated_at = created_at
WHERE
    updated_at = '2024-09-13 04:56:10.456897'

UPDATE chatbot.bot
SET
    updated_at = created_at
WHERE
    updated_at = '2024-09-13 04:56:10.456897'

UPDATE chatbot.bot_integrations
SET
    updated_at = created_at
WHERE
    updated_at = '2024-09-13 04:56:10.456897'

UPDATE chatbot.bot_user
SET
    updated_at = created_at
WHERE
    updated_at = '2024-09-13 04:56:10.456897'

UPDATE chatbot.document
SET
    updated_at = created_at
WHERE
    updated_at = '2024-09-13 04:56:10.456897'

UPDATE chatbot.intents
SET
    updated_at = created_at
WHERE
    updated_at = '2024-09-13 04:56:10.456897'

UPDATE chatbot.leads
SET
    updated_at = created_at
WHERE
    updated_at = '2024-09-13 04:56:10.456897'

UPDATE chatbot.messages
SET
    updated_at = created_at
WHERE
    updated_at = '2024-09-13 04:56:10.456897'

UPDATE admin.integration
SET
    updated_at = created_at
WHERE
    updated_at = '2024-09-13 04:56:10.456897'

UPDATE admin.payment
SET
    updated_at = created_at
WHERE
    updated_at = '2024-09-13 04:56:10.456897'

UPDATE admin.timeline
SET
    updated_at = created_at
WHERE
    updated_at = '2024-09-13 04:56:10.456897'

UPDATE chatbot.messages SET status = false WHERE content = 'Hi'

UPDATE chatbot.bot_user 
SET mobile = regexp_replace(mobile, '\s', '', 'g')

UPDATE chatbot.bot_user 
SET country_code = LEFT(mobile, LENGTH(mobile) - 10),
    mobile = RIGHT(mobile, 10)