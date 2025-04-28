export const ecommerceDynamicForm = {
   "product_enquiry_form": [
    {
        "type": "text",
        "label": "Customer Name",
        "model": "customer_name",
        "required": true,
        "placeholder": "Enter Customer Name",
        "errorMessage": "Customer Name is required."
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
        "label": "Product Interest",
        "model": "product_interest",
        "required": false,
        "placeholder": "Enter Product Name or Category",
        "errorMessage": "Invalid Product Interest."
    },
    {
        "type": "text",
        "label": "Preferred Contact Method",
        "model": "preferred_contact_method",
        "required": false,
        "placeholder": "Enter Contact Method (Phone, Email, WhatsApp)",
        "errorMessage": "Invalid Contact Method."
    }
]

}