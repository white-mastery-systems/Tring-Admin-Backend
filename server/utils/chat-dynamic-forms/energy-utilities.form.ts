export const energyUtilitiesDynamicForm = {
   "project_consultation_form": [
    {
        "type": "text",
        "label": "Company Name",
        "model": "company_name",
        "required": true,
        "placeholder": "Enter Company Name",
        "errorMessage": "Company Name is required."
    },
    {
        "type": "text",
        "label": "Contact Person",
        "model": "contact_person",
        "required": true,
        "placeholder": "Enter Contact Person Name",
        "errorMessage": "Contact Person is required."
    },
    {
        "type": "text",
        "label": "Project Type",
        "model": "project_type",
        "required": false,
        "placeholder": "Enter Project Type (e.g., Solar, Wind, Power Distribution)",
        "errorMessage": "Invalid Project Type."
    },
    {
        "type": "text",
        "label": "Preferred Meeting Time",
        "model": "preferred_meeting_time",
        "required": false,
        "placeholder": "Enter Preferred Meeting Time",
        "errorMessage": "Invalid Meeting Time."
    }
   ]
}