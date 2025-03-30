export const itServiceDynamicForm = {
    "fields": [
        {
            "type": "text",
            "label": "Business Name",
            "model": "business_name",
            "required": true,
            "placeholder": "Enter Business Name",
            "errorMessage": "Business Name is required."
        },
        {
            "type": "text",
            "label": "Service Interest",
            "model": "service_interest",
            "required": true,
            "placeholder": "Enter IT Service Needed (e.g., Web Development, Cloud Solutions)",
            "errorMessage": "Service Interest is required."
        },
        {
            "type": "text",
            "label": "Project Scope",
            "model": "project_scope",
            "required": false,
            "placeholder": "Enter Project Details",
            "errorMessage": "Invalid Project Scope."
        },
        {
            "type": "datetime-local",
            "label": "Preferred Meeting Time",
            "model": "preferred_meeting_time",
            "required": false,
            "placeholder": "Select Preferred Meeting Time",
            "errorMessage": "Invalid Meeting Time."
        }
    ]
}