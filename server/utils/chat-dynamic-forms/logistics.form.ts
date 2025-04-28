export const logisticsDynamicForm = {
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
            "label": "Service Required",
            "model": "service_required",
            "required": true,
            "placeholder": "Enter Service Type (e.g., Freight, Warehousing, Courier)",
            "errorMessage": "Service Type is required."
        },
        {
            "type": "phone",
            "label": "Contact Number",
            "model": "contact_number",
            "required": false,
            "placeholder": "Enter Contact Number",
            "errorMessage": "Invalid Contact Number."
        },
        {
            "type": "text",
            "label": "Pickup Location",
            "model": "pickup_location",
            "required": false,
            "placeholder": "Enter Pickup Location",
            "errorMessage": "Invalid Pickup Location."
        },
        {
            "type": "text",
            "label": "Drop Location",
            "model": "drop_location",
            "required": false,
            "placeholder": "Enter Drop Location",
            "errorMessage": "Invalid Drop Location."
        }
    ]
}