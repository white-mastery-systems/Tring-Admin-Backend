
export const travelDynamicForm = {
  "travel_booking_form": [
    {
        "type": "text",
        "label": "Traveler Name",
        "model": "traveler_name",
        "required": true,
        "placeholder": "Enter Traveler Name",
        "errorMessage": "Traveler Name is required."
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
        "label": "Destination",
        "model": "destination",
        "required": true,
        "placeholder": "Enter Travel Destination",
        "errorMessage": "Destination is required."
    },
    {
        "type": "date",
        "label": "Travel Date",
        "model": "travel_date",
        "required": true,
        "placeholder": "Select Travel Date",
        "errorMessage": "Travel Date is required."
    },
    {
        "type": "text",
        "label": "Package Preference",
        "model": "package_preference",
        "required": false,
        "placeholder": "Enter Package Type (e.g., Luxury, Budget, Adventure)",
        "errorMessage": "Invalid Package Preference."
    }
  ]
}
