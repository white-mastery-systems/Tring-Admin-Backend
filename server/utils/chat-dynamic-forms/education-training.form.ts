export const educationTrainingDynamicForm = {
"student_enrollment_form": [
  {
    "type": "text",
    "label": "Student Name",
    "model": "student_name",
    "required": true,
    "placeholder": "Enter Student Name",
    "errorMessage": "Student Name is required."
  },
  {
    "type": "email",
    "label": "Contact Email",
    "model": "contact_email",
    "required": true,
    "placeholder": "Enter Contact Email",
    "errorMessage": "Invalid Email Address."
  },
  {
    "type": "text",
    "label": "Course Interest",
    "model": "course_interest",
    "required": true,
    "placeholder": "Enter Course Name (e.g., Data Science, Digital Marketing)",
    "errorMessage": "Course Interest is required."
  },
  {
    "type": "date",
    "label": "Preferred Start Date",
    "model": "preferred_start_date",
    "required": false,
    "placeholder": "Select Preferred Start Date",
    "errorMessage": "Invalid Start Date."
  }
]

}