const bcrypt = require('bcryptjs');
const prisma = require('../config/db');

const seedDatabase = async () => {
  try {
    const userCount = await prisma.user.count();
    if (userCount > 0) {
      console.log('🌱 Database already has users. Skipping auto-seeding.');
      return;
    }

    console.log('🌱 Database is empty. Starting auto-seeding...');

    const hashedSuperPass = await bcrypt.hash('SUPERVISOR', 10);
    const hashedClientPass = await bcrypt.hash('WEMAKESOLUTIONS', 10);

    // ============================================================
    // 1. CREATE SUPERVISOR
    // ============================================================
    const supervisorUser = await prisma.user.create({
      data: {
        name: 'SUPERVISOR',
        email: 'supervisor@arthiconstructions.com',
        password: hashedSuperPass,
        role: 'SUPERVISOR',
        phone: '+91 98765 43210',
        avatar: 'VR'
      }
    });

    const supervisorProfile = await prisma.supervisor.create({
      data: { userId: supervisorUser.id }
    });

    console.log('✅ Supervisor created.');

    // ============================================================
    // 2. CREATE 5 PROJECTS
    // ============================================================
    const projectsData = [
      {
        name: 'Arthi Skyline Towers',
        tagline: 'Rise Above the Ordinary',
        location: 'Kakkanad, Kochi, Kerala',
        mapQuery: 'Kakkanad+Kochi+Kerala',
        type: 'Premium Apartments',
        status: 'ONGOING',
        startingPrice: '₹72 Lakhs',
        priceNote: 'Onwards for 2 BHK',
        towers: 3,
        floors: 18,
        totalUnits: 216,
        unitsAvailable: 84,
        unitsBooked: 132,
        flats: 216,
        expectedCompletion: 'December 2027',
        constructionProgress: 48,
        reraNo: 'KL/RERA/PRJ/2024/001234',
        hero: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600&q=80',
        salesContactName: 'Arun Nair',
        salesContactPhone: '+91 94470 12345',
        salesContactEmail: 'skyline@arthiconstructions.com',
        description: 'Arthi Skyline Towers redefines urban living in the heart of Kochi\'s IT corridor, Kakkanad. Rising 18 floors above the city, these premium apartments offer breathtaking views of the Vembanad backwaters and the Western Ghats. Strategically located near InfoPark and SmartCity, this project is ideal for IT professionals and families seeking a premium lifestyle. Each apartment is designed with Vastu compliance, cross-ventilation, and large balconies that bring the outdoors in.',
        amenities: JSON.stringify(['Swimming Pool', 'Gym', 'Club House', "Children's Park", '24/7 Security', 'Parking', 'Jogging Track', 'Terrace Garden', 'EV Charging']),
        specifications: JSON.stringify({
          "Structure": "RCC framed structure with ISI grade cement",
          "Flooring": "Vitrified tiles in living, bedrooms; Anti-skid tiles in bathrooms",
          "Kitchen": "Granite counter, stainless steel sink, modular provision",
          "Bathroom": "Branded CP fittings, wall-hung WC, shower enclosure",
          "Doors": "Teak wood main door; Flush doors for internal rooms",
          "Windows": "UPVC sliding windows with mosquito mesh",
          "Electrical": "Concealed copper wiring, modular switches, fire safety",
          "Security": "CCTV, intercom, biometric access, 24/7 security personnel"
        }),
        faqs: JSON.stringify([
          { q: 'Is this project RERA approved?', a: 'Yes. RERA Registration No: KL/RERA/PRJ/2024/001234. You can verify at krera.in.' },
          { q: 'What is the EMI for a 2 BHK?', a: 'For a 2 BHK at ₹72L with 20% down payment and 8.5% interest over 20 years, EMI is approximately ₹52,000/month.' },
          { q: 'Is home loan available?', a: 'Yes. We have tie-ups with SBI, HDFC, ICICI, Axis Bank and all major housing finance companies.' },
          { q: 'When will possession happen?', a: 'Expected possession is December 2027 as per RERA timeline.' }
        ])
      },
      {
        name: 'Arthi Palm Villas',
        tagline: 'Your Private Paradise in Kochi',
        location: 'Edapally, Kochi, Kerala',
        mapQuery: 'Edapally+Kochi+Kerala',
        type: 'Luxury Villas',
        status: 'UPCOMING',
        startingPrice: '₹1.85 Crore',
        priceNote: 'Onwards for 3 BHK Villa',
        villas: 48,
        floors: 2,
        totalUnits: 48,
        unitsAvailable: 48,
        unitsBooked: 0,
        expectedCompletion: 'June 2028',
        constructionProgress: 12,
        reraNo: 'KL/RERA/PRJ/2025/002891',
        hero: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80',
        salesContactName: 'Priya Varghese',
        salesContactPhone: '+91 94470 23456',
        salesContactEmail: 'palmvillas@arthiconstructions.com',
        description: 'Arthi Palm Villas is an exclusive gated community of 48 ultra-luxury villas nestled in Edapally, Kochi\'s most premium residential address. Set within 8 acres of landscaped greenery, each villa is a masterclass in contemporary architecture paired with traditional Kerala design sensibilities. Every villa features private landscaped gardens, dedicated parking for 2 cars, and smart home automation.',
        amenities: JSON.stringify(['Private Pool', 'Gym', 'Club House', "Children's Park", '24/7 Security', 'Covered Parking', 'Landscaped Garden', 'Jogging Track', 'Yoga Pavilion', 'Smart Home']),
        specifications: JSON.stringify({
          "Structure": "Load-bearing RCC with Porotherm brick walls",
          "Flooring": "Italian marble in living; Engineered wood in bedrooms",
          "Kitchen": "Modular kitchen with granite top, Hettich fittings, chimney provision",
          "Bathroom": "Jacuzzi in master bath, Kohler/Grohe fittings, rain shower",
          "Doors": "Teak wood main door with digital lock; Solid core internal doors",
          "Windows": "Double-glazed UPVC with tilt & turn mechanism",
          "Electrical": "Smart home wiring, solar panel provision, EV charger point",
          "Exterior": "Textured paint with weather-resistant coating, aluminum cladding accents"
        }),
        faqs: JSON.stringify([
          { q: 'What is the pre-launch offer?', a: 'Pre-launch buyers get an exclusive 5% discount and first choice of villa plot selection.' },
          { q: 'Is there a villa with private pool?', a: 'Yes, select plots allow private plunge pool addition at additional cost.' },
          { q: 'Is the community gated with security?', a: 'Yes, single entry/exit point with boom barrier, CCTV and 24/7 security personnel.' }
        ])
      },
      {
        name: 'Arthi Marine Heights',
        tagline: 'Live Where the Sea Meets the Sky',
        location: 'Beach Road, Kozhikode, Kerala',
        mapQuery: 'Kozhikode+Beach+Road+Kerala',
        type: 'Sea-View Apartments',
        status: 'ONGOING',
        startingPrice: '₹58 Lakhs',
        priceNote: 'Onwards for 2 BHK',
        towers: 2,
        floors: 14,
        totalUnits: 168,
        unitsAvailable: 61,
        unitsBooked: 107,
        flats: 168,
        expectedCompletion: 'September 2027',
        constructionProgress: 63,
        reraNo: 'KL/RERA/PRJ/2023/003567',
        hero: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=80',
        salesContactName: 'Suresh Menon',
        salesContactPhone: '+91 94470 34567',
        salesContactEmail: 'marine@arthiconstructions.com',
        description: 'Arthi Marine Heights stands tall on Kozhikode\'s iconic Beach Road, offering panoramic views of the Arabian Sea from every floor. Built across two elegant towers of 14 floors each, this project brings premium coastal living to Kerala\'s City of Spices. Waking up to sea breezes, watching sunsets from your balcony, and living minutes from Kozhikode\'s finest dining and shopping.',
        amenities: JSON.stringify(['Rooftop Pool', 'Gym', 'Club House', "Children's Play Area", '24/7 Security', 'Parking', 'Multipurpose Hall', 'Power Backup', 'EV Charging']),
        specifications: JSON.stringify({
          "Structure": "RCC framed structure, seismic Zone III compliant",
          "Flooring": "Vitrified tiles (800x800) in living; Ceramic tiles in bathrooms",
          "Kitchen": "Platform with granite, stainless steel sink, 2 utility connections",
          "Bathroom": "CP fittings (Jaquar/equivalent), wall-hung WC, shower area",
          "Doors": "Ornate main door; Flush doors with quality hardware inside",
          "Windows": "UPVC sliding with mosquito mesh and salt-air resistant coating",
          "Electrical": "ISI marked wiring, ELCB, modular switches, power backup",
          "Safety": "Firefighting system, sprinklers, emergency staircase, CCTV"
        }),
        faqs: JSON.stringify([
          { q: 'Do all units have sea view?', a: 'Floors 5 and above have clear sea views. Floors 3-4 have partial views. Ground and 1st floor face the garden.' },
          { q: 'Are pets allowed?', a: 'Yes, small pets are allowed in designated areas with prior registration.' },
          { q: 'What is the maintenance charge?', a: 'Estimated ₹3.50 per sq.ft per month post possession.' }
        ])
      },
      {
        name: 'Arthi Royal Enclave',
        tagline: 'A Legacy of Elegance',
        location: 'Calicut University Road, Kozhikode, Kerala',
        mapQuery: 'Calicut+University+Road+Kozhikode+Kerala',
        type: 'Premium Villas',
        status: 'COMPLETED',
        startingPrice: '₹95 Lakhs',
        priceNote: 'Resale from ₹95L',
        villas: 36,
        floors: 2,
        totalUnits: 36,
        unitsAvailable: 4,
        unitsBooked: 32,
        expectedCompletion: 'Completed — March 2024',
        constructionProgress: 100,
        reraNo: 'KL/RERA/PRJ/2021/004102',
        hero: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1600&q=80',
        salesContactName: 'Deepa Krishnan',
        salesContactPhone: '+91 94470 45678',
        salesContactEmail: 'royalenclave@arthiconstructions.com',
        description: 'Arthi Royal Enclave is a premium villa community on Calicut University Road, Kozhikode. Completed in March 2024, this project set a new benchmark for luxury villas in Malabar. With 36 villas spread across 6 acres of tree-lined avenues, it offers a serene university-neighbourhood lifestyle.',
        amenities: JSON.stringify(['Swimming Pool', 'Gym', 'Club House', "Children's Park", '24/7 Security', 'Covered Parking', 'Garden & Landscaping', 'CCTV Surveillance', 'Power Backup']),
        specifications: JSON.stringify({
          "Structure": "Premium RCC with AAC blocks",
          "Flooring": "Italian marble in living; Wooden flooring in bedrooms",
          "Kitchen": "Full modular kitchen with Hettich accessories, Quartz top",
          "Bathroom": "Kohler/Grohe fittings, Jacuzzi in master, wall-hung WC",
          "Doors": "Solid teak main door with brass fittings; Solid core interior",
          "Windows": "Double-glazed UPVC — noise and heat insulating",
          "Electrical": "Full smart home automation with Schneider switches"
        }),
        faqs: JSON.stringify([
          { q: 'Is this project completed?', a: 'Yes, fully completed in March 2024. Possession given to all 32 buyers. 4 resale units available.' },
          { q: 'How to buy a resale unit?', a: 'Contact our sales team. We facilitate resale with full documentation support.' }
        ])
      },
      {
        name: 'Arthi Green Meadows',
        tagline: 'Eco-Living in the Heart of Kochi',
        location: 'Thrikkakara, Kochi, Kerala',
        mapQuery: 'Thrikkakara+Kochi+Kerala',
        type: 'Eco-Friendly Apartments',
        status: 'UPCOMING',
        startingPrice: '₹62 Lakhs',
        priceNote: 'Onwards for 2 BHK',
        towers: 4,
        floors: 16,
        totalUnits: 320,
        unitsAvailable: 320,
        unitsBooked: 0,
        expectedCompletion: 'March 2029',
        constructionProgress: 5,
        hero: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1600&q=80',
        salesContactName: 'Anilkumar PV',
        salesContactPhone: '+91 94470 56789',
        salesContactEmail: 'greenmeadows@arthiconstructions.com',
        description: 'Arthi Green Meadows is an eco-conscious residential community in Thrikkakara, Kochi. Targeting GRIHA 4-star rating, this project uses solar energy, rainwater harvesting, and organic waste management to create a truly sustainable living environment. Spread across 12 acres of green land, this 320-unit township is designed for the modern eco-aware family.',
        amenities: JSON.stringify(['Olympic Pool', 'Gym', 'Grand Club House', "Children's Adventure Park", '24/7 Security', 'Multi-Level Parking', 'Solar Panels', 'Rainwater Harvesting', 'Organic Farm', 'EV Charging']),
        specifications: JSON.stringify({
          "Structure": "AAC block with fly-ash bricks — low carbon footprint",
          "Flooring": "Eco-friendly vitrified tiles; Bamboo flooring option in bedrooms",
          "Kitchen": "Modular kitchen with composite stone top; Waste disposal unit",
          "Bathroom": "Water-efficient fittings (3-star rated); Dual flush WC"
        }),
        faqs: JSON.stringify([
          { q: 'When does pre-launch booking open?', a: 'Pre-launch bookings open October 2025.' },
          { q: 'Is home loan available?', a: 'Yes, pre-approvals are available with SBI and HDFC.' }
        ])
      }
    ];

    const createdProjects = [];
    for (const proj of projectsData) {
      const p = await prisma.project.create({
        data: { ...proj, supervisorId: supervisorProfile.id }
      });
      createdProjects.push(p);
    }
    console.log(`✅ Seeded ${createdProjects.length} Projects.`);

    // ============================================================
    // 3. CREATE 5 CLIENTS
    // ============================================================
    const clientsData = [
      {
        user: { name: 'JENSONSOLUTIONS', email: 'jensonsolutions@arthiconstructions.com', phone: '+91 90000 00000', avatar: 'JS' },
        client: { projectId: createdProjects[0].id, clientCode: 'ACV-2345' }
      },
      {
        user: { name: 'Sreekumar Nair', email: 'sreekumar@example.com', phone: '+91 94471 11111', avatar: 'SN' },
        client: { projectId: createdProjects[1].id, clientCode: 'ACV-1892' }
      },
      {
        user: { name: 'Fathima Rashid', email: 'fathima@example.com', phone: '+91 94472 22222', avatar: 'FR' },
        client: { projectId: createdProjects[2].id, clientCode: 'AMH-5501' }
      },
      {
        user: { name: 'Thomas Mathew', email: 'thomas@example.com', phone: '+91 94473 33333', avatar: 'TM' },
        client: { projectId: createdProjects[3].id, clientCode: 'ARE-7743' }
      },
      {
        user: { name: 'Anitha Krishnan', email: 'anitha@example.com', phone: '+91 94474 44444', avatar: 'AK' },
        client: { projectId: createdProjects[4].id, clientCode: 'AGM-0012' }
      }
    ];

    const createdClients = [];
    for (const cd of clientsData) {
      const u = await prisma.user.create({
        data: { ...cd.user, password: hashedClientPass, role: 'CLIENT' }
      });
      const c = await prisma.client.create({
        data: { userId: u.id, ...cd.client }
      });
      createdClients.push({ user: u, client: c });
    }
    console.log(`✅ Seeded ${createdClients.length} Clients.`);

    // ============================================================
    // 4. CONSTRUCTION UPDATES FOR ALL PROJECTS
    // ============================================================
    const updatesMap = [
      // Project 0: Arthi Skyline Towers — 48%
      [
        { stage: 'Site Preparation', percentage: 100, note: 'Land clearing, leveling and boundary wall construction completed.', daysAgo: 540 },
        { stage: 'Foundation & Excavation', percentage: 100, note: 'Piling and basement slab casting completed successfully.', daysAgo: 420 },
        { stage: 'Structural Work (Columns & Slabs)', percentage: 100, note: 'All 18 floors — columns, beams and slabs cast.', daysAgo: 210 },
        { stage: 'Brickwork & Masonry', percentage: 80, note: 'Brickwork completed on floors 1–14. Floors 15–18 ongoing.', daysAgo: 90 },
        { stage: 'Electrical & Plumbing', percentage: 55, note: 'Internal wiring and plumbing on floors 1–10 done. Floors 11–18 ongoing.', daysAgo: 30 },
        { stage: 'Plastering & Painting', percentage: 20, note: 'Internal plastering started on floors 1–6. Primer coat applied.', daysAgo: 5 },
        { stage: 'Flooring & Tiling', percentage: 0, note: 'Scheduled to commence after plastering completion.', daysAgo: 0 },
        { stage: 'Handover & Finishing', percentage: 0, note: 'Final stage. Expected December 2027.', daysAgo: 0 }
      ],
      // Project 1: Arthi Palm Villas — 12%
      [
        { stage: 'Site Preparation', percentage: 100, note: 'Site cleared. Soil testing and geotechnical survey complete.', daysAgo: 120 },
        { stage: 'Foundation & Excavation', percentage: 50, note: 'Excavation for 24 villas complete. Remaining 24 in progress.', daysAgo: 30 },
        { stage: 'Structural Work', percentage: 0, note: 'Scheduled after foundation completion.', daysAgo: 0 },
        { stage: 'Brickwork & Masonry', percentage: 0, note: 'Yet to commence.', daysAgo: 0 },
        { stage: 'Finishing & Handover', percentage: 0, note: 'Expected June 2028.', daysAgo: 0 }
      ],
      // Project 2: Arthi Marine Heights — 63%
      [
        { stage: 'Site Preparation', percentage: 100, note: 'Site cleared and boundary walls erected.', daysAgo: 720 },
        { stage: 'Foundation & Excavation', percentage: 100, note: 'Deep piling completed. Raft foundation laid successfully.', daysAgo: 600 },
        { stage: 'Structural Work', percentage: 100, note: 'All 14 floors of Tower A and Tower B fully cast.', daysAgo: 380 },
        { stage: 'Brickwork & Masonry', percentage: 100, note: 'Brickwork and partition walls completed across all units.', daysAgo: 200 },
        { stage: 'Electrical & Plumbing', percentage: 90, note: 'Full electrical and plumbing installed in Tower A. Tower B — 80% done.', daysAgo: 60 },
        { stage: 'Plastering & Painting', percentage: 60, note: 'Internal plastering complete. External painting ongoing.', daysAgo: 15 },
        { stage: 'Flooring & Tiling', percentage: 40, note: 'Flooring complete in Tower A floors 1–8. Tower B in progress.', daysAgo: 5 },
        { stage: 'Handover & Finishing', percentage: 0, note: 'Expected September 2027.', daysAgo: 0 }
      ],
      // Project 3: Arthi Royal Enclave — 100%
      [
        { stage: 'Site Preparation', percentage: 100, note: 'Completed.', daysAgo: 1200 },
        { stage: 'Foundation & Excavation', percentage: 100, note: 'Completed.', daysAgo: 1100 },
        { stage: 'Structural Work', percentage: 100, note: 'Completed.', daysAgo: 900 },
        { stage: 'Brickwork & Masonry', percentage: 100, note: 'Completed.', daysAgo: 750 },
        { stage: 'Electrical & Plumbing', percentage: 100, note: 'Completed.', daysAgo: 600 },
        { stage: 'Plastering & Painting', percentage: 100, note: 'Completed.', daysAgo: 500 },
        { stage: 'Flooring & Tiling', percentage: 100, note: 'Premium Italian marble and engineered wood installed.', daysAgo: 400 },
        { stage: 'Handover & Finishing', percentage: 100, note: 'All 32 villas handed over to buyers. March 2024.', daysAgo: 365 }
      ],
      // Project 4: Arthi Green Meadows — 5%
      [
        { stage: 'Site Preparation', percentage: 60, note: 'Soil testing and environmental clearance obtained. Site clearance 60% done.', daysAgo: 20 },
        { stage: 'Foundation & Excavation', percentage: 0, note: 'Scheduled to begin Q1 2026.', daysAgo: 0 },
        { stage: 'Structural Work', percentage: 0, note: 'Yet to commence.', daysAgo: 0 },
        { stage: 'Eco Systems Installation', percentage: 0, note: 'Solar and rainwater systems planned post-structure.', daysAgo: 0 },
        { stage: 'Handover & Finishing', percentage: 0, note: 'Expected March 2029.', daysAgo: 0 }
      ]
    ];

    for (let pi = 0; pi < createdProjects.length; pi++) {
      const proj = createdProjects[pi];
      for (const up of updatesMap[pi]) {
        const date = new Date();
        date.setDate(date.getDate() - up.daysAgo);
        await prisma.constructionUpdate.create({
          data: { projectId: proj.id, stage: up.stage, percentage: up.percentage, note: up.note, date }
        });
      }
    }
    console.log('✅ Construction updates seeded.');

    // ============================================================
    // 5. GALLERY IMAGES FOR ALL PROJECTS
    // ============================================================
    const galleryMap = [
      // Arthi Skyline Towers
      [
        { url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900&q=80', caption: 'Foundation Piling Work — Dec 2024', daysAgo: 200 },
        { url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=900&q=80', caption: 'Structural Frame — Floor 10 Complete', daysAgo: 120 },
        { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80', caption: 'Internal Plastering — Floor 5', daysAgo: 60 },
        { url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=900&q=80', caption: 'Tower A — Exterior Progress', daysAgo: 30 },
        { url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&q=80', caption: 'Bird\'s Eye View — Current Progress', daysAgo: 10 },
        { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=80', caption: 'Rooftop Progress — Tower B', daysAgo: 5 }
      ],
      // Arthi Palm Villas
      [
        { url: 'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=900&q=80', caption: 'Villa Layout — Groundbreaking Ceremony', daysAgo: 90 },
        { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80', caption: 'Foundation Excavation — Phase 1', daysAgo: 30 },
        { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&q=80', caption: 'Site Plan Overview', daysAgo: 10 }
      ],
      // Arthi Marine Heights
      [
        { url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&q=80', caption: 'Tower A & B — Full Structural View', daysAgo: 180 },
        { url: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=900&q=80', caption: 'Sea View Balcony — 10th Floor', daysAgo: 90 },
        { url: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=900&q=80', caption: 'Floor Tiling Progress — Tower A', daysAgo: 45 },
        { url: 'https://images.unsplash.com/photo-1601918774946-25832a4be0d6?w=900&q=80', caption: 'External Paint — North Facade', daysAgo: 15 },
        { url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=900&q=80', caption: 'Pool Area Construction Progress', daysAgo: 5 }
      ],
      // Arthi Royal Enclave (completed)
      [
        { url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=900&q=80', caption: 'Villa Exterior — Handover Ready', daysAgo: 365 },
        { url: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=900&q=80', caption: 'Living Room — Italian Marble Flooring', daysAgo: 365 },
        { url: 'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=900&q=80', caption: 'Master Bedroom — Final Finish', daysAgo: 365 },
        { url: 'https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?w=900&q=80', caption: 'Community Swimming Pool', daysAgo: 365 }
      ],
      // Arthi Green Meadows
      [
        { url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=900&q=80', caption: 'Site Overview — Pre-Construction', daysAgo: 25 },
        { url: 'https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?w=900&q=80', caption: 'Environmental Clearance Board', daysAgo: 10 }
      ]
    ];

    for (let pi = 0; pi < createdProjects.length; pi++) {
      const proj = createdProjects[pi];
      for (const g of galleryMap[pi]) {
        const date = new Date();
        date.setDate(date.getDate() - g.daysAgo);
        await prisma.galleryItem.create({
          data: { projectId: proj.id, url: g.url, caption: g.caption, type: 'image', uploadedBy: 'Supervisor', date }
        });
      }
    }
    console.log('✅ Gallery images seeded.');

    // ============================================================
    // 6. DOCUMENTS FOR ALL PROJECTS
    // ============================================================
    const docsMap = [
      // Project 0 — Jenson's project
      [
        { name: 'Sale Agreement', url: '#', type: 'Agreement', daysAgo: 500 },
        { name: 'Approved Blueprint — Floor 7B', url: '#', type: 'Blueprint', daysAgo: 490 },
        { name: 'Payment Receipt #1 — Booking Amount', url: '#', type: 'Receipt', daysAgo: 480 },
        { name: 'Payment Receipt #2 — Foundation Milestone', url: '#', type: 'Receipt', daysAgo: 380 },
        { name: 'Payment Receipt #3 — Structure Completion', url: '#', type: 'Receipt', daysAgo: 280 },
        { name: 'Payment Receipt #4 — Brickwork Milestone', url: '#', type: 'Receipt', daysAgo: 180 },
        { name: 'Structural Warranty Certificate', url: '#', type: 'Warranty', daysAgo: 200 },
        { name: 'RERA Registration Certificate', url: '#', type: 'Certificate', daysAgo: 550 },
        { name: 'Construction Schedule 2024–2027', url: '#', type: 'Schedule', daysAgo: 300 }
      ],
      // Project 1
      [
        { name: 'Sale Agreement — Villa 12B', url: '#', type: 'Agreement', daysAgo: 100 },
        { name: 'RERA Certificate', url: '#', type: 'Certificate', daysAgo: 100 },
        { name: 'Pre-Launch Booking Receipt', url: '#', type: 'Receipt', daysAgo: 95 }
      ],
      // Project 2
      [
        { name: 'Sale Agreement — Flat 8A, Tower B', url: '#', type: 'Agreement', daysAgo: 600 },
        { name: 'Approved Floor Plan', url: '#', type: 'Blueprint', daysAgo: 580 },
        { name: 'Payment Receipt #1', url: '#', type: 'Receipt', daysAgo: 570 },
        { name: 'Payment Receipt #2', url: '#', type: 'Receipt', daysAgo: 470 },
        { name: 'Payment Receipt #3', url: '#', type: 'Receipt', daysAgo: 350 },
        { name: 'Payment Receipt #4', url: '#', type: 'Receipt', daysAgo: 200 },
        { name: 'RERA Registration Certificate', url: '#', type: 'Certificate', daysAgo: 620 }
      ],
      // Project 3
      [
        { name: 'Sale Agreement — Villa 24', url: '#', type: 'Agreement', daysAgo: 800 },
        { name: 'Handover Certificate', url: '#', type: 'Certificate', daysAgo: 365 },
        { name: 'Final Payment Receipt', url: '#', type: 'Receipt', daysAgo: 365 },
        { name: 'Possession Letter', url: '#', type: 'Certificate', daysAgo: 365 },
        { name: '10-Year Structural Warranty', url: '#', type: 'Warranty', daysAgo: 365 }
      ],
      // Project 4
      [
        { name: 'Pre-Registration Letter of Interest', url: '#', type: 'Agreement', daysAgo: 15 },
        { name: 'Environmental Clearance Certificate', url: '#', type: 'Certificate', daysAgo: 20 }
      ]
    ];

    for (let pi = 0; pi < createdProjects.length; pi++) {
      for (const doc of docsMap[pi]) {
        const date = new Date();
        date.setDate(date.getDate() - doc.daysAgo);
        await prisma.document.create({
          data: { projectId: createdProjects[pi].id, name: doc.name, url: doc.url, type: doc.type, uploadedBy: 'Supervisor', date }
        });
      }
    }
    console.log('✅ Documents seeded.');

    // ============================================================
    // 7. PAYMENTS FOR ALL CLIENT PROJECTS
    // ============================================================
    // Helper to create due date
    const daysFromNow = (d) => { const dt = new Date(); dt.setDate(dt.getDate() + d); return dt; };
    const daysBack = (d) => { const dt = new Date(); dt.setDate(dt.getDate() - d); return dt; };

    const paymentsMap = [
      // Client 0 (JENSONSOLUTIONS) — Arthi Skyline Towers
      {
        clientIdx: 0, projectIdx: 0,
        payments: [
          { description: 'Booking Amount', amount: 750000, status: 'PAID', method: 'NEFT', due: daysBack(480) },
          { description: 'Foundation Milestone', amount: 1500000, status: 'PAID', method: 'Cheque', due: daysBack(380) },
          { description: 'Structure Completion', amount: 1250000, status: 'PAID', method: 'NEFT', due: daysBack(280) },
          { description: 'Brickwork & Roofing', amount: 1300000, status: 'PAID', method: 'UPI', due: daysBack(120) },
          { description: 'Electrical & Plumbing', amount: 800000, status: 'DUE', due: daysFromNow(13) },
          { description: 'Plastering & Painting', amount: 1000000, status: 'UPCOMING', due: daysFromNow(105) },
          { description: 'Handover Balance', amount: 900000, status: 'UPCOMING', due: daysFromNow(540) }
        ]
      },
      // Client 1 — Arthi Palm Villas
      {
        clientIdx: 1, projectIdx: 1,
        payments: [
          { description: 'Booking Amount', amount: 500000, status: 'PAID', method: 'UPI', due: daysBack(90) },
          { description: 'Foundation Start', amount: 1850000, status: 'DUE', due: daysFromNow(30) },
          { description: 'Structure Milestone', amount: 3500000, status: 'UPCOMING', due: daysFromNow(300) },
          { description: 'Final Balance', amount: 8150000, status: 'UPCOMING', due: daysFromNow(700) }
        ]
      },
      // Client 2 — Arthi Marine Heights
      {
        clientIdx: 2, projectIdx: 2,
        payments: [
          { description: 'Booking Amount', amount: 580000, status: 'PAID', method: 'NEFT', due: daysBack(600) },
          { description: 'Foundation Milestone', amount: 1160000, status: 'PAID', method: 'NEFT', due: daysBack(480) },
          { description: 'Structure Completion', amount: 1160000, status: 'PAID', method: 'Cheque', due: daysBack(350) },
          { description: 'Brickwork Milestone', amount: 870000, status: 'PAID', method: 'UPI', due: daysBack(180) },
          { description: 'Finishing Milestone', amount: 870000, status: 'DUE', due: daysFromNow(20) },
          { description: 'Handover Balance', amount: 1160000, status: 'UPCOMING', due: daysFromNow(420) }
        ]
      },
      // Client 3 — Arthi Royal Enclave (completed)
      {
        clientIdx: 3, projectIdx: 3,
        payments: [
          { description: 'Booking Amount', amount: 250000, status: 'PAID', method: 'NEFT', due: daysBack(1100) },
          { description: 'Foundation Milestone', amount: 1000000, status: 'PAID', method: 'Cheque', due: daysBack(950) },
          { description: 'Structure Completion', amount: 2000000, status: 'PAID', method: 'NEFT', due: daysBack(750) },
          { description: 'Finishing Milestone', amount: 2500000, status: 'PAID', method: 'NEFT', due: daysBack(550) },
          { description: 'Final Handover Balance', amount: 3750000, status: 'PAID', method: 'NEFT', due: daysBack(365) }
        ]
      },
      // Client 4 — Arthi Green Meadows
      {
        clientIdx: 4, projectIdx: 4,
        payments: [
          { description: 'Pre-Launch Token Amount', amount: 100000, status: 'PAID', method: 'UPI', due: daysBack(15) },
          { description: 'Booking Amount', amount: 620000, status: 'UPCOMING', due: daysFromNow(60) },
          { description: 'Foundation Milestone', amount: 1240000, status: 'UPCOMING', due: daysFromNow(365) }
        ]
      }
    ];

    for (const pm of paymentsMap) {
      const clientRecord = createdClients[pm.clientIdx].client;
      const projectId = createdProjects[pm.projectIdx].id;
      for (const pay of pm.payments) {
        await prisma.payment.create({
          data: {
            projectId,
            clientId: clientRecord.id,
            description: pay.description,
            amount: pay.amount,
            status: pay.status,
            method: pay.method || null,
            due: pay.due
          }
        });
      }
    }
    console.log('✅ Payments seeded.');

    // ============================================================
    // 8. REQUESTS
    // ============================================================
    const requestsData = [
      // Jenson's requests (projectIdx 0, clientIdx 0)
      { projectIdx: 0, clientIdx: 0, category: 'Kitchen', title: 'Extra overhead cabinet on north wall', description: 'Requesting additional overhead drawers along north wall of kitchen.', status: 'COMPLETED', reply: 'Done! Additional cabinets have been installed as per your request.' },
      { projectIdx: 0, clientIdx: 0, category: 'Electrical', title: 'Two extra power outlets in master bedroom', description: 'Need two additional outlets near bedside tables for charging.', status: 'APPROVED', reply: 'Approved. Electricians will install during the next phase of wiring work.' },
      { projectIdx: 0, clientIdx: 0, category: 'Interior', title: 'Wooden flooring upgrade in living room', description: 'Would like to upgrade from vitrified tiles to engineered wood in living room.', status: 'PENDING', reply: null },
      { projectIdx: 0, clientIdx: 0, category: 'Painting', title: 'Change bedroom color to warm beige', description: 'Would prefer light beige shade in all bedrooms instead of standard off-white.', status: 'PENDING', reply: null },
      { projectIdx: 0, clientIdx: 0, category: 'Other', title: 'Add a balcony partition wall', description: 'Need privacy partition between balconies.', status: 'REJECTED', reply: 'Structural changes to balcony are not feasible without affecting load-bearing components. Kindly consider a glass screen as alternative.' },
      // Fathima's requests (projectIdx 2, clientIdx 2)
      { projectIdx: 2, clientIdx: 2, category: 'Kitchen', title: 'Hob and chimney provision upgrade', description: 'Need provision for island hob and ceiling chimney.', status: 'APPROVED', reply: 'Approved. Provision will be made during plumbing and electrical phase.' },
      { projectIdx: 2, clientIdx: 2, category: 'Bathroom', title: 'Rain shower in master bathroom', description: 'Upgrade master bath to include rain shower head and enclosure.', status: 'PENDING', reply: null }
    ];

    for (const req of requestsData) {
      await prisma.request.create({
        data: {
          projectId: createdProjects[req.projectIdx].id,
          clientId: createdClients[req.clientIdx].client.id,
          category: req.category,
          title: req.title,
          description: req.description,
          status: req.status,
          reply: req.reply
        }
      });
    }
    console.log('✅ Requests seeded.');

    // ============================================================
    // 9. SITE VISITS
    // ============================================================
    const siteVisitsData = [
      // Jenson's visits
      { projectIdx: 0, clientIdx: 0, daysAgo: 60, time: '10:00 AM', visitors: '2 Adults', notes: 'Foundation inspection visit.', status: 'COMPLETED' },
      { projectIdx: 0, clientIdx: 0, daysAgo: 20, time: '11:30 AM', visitors: '3 Adults', notes: 'Structural progress review — floors 5–10.', status: 'COMPLETED' },
      { projectIdx: 0, clientIdx: 0, daysFromNow: 5, time: '10:30 AM', visitors: '2 Adults, 1 Child', notes: 'Electrical and plumbing progress visit.', status: 'CONFIRMED' },
      { projectIdx: 0, clientIdx: 0, daysFromNow: 30, time: '11:00 AM', visitors: '2 Adults', notes: 'Plastering and finishing review.', status: 'PENDING' },
      // Thomas's visit (completed project)
      { projectIdx: 3, clientIdx: 3, daysAgo: 370, time: '09:30 AM', visitors: '4 Adults', notes: 'Final handover walk-through and punch list.', status: 'COMPLETED' }
    ];

    for (const sv of siteVisitsData) {
      let visitDate = new Date();
      if (sv.daysAgo) visitDate.setDate(visitDate.getDate() - sv.daysAgo);
      if (sv.daysFromNow) visitDate.setDate(visitDate.getDate() + sv.daysFromNow);

      await prisma.siteVisit.create({
        data: {
          projectId: createdProjects[sv.projectIdx].id,
          clientId: createdClients[sv.clientIdx].client.id,
          date: visitDate,
          time: sv.time,
          visitors: sv.visitors,
          notes: sv.notes,
          status: sv.status
        }
      });
    }
    console.log('✅ Site visits seeded.');

    // ============================================================
    // 10. NOTIFICATIONS
    // ============================================================
    const jensonUser = createdClients[0].user;
    const notificationsData = [
      { title: 'Electrical work on Floor 6 completed', body: 'Supervisor Vignesh Raja has confirmed completion of floor 6 wiring and power points. Photos uploaded to gallery.', daysAgo: 5 },
      { title: 'Upcoming Payment Reminder', body: 'Installment #5 — ₹8,00,000 for Electrical & Plumbing is due in 13 days. Please ensure timely payment.', daysAgo: 2 },
      { title: '6 New Construction Photos Added', body: 'Vignesh Raja uploaded 6 new photos from the site inspection on ' + new Date().toLocaleDateString('en-IN') + '. Visit Gallery to view them.', daysAgo: 1 },
      { title: 'Request Approved: Extra Power Outlets', body: 'Your request for additional power outlets in the master bedroom has been approved and will be implemented in the next phase.', daysAgo: 10 },
      { title: 'Site Visit Confirmed for Next Week', body: 'Your site visit on ' + new Date(Date.now() + 5 * 86400000).toLocaleDateString('en-IN') + ' at 10:30 AM has been confirmed by the supervisor.', daysAgo: 3 },
      { title: 'Construction Progress Updated to 48%', body: 'The construction progress for Arthi Skyline Towers has been updated to 48% overall completion.', daysAgo: 7 }
    ];

    for (const notif of notificationsData) {
      const ts = new Date();
      ts.setDate(ts.getDate() - notif.daysAgo);
      await prisma.notification.create({
        data: {
          userId: jensonUser.id,
          title: notif.title,
          body: notif.body,
          timestamp: ts
        }
      });
    }
    console.log('✅ Notifications seeded.');

    // ============================================================
    // 11. DEMO CHAT MESSAGES (JENSON <-> SUPERVISOR)
    // ============================================================
    const jensonId = jensonUser.id;
    const supervisorId = supervisorUser.id;
    const projectId = createdProjects[0].id;

    const chatMessages = [
      { senderId: supervisorId, receiverId: jensonId, content: 'Good morning Mr. Jenson! I wanted to update you — the structural work on all 18 floors is now complete. The project is progressing well.', hoursAgo: 168 },
      { senderId: jensonId, receiverId: supervisorId, content: 'Good morning Vignesh! That is great news. How is the brickwork going?', hoursAgo: 167 },
      { senderId: supervisorId, receiverId: jensonId, content: 'Brickwork is 80% done. Floors 1 to 14 are complete. We should be done with all floors by end of next month.', hoursAgo: 167 },
      { senderId: jensonId, receiverId: supervisorId, content: 'Has the roofing work been completed?', hoursAgo: 96 },
      { senderId: supervisorId, receiverId: jensonId, content: 'Yes! Roofing was completed last week. We have started the waterproofing treatment. Painting begins next Monday.', hoursAgo: 95 },
      { senderId: jensonId, receiverId: supervisorId, content: 'Excellent. When can I schedule my next site visit?', hoursAgo: 72 },
      { senderId: supervisorId, receiverId: jensonId, content: 'Saturday at 10:30 AM is available for your visit. I will personally take you through the floors and show the progress.', hoursAgo: 71 },
      { senderId: jensonId, receiverId: supervisorId, content: 'Perfect. Saturday at 10:30 AM works for me. I\'ll be bringing my wife as well.', hoursAgo: 70 },
      { senderId: supervisorId, receiverId: jensonId, content: 'Sure, no problem! Helmets and safety gear will be provided at site. Please wear closed-toe shoes.', hoursAgo: 69 },
      { senderId: jensonId, receiverId: supervisorId, content: 'Can you upload the latest staircase and lobby photos? I want to show my wife the progress.', hoursAgo: 48 },
      { senderId: supervisorId, receiverId: jensonId, content: 'Sure! I have already uploaded today\'s site images to your gallery — 6 new photos including the staircase, lobby area and the view from floor 12.', hoursAgo: 47 },
      { senderId: jensonId, receiverId: supervisorId, content: 'Received them. The staircase looks great! The marble finishing is exactly what we wanted.', hoursAgo: 46 },
      { senderId: supervisorId, receiverId: jensonId, content: 'Thank you! We are putting in extra care to ensure the finish quality is top-notch throughout. Your flat on floor 7B will have the best view of the project!', hoursAgo: 45 },
      { senderId: jensonId, receiverId: supervisorId, content: 'One more thing — I raised a request for wooden flooring in the living room. Any update on that?', hoursAgo: 24 },
      { senderId: supervisorId, receiverId: jensonId, content: 'I have received the request and shared it with the project team for feasibility review. I will update you within 3 working days.', hoursAgo: 23 },
      { senderId: jensonId, receiverId: supervisorId, content: 'Great, thank you for the quick response!', hoursAgo: 22 },
      { senderId: supervisorId, receiverId: jensonId, content: 'Always! Feel free to reach out anytime. See you Saturday morning!', hoursAgo: 21 }
    ];

    for (const msg of chatMessages) {
      const ts = new Date();
      ts.setHours(ts.getHours() - msg.hoursAgo);
      await prisma.message.create({
        data: {
          projectId,
          senderId: msg.senderId,
          receiverId: msg.receiverId,
          content: msg.content,
          timestamp: ts
        }
      });
    }
    console.log('✅ Chat messages seeded.');

    // ============================================================
    // 12. QR CODES
    // ============================================================
    for (let i = 0; i < createdClients.length; i++) {
      const client = createdClients[i].client;
      await prisma.qRCode.create({
        data: {
          clientId: client.id,
          projectId: createdProjects[i].id,
          code: `ARTHI_CLIENT_${client.clientCode}_${Date.now()}_PORTAL`
        }
      });
    }
    console.log('✅ QR codes seeded.');

    console.log('\n🌱 ====================================');
    console.log('🌱 All demo data seeded successfully!');
    console.log('🌱 Client Login:    JENSONSOLUTIONS / WEMAKESOLUTIONS');
    console.log('🌱 Supervisor Login: SUPERVISOR / SUPERVISOR');
    console.log('🌱 ====================================\n');

  } catch (error) {
    console.error('❌ Error during auto-seeding:', error);
  }
};

module.exports = seedDatabase;
