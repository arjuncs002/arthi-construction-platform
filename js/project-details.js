/* ============================================================
   ARTHI CONSTRUCTIONS — Project Details Page Logic
   Reads ?id=<slug> from URL and renders the correct project.
   ============================================================ */

const PROJECTS = {
  'arthi-skyline-towers': {
    id: 'arthi-skyline-towers',
    name: 'Arthi Skyline Towers',
    tagline: 'Rise Above the Ordinary',
    location: 'Kakkanad, Kochi, Kerala',
    mapQuery: 'Kakkanad+Kochi+Kerala',
    builder: 'Arthi Constructions',
    type: 'Premium Apartments',
    status: 'Ongoing',
    statusClass: 'chip-info',
    startingPrice: '₹72 Lakhs',
    priceNote: 'Onwards for 2 BHK',
    towers: 3,
    floors: 18,
    totalUnits: 216,
    unitsAvailable: 84,
    unitsBooked: 132,
    villas: null,
    flats: 216,
    expectedCompletion: 'December 2027',
    constructionProgress: 48,
    launchDate: 'March 2024',
    reraNo: 'KL/RERA/PRJ/2024/001234',
    hero: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600&q=80',
    gallery: [
      { src: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&q=80', cap: 'Tower Exterior' },
      { src: 'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=900&q=80', cap: 'Lobby' },
      { src: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=900&q=80', cap: 'Living Room' },
      { src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80', cap: 'Master Bedroom' },
      { src: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=80', cap: 'Site Progress' },
      { src: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&q=80', cap: 'Pool Deck' },
    ],
    amenities: ['Swimming Pool', 'Gym', 'Club House', "Children's Park", '24/7 Security', 'Parking', 'Jogging Track', 'Terrace Garden', 'EV Charging'],
    floorPlans: [
      { type: '2 BHK', area: '1,050 sq.ft', price: '₹72L+', img: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80' },
      { type: '3 BHK', area: '1,450 sq.ft', price: '₹98L+', img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80' },
      { type: '3 BHK Luxury', area: '1,800 sq.ft', price: '₹1.25Cr+', img: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=600&q=80' },
    ],
    nearby: {
      schools: ['Bhavan\'s Varuna Vidyalaya (1.2 km)', 'Rajagiri Public School (2.1 km)', 'Choice School (3.5 km)'],
      hospitals: ['Aster Medcity (2.8 km)', 'Lakeshore Hospital (4.2 km)', 'Sunrise Hospital (5.1 km)'],
      metro: ['Kakkanad Metro Station (0.8 km)', 'InfoPark Metro Station (1.5 km)'],
      airport: ['Cochin International Airport (18 km — 30 mins)'],
    },
    description: `Arthi Skyline Towers redefines urban living in the heart of Kochi's IT corridor, Kakkanad. Rising 18 floors above the city, these premium apartments offer breathtaking views of the Vembanad backwaters and the Western Ghats. Strategically located near InfoPark and SmartCity, this project is ideal for IT professionals and families seeking a premium lifestyle.\n\nEach apartment is designed with Vastu compliance, cross-ventilation, and large balconies that bring the outdoors in. The project features world-class amenities spread across 2.5 acres of lush landscaped grounds.`,
    specifications: [
      { label: 'Structure', value: 'RCC framed structure with ISI grade cement' },
      { label: 'Flooring', value: 'Vitrified tiles in living, bedrooms; Anti-skid tiles in bathrooms' },
      { label: 'Kitchen', value: 'Granite counter, stainless steel sink, modular provision' },
      { label: 'Bathroom', value: 'Branded CP fittings, wall-hung WC, shower enclosure' },
      { label: 'Doors', value: 'Teak wood main door; Flush doors for internal rooms' },
      { label: 'Windows', value: 'UPVC sliding windows with mosquito mesh' },
      { label: 'Electrical', value: 'Concealed copper wiring, modular switches, fire safety' },
      { label: 'Security', value: 'CCTV, intercom, biometric access, 24/7 security personnel' },
    ],
    faqs: [
      { q: 'Is this project RERA approved?', a: 'Yes. RERA Registration No: KL/RERA/PRJ/2024/001234. You can verify at krera.in.' },
      { q: 'What is the EMI for a 2 BHK?', a: 'For a 2 BHK at ₹72L with 20% down payment and 8.5% interest over 20 years, EMI is approximately ₹52,000/month.' },
      { q: 'Is home loan available?', a: 'Yes. We have tie-ups with SBI, HDFC, ICICI, Axis Bank and all major housing finance companies.' },
      { q: 'When will possession happen?', a: 'Expected possession is December 2027 as per RERA timeline.' },
      { q: 'Is Vastu compliance followed?', a: 'Yes, all units are designed with strict Vastu compliance by our in-house Vastu consultant.' },
    ],
    progressStages: [
      { stage: 'Site Preparation', pct: 100 },
      { stage: 'Foundation & Excavation', pct: 100 },
      { stage: 'Structural Work', pct: 100 },
      { stage: 'Masonry & Brickwork', pct: 85 },
      { stage: 'Electrical & Plumbing', pct: 45 },
      { stage: 'Finishing & Interiors', pct: 10 },
    ],
    salesContact: { name: 'Arun Nair', phone: '+91 94470 12345', email: 'skyline@arthiconstructions.com' },
  },

  'arthi-palm-villas': {
    id: 'arthi-palm-villas',
    name: 'Arthi Palm Villas',
    tagline: 'Your Private Paradise in Kochi',
    location: 'Edapally, Kochi, Kerala',
    mapQuery: 'Edapally+Kochi+Kerala',
    builder: 'Arthi Constructions',
    type: 'Luxury Villas',
    status: 'Upcoming',
    statusClass: 'chip-warning',
    startingPrice: '₹1.85 Crore',
    priceNote: 'Onwards for 3 BHK Villa',
    towers: null,
    floors: 2,
    totalUnits: 48,
    unitsAvailable: 48,
    unitsBooked: 0,
    villas: 48,
    flats: null,
    expectedCompletion: 'June 2028',
    constructionProgress: 12,
    launchDate: 'August 2025',
    reraNo: 'KL/RERA/PRJ/2025/002891',
    hero: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80',
    gallery: [
      { src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80', cap: 'Villa Exterior' },
      { src: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&q=80', cap: 'Pool Villa' },
      { src: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=900&q=80', cap: 'Living Space' },
      { src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80', cap: 'Master Suite' },
      { src: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=80', cap: 'Construction Update' },
      { src: 'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=900&q=80', cap: 'Garden View' },
    ],
    amenities: ['Private Pool', 'Gym', 'Club House', "Children's Park", '24/7 Security', 'Covered Parking', 'Landscaped Garden', 'Jogging Track', 'Yoga Pavilion', 'Smart Home'],
    floorPlans: [
      { type: '3 BHK Villa', area: '2,200 sq.ft', price: '₹1.85Cr+', img: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80' },
      { type: '4 BHK Grand Villa', area: '2,900 sq.ft', price: '₹2.40Cr+', img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80' },
    ],
    nearby: {
      schools: ['Bhavan\'s Adarsha Vidyalaya (0.9 km)', 'Rajagiri CMI Public School (2.4 km)', 'Little Flower School (3.2 km)'],
      hospitals: ['VPS Lakeshore Hospital (1.5 km)', 'Aster MIMS (3.8 km)', 'Kerala Institute of Medical Sciences (6.1 km)'],
      metro: ['Edapally Metro Junction (0.6 km) — Blue + Red line interchange'],
      airport: ['Cochin International Airport (14 km — 25 mins)'],
    },
    description: `Arthi Palm Villas is an exclusive gated community of 48 ultra-luxury villas nestled in Edapally, Kochi's most premium residential address. Set within 8 acres of landscaped greenery, each villa is a masterclass in contemporary architecture paired with traditional Kerala design sensibilities.\n\nEvery villa features private landscaped gardens, dedicated parking for 2 cars, and smart home automation. The project is located at Kochi's most strategic junction — minutes from the Edapally metro interchange, OBERON Mall, and Lakeshore Hospital.`,
    specifications: [
      { label: 'Structure', value: 'Load-bearing RCC with Porotherm brick walls' },
      { label: 'Flooring', value: 'Italian marble in living; Engineered wood in bedrooms' },
      { label: 'Kitchen', value: 'Modular kitchen with granite top, Hettich fittings, chimney provision' },
      { label: 'Bathroom', value: 'Jacuzzi in master bath, Kohler/Grohe fittings, rain shower' },
      { label: 'Doors', value: 'Teak wood main door with digital lock; Solid core internal doors' },
      { label: 'Windows', value: 'Double-glazed UPVC with tilt & turn mechanism' },
      { label: 'Electrical', value: 'Smart home wiring, solar panel provision, EV charger point' },
      { label: 'Exterior', value: 'Textured paint with weather-resistant coating, aluminum cladding accents' },
    ],
    faqs: [
      { q: 'What is the pre-launch offer?', a: 'Pre-launch buyers get an exclusive 5% discount and first choice of villa plot selection.' },
      { q: 'Is there a villa with private pool?', a: 'Yes, select plots allow private plunge pool addition at additional cost.' },
      { q: 'Is the community gated with security?', a: 'Yes, single entry/exit point with boom barrier, CCTV and 24/7 security personnel.' },
      { q: 'When does construction begin?', a: 'Civil work commences August 2025. Site preparation is already underway.' },
    ],
    progressStages: [
      { stage: 'Land Development & Survey', pct: 100 },
      { stage: 'Approvals & RERA Registration', pct: 100 },
      { stage: 'Site Preparation', pct: 65 },
      { stage: 'Foundation Work', pct: 0 },
      { stage: 'Structural Work', pct: 0 },
      { stage: 'Finishing & Handover', pct: 0 },
    ],
    salesContact: { name: 'Priya Varghese', phone: '+91 94470 23456', email: 'palmvillas@arthiconstructions.com' },
  },

  'arthi-marine-heights': {
    id: 'arthi-marine-heights',
    name: 'Arthi Marine Heights',
    tagline: 'Live Where the Sea Meets the Sky',
    location: 'Beach Road, Kozhikode, Kerala',
    mapQuery: 'Kozhikode+Beach+Road+Kerala',
    builder: 'Arthi Constructions',
    type: 'Sea-View Apartments',
    status: 'Ongoing',
    statusClass: 'chip-info',
    startingPrice: '₹58 Lakhs',
    priceNote: 'Onwards for 2 BHK',
    towers: 2,
    floors: 14,
    totalUnits: 168,
    unitsAvailable: 61,
    unitsBooked: 107,
    villas: null,
    flats: 168,
    expectedCompletion: 'September 2027',
    constructionProgress: 63,
    launchDate: 'January 2023',
    reraNo: 'KL/RERA/PRJ/2023/003567',
    hero: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=80',
    gallery: [
      { src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&q=80', cap: 'Tower View' },
      { src: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=80', cap: 'Construction Progress' },
      { src: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=900&q=80', cap: 'Structural Work' },
      { src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80', cap: 'Interior Progress' },
      { src: 'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=900&q=80', cap: 'Model Flat' },
      { src: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&q=80', cap: 'Pool Area' },
    ],
    amenities: ['Rooftop Pool', 'Gym', 'Club House', "Children's Play Area", '24/7 Security', 'Parking', 'Multipurpose Hall', 'Power Backup', 'EV Charging'],
    floorPlans: [
      { type: '2 BHK Sea View', area: '1,120 sq.ft', price: '₹58L+', img: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80' },
      { type: '3 BHK Sea View', area: '1,550 sq.ft', price: '₹82L+', img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80' },
      { type: '3 BHK Penthouse', area: '2,100 sq.ft', price: '₹1.2Cr+', img: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=600&q=80' },
    ],
    nearby: {
      schools: ['Calvathy Public School (0.7 km)', 'Kendriya Vidyalaya Calicut (1.9 km)', 'The Oxford School (2.8 km)'],
      hospitals: ['Baby Memorial Hospital (1.1 km)', 'MIMS Hospital (2.5 km)', 'Aster MIMS Kozhikode (4.2 km)'],
      metro: ['Kozhikode Metro Phase 2 (Planned by 2027) — Beach Road Station (0.4 km)'],
      airport: ['Calicut International Airport (28 km — 40 mins)'],
    },
    description: `Arthi Marine Heights stands tall on Kozhikode's iconic Beach Road, offering panoramic views of the Arabian Sea from every floor. Built across two elegant towers of 14 floors each, this project brings premium coastal living to Kerala's City of Spices.\n\nWaking up to sea breezes, watching sunsets from your balcony, and living minutes from Kozhikode's finest dining and shopping — this is the lifestyle Arthi Marine Heights delivers. The project is 63% complete with possession in sight.`,
    specifications: [
      { label: 'Structure', value: 'RCC framed structure, seismic Zone III compliant' },
      { label: 'Flooring', value: 'Vitrified tiles (800x800) in living; Ceramic tiles in bathrooms' },
      { label: 'Kitchen', value: 'Platform with granite, stainless steel sink, 2 utility connections' },
      { label: 'Bathroom', value: 'CP fittings (Jaquar/equivalent), wall-hung WC, shower area' },
      { label: 'Doors', value: 'Ornate main door; Flush doors with quality hardware inside' },
      { label: 'Windows', value: 'UPVC sliding with mosquito mesh and salt-air resistant coating' },
      { label: 'Electrical', value: 'ISI marked wiring, ELCB, modular switches, power backup' },
      { label: 'Safety', value: 'Firefighting system, sprinklers, emergency staircase, CCTV' },
    ],
    faqs: [
      { q: 'Do all units have sea view?', a: 'Floors 5 and above have clear sea views. Floors 3-4 have partial views. Ground and 1st floor face the garden.' },
      { q: 'Are pets allowed?', a: 'Yes, small pets are allowed in designated areas with prior registration.' },
      { q: 'What is the maintenance charge?', a: 'Estimated ₹3.50 per sq.ft per month post possession.' },
      { q: 'Is there a gym and pool?', a: 'Yes — a rooftop infinity pool and a fully equipped gym on the podium level.' },
    ],
    progressStages: [
      { stage: 'Foundation & Piling', pct: 100 },
      { stage: 'Structural Work (All Floors)', pct: 100 },
      { stage: 'Masonry & Brickwork', pct: 100 },
      { stage: 'Plumbing & Electrical', pct: 75 },
      { stage: 'Plastering', pct: 60 },
      { stage: 'Flooring & Finishing', pct: 25 },
    ],
    salesContact: { name: 'Suresh Menon', phone: '+91 94470 34567', email: 'marine@arthiconstructions.com' },
  },

  'arthi-royal-enclave': {
    id: 'arthi-royal-enclave',
    name: 'Arthi Royal Enclave',
    tagline: 'A Legacy of Elegance',
    location: 'Calicut University Road, Kozhikode, Kerala',
    mapQuery: 'Calicut+University+Road+Kozhikode+Kerala',
    builder: 'Arthi Constructions',
    type: 'Premium Villas',
    status: 'Completed',
    statusClass: 'chip-success',
    startingPrice: '₹95 Lakhs',
    priceNote: 'Resale from ₹95L',
    towers: null,
    floors: 2,
    totalUnits: 36,
    unitsAvailable: 4,
    unitsBooked: 32,
    villas: 36,
    flats: null,
    expectedCompletion: 'Completed — March 2024',
    constructionProgress: 100,
    launchDate: 'June 2021',
    reraNo: 'KL/RERA/PRJ/2021/004102',
    hero: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1600&q=80',
    gallery: [
      { src: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=900&q=80', cap: 'Villa Exterior' },
      { src: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=900&q=80', cap: 'Living Room' },
      { src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80', cap: 'Master Bedroom' },
      { src: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&q=80', cap: 'Community Club House' },
      { src: 'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=900&q=80', cap: 'Landscaped Garden' },
      { src: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900&q=80', cap: 'Street View' },
    ],
    amenities: ['Swimming Pool', 'Gym', 'Club House', "Children's Park", '24/7 Security', 'Covered Parking', 'Garden & Landscaping', 'CCTV Surveillance', 'Power Backup'],
    floorPlans: [
      { type: '3 BHK Villa', area: '1,950 sq.ft', price: '₹95L (Resale)', img: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80' },
      { type: '4 BHK Villa', area: '2,500 sq.ft', price: '₹1.25Cr (Resale)', img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80' },
    ],
    nearby: {
      schools: ['University of Calicut Campus School (0.5 km)', 'EMEA College (1.2 km)', 'Farook College (2.1 km)'],
      hospitals: ['Government Medical College Kozhikode (3.5 km)', 'MIMS Hospital (4.8 km)', 'Baby Memorial Hospital (6.2 km)'],
      metro: ['Kozhikode Metro (Planned) — University Station (0.9 km estimated)'],
      airport: ['Calicut International Airport (23 km — 35 mins)'],
    },
    description: `Arthi Royal Enclave is a completely sold-out (92%) premium villa community on Calicut University Road, Kozhikode. Completed in March 2024, this project set a new benchmark for luxury villas in Malabar. With 36 villas spread across 6 acres of tree-lined avenues, it offers a serene university-neighbourhood lifestyle.\n\nHappy homeowners have given Royal Enclave a 4.8/5 rating for quality of construction, timely delivery, and post-handover support. A few resale units are available through Arthi Constructions.`,
    specifications: [
      { label: 'Structure', value: 'Premium RCC with AAC blocks' },
      { label: 'Flooring', value: 'Italian marble in living; Wooden flooring in bedrooms' },
      { label: 'Kitchen', value: 'Full modular kitchen with Hettich accessories, Quartz top' },
      { label: 'Bathroom', value: 'Kohler/Grohe fittings, Jacuzzi in master, wall-hung WC' },
      { label: 'Doors', value: 'Solid teak main door with brass fittings; Solid core interior' },
      { label: 'Windows', value: 'Double-glazed UPVC — noise and heat insulating' },
      { label: 'Electrical', value: 'Full smart home automation with Schneider switches' },
      { label: 'Handover', value: 'Completed March 2024 — 100% possession given on time' },
    ],
    faqs: [
      { q: 'Is this project completed?', a: 'Yes, fully completed in March 2024. Possession given to all 32 buyers. 4 resale units available.' },
      { q: 'How to buy a resale unit?', a: 'Contact our sales team. We facilitate resale with full documentation support.' },
      { q: 'What is the community maintenance?', a: '₹4.00 per sq.ft per month, managed by Resident Welfare Association.' },
    ],
    progressStages: [
      { stage: 'Foundation & Excavation', pct: 100 },
      { stage: 'Structural Work', pct: 100 },
      { stage: 'Masonry & Roofing', pct: 100 },
      { stage: 'Electrical & Plumbing', pct: 100 },
      { stage: 'Finishing & Interiors', pct: 100 },
      { stage: 'Handover & Possession', pct: 100 },
    ],
    salesContact: { name: 'Deepa Krishnan', phone: '+91 94470 45678', email: 'royalenclave@arthiconstructions.com' },
  },

  'arthi-green-meadows': {
    id: 'arthi-green-meadows',
    name: 'Arthi Green Meadows',
    tagline: 'Eco-Living in the Heart of Kochi',
    location: 'Thrikkakara, Kochi, Kerala',
    mapQuery: 'Thrikkakara+Kochi+Kerala',
    builder: 'Arthi Constructions',
    type: 'Eco-Friendly Apartments',
    status: 'Upcoming',
    statusClass: 'chip-warning',
    startingPrice: '₹62 Lakhs',
    priceNote: 'Onwards for 2 BHK',
    towers: 4,
    floors: 16,
    totalUnits: 320,
    unitsAvailable: 320,
    unitsBooked: 0,
    villas: null,
    flats: 320,
    expectedCompletion: 'March 2029',
    constructionProgress: 5,
    launchDate: 'October 2025',
    reraNo: 'Pending — Application Submitted',
    hero: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1600&q=80',
    gallery: [
      { src: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=900&q=80', cap: 'Architectural Render' },
      { src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80', cap: 'Green Landscape' },
      { src: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&q=80', cap: 'Community Plan' },
      { src: 'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=900&q=80', cap: 'Clubhouse Render' },
      { src: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&q=80', cap: 'Tower Elevation' },
      { src: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900&q=80', cap: 'Site Survey' },
    ],
    amenities: ['Olympic Pool', 'Gym', 'Grand Club House', "Children's Adventure Park", '24/7 Security', 'Multi-Level Parking', 'Solar Panels', 'Rainwater Harvesting', 'Organic Farm', 'Amphitheatre', 'Co-Working Space', 'EV Charging'],
    floorPlans: [
      { type: '2 BHK', area: '980 sq.ft', price: '₹62L+', img: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80' },
      { type: '2.5 BHK', area: '1,200 sq.ft', price: '₹75L+', img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80' },
      { type: '3 BHK', area: '1,500 sq.ft', price: '₹94L+', img: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=600&q=80' },
    ],
    nearby: {
      schools: ['Thrikkakara Government School (0.4 km)', 'Choice School (1.8 km)', 'Rajagiri Bethany School (2.5 km)'],
      hospitals: ['Aster Medcity (3.2 km)', 'Sunrise Hospital (4.1 km)', 'KIMS Hospital (6.8 km)'],
      metro: ['Thrikkakara Metro Station (0.3 km — upcoming) — very close to proposed station'],
      airport: ['Cochin International Airport (15 km — 25 mins)'],
    },
    description: `Arthi Green Meadows is our most ambitious project to date — a 4-tower eco-conscious residential community in Thrikkakara, Kochi. With GRIHA 4-star rating target, this project uses solar energy, rainwater harvesting, and organic waste management to create a truly sustainable living environment.\n\nSpread across 12 acres of green land, this 320-unit township is designed for the modern eco-aware family. The project is adjacent to the upcoming Thrikkakara metro station, making it a golden investment opportunity.`,
    specifications: [
      { label: 'Structure', value: 'AAC block with fly-ash bricks — low carbon footprint' },
      { label: 'Flooring', value: 'Eco-friendly vitrified tiles; Bamboo flooring option in bedrooms' },
      { label: 'Kitchen', value: 'Modular kitchen with composite stone top; Waste disposal unit' },
      { label: 'Bathroom', value: 'Water-efficient fittings (3-star rated); Dual flush WC' },
      { label: 'Energy', value: 'Solar water heater, solar panels for common areas, LED throughout' },
      { label: 'Water', value: 'Rainwater harvesting, STP plant for 100% water reuse' },
      { label: 'Waste', value: 'Organic waste converter on-site; Segregated waste management' },
      { label: 'Certification', value: 'GRIHA 4-star rating targeted; IGBC Green Homes certification' },
    ],
    faqs: [
      { q: 'When does pre-launch booking open?', a: 'Pre-launch bookings open October 2025. Register your interest now to receive priority allocation.' },
      { q: 'What is the pre-launch price benefit?', a: 'Pre-launch pricing is at ₹62L for 2 BHK, which is expected to increase 12-15% by launch.' },
      { q: 'Is RERA registration done?', a: 'RERA application is submitted. Registration expected by September 2025.' },
      { q: 'What makes this project eco-friendly?', a: 'Solar panels, rainwater harvesting, STP for water reuse, organic waste converter, EV charging, and bicycle tracks.' },
    ],
    progressStages: [
      { stage: 'Land Acquisition & Survey', pct: 100 },
      { stage: 'Design & Approvals', pct: 80 },
      { stage: 'Site Preparation', pct: 20 },
      { stage: 'Foundation Work', pct: 0 },
      { stage: 'Structural Work', pct: 0 },
      { stage: 'Finishing & Handover', pct: 0 },
    ],
    salesContact: { name: 'Anilkumar PV', phone: '+91 94470 56789', email: 'greenmeadows@arthiconstructions.com' },
  },

  'arthi-harbour-view': {
    id: 'arthi-harbour-view',
    name: 'Arthi Harbour View',
    tagline: 'The Finest Address on Marine Drive',
    location: 'Marine Drive, Ernakulam, Kochi, Kerala',
    mapQuery: 'Marine+Drive+Ernakulam+Kochi+Kerala',
    builder: 'Arthi Constructions',
    type: 'Ultra-Luxury Residences',
    status: 'Completed',
    statusClass: 'chip-success',
    startingPrice: '₹1.45 Crore',
    priceNote: 'Resale from ₹1.45Cr',
    towers: 1,
    floors: 22,
    totalUnits: 88,
    unitsAvailable: 3,
    unitsBooked: 85,
    villas: null,
    flats: 88,
    expectedCompletion: 'Completed — June 2023',
    constructionProgress: 100,
    launchDate: 'January 2019',
    reraNo: 'KL/RERA/PRJ/2019/005678',
    hero: 'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=1600&q=80',
    gallery: [
      { src: 'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=900&q=80', cap: 'Marine Drive Frontage' },
      { src: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=900&q=80', cap: 'Grand Lobby' },
      { src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80', cap: 'Premium Interior' },
      { src: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=900&q=80', cap: 'Terrace Pool' },
      { src: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&q=80', cap: 'Harbour Views' },
      { src: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=80', cap: 'Building at Night' },
    ],
    amenities: ['Infinity Pool', 'World-Class Gym', 'Grand Club House', "Children's Play Zone", '3-Tier Security', 'Valet Parking', 'Concierge Service', 'Spa & Sauna', 'Home Theatre', 'Sky Lounge'],
    floorPlans: [
      { type: '3 BHK Luxury', area: '2,100 sq.ft', price: '₹1.45Cr (Resale)', img: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80' },
      { type: '4 BHK Super Premium', area: '2,800 sq.ft', price: '₹2.00Cr (Resale)', img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80' },
      { type: 'Penthouse', area: '4,200 sq.ft', price: '₹4.00Cr (Resale)', img: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=600&q=80' },
    ],
    nearby: {
      schools: ['St. Albert\'s School (0.8 km)', 'Sacred Heart School (1.5 km)', 'Bharatiya Vidya Bhavan (2.1 km)'],
      hospitals: ['Welcare Hospital (0.6 km)', 'Rajagiri Hospital (2.8 km)', 'Amrita Institute of Medical Sciences (8.5 km)'],
      metro: ['MG Road Metro Station (0.4 km)', 'Maharaja\'s College Station (0.9 km)'],
      airport: ['Cochin International Airport (32 km — 50 mins)'],
    },
    description: `Arthi Harbour View is Kochi's most prestigious ultra-luxury residential tower, standing 22 floors tall on Marine Drive — the city's most coveted waterfront promenade. Completed in June 2023, it is home to 85 discerning families who have chosen to live where Kochi's vibrant city life meets the tranquil backwaters.\n\nFrom every floor, residents wake up to sweeping views of the Kochi harbour, the Chinese fishing nets, and the historic Fort Kochi skyline. The building features a double-height sky lobby, infinity pool, and a dedicated concierge service — redefining Kerala's luxury real estate standard.`,
    specifications: [
      { label: 'Structure', value: 'High-performance RCC with SRC steel core — wind and seismic rated' },
      { label: 'Flooring', value: 'Premium Italian Statuario marble throughout; Herringbone wood in bedrooms' },
      { label: 'Kitchen', value: 'German modular kitchen with Miele appliances, Silestone top' },
      { label: 'Bathroom', value: 'Bespoke design — Duravit sanitary ware, Grohe thermostatic shower, heated floor' },
      { label: 'Doors', value: 'Flush pivoting main door with biometric lock; Solid core lacquered internal doors' },
      { label: 'Windows', value: 'Floor-to-ceiling double-glazed fixed glass for panoramic harbour views' },
      { label: 'Electrical', value: 'Lutron smart home automation, Schneider Gold range switches' },
      { label: 'Building', value: 'LEED Gold rated, concierge service, valet parking, sky lounge on 22nd floor' },
    ],
    faqs: [
      { q: 'Is the project fully completed?', a: 'Yes. 100% completed in June 2023. All common areas and amenities operational.' },
      { q: 'Are resale units available?', a: 'Only 3 resale units available. Very limited. Contact sales for priority viewing.' },
      { q: 'What is the concierge service?', a: 'Dedicated concierge handles everything from grocery delivery, cab booking, home maintenance scheduling to restaurant reservations.' },
      { q: 'Is the sky lounge private?', a: 'The sky lounge on Floor 22 is exclusive for residents and their guests.' },
    ],
    progressStages: [
      { stage: 'Foundation & Piling', pct: 100 },
      { stage: 'Structural Work', pct: 100 },
      { stage: 'Facade & Cladding', pct: 100 },
      { stage: 'Interiors & Finishing', pct: 100 },
      { stage: 'Amenities & Landscaping', pct: 100 },
      { stage: 'Possession & Handover', pct: 100 },
    ],
    salesContact: { name: 'Kavitha Pillai', phone: '+91 94470 67890', email: 'harbourview@arthiconstructions.com' },
  },
};

// Utility to get URL param
function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

// ============================================================
//  RENDER PROJECT
// ============================================================
function renderProject(data) {
  document.title = `${data.name} — Arthi Constructions`;

  // ---- Hero ----
  const heroEl = document.getElementById('pdHero');
  if (heroEl) {
    heroEl.style.backgroundImage = `linear-gradient(to bottom, rgba(10,20,40,0.35) 0%, rgba(10,20,40,0.7) 100%), url('${data.hero}')`;
  }
  setText('pdName',     data.name);
  setText('pdTagline',  data.tagline);
  setText('pdStatus',   data.status);
  const stEl = document.getElementById('pdStatus');
  if (stEl) stEl.className = `pd-status-chip ${data.statusClass}`;
  setText('pdLocation', data.location);
  setText('pdType',     data.type);
  setText('pdPrice',    data.startingPrice);
  setText('pdPriceNote', data.priceNote);
  setText('pdBuilder',  data.builder);
  setText('pdReraNo',   data.reraNo);

  // ---- Key Facts ----
  setText('pdTowers',   data.towers  ? data.towers + ' Tower' + (data.towers > 1 ? 's' : '') : 'Gated Community');
  setText('pdFloors',   data.floors  + (data.villas ? ' Floors / Villa' : ' Floors'));
  setText('pdTotal',    data.totalUnits + ' Units');
  setText('pdAvail',    data.unitsAvailable + ' Units');
  setText('pdBooked',   data.unitsBooked + ' Units');
  const unitTypeEl = document.getElementById('pdUnitType');
  if (unitTypeEl) {
    if (data.flats) unitTypeEl.textContent = data.flats + ' Flats';
    else if (data.villas) unitTypeEl.textContent = data.villas + ' Villas';
    else unitTypeEl.textContent = data.totalUnits + ' Units';
  }
  setText('pdCompletion', data.expectedCompletion);
  setText('pdLaunch',   data.launchDate);

  // ---- Overall progress bar ----
  const pBar = document.getElementById('pdProgressFill');
  const pLabel = document.getElementById('pdProgressLabel');
  if (pBar) pBar.style.width = data.constructionProgress + '%';
  if (pLabel) pLabel.textContent = data.constructionProgress + '% Complete';

  // ---- Construction stage progress ----
  const stagesEl = document.getElementById('pdStages');
  if (stagesEl && data.progressStages) {
    stagesEl.innerHTML = data.progressStages.map(s => {
      const cls = s.pct === 100 ? 'green' : s.pct > 0 ? 'blue' : '';
      return `<div class="pd-stage">
        <div class="pd-stage-label"><span>${s.stage}</span><strong>${s.pct}%</strong></div>
        <div class="pd-stage-bar"><div class="pd-stage-fill ${cls}" style="width:${s.pct}%"></div></div>
      </div>`;
    }).join('');
  }

  // ---- Amenities ----
  const amenEl = document.getElementById('pdAmenities');
  if (amenEl && data.amenities) {
    amenEl.innerHTML = data.amenities.map(a => `<div class="pd-amenity-chip">✅ ${a}</div>`).join('');
  }

  // ---- Gallery ----
  const galEl = document.getElementById('pdGallery');
  if (galEl && data.gallery) {
    galEl.innerHTML = data.gallery.map((g, i) => `
      <div class="pd-gal-item" data-lb-src="${g.src}" data-lb-cap="${g.cap}" data-index="${i}">
        <img src="${g.src}" alt="${g.cap}" loading="lazy">
        <div class="pd-gal-overlay">🔍 ${g.cap}</div>
      </div>`).join('');
    initGalleryLightbox(data.gallery);
  }

  // ---- Floor Plans ----
  const fpEl = document.getElementById('pdFloorPlans');
  if (fpEl && data.floorPlans) {
    fpEl.innerHTML = data.floorPlans.map(fp => `
      <div class="pd-fp-card">
        <div class="pd-fp-img"><img src="${fp.img}" alt="${fp.type} floor plan" loading="lazy"></div>
        <div class="pd-fp-info">
          <div class="pd-fp-type">${fp.type}</div>
          <div class="pd-fp-area">📐 ${fp.area}</div>
          <div class="pd-fp-price">💰 ${fp.price}</div>
          <button class="btn btn-gold btn-sm" onclick="openEnquiry('${fp.type}')">Enquire Now</button>
        </div>
      </div>`).join('');
  }

  // ---- Nearby ----
  renderNearby('pdSchools', data.nearby.schools, '🏫');
  renderNearby('pdHospitals', data.nearby.hospitals, '🏥');
  renderNearby('pdMetro', data.nearby.metro, '🚇');
  renderNearby('pdAirport', data.nearby.airport, '✈️');

  // ---- Map ----
  const mapEl = document.getElementById('pdMapFrame');
  if (mapEl) {
    mapEl.src = `https://maps.google.com/maps?q=${encodeURIComponent(data.location)}&z=15&output=embed`;
  }

  // ---- Description ----
  const descEl = document.getElementById('pdDescription');
  if (descEl) {
    descEl.innerHTML = data.description.split('\n').filter(Boolean).map(p => `<p>${p}</p>`).join('');
  }

  // ---- Specs ----
  const specEl = document.getElementById('pdSpecs');
  if (specEl && data.specifications) {
    specEl.innerHTML = data.specifications.map(s => `
      <div class="pd-spec-row"><span class="pd-spec-label">${s.label}</span><span class="pd-spec-val">${s.value}</span></div>`).join('');
  }

  // ---- FAQs ----
  const faqEl = document.getElementById('pdFaqs');
  if (faqEl && data.faqs) {
    faqEl.innerHTML = data.faqs.map((f, i) => `
      <div class="pd-faq-item" id="faq-${i}">
        <button class="pd-faq-q" onclick="toggleFaq(${i})">
          <span>${f.q}</span><span class="pd-faq-arrow">▼</span>
        </button>
        <div class="pd-faq-a" id="faq-a-${i}">${f.a}</div>
      </div>`).join('');
  }

  // ---- Contact / Sales ----
  setText('pdSalesName',  data.salesContact.name);
  setText('pdSalesPhone', data.salesContact.phone);
  setText('pdSalesEmail', data.salesContact.email);

  // Prefill enquiry form with project name
  const enqProject = document.getElementById('enqProject');
  if (enqProject) enqProject.value = data.name;
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val || '';
}

function renderNearby(id, items, icon) {
  const el = document.getElementById(id);
  if (!el || !items) return;
  el.innerHTML = items.map(i => `<div class="pd-nearby-item">${icon} ${i}</div>`).join('');
}

// ---- Gallery Lightbox ----
function initGalleryLightbox(gallery) {
  let lbItems = gallery;
  let lbIndex = 0;
  const lb = document.getElementById('pdLightbox');
  const lbImg = document.getElementById('pdLbImg');
  const lbCap = document.getElementById('pdLbCap');

  document.querySelectorAll('.pd-gal-item').forEach(item => {
    item.addEventListener('click', () => {
      lbIndex = parseInt(item.getAttribute('data-index'));
      showSlide();
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function showSlide() {
    const it = lbItems[lbIndex];
    lbImg.src = it.src;
    lbCap.textContent = it.cap;
  }

  document.getElementById('pdLbClose').addEventListener('click', () => { lb.classList.remove('open'); document.body.style.overflow = ''; });
  document.getElementById('pdLbPrev').addEventListener('click', () => { lbIndex = (lbIndex - 1 + lbItems.length) % lbItems.length; showSlide(); });
  document.getElementById('pdLbNext').addEventListener('click', () => { lbIndex = (lbIndex + 1) % lbItems.length; showSlide(); });
  lb.addEventListener('click', e => { if (e.target === lb) { lb.classList.remove('open'); document.body.style.overflow = ''; } });
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') { lb.classList.remove('open'); document.body.style.overflow = ''; }
    if (e.key === 'ArrowLeft')  { lbIndex = (lbIndex - 1 + lbItems.length) % lbItems.length; showSlide(); }
    if (e.key === 'ArrowRight') { lbIndex = (lbIndex + 1) % lbItems.length; showSlide(); }
  });
}

// ---- FAQ Toggle ----
function toggleFaq(i) {
  const answer = document.getElementById(`faq-a-${i}`);
  const item = document.getElementById(`faq-${i}`);
  if (!answer) return;
  const isOpen = answer.classList.contains('open');
  document.querySelectorAll('.pd-faq-a').forEach(a => a.classList.remove('open'));
  document.querySelectorAll('.pd-faq-item').forEach(f => f.classList.remove('open'));
  if (!isOpen) { answer.classList.add('open'); item.classList.add('open'); }
}

// ---- Enquiry Modal ----
function openEnquiry(planType) {
  const el = document.getElementById('enqPlan');
  if (el) el.value = planType || '';
  openModal('pdEnquiryModal');
}

// ============================================================
//  INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  const id = getParam('id');
  const data = id ? PROJECTS[id] : null;

  if (!data) {
    // Fallback — show first project if no id
    const fallback = Object.values(PROJECTS)[0];
    renderProject(fallback);
    history.replaceState(null, '', `?id=${fallback.id}`);
  } else {
    renderProject(data);
  }

  // ---- Sticky nav active state ----
  const navLinks = document.querySelectorAll('.pd-nav a');
  window.addEventListener('scroll', () => {
    let current = '';
    document.querySelectorAll('.pd-section[id]').forEach(section => {
      if (window.scrollY >= section.offsetTop - 100) current = section.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  });

  // ---- Enquiry form submit ----
  const enqForm = document.getElementById('pdEnquiryForm');
  if (enqForm) {
    enqForm.addEventListener('submit', e => {
      e.preventDefault();
      closeModal('pdEnquiryModal');
      showToast('Enquiry submitted! Our sales team will call you within 24 hours.', 'success');
      enqForm.reset();
    });
  }

  // ---- Brochure download ----
  document.querySelectorAll('[data-action="download-brochure"]').forEach(btn => {
    btn.addEventListener('click', () => showToast('Brochure PDF is being prepared. Download will start shortly.', 'success', '📥'));
  });

  // ---- Book site visit from project page ----
  document.querySelectorAll('[data-action="book-visit"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const logged = localStorage.getItem('arthi_session');
      if (logged) {
        window.location.href = 'dashboard.html?panel=site-visit';
      } else {
        showToast('Please login to book a site visit.', 'info');
        setTimeout(() => window.location.href = 'index.html', 1200);
      }
    });
  });

  // ---- Contact call button ----
  document.querySelectorAll('[data-action="call-sales"]').forEach(btn => {
    btn.addEventListener('click', () => showToast('Connecting you to our sales team…', 'success', '📞'));
  });

  // ---- Share button ----
  const shareBtn = document.getElementById('pdShareBtn');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      if (navigator.share) {
        navigator.share({ title: document.title, url: window.location.href });
      } else {
        navigator.clipboard.writeText(window.location.href);
        showToast('Link copied to clipboard!', 'success', '🔗');
      }
    });
  }
});
