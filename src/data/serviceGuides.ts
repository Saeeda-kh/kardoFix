export type ServiceOffering = {
  name: string;
  description: string;
  startingPrice: number;
};

export type ServiceGuide = {
  slug: string;
  category: string;
  headline: string;
  intro: string;
  startingPrice: number;
  offerings: ServiceOffering[];
  benefits: string[];
  steps: { title: string; description: string }[];
  faqs: { question: string; answer: string }[];
};

const sharedSteps = [
  { title: "Choose your service", description: "Select the type of help you need and share a few details." },
  { title: "Review your request", description: "A suitable provider can confirm scope, availability, and the final estimate." },
  { title: "Get the work done", description: "Agree on the visit details directly before work begins." },
];

const sharedFaqs = [
  { question: "Are the prices shown final?", answer: "No. These are sample starting estimates for this preview. A provider should confirm the scope and final price before you agree to a service." },
  { question: "How do I choose a provider?", answer: "Open the provider directory from this page, review the profile details, and contact KardoFix to request assistance." },
  { question: "Is the service available in my area?", answer: "Availability depends on your location and the provider’s schedule. Confirm both when you submit a request." },
];

export const serviceGuides: ServiceGuide[] = [
  {
    slug: "plumbing", category: "Plumbing", headline: "Plumbing help, without the guesswork.",
    intro: "From a dripping tap to a stubborn blockage, explore common plumbing services and find the right professional for your home.", startingPrice: 199,
    offerings: [
      { name: "Tap & faucet repair", description: "Inspection and repair for leaking, loose, or damaged taps and faucets.", startingPrice: 199 },
      { name: "Leak detection & repair", description: "Locate visible leaks around household pipes, walls, and fixtures and discuss a repair plan.", startingPrice: 299 },
      { name: "Pipe fitting", description: "Connect, replace, or adjust household water pipes and fittings.", startingPrice: 399 },
      { name: "Drain unclogging", description: "Clear common blockages in kitchen sinks, washbasins, and bathroom drains.", startingPrice: 299 },
      { name: "Bathroom fixture installation", description: "Install or replace faucets, shower heads, and other selected bathroom fixtures.", startingPrice: 399 },
      { name: "Flush tank repair", description: "Troubleshoot common flush-tank leaks, filling issues, and faulty flush mechanisms.", startingPrice: 299 },
      { name: "Toilet installation & repair", description: "Arrange installation or repair support for common toilet and seal issues.", startingPrice: 499 },
      { name: "Water heater (geyser) repair", description: "Get plumbing-side inspection and repair support for geyser connections and leaks.", startingPrice: 399 },
      { name: "Water tank cleaning & installation", description: "Discuss household water-tank cleaning, connection, or replacement requirements.", startingPrice: 599 },
      { name: "Water pump / motor repair", description: "Troubleshoot common household water-pump and motor connection problems.", startingPrice: 399 },
      { name: "Kitchen sink repair & installation", description: "Repair sink leaks or arrange installation of a kitchen sink and its connections.", startingPrice: 399 },
      { name: "Emergency plumbing visit", description: "Request help for urgent plumbing issues; availability and visit charges must be confirmed.", startingPrice: 499 },
    ],
    benefits: ["Discuss the issue before work starts", "Get a scope-based estimate", "Choose a provider serving your area"], steps: sharedSteps, faqs: sharedFaqs,
  },
  {
    slug: "electrical", category: "Electrical", headline: "Electrical repairs handled with care.",
    intro: "Explore everyday home electrical services, from light fittings to wiring checks, and request help for your specific issue.", startingPrice: 249,
    offerings: [
      { name: "Light installation", description: "Install or replace selected indoor lights and fixtures.", startingPrice: 249 },
      { name: "Fan repair & installation", description: "Troubleshoot common fan issues or arrange installation support.", startingPrice: 299 },
      { name: "Switch & socket repair", description: "Repair or replace faulty household switches and sockets.", startingPrice: 199 },
      { name: "Wiring inspection", description: "Review an electrical concern and discuss suitable next steps.", startingPrice: 399 },
      { name: "Doorbell installation", description: "Installation support for common wired or wireless doorbells.", startingPrice: 249 },
      { name: "Power backup setup", description: "Help with basic inverter or backup-power connection requirements.", startingPrice: 499 },
    ],
    benefits: ["Share the problem before arranging a visit", "Confirm parts and pricing in advance", "Choose a provider based on your requirements"], steps: sharedSteps, faqs: sharedFaqs,
  },
  {
    slug: "appliances-repair", category: "Appliances Repair", headline: "Get your home appliances back on track.",
    intro: "Find repair and maintenance help for common household appliances. Describe the symptoms so the provider can advise on the next step.", startingPrice: 299,
    offerings: [
      { name: "Air conditioner repair", description: "Diagnosis and repair support for common AC performance issues.", startingPrice: 499 },
      { name: "Refrigerator repair", description: "Troubleshooting for cooling, noise, and common refrigerator faults.", startingPrice: 399 },
      { name: "Washing machine repair", description: "Help with drainage, spin-cycle, and everyday washer problems.", startingPrice: 399 },
      { name: "Microwave repair", description: "Diagnosis for selected microwave heating and control issues.", startingPrice: 349 },
      { name: "Water purifier service", description: "Routine inspection and maintenance assistance for home purifiers.", startingPrice: 299 },
      { name: "Geyser repair", description: "Troubleshooting and repair support for common water-heater issues.", startingPrice: 399 },
    ],
    benefits: ["Explain the appliance issue when requesting help", "Ask about inspection and spare-part costs", "Confirm the make and model with your provider"], steps: sharedSteps, faqs: sharedFaqs,
  },
  {
    slug: "carpentry-furniture", category: "Carpentry & Furniture", headline: "Thoughtful fixes for furniture and fittings.",
    intro: "From a loose hinge to furniture repairs, find carpentry support suited to the job and materials in your home.", startingPrice: 299,
    offerings: [
      { name: "Furniture repair", description: "Repair assistance for common household furniture wear and damage.", startingPrice: 399 },
      { name: "Door & hinge repair", description: "Adjust or repair doors, handles, and hinges that need attention.", startingPrice: 299 },
      { name: "Shelf installation", description: "Install shelves and selected wall-mounted storage fittings.", startingPrice: 399 },
      { name: "Custom carpentry", description: "Discuss made-to-measure woodwork and project requirements.", startingPrice: 999 },
      { name: "Bed & wardrobe assembly", description: "Assembly and adjustment help for common furniture items.", startingPrice: 499 },
      { name: "Curtain rod installation", description: "Mount curtain rods and selected window fittings.", startingPrice: 299 },
    ],
    benefits: ["Share photos and dimensions before the visit", "Discuss material and hardware costs", "Plan the work around your space"], steps: sharedSteps, faqs: sharedFaqs,
  },
  {
    slug: "painting", category: "Painting", headline: "Give your walls a fresh start.",
    intro: "Explore painting and surface-finishing support for a room refresh, touch-ups, or a larger home project.", startingPrice: 999,
    offerings: [
      { name: "Interior wall painting", description: "Painting support for rooms and interior walls, subject to site assessment.", startingPrice: 999 },
      { name: "Wall touch-ups", description: "Small-area touch-up work for scuffs and minor surface marks.", startingPrice: 499 },
      { name: "Wall texture finish", description: "Discuss decorative texture options and surface preparation needs.", startingPrice: 1499 },
      { name: "Ceiling painting", description: "Refresh ceilings with suitable paint and preparation.", startingPrice: 999 },
      { name: "Wood polish & finish", description: "Polish and finishing support for selected wooden surfaces.", startingPrice: 799 },
      { name: "Exterior painting", description: "Discuss exterior surface preparation, access, and project requirements.", startingPrice: 1999 },
    ],
    benefits: ["Request a site assessment for accurate pricing", "Discuss paint brands and material costs", "Plan preparation and cleanup expectations"], steps: sharedSteps, faqs: sharedFaqs,
  },
  {
    slug: "pest-control", category: "Pest Control", headline: "A more comfortable, pest-aware home.",
    intro: "Explore household pest treatment options and request an assessment based on the pest, affected area, and your home’s needs.", startingPrice: 499,
    offerings: [
      { name: "Cockroach treatment", description: "Treatment options for common indoor cockroach concerns.", startingPrice: 499 },
      { name: "Termite inspection & treatment", description: "Assessment and treatment planning for suspected termite activity.", startingPrice: 999 },
      { name: "Rodent control", description: "Discuss rodent activity, entry points, and suitable control measures.", startingPrice: 699 },
      { name: "Ant treatment", description: "Treatment support for common household ant activity.", startingPrice: 499 },
      { name: "Mosquito control", description: "Options for reducing mosquito activity around the home.", startingPrice: 599 },
      { name: "Bed bug treatment", description: "Assessment-led support for suspected bed bug activity.", startingPrice: 999 },
    ],
    benefits: ["Tell the provider what pest you have noticed", "Ask about preparation and re-entry guidance", "Confirm treatment details and any follow-up"], steps: sharedSteps, faqs: sharedFaqs,
  },
  {
    slug: "ac-services", category: "AC Services", headline: "Comfortable cooling starts with the right care.",
    intro: "Find help with air-conditioner servicing, repairs, and installation. Share your unit type and concern when requesting support.", startingPrice: 399,
    offerings: [
      { name: "AC servicing", description: "Routine inspection and cleaning support for selected AC units.", startingPrice: 499 },
      { name: "AC repair", description: "Diagnosis for common cooling, noise, or performance issues.", startingPrice: 499 },
      { name: "AC installation", description: "Installation planning based on unit type and site requirements.", startingPrice: 1499 },
      { name: "AC uninstallation", description: "Careful removal support for an existing air-conditioning unit.", startingPrice: 799 },
      { name: "Gas check & refill assessment", description: "Inspection to assess refrigerant concerns and possible next steps.", startingPrice: 999 },
      { name: "Water leakage check", description: "Troubleshooting for indoor-unit drainage and water leakage issues.", startingPrice: 399 },
    ],
    benefits: ["Share the AC type and symptoms", "Confirm inspection, parts, and visit charges", "Ask about service scope before work begins"], steps: sharedSteps, faqs: sharedFaqs,
  },
  {
    slug: "home-security", category: "Home Security", headline: "Practical security upgrades for your home.",
    intro: "Explore installation help for cameras, video door phones, and other home security equipment.", startingPrice: 799,
    offerings: [
      { name: "CCTV camera installation", description: "Installation planning for camera coverage and cable routing.", startingPrice: 999 },
      { name: "Video door phone setup", description: "Set up a compatible video door phone and explain basic operation.", startingPrice: 1299 },
      { name: "Smart door lock installation", description: "Installation support for selected smart locks and access devices.", startingPrice: 999 },
      { name: "Wi-Fi camera setup", description: "Help connect and position compatible indoor security cameras.", startingPrice: 799 },
      { name: "Security system inspection", description: "Review an existing setup and discuss repair or upgrade options.", startingPrice: 499 },
      { name: "Motion sensor setup", description: "Install and configure selected motion detection devices.", startingPrice: 799 },
    ],
    benefits: ["Discuss device compatibility in advance", "Plan camera positions and coverage", "Confirm equipment and installation costs"], steps: sharedSteps, faqs: sharedFaqs,
  },
  {
    slug: "beauty-wellness", category: "Beauty & Wellness", headline: "Personal care, on your schedule.",
    intro: "Explore at-home beauty and wellness services and request a professional for your preferred service and timing.", startingPrice: 499,
    offerings: [
      { name: "At-home salon service", description: "Selected salon services delivered at home by appointment.", startingPrice: 699 },
      { name: "Haircut & styling", description: "Personal hair care and styling for your requested look.", startingPrice: 499 },
      { name: "Makeup services", description: "Makeup support for everyday, party, or special-occasion looks.", startingPrice: 999 },
      { name: "Manicure & pedicure", description: "At-home nail care and grooming services by appointment.", startingPrice: 699 },
      { name: "Relaxation massage", description: "Wellness massage options; confirm service details and suitability first.", startingPrice: 999 },
      { name: "Bridal & occasion-ready", description: "Discuss a tailored beauty plan for events and celebrations.", startingPrice: 1999 },
    ],
    benefits: ["Confirm the exact service and duration", "Discuss products, hygiene, and preferences", "Agree on suitability and final cost beforehand"], steps: sharedSteps, faqs: sharedFaqs,
  },
  {
    slug: "packers-movers", category: "Packers & Movers", headline: "Make your next move feel more manageable.",
    intro: "Plan home or office moves with packing and shifting support suited to your inventory, route, and schedule.", startingPrice: 1499,
    offerings: [
      { name: "Home shifting", description: "Moving support for household items between locations.", startingPrice: 2999 },
      { name: "Office relocation", description: "Plan packing and transport for office furniture and equipment.", startingPrice: 4999 },
      { name: "Packing services", description: "Packing assistance for selected rooms, fragile goods, or full homes.", startingPrice: 1499 },
      { name: "Loading & unloading", description: "Arrange labor support for loading and unloading household goods.", startingPrice: 999 },
      { name: "Furniture dismantling", description: "Disassemble and reassemble suitable furniture for a move.", startingPrice: 799 },
      { name: "Local mini move", description: "Support for smaller local moves with a limited number of items.", startingPrice: 1499 },
    ],
    benefits: ["Share pickup, delivery, and access details", "Discuss inventory and packing needs", "Confirm transport, labor, and insurance terms"], steps: sharedSteps, faqs: sharedFaqs,
  },
  {
    slug: "events-occasions", category: "Events & Occasions", headline: "Bring your next celebration together.",
    intro: "Find support for event decor, catering, photography, and the details that make a gathering feel special.", startingPrice: 1999,
    offerings: [
      { name: "Event decoration", description: "Decor planning for birthdays, celebrations, and intimate gatherings.", startingPrice: 2999 },
      { name: "Small-event catering", description: "Discuss menu and serving arrangements for your guest count.", startingPrice: 3999 },
      { name: "Event photography", description: "Photography coverage options based on event duration and requirements.", startingPrice: 2999 },
      { name: "Birthday setup", description: "Coordinate simple themes, balloons, and celebration details.", startingPrice: 1999 },
      { name: "Makeup for occasions", description: "Book occasion-ready makeup support at your preferred location.", startingPrice: 1499 },
      { name: "Event coordination", description: "Get help organizing vendors, setup timing, and event-day details.", startingPrice: 4999 },
    ],
    benefits: ["Share your date, venue, and guest count", "Discuss inclusions and setup time", "Confirm the plan and payment terms in writing"], steps: sharedSteps, faqs: sharedFaqs,
  },
  {
    slug: "home-tutor", category: "Home Tutor", headline: "Learning support shaped around the student.",
    intro: "Explore one-to-one tutoring options for school subjects, senior studies, and Quran learning at home or online where available.", startingPrice: 500,
    offerings: [
      { name: "Tutoring for kids", description: "Foundational support in core subjects for younger learners.", startingPrice: 500 },
      { name: "Matriculation subjects", description: "Subject-focused tutoring and exam preparation for matriculation.", startingPrice: 700 },
      { name: "Senior studies tutoring", description: "Focused academic support for advanced school-level subjects.", startingPrice: 900 },
      { name: "Quran studies", description: "Lessons in recitation, tajweed, and memorization with a suitable tutor.", startingPrice: 600 },
      { name: "English & communication", description: "Practice reading, writing, grammar, and communication skills.", startingPrice: 500 },
      { name: "Online tutoring", description: "Remote lessons where the tutor and student both support online sessions.", startingPrice: 500 },
    ],
    benefits: ["Match the tutor to the student’s level", "Discuss goals and preferred lesson schedule", "Confirm online or in-person availability"], steps: sharedSteps, faqs: sharedFaqs,
  },
  {
    slug: "home-maid", category: "Home Maid", headline: "Everyday household help that fits your routine.",
    intro: "Explore flexible home assistance for daily chores, kitchen help, tidying, and laundry. Confirm tasks and schedule before arranging support.", startingPrice: 150,
    offerings: [
      { name: "Daily household help", description: "Support with agreed everyday household tasks and routines.", startingPrice: 250 },
      { name: "Kitchen assistance", description: "Help with kitchen upkeep, dishes, and agreed preparation tasks.", startingPrice: 200 },
      { name: "Laundry & ironing", description: "Laundry folding, ironing, and related household tasks by arrangement.", startingPrice: 200 },
      { name: "Home tidying", description: "Organize and tidy selected rooms or household areas.", startingPrice: 250 },
      { name: "Cooking assistance", description: "Meal preparation help based on your menu and household needs.", startingPrice: 300 },
      { name: "Part-time home help", description: "Arrange a defined set of tasks for a mutually agreed schedule.", startingPrice: 150 },
    ],
    benefits: ["Agree on the exact tasks and working hours", "Discuss household preferences and supplies", "Confirm pay frequency and arrangement directly"], steps: sharedSteps, faqs: sharedFaqs,
  },
  {
    slug: "cooking-services", category: "Cooking Services", headline: "Home-cooked meals, made around your table.",
    intro: "Find home cooks and chefs for everyday meals, dietary preferences, and small gatherings.", startingPrice: 1200,
    offerings: [
      { name: "Daily home cooking", description: "Prepare everyday meals based on your menu and household preferences.", startingPrice: 1200 },
      { name: "North Indian cuisine", description: "Home-style dishes and menus inspired by North Indian cuisine.", startingPrice: 1200 },
      { name: "Vegetarian meals", description: "Vegetarian meal preparation for daily routines or special menus.", startingPrice: 1200 },
      { name: "Multi-cuisine cooking", description: "Discuss menus spanning different cuisines and preparation styles.", startingPrice: 1500 },
      { name: "Small gathering chef", description: "Meal preparation support for family events and small gatherings.", startingPrice: 2500 },
      { name: "Meal prep assistance", description: "Prepare planned meals or ingredients for the week by arrangement.", startingPrice: 1000 },
    ],
    benefits: ["Share menu and dietary preferences", "Confirm ingredients and grocery arrangements", "Agree on timing and serving requirements"], steps: sharedSteps, faqs: sharedFaqs,
  },
  {
    slug: "nursing-services", category: "Nursing Services", headline: "Attentive care support, coordinated with your family.",
    intro: "Explore in-home nursing and patient-support options. Discuss care needs and credentials with the provider before confirming any care plan.", startingPrice: 1000,
    offerings: [
      { name: "Home nursing visit", description: "In-home nursing support as agreed with the family and qualified professional.", startingPrice: 1000 },
      { name: "Elderly care support", description: "Assistance with agreed daily support needs for older adults.", startingPrice: 1000 },
      { name: "Post-hospital support", description: "Non-emergency in-home support following discharge, based on care instructions.", startingPrice: 1200 },
      { name: "Patient attendant", description: "Companionship and daily living assistance as agreed with the family.", startingPrice: 800 },
      { name: "Routine vitals assistance", description: "Basic monitoring support when appropriate and performed by qualified personnel.", startingPrice: 1000 },
      { name: "Day or night shift care", description: "Discuss shift duration, care scope, and availability with the provider.", startingPrice: 1500 },
    ],
    benefits: ["Verify qualifications and experience before booking", "Share care instructions with the provider", "Confirm scope, schedule, and emergency arrangements"], steps: sharedSteps, faqs: [
      { question: "Does this replace medical advice or emergency care?", answer: "No. This service guide is not medical advice and is not for emergencies. Contact local emergency services or a licensed clinician for urgent medical needs." },
      ...sharedFaqs,
    ],
  },
  {
    slug: "other-services", category: "Other Services", headline: "Need a hand with something else at home?",
    intro: "Tell us what you need help with. Explore general home maintenance and custom requests, then confirm the scope with a provider.", startingPrice: 399,
    offerings: [
      { name: "General home maintenance", description: "Small, non-specialist household fixes and maintenance tasks.", startingPrice: 399 },
      { name: "Drill & wall mounting", description: "Mount suitable household items after checking the wall and fixture type.", startingPrice: 299 },
      { name: "Curtain & blind fitting", description: "Install or adjust common curtains, rods, and blinds.", startingPrice: 299 },
      { name: "Furniture assembly", description: "Assemble compatible flat-pack and household furniture.", startingPrice: 399 },
      { name: "Home inspection assistance", description: "Walk through a list of minor maintenance concerns and discuss next steps.", startingPrice: 499 },
      { name: "Custom service request", description: "Describe a task not listed here so the team can help identify a suitable professional.", startingPrice: 399 },
    ],
    benefits: ["Describe the task clearly", "Share photos or measurements if useful", "A provider must confirm they can safely do the work"], steps: sharedSteps, faqs: sharedFaqs,
  },
];

export function getServiceGuide(slug: string) {
  return serviceGuides.find((guide) => guide.slug === slug);
}