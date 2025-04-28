export const financeBankingDynamicForm = {
"financial_services_inquiry_form": [
  {
    "type": "text",
    "label": "Full Name",
    "model": "full_name",
    "required": true,
    "placeholder": "Enter your full name",
    "errorMessage": "Full Name is required"
  },
  {
    "type": "phone",
    "label": "Contact Number",
    "model": "contact_number",
    "required": true,
    "placeholder": "Enter your contact number",
    "errorMessage": "Invalid contact number"
  },
  {
    "type": "text",
    "label": "Service Interest",
    "model": "service_interest",
    "required": true,
    "placeholder": "E.g. Loan, Investment, Insurance",
    "errorMessage": "Service Interest is required"
  },
  {
    "type": "time",
    "label": "Preferred Meeting Time",
    "model": "preferred_meeting_time",
    "required": false,
    "placeholder": "Select a meeting time",
    "errorMessage": "Invalid meeting time"
  },
  {
    "type": "text",
    "label": "Financial Goal",
    "model": "financial_goal",
    "required": false,
    "placeholder": "E.g. Retirement Planning, Wealth Growth",
    "errorMessage": "Invalid financial goal"
  }
]

}