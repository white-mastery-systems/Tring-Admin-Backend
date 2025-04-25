export const healthCareDynamicForm = {
  "appointment_booking_form": [
    {
        "type": "text",
        "label": "Patient Name",
        "model": "patient_name",
        "required": true,
        "placeholder": "Enter Patient Name",
        "errorMessage": "Patient Name is required."
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
        "type": "date",
        "label": "Appointment Date",
        "model": "appointment_date",
        "required": true,
        "placeholder": "Select Appointment Date",
        "errorMessage": "Appointment Date is required."
    },
    {
        "type": "text",
        "label": "Specialty",
        "model": "specialty",
        "required": false,
        "placeholder": "Enter Medical Specialty (e.g., Cardiology, Dermatology)",
        "errorMessage": "Invalid Specialty."
    },
    {
        "type": "text",
        "label": "Hospital Location",
        "model": "hospital_location",
        "required": true,
        "placeholder": "Enter Hospital or Clinic Location",
        "errorMessage": "Hospital Location is required."
    }
]

}