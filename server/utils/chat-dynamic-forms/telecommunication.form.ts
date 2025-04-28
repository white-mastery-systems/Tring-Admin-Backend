export const telecommunicationDynamicForm = {
    "fields": [
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
            "label": "Service Interest",
            "model": "service_interest",
            "required": true,
            "placeholder": "Enter Interested Service (e.g., Internet, VoIP, Cloud Solutions)",
            "errorMessage": "Service Interest is required."
        },
        {
            "type": "text",
            "label": "Contact Person",
            "model": "contact_person",
            "required": false,
            "placeholder": "Enter Contact Person Name",
            "errorMessage": "Invalid Contact Person."
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