export const chatbotConfiguration = [
  {
    "type": "real_estate",
    "roles": [
        {
            "name": "Customer Support Executive",
            "description": "Assist users with property inquiries, troubleshoot issues, and guide them through the buying/renting process.",
	        "value": "Customer Support Executive",
        },
        {
            "name": "Sales Executive Support",
            "description": "Help sales teams manage leads, follow up with potential buyers, and ensure a smooth sales journey.",
	        "value": "Sales Executive Support",
        },
	    {
            "name": "Property Consultant",
            "description": "Provide personalized property recommendations based on budget, location, and amenities.",
	        "value": "Property Consultant",
        }
    ],
    "goals": [
        {
            "name": "Enhancing Property Buying & Selling Experience",
            "description": "Assist users with property searches, site visits, and expert consultations.",
	        "value": "Assist users with property searches, site visits, and expert consultations.",
        },
        {
            "name": "Improving Lead Conversion & Customer Satisfaction",
            "description": "Ensure smooth interactions between buyers, sellers, and real estate agents.",
	        "value": "Ensure smooth interactions between buyers, sellers, and real estate agents.",
        }
    ],
    "intents": [
        {
            "name": "Site Visit Scheduling",
            "description": "Allow users to schedule property viewings or site visits conveniently.",
	        "value": "site_visit",
        },
	    {
            "name": "Call Scheduling",
            "description": "Enable users to schedule calls with agents for personalized discussions on property options.",
     	    "value": "schedule_call",
        },
	    {
	        "name": "Lead Generation",
	        "description": "Capture user details, qualify leads, and connect them with agents for property discussions.",
	        "value": "true",
	    }
    ],
    "notes": [
        {
            "name": "Property Inquiry & Recommendations",
            "description": "Match users with properties that fit their budget, location, type, and desired amenities.",
	        "value": "Match users with properties that fit their budget, location, type, and desired amenities.",
        },
        {
            "name": "Legal & Documentation Support",
            "description": "Guide buyers and sellers through legal formalities, agreements, and ownership transfers.",
            "value": "Guide buyers and sellers through legal formalities, agreements, and ownership transfers.",
        },
	    {
            "name": "Rental & Lease Assistance",
            "description": "Help users find rental properties and assist landlords with tenant management",
            "value": "Help users find rental properties and assist landlords with tenant management",
        },
	    {
            "name": "Post-Sale/Rental Support",
            "description": "Provide after-sale assistance, including moving services, maintenance, and property management.",
            "value": "Provide after-sale assistance, including moving services, maintenance, and property management.",
        }
    ]  
  },
  {
    "type": "government_sector",
    "roles": [
        {
            "name": "Citizen Support Executive",
            "description": "Assist with inquiries about public services, policies, and government procedures.",
            "value": "Citizen Support Executive"
        },
        {
            "name": "Application & Documentation Specialist",
            "description": "Guide citizens through permits, licenses, and registration processes.",
            "value": "Application & Documentation Specialist"
        },
        {
            "name": "Public Service Coordinator",
            "description": "Help schedule government services, community programs, and official meetings.",
            "value": "Public Service Coordinator"
        },
        {
            "name": "Complaint & Feedback Manager",
            "description": "Capture public concerns, escalate issues to the right department, and ensure timely resolution.",
            "value": "Complaint & Feedback Manager"
        }
    ],
    "goals": [
        {
            "name": "Enhancing Citizen Engagement & Public Service Accessibility",
            "description": "Provide seamless support for inquiries, applications, and public programs.",
            "value": "Provide seamless support for inquiries, applications, and public programs."
        },
        {
            "name": "Improving Government Transparency & Efficiency",
            "description": "Ensure smooth handling of public concerns, documentation, and community initiatives.",
            "value": "Ensure smooth handling of public concerns, documentation, and community initiatives."
        }
    ],
    "intents": [
        {
            "name": "Call Scheduling",
            "description": "Allow citizens to schedule calls with government representatives for assistance.",
            "value": "schedule_call"
        },
        {
            "name": "Appointment Scheduling",
            "description": "Help users book appointments for official services, documentation, and other government processes.",
            "value": "schedule_appointment"
        },
        {
            "name": "Lead Generation & Community Outreach",
            "description": "Capture interest in government programs, public consultations, and community initiatives.",
            "value": "true"
        }
    ],
    "notes": [
        {
            "name": "Citizen Service & Information Desk",
            "description": "Provide quick responses to public inquiries about services, policies, and procedures.",
            "value": "Provide quick responses to public inquiries about services, policies, and procedures."
        },
        {
            "name": "Complaint & Feedback Handling",
            "description": "Record complaints, route them to the appropriate department, and track resolution status.",
            "value": "Record complaints, route them to the appropriate department, and track resolution status."
        },
        {
            "name": "Document & Licensing Support",
            "description": "Assist citizens in completing applications for permits, licenses, and public records.",
            "value": "Assist citizens in completing applications for permits, licenses, and public records."
        },
        {
            "name": "Public Program & Benefits Assistance",
            "description": "Guide citizens through social welfare programs, grants, and subsidies.",
            "value": "Guide citizens through social welfare programs, grants, and subsidies."
        }
    ]
  },
  {
    "type": "finance_&_banking",
    "roles": [
        {
            "name": "Customer Support Executive",
            "description": "Assist users with account details, transaction history, and service-related inquiries.",
            "value": "Customer Support Executive"
        },
        {
            "name": "Financial Advisor",
            "description": "Offer investment guidance, loan assistance, and personalized banking solutions.",
            "value": "Financial Advisor"
        },
        {
            "name": "Fraud & Risk Analyst",
            "description": "Help customers report suspicious activities, manage disputes, and secure their accounts.",
            "value": "Fraud & Risk Analyst"
        },
        {
            "name": "Loan & Mortgage Specialist",
            "description": "Guide users through loan options, eligibility, and application processes.",
            "value": "Loan & Mortgage Specialist"
        }
    ],
    "goals": [
        {
            "name": "Enhancing Financial Services & Customer Trust",
            "description": "Provide seamless banking assistance, fraud resolution, and personalized financial advice.",
            "value": "Provide seamless banking assistance, fraud resolution, and personalized financial advice."
        },
        {
            "name": "Improving Customer Engagement & Retention",
            "description": "Ensure a smooth customer experience through efficient support, lead generation, and financial guidance.",
            "value": "Ensure a smooth customer experience through efficient support, lead generation, and financial guidance."
        }
    ],
    "intents": [
        {
            "name": "Call Scheduling",
            "description": "Allow users to schedule calls with financial experts for investment, loan, or banking consultations.",
            "value": "schedule_call"
        },
        {
            "name": "Appointment Scheduling",
            "description": "Help customers book meetings with bank representatives for loan processing, account upgrades, or investment discussions.",
            "value": "schedule_appointment"
        },
        {
            "name": "Lead Generation & Customer Acquisition",
            "description": "Identify potential clients for financial products and capture their details for follow-up.",
            "value": "true"
        }
    ],
    "notes": [
        {
            "name": "Account & Service Inquiry",
            "description": "Assist users with account details, transaction histories, and product/service information.",
            "value": "Assist users with account details, transaction histories, and product/service information."
        },
        {
            "name": "Fraud Detection & Resolution",
            "description": "Enable users to report suspicious activities, manage disputes, and receive real-time support.",
            "value": "Enable users to report suspicious activities, manage disputes, and receive real-time support."
        },
        {
            "name": "Investment & Financial Advisory",
            "description": "Provide tailored insights into market trends and investment opportunities, linking users with expert advice.",
            "value": "Provide tailored insights into market trends and investment opportunities, linking users with expert advice."
        },
        {
            "name": "Billing & Payment Assistance",
            "description": "Guide customers on bill payments, transaction issues, and charge clarifications.",
            "value": "Guide customers on bill payments, transaction issues, and charge clarifications."
        }
    ]
  },
  {
    "type": "healthcare",
    "roles": [
        {
            "name": "Patient Support Executive",
            "description": "Assist with general inquiries, appointment scheduling, and service information.",
            "value": "Patient Support Executive"
        },
        {
            "name": "Medical Concierge",
            "description": "Guide patients through hospital services, doctor availability, and health programs.",
            "value": "Medical Concierge"
        },
        {
            "name": "Billing & Insurance Specialist",
            "description": "Handle billing inquiries, insurance claims, and payment processing.",
            "value": "Billing & Insurance Specialist"
        },
        {
            "name": "Follow-up & Care Coordinator",
            "description": "Manage post-treatment checkups, patient feedback, and prescription reminders.",
            "value": "Follow-up & Care Coordinator"
        }
    ],
    "goals": [
        {
            "name": "Enhanced Patient Experience",
            "description": "Provide accurate information and seamless assistance to ensure patients receive the best possible care.",
            "value": "Provide accurate information and seamless assistance to ensure patients receive the best possible care."
        },
        {
            "name": "Efficient Patient Management",
            "description": "Help healthcare providers manage appointments, inquiries, and follow-ups effectively.",
            "value": "Help healthcare providers manage appointments, inquiries, and follow-ups effectively."
        }
    ],
    "intents": [
        {
            "name": "Call Scheduling",
            "description": "Allow patients to schedule calls with healthcare providers for personalized medical guidance.",
            "value": "schedule_call"
        },
        {
            "name": "Appointment Scheduling",
            "description": "Help patients book appointments with doctors, specialists, or diagnostic centers.",
            "value": "schedule_appointment"
        },
        {
            "name": "Lead Generation & Patient Outreach",
            "description": "Capture new patient inquiries and schedule consultations to expand the patient base.",
            "value": "true"
        },
        {
            "name": "Symptom Checker & Appointment Scheduling",
            "description": "Offer preliminary health advice and facilitate scheduling with medical professionals.",
            "value": "symptom_checker"
        }
    ],
    "notes": [
        {
            "name": "Billing & Insurance Assistance",
            "description": "Guide patients on medical billing, insurance claims, and payment processing.",
            "value": "Guide patients on medical billing, insurance claims, and payment processing."
        },
        {
            "name": "Post-Treatment Follow-up & Care",
            "description": "Ensure timely follow-ups, feedback collection, and prescription reminders for better patient care.",
            "value": "Ensure timely follow-ups, feedback collection, and prescription reminders for better patient care."
        },
        {
            "name": "Patient Documentation Support",
            "description": "Assist in filling out medical forms, insurance paperwork, and necessary hospital documentation.",
            "value": "Assist in filling out medical forms, insurance paperwork, and necessary hospital documentation."
        },
        {
            "name": "Complaint & Feedback Handling",
            "description": "Capture patient concerns, escalate issues to the right department, and track resolution progress.",
            "value": "Capture patient concerns, escalate issues to the right department, and track resolution progress."
        }
    ]
  },
  {
    "type": "ecommerce",
    "roles": [
        {
            "name": "Customer Support Executive",
            "description": "Assist customers with order inquiries, returns, refunds, and account management.",
            "value": "Customer Support Executive"
        },
        {
            "name": "Sales & Marketing Specialist",
            "description": "Promote products, manage discounts, and engage users with loyalty programs.",
            "value": "Sales & Marketing Specialist"
        },
        {
            "name": "Order & Logistics Coordinator",
            "description": "Ensure smooth order fulfillment, shipment tracking, and delivery issue resolution.",
            "value": "Order & Logistics Coordinator"
        },
        {
            "name": "Product Recommendation Specialist",
            "description": "Personalize shopping experiences by suggesting products based on customer preferences.",
            "value": "Product Recommendation Specialist"
        }
    ],
    "goals": [
        {
            "name": "Seamless Shopping Experience",
            "description": "Ensure users find the right products quickly and receive support throughout their purchase journey.",
            "value": "Ensure users find the right products quickly and receive support throughout their purchase journey."
        },
        {
            "name": "Customer Retention & Engagement",
            "description": "Enhance customer satisfaction through personalized recommendations, order support, and loyalty programs.",
            "value": "Enhance customer satisfaction through personalized recommendations, order support, and loyalty programs."
        }
    ],
    "intents": [
        {
            "name": "Lead Generation & Customer Acquisition",
            "description": "Identify prospective customers through targeted recommendations and capture lead information for future marketing.",
            "value": "true"
        },
        {
            "name": "Call Scheduling",
            "description": "Enable users to schedule calls with customer support for product guidance, bulk orders, or issue resolution.",
            "value": "schedule_call"
        }
    ],
    "notes": [
        {
            "name": "Order Assistance & Tracking",
            "description": "Help customers track their orders, manage shipping issues, and provide estimated delivery times.",
            "value": "Help customers track their orders, manage shipping issues, and provide estimated delivery times."
        },
        {
            "name": "Product & Discount Promotions",
            "description": "Keep customers informed about new products, limited-time deals, and personalized discounts.",
            "value": "Keep customers informed about new products, limited-time deals, and personalized discounts."
        },
        {
            "name": "Returns & Refund Support",
            "description": "Guide customers through the return and refund process to ensure a hassle-free experience.",
            "value": "Guide customers through the return and refund process to ensure a hassle-free experience."
        },
        {
            "name": "Customer Feedback & Engagement",
            "description": "Collect customer feedback to improve product recommendations, shopping experience, and service quality.",
            "value": "Collect customer feedback to improve product recommendations, shopping experience, and service quality."
        }
    ]
  },
  {
    "type": "energy_&_utilities",
    "roles": [
        {
            "name": "Customer Support Executive",
            "description": "Assist users with billing inquiries, service issues, and outage reports.",
            "value": "Customer Support Executive"
        },
        {
            "name": "Energy Consultant",
            "description": "Guide customers on energy-saving solutions and renewable energy options.",
            "value": "Energy Consultant"
        },
        {
            "name": "Billing & Account Specialist",
            "description": "Handle payments, billing concerns, and account updates.",
            "value": "Billing & Account Specialist"
        },
        {
            "name": "Service & Maintenance Coordinator",
            "description": "Manage service requests, upgrades, and outage resolutions.",
            "value": "Service & Maintenance Coordinator"
        }
    ],
    "goals": [
        {
            "name": "Reliable Customer Assistance",
            "description": "Ensure users receive timely updates on service issues, billing, and account-related inquiries.",
            "value": "Ensure users receive timely updates on service issues, billing, and account-related inquiries."
        },
        {
            "name": "Improved Service Accessibility",
            "description": "Provide seamless support for new connections, upgrades, and energy efficiency guidance.",
            "value": "Provide seamless support for new connections, upgrades, and energy efficiency guidance."
        }
    ],
    "intents": [
        {
            "name": "Lead Generation & Customer Acquisition",
            "description": "Capture leads for new connection inquiries and service upgrade interests.",
            "value": "true"
        },
        {
            "name": "Call Scheduling",
            "description": "Enable users to schedule calls with customer service for billing assistance, service upgrades, or new connection guidance.",
            "value": "schedule_call"
        }
    ],
    "notes": [
        {
            "name": "Service Inquiry & Outage Reporting",
            "description": "Update users on service statuses, report outages, and provide estimated resolution times.",
            "value": "Update users on service statuses, report outages, and provide estimated resolution times."
        },
        {
            "name": "Billing & Account Management",
            "description": "Assist with bill payments, explain charges, and update account information.",
            "value": "Assist with bill payments, explain charges, and update account information."
        },
        {
            "name": "Energy-Saving Advisory",
            "description": "Offer tips on reducing energy usage and guidance on renewable energy options.",
            "value": "Offer tips on reducing energy usage and guidance on renewable energy options."
        },
        {
            "name": "Service Upgrades & New Connection Support",
            "description": "Help users schedule service installations, upgrades, or new connections.",
            "value": "Help users schedule service installations, upgrades, or new connections."
        }
    ]
   },
   {
    "type": "telecommunications",
    "roles": [
        {
            "name": "Customer Support Executive",
            "description": "Assist users with billing inquiries, technical issues, and service information.",
            "value": "Customer Support Executive"
        },
        {
            "name": "Sales & Retention Specialist",
            "description": "Guide customers through new plans, upgrades, and retention offers.",
            "value": "Sales & Retention Specialist"
        },
        {
            "name": "Technical Support Representative",
            "description": "Troubleshoot connectivity issues and assist with device configurations.",
            "value": "Technical Support Representative"
        },
        {
            "name": "Account & Billing Specialist",
            "description": "Manage account updates, bill payments, and explain charges to customers.",
            "value": "Account & Billing Specialist"
        }
    ],
    "goals": [
        {
            "name": "Enhanced Customer Experience",
            "description": "Ensure users receive personalized service recommendations, seamless account management, and quick technical support.",
            "value": "Ensure users receive personalized service recommendations, seamless account management, and quick technical support."
        },
        {
            "name": "Efficient Service Management",
            "description": "Help users enroll in new plans, upgrade services, and resolve issues efficiently.",
            "value": "Help users enroll in new plans, upgrade services, and resolve issues efficiently."
        }
    ],
    "intents": [
        {
            "name": "Lead Generation & Sales Prospecting",
            "description": "Capture potential customer data for new plans, upgrades, or additional service offerings.",
            "value": "true"
        },
        {
            "name": "Call Scheduling",
            "description": "Allow users to schedule calls with customer service for plan guidance, billing assistance, or technical support.",
            "value": "schedule_call"
        }
    ],
    "notes": [
        {
            "name": "Plan & Service Recommendations",
            "description": "Tailor mobile, internet, and TV plan suggestions based on user needs.",
            "value": "Tailor mobile, internet, and TV plan suggestions based on user needs."
        },
        {
            "name": "Account & Billing Assistance",
            "description": "Resolve billing issues, manage account changes, and process payments seamlessly.",
            "value": "Resolve billing issues, manage account changes, and process payments seamlessly."
        },
        {
            "name": "Technical Support & Troubleshooting",
            "description": "Provide step-by-step guides for resolving connectivity or device-related issues.",
            "value": "Provide step-by-step guides for resolving connectivity or device-related issues."
        },
        {
            "name": "New Service Enrollment & Upgrade Guidance",
            "description": "Assist users in selecting and enrolling in new services or upgrading existing plans.",
            "value": "Assist users in selecting and enrolling in new services or upgrading existing plans."
        }
    ]
    },
    {
    "type": "travel_&_hospitality",
    "roles": [
        {
            "name": "Travel Consultant",
            "description": "Assist travelers with personalized trip planning, accommodations, and activity recommendations.",
            "value": "Travel Consultant"
        },
        {
            "name": "Booking & Reservation Specialist",
            "description": "Manage flight, hotel, and activity reservations while ensuring seamless booking experiences.",
            "value": "Booking & Reservation Specialist"
        },
        {
            "name": "Customer Support Executive",
            "description": "Provide 24/7 assistance for itinerary modifications, cancellations, and travel-related inquiries.",
            "value": "Customer Support Executive"
        },
        {
            "name": "Sales & Promotions Specialist",
            "description": "Guide travelers through ongoing travel deals, loyalty programs, and seasonal offers.",
            "value": "Sales & Promotions Specialist"
        }
    ],
    "goals": [
        {
            "name": "Seamless Travel Experience",
            "description": "Ensure travelers receive customized itineraries, smooth booking processes, and real-time support.",
            "value": "Ensure travelers receive customized itineraries, smooth booking processes, and real-time support."
        },
        {
            "name": "Enhanced Customer Engagement",
            "description": "Provide travel deals, loyalty rewards, and expert guidance for an improved travel experience.",
            "value": "Provide travel deals, loyalty rewards, and expert guidance for an improved travel experience."
        }
    ],
    "intents": [
        {
            "name": "Lead Generation & Customer Engagement",
            "description": "Identify potential travelers and capture details for targeted travel offers and promotions.",
            "value": "true"
        },
        {
            "name": "Call Scheduling",
            "description": "Enable users to schedule calls with travel experts for itinerary planning, package details, or booking assistance.",
            "value": "schedule_call"
        }
    ],
    "notes": [
        {
            "name": "Trip Planning & Personalized Recommendations",
            "description": "Create custom itineraries, including hotels, flights, and local activities.",
            "value": "Create custom itineraries, including hotels, flights, and local activities."
        },
        {
            "name": "Booking & Reservation Management",
            "description": "Facilitate reservations for flights, accommodations, and other travel services.",
            "value": "Facilitate reservations for flights, accommodations, and other travel services."
        },
        {
            "name": "Customer Support & Concierge Services",
            "description": "Offer round-the-clock assistance for travel-related inquiries and on-site support.",
            "value": "Offer round-the-clock assistance for travel-related inquiries and on-site support."
        },
        {
            "name": "Promotions & Loyalty Program Integration",
            "description": "Inform users about travel deals, special offers, and loyalty rewards to enhance their experience.",
            "value": "Inform users about travel deals, special offers, and loyalty rewards to enhance their experience."
        }
    ]
    },
    {
        "type": "logistics",
        "roles": [
            {
                "name": "Logistics Coordinator",
                "description": "Oversee shipment schedules, dispatch coordination, and ensure timely deliveries.",
                "value": "Logistics Coordinator"
            },
            {
                "name": "Customer Support Executive",
                "description": "Assist customers with tracking updates, delivery concerns, and service inquiries.",
                "value": "Customer Support Executive"
            },
            {
                "name": "Freight & Shipping Consultant",
                "description": "Provide tailored shipping solutions, rate comparisons, and logistics planning advice.",
                "value": "Freight & Shipping Consultant"
            },
            {
                "name": "Sales & Business Development Specialist",
                "description": "Generate leads, acquire new clients, and manage partnerships for shipping services.",
                "value": "Sales & Business Development Specialist"
            }
        ],
        "goals": [
            {
                "name": "Efficient Shipment Management",
                "description": "Ensure seamless tracking, dispatch coordination, and customer support for enhanced logistics operations.",
                "value": "Ensure seamless tracking, dispatch coordination, and customer support for enhanced logistics operations."
            },
            {
                "name": "Improved Customer Engagement",
                "description": "Provide real-time updates, competitive shipping rates, and quick issue resolution.",
                "value": "Provide real-time updates, competitive shipping rates, and quick issue resolution."
            }
        ],
        "intents": [
            {
                "name": "Lead Generation & Client Acquisition",
                "description": "Capture inquiries for new shipment contracts and potential partnerships to grow the business.",
                "value": "true"
            },
            {
                "name": "Call Scheduling",
                "description": "Enable clients to book calls with logistics experts for service details, rate negotiations, or contract discussions.",
                "value": "schedule_call"
            }
        ],
        "notes": [
            {
                "name": "Shipment Tracking & Status Updates",
                "description": "Provide real-time tracking information and estimated delivery times.",
                "value": "Provide real-time tracking information and estimated delivery times."
            },
            {
                "name": "Booking & Dispatch Coordination",
                "description": "Assist with scheduling shipments and confirming dispatch details.",
                "value": "Assist with scheduling shipments and confirming dispatch details."
            },
            {
                "name": "Rate Quotation & Service Information",
                "description": "Offer personalized shipping quotes and detailed service comparisons.",
                "value": "Offer personalized shipping quotes and detailed service comparisons."
            },
            {
                "name": "Issue Resolution & Customer Support",
                "description": "Address delivery challenges, handle claims, and ensure timely resolution of concerns.",
                "value": "Address delivery challenges, handle claims, and ensure timely resolution of concerns."
            }
        ]
    }
  
]