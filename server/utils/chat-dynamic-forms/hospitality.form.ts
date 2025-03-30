export const hospitalityDynamicForm ={
    "fields": [
        {
            "type": "text",
            "label": "Customer Name",
            "model": "customer_name",
            "required": true,
            "placeholder": "Enter Customer Name",
            "errorMessage": "Customer Name is required."
        },
        {
            "type": "text",
            "label": "Event Type",
            "model": "event_type",
            "required": true,
            "placeholder": "Enter Event Type (e.g., Wedding, Conference, Party)",
            "errorMessage": "Event Type is required."
        },
        {
            "type": "number",
            "label": "Guest Count",
            "model": "guest_count",
            "required": true,
            "placeholder": "Enter Expected Guest Count",
            "errorMessage": "Guest Count is required."
        },
        {
            "type": "date",
            "label": "Preferred Date",
            "model": "preferred_date",
            "required": true,
            "placeholder": "Select Preferred Event Date",
            "errorMessage": "Preferred Date is required."
        },
        {
            "type": "text",
            "label": "Venue Location",
            "model": "venue_location",
            "required": false,
            "placeholder": "Enter Preferred Venue Location",
            "errorMessage": "Invalid Venue Location."
        }
    ]
}