export const realEstateDynamicForm = {
   "property_enquiry_form": [
    {
        "type": "text",
        "label": "Property Type",
        "model": "property_type",
        "required": true,
        "placeholder": "Enter Property Type",
        "errorMessage": "Property Type is required."
    },
    {
        "type": "number",
        "label": "Budget",
        "model": "budget",
        "required": true,
        "placeholder": "Enter Budget",
        "errorMessage": "Budget is required."
    },
    {
        "type": "text",
        "label": "Location",
        "model": "location",
        "required": true,
        "placeholder": "Enter Location",
        "errorMessage": "Location is required."
    },
    {
        "type": "date",
        "label": "Virtual Tour Date",
        "model": "virtual_tour_date",
        "required": false,
        "placeholder": "Select Date",
        "errorMessage": "Invalid Date."
    },
    {
        "type": "text",
        "label": "Preferred Contact Method",
        "model": "preferred_contact_method",
        "required": false,
        "placeholder": "Enter Contact Method",
        "errorMessage": "Invalid Contact Method."
    }
   ]
}