export const governmentSectorsDynamicForm = {
    "fields": [
        {
            "type": "text",
            "label": "Applicant Name",
            "model": "applicant_name",
            "required": true,
            "placeholder": "Enter your full name",
            "errorMessage": "Applicant Name is required"
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
            "label": "Service Required",
            "model": "service_required",
            "required": true,
            "placeholder": "E.g. Permits, Licenses, Approvals",
            "errorMessage": "Service Required is required"
        },
        {
            "type": "date",
            "label": "Appointment Date",
            "model": "appointment_date",
            "required": false,
            "placeholder": "Select an appointment date",
            "errorMessage": "Invalid date"
        },
        {
            "type": "text",
            "label": "Location",
            "model": "location",
            "required": false,
            "placeholder": "Enter the service location",
            "errorMessage": "Invalid location"
        }
    ]
}