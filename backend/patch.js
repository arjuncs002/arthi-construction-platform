const fs = require('fs');
let schema = fs.readFileSync('prisma/schema.prisma', 'utf8');

schema = schema.replace(/provider\s*=\s*"postgresql"/g, 'provider = "sqlite"');
schema = schema.replace(/enum \w+ \{[\s\S]*?\}/g, '');
schema = schema.replace(/Role     @default\(CLIENT\)/g, 'String @default("CLIENT")');
schema = schema.replace(/Role/g, 'String');
schema = schema.replace(/ProjectStatus @default\(ONGOING\)/g, 'String @default("ONGOING")');
schema = schema.replace(/ProjectStatus/g, 'String');
schema = schema.replace(/RequestStatus @default\(PENDING\)/g, 'String @default("PENDING")');
schema = schema.replace(/RequestStatus/g, 'String');
schema = schema.replace(/PaymentStatus @default\(DUE\)/g, 'String @default("DUE")');
schema = schema.replace(/PaymentStatus/g, 'String');
schema = schema.replace(/VisitStatus @default\(PENDING\)/g, 'String @default("PENDING")');
schema = schema.replace(/VisitStatus/g, 'String');
schema = schema.replace(/String\[\]/g, 'String');
schema = schema.replace(/Json\?/g, 'String?');
schema = schema.replace(/@db\.Text/g, '');

fs.writeFileSync('prisma/schema.prisma', schema);

let env = fs.readFileSync('.env', 'utf8');
env = env.replace(/DATABASE_URL=.*/, 'DATABASE_URL="file:./dev.db"');
fs.writeFileSync('.env', env);

let seed = fs.readFileSync('src/utils/seedData.js', 'utf8');
seed = seed.replace(/amenities: (\[.*?\])/g, 'amenities: JSON.stringify($1)');
seed = seed.replace(/specifications: (\{.*?\})/gs, 'specifications: JSON.stringify($1)');
seed = seed.replace(/faqs: (\[.*?\])/gs, 'faqs: JSON.stringify($1)');

fs.writeFileSync('src/utils/seedData.js', seed);
