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

INSERT INTO admin.admin_pricing (
  id, plan_code, price, type, sessions, is_india_pricing, duration, 
  extra_session_cost, extra_sessions_limit, bots_allowed, extra_bot_limit, 
  lead_gen_enabled, crm_config_enabled, widget_customization, 
  tring_branding, extra_bot_cost
) 
VALUES
(
  2, 'chat_super_intelligence', 6999, 'chatbot', 250, TRUE, 'month', 8, 1000, 10, 50, TRUE, TRUE, 'advance', 'paid', 1000
),
(
  4, 'chat_free', 0, 'chatbot', 50, TRUE, 'lifetime', 0, 0, 1, 0, FALSE, FALSE, 'na', 'na', 0
),
(
  5, 'chat_intelligence', 1999, 'chatbot', 60, TRUE, 'month', 10, 200, 2, 5, FALSE, FALSE, 'yes', 'na', 1000
),
(
  6, 'voicebot_fluent', 14999, 'voicebot', 1500, TRUE, 'month', 6, NULL, 1, NULL, TRUE, TRUE, 'yes', 'yes', NULL
),
(
  7, 'voicebot_fluent', 199, 'voicebot', 1500, FALSE, 'month', 0.07, NULL, 1, NULL, TRUE, TRUE, 'yes', 'yes', NULL
),
(
  8, 'voicebot_lucid', 599, 'voicebot', 5000, FALSE, 'month', 0.65, NULL, 1, NULL, TRUE, TRUE, 'advance', 'yes', NULL
),
(
  9, 'voicebot_lucid', 39999, 'voicebot', 5000, TRUE, 'month', 5, NULL, 1, NULL, TRUE, TRUE, 'advance', 'yes', NULL
),
(
  11, 'chat_intelligence', 29, 'chatbot', 60, FALSE, 'month', 0.6, 200, 2, 5, FALSE, FALSE, 'yes', 'na', 15
),
(
  12, 'chat_super_intelligence', 99, 'chatbot', 250, FALSE, 'month', 0.45, 1000, 10, 50, TRUE, TRUE, 'advance', 'paid', 15
),
(
  13, 'voice_free', 0, 'voicebot', 50, TRUE, 'lifetime', 0, 0, 1, NULL, FALSE, FALSE, 'na', 'na', NULL
);

