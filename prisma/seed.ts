// prisma/seed.ts
//
// Run with:  npx prisma db seed
// Or:        npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts
//
// Requires "prisma.seed" in package.json:
//   "prisma": { "seed": "ts-node --compiler-options '{\"module\":\"CommonJS\"}' prisma/seed.ts" }
//
// Covers:
//   - 5 Brands
//   - 5 Categories  (with one subcategory)
//   - 6 Attributes  (BTU, Capacity, Dimensions, Voltage, Energy Star, Weight)
//   - 10 Products   — each with images, attributes, at least one with variants & documents

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱  Seeding database...\n");

  // ── 1. Wipe existing data (safe for dev) ────────────────────────────────────
  await prisma.$transaction([
    prisma.productAttribute.deleteMany(),
    prisma.productVariant.deleteMany(),
    prisma.productDocument.deleteMany(),
    prisma.productImage.deleteMany(),
    prisma.product.deleteMany(),
    prisma.attributeValue.deleteMany(),
    prisma.attribute.deleteMany(),
    prisma.category.deleteMany(),
    prisma.brand.deleteMany(),
  ]);
  console.log("✓  Cleared existing records");

  // ── 2. Brands ───────────────────────────────────────────────────────────────

  const [vulcan, turboAir, pitco, hobart, trueRefrig] = await Promise.all([
    prisma.brand.create({
      data: {
        name:    "Vulcan",
        slug:    "vulcan",
        logoUrl: null,
      },
    }),
    prisma.brand.create({
      data: {
        name:    "Turbo Air",
        slug:    "turbo-air",
        logoUrl: null,
      },
    }),
    prisma.brand.create({
      data: {
        name:    "Pitco",
        slug:    "pitco",
        logoUrl: null,
      },
    }),
    prisma.brand.create({
      data: {
        name:    "Hobart",
        slug:    "hobart",
        logoUrl: null,
      },
    }),
    prisma.brand.create({
      data: {
        name:    "True",
        slug:    "true",
        logoUrl: null,
      },
    }),
  ]);
  console.log("✓  Created 5 brands");

  // ── 3. Categories ───────────────────────────────────────────────────────────

  const catOvens = await prisma.category.create({
    data: {
      name:        "Ovens & Ranges",
      slug:        "ovens-ranges",
      description: "Commercial convection ovens, deck ovens, and cooking ranges for high-volume kitchens.",
    },
  });

  // Subcategory of Ovens
  const catConvection = await prisma.category.create({
    data: {
      name:        "Convection Ovens",
      slug:        "convection-ovens",
      description: "Full-size and half-size commercial convection ovens.",
      parentId:    catOvens.id,
    },
  });

  const catRefrig = await prisma.category.create({
    data: {
      name:        "Refrigeration",
      slug:        "refrigeration",
      description: "Reach-in coolers, walk-in refrigerators, and undercounter refrigeration.",
    },
  });

  const catFryers = await prisma.category.create({
    data: {
      name:        "Fryers",
      slug:        "fryers",
      description: "Gas and electric commercial deep fryers for restaurants and fast food operations.",
    },
  });

  const catWarewash = await prisma.category.create({
    data: {
      name:        "Warewashing",
      slug:        "warewashing",
      description: "Undercounter, door-type, and conveyor commercial dishwashers.",
    },
  });

  const catPrepTables = await prisma.category.create({
    data: {
      name:        "Prep Tables",
      slug:        "prep-tables",
      description: "Stainless steel work tables, prep tables, and equipment stands.",
    },
  });

  console.log("✓  Created 6 categories (1 subcategory)");

  // ── 4. Attributes ───────────────────────────────────────────────────────────

  const attrBtu = await prisma.attribute.create({
    data: {
      name: "BTU Rating",
      slug: "btu-rating",
      unit: "BTU/hr",
      type: "NUMBER",
    },
  });

  const attrCapacity = await prisma.attribute.create({
    data: {
      name: "Capacity",
      slug: "capacity",
      unit: null,
      type: "TEXT",
    },
  });

  const attrDimensions = await prisma.attribute.create({
    data: {
      name: "Dimensions (W × D × H)",
      slug: "dimensions",
      unit: "inches",
      type: "TEXT",
    },
  });

  const attrVoltage = await prisma.attribute.create({
    data: {
      name: "Voltage",
      slug: "voltage",
      unit: "V",
      type: "TEXT",
    },
  });

  const attrEnergyStar = await prisma.attribute.create({
    data: {
      name: "ENERGY STAR",
      slug: "energy-star",
      unit: null,
      type: "BOOLEAN",
    },
  });

  const attrWeight = await prisma.attribute.create({
    data: {
      name: "Weight",
      slug: "weight",
      unit: "lbs",
      type: "NUMBER",
    },
  });

  console.log("✓  Created 6 attributes");

  // ── 5. Products ─────────────────────────────────────────────────────────────
  // 10 products spanning all categories, brands, and complexity levels.

  // ── Product 1: Vulcan double-deck convection oven ──────────────────────────
  const oven1 = await prisma.product.create({
    data: {
      name:             "Vulcan VC44GD Double Deck Convection Oven",
      slug:             "vulcan-vc44gd-double-deck-convection-oven",
      shortDescription: "Full-size double-deck gas convection oven with solid-state controls and porcelain oven interior.",
      description: `The Vulcan VC44GD is the workhorse of high-volume commercial kitchens. Its double-deck configuration delivers 60,000 BTU per deck, ideal for bakeries, hotels, and full-service restaurants.

Key highlights:
• Porcelain enamel interior for easy cleaning
• Solid-state digital controls with programmable cook timer
• Stainless steel exterior and door handles
• Cool-to-the-touch door with triple-pane glass
• Two-speed fan motor for gentle or rapid bake cycles`,
      price:         4850,
      currency:      "USD",
      sku:           "VUL-VC44GD",
      modelNumber:   "VC44GD",
      stockQuantity: 8,
      isActive:      true,
      isFeatured:    true,
      brandId:       vulcan.id,
      categoryId:    catConvection.id,
    },
  });

  await prisma.productImage.createMany({
    data: [
      { productId: oven1.id, imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80", altText: "Vulcan VC44GD front view", position: 0 },
      { productId: oven1.id, imageUrl: "https://images.unsplash.com/photo-1565891741441-64926e3838b0?w=800&q=80", altText: "Vulcan VC44GD interior", position: 1 },
    ],
  });

  await prisma.productAttribute.createMany({
    data: [
      { productId: oven1.id, attributeId: attrBtu.id,        value: "60,000 per deck" },
      { productId: oven1.id, attributeId: attrCapacity.id,    value: "Double deck, 5 racks each" },
      { productId: oven1.id, attributeId: attrDimensions.id,  value: "38 × 29 × 57" },
      { productId: oven1.id, attributeId: attrVoltage.id,     value: "120 / 60 Hz" },
      { productId: oven1.id, attributeId: attrEnergyStar.id,  value: "Yes" },
      { productId: oven1.id, attributeId: attrWeight.id,      value: "385" },
    ],
  });

  await prisma.productDocument.createMany({
    data: [
      { productId: oven1.id, title: "VC44GD Installation Manual",    documentUrl: "https://example.com/docs/vulcan-vc44gd-install.pdf",    documentType: "Installation Manual" },
      { productId: oven1.id, title: "VC44GD Specification Sheet",    documentUrl: "https://example.com/docs/vulcan-vc44gd-spec.pdf",       documentType: "Specification Sheet" },
    ],
  });

  // ── Product 2: Vulcan single-deck oven (variant of above category) ─────────
  const oven2 = await prisma.product.create({
    data: {
      name:             "Vulcan VC4GD Single Deck Gas Convection Oven",
      slug:             "vulcan-vc4gd-single-deck-convection-oven",
      shortDescription: "Full-size single-deck gas convection oven, 44,000 BTU with digital controls.",
      description: `The Vulcan VC4GD brings the same reliability as the double-deck model in a compact single-deck footprint. Perfect for smaller operations or as a supplemental oven.

• 44,000 BTU burner system
• Digital cook-and-hold controls
• One-piece seamless porcelain cavity
• Three racks included`,
      price:         2980,
      currency:      "USD",
      sku:           "VUL-VC4GD",
      modelNumber:   "VC4GD",
      stockQuantity: 14,
      isActive:      true,
      isFeatured:    false,
      brandId:       vulcan.id,
      categoryId:    catConvection.id,
    },
  });

  await prisma.productImage.createMany({
    data: [
      { productId: oven2.id, imageUrl: "https://images.unsplash.com/photo-1565891741441-64926e3838b0?w=800&q=80", altText: "Vulcan VC4GD convection oven", position: 0 },
    ],
  });

  await prisma.productAttribute.createMany({
    data: [
      { productId: oven2.id, attributeId: attrBtu.id,        value: "44,000" },
      { productId: oven2.id, attributeId: attrCapacity.id,    value: "Single deck, 5 racks" },
      { productId: oven2.id, attributeId: attrDimensions.id,  value: "38 × 29 × 38" },
      { productId: oven2.id, attributeId: attrVoltage.id,     value: "120 / 60 Hz" },
      { productId: oven2.id, attributeId: attrEnergyStar.id,  value: "Yes" },
      { productId: oven2.id, attributeId: attrWeight.id,      value: "220" },
    ],
  });

  // ── Product 3: Turbo Air Reach-In Refrigerator ─────────────────────────────
  const fridge1 = await prisma.product.create({
    data: {
      name:             "Turbo Air M3R72-3 Three-Section Reach-In Refrigerator",
      slug:             "turbo-air-m3r72-3-reach-in-refrigerator",
      shortDescription: "72 cu ft three-section reach-in refrigerator with LED lighting and ENERGY STAR certification.",
      description: `The Turbo Air M3R72-3 is a self-contained, top-mounted reach-in refrigerator built for demanding commercial environments.

• R-290 hydrocarbon refrigerant — eco-friendly and efficient
• Interior LED lighting with on/off switch
• Auto-closing, self-sealing door gaskets
• Stainless steel interior and exterior
• Digital temperature controller with alarm
• Holds temperature range: 33°F – 41°F`,
      price:         3290,
      currency:      "USD",
      sku:           "TA-M3R72-3",
      modelNumber:   "M3R72-3",
      stockQuantity: 6,
      isActive:      true,
      isFeatured:    true,
      brandId:       turboAir.id,
      categoryId:    catRefrig.id,
    },
  });

  await prisma.productImage.createMany({
    data: [
      { productId: fridge1.id, imageUrl: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800&q=80", altText: "Turbo Air M3R72-3 reach-in refrigerator", position: 0 },
    ],
  });

  await prisma.productAttribute.createMany({
    data: [
      { productId: fridge1.id, attributeId: attrCapacity.id,    value: "72 cu ft" },
      { productId: fridge1.id, attributeId: attrDimensions.id,  value: "82.25 × 32 × 83.25" },
      { productId: fridge1.id, attributeId: attrVoltage.id,     value: "115 / 60 Hz" },
      { productId: fridge1.id, attributeId: attrEnergyStar.id,  value: "Yes" },
      { productId: fridge1.id, attributeId: attrWeight.id,      value: "440" },
    ],
  });

  // ── Product 4: True T-49 Reach-In Cooler ──────────────────────────────────
  const fridge2 = await prisma.product.create({
    data: {
      name:             "True T-49 Two-Section Reach-In Cooler",
      slug:             "true-t-49-reach-in-cooler",
      shortDescription: "49 cu ft two-section reach-in cooler with hydrocarbon refrigerant and stainless steel interior.",
      description: `True's T-49 is renowned for its robust construction and industry-leading 7-year compressor warranty. A staple in professional kitchens worldwide.

• R-290 refrigerant — lowest environmental impact
• Adjustable PVC-coated wire shelves (6 included)
• Factory-installed door locks
• Operating range: 33°F – 38°F
• Epoxy-coated steel floor for durability`,
      price:         2980,
      currency:      "USD",
      sku:           "TRUE-T49",
      modelNumber:   "T-49",
      stockQuantity: 11,
      isActive:      true,
      isFeatured:    false,
      brandId:       trueRefrig.id,
      categoryId:    catRefrig.id,
    },
  });

  await prisma.productImage.createMany({
    data: [
      { productId: fridge2.id, imageUrl: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800&q=80", altText: "True T-49 reach-in cooler", position: 0 },
    ],
  });

  await prisma.productAttribute.createMany({
    data: [
      { productId: fridge2.id, attributeId: attrCapacity.id,    value: "49 cu ft" },
      { productId: fridge2.id, attributeId: attrDimensions.id,  value: "52.75 × 29.5 × 78.375" },
      { productId: fridge2.id, attributeId: attrVoltage.id,     value: "115 / 60 Hz" },
      { productId: fridge2.id, attributeId: attrEnergyStar.id,  value: "Yes" },
      { productId: fridge2.id, attributeId: attrWeight.id,      value: "320" },
    ],
  });

  // ── Product 5: Pitco SG14 Gas Floor Fryer ─────────────────────────────────
  const fryer1 = await prisma.product.create({
    data: {
      name:             "Pitco SG14 Millivolt Gas Floor Fryer",
      slug:             "pitco-sg14-millivolt-gas-floor-fryer",
      shortDescription: "40–50 lb oil capacity gas floor fryer with millivolt controls and stainless steel fry tank.",
      description: `The Pitco SG14 is a reliable, no-frills gas floor fryer built for busy commercial operations. Millivolt controls require no external power source — ideal for locations with unreliable electricity.

• 110,000 BTU burner output
• 40–50 lb oil capacity with stainless fry tank
• Thermostat range: 200°F – 400°F
• Large cool zone to extend oil life
• 1-1/4" full-port drain valve
• Casters included for mobility`,
      price:         1640,
      currency:      "USD",
      sku:           "PIT-SG14",
      modelNumber:   "SG14",
      stockQuantity: 22,
      isActive:      true,
      isFeatured:    false,
      brandId:       pitco.id,
      categoryId:    catFryers.id,
    },
  });

  await prisma.productImage.createMany({
    data: [
      { productId: fryer1.id, imageUrl: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&q=80", altText: "Pitco SG14 gas floor fryer", position: 0 },
    ],
  });

  await prisma.productAttribute.createMany({
    data: [
      { productId: fryer1.id, attributeId: attrBtu.id,        value: "110,000" },
      { productId: fryer1.id, attributeId: attrCapacity.id,    value: "40–50 lb oil" },
      { productId: fryer1.id, attributeId: attrDimensions.id,  value: "15.5 × 34.875 × 47" },
      { productId: fryer1.id, attributeId: attrVoltage.id,     value: "Millivolt (no power required)" },
      { productId: fryer1.id, attributeId: attrEnergyStar.id,  value: "No" },
      { productId: fryer1.id, attributeId: attrWeight.id,      value: "145" },
    ],
  });

  // Variants: natural gas vs LP gas
  await prisma.productVariant.createMany({
    data: [
      { productId: fryer1.id, name: "Natural Gas",    sku: "PIT-SG14-NG", price: null, stock: 15 },
      { productId: fryer1.id, name: "Liquid Propane", sku: "PIT-SG14-LP", price: 80,   stock: 7  },
    ],
  });

  await prisma.productDocument.create({
    data: {
      productId:    fryer1.id,
      title:        "SG14 Operator Manual",
      documentUrl:  "https://example.com/docs/pitco-sg14-manual.pdf",
      documentType: "Operator Manual",
    },
  });

  // ── Product 6: Pitco SE Series Electric Countertop Fryer ──────────────────
  const fryer2 = await prisma.product.create({
    data: {
      name:             "Pitco SE14S Electric Countertop Fryer",
      slug:             "pitco-se14s-electric-countertop-fryer",
      shortDescription: "14 lb capacity electric countertop fryer, ideal for smaller operations and concession stands.",
      description: `A compact electric solution where gas is unavailable or impractical. The Pitco SE14S delivers consistent frying performance at the countertop scale.

• 14 lb oil capacity
• 240V / 5,400W heating element
• Adjustable thermostat: 200°F – 375°F
• Stainless steel pot and baskets (2 included)
• Welded support brackets for durability`,
      price:         680,
      currency:      "USD",
      sku:           "PIT-SE14S",
      modelNumber:   "SE14S",
      stockQuantity: 35,
      isActive:      true,
      isFeatured:    false,
      brandId:       pitco.id,
      categoryId:    catFryers.id,
    },
  });

  await prisma.productImage.createMany({
    data: [
      { productId: fryer2.id, imageUrl: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80", altText: "Pitco SE14S countertop fryer", position: 0 },
    ],
  });

  await prisma.productAttribute.createMany({
    data: [
      { productId: fryer2.id, attributeId: attrCapacity.id,    value: "14 lb oil" },
      { productId: fryer2.id, attributeId: attrDimensions.id,  value: "11.75 × 25.5 × 15" },
      { productId: fryer2.id, attributeId: attrVoltage.id,     value: "240V / 1Ph" },
      { productId: fryer2.id, attributeId: attrEnergyStar.id,  value: "No" },
      { productId: fryer2.id, attributeId: attrWeight.id,      value: "42" },
    ],
  });

  // ── Product 7: Hobart LXEH Undercounter Dishwasher ────────────────────────
  const dishwasher1 = await prisma.product.create({
    data: {
      name:             "Hobart LXEH High-Temp Undercounter Dishwasher",
      slug:             "hobart-lxeh-high-temp-undercounter-dishwasher",
      shortDescription: "ENERGY STAR undercounter dishwasher with built-in electric booster heater, 30 racks/hour.",
      description: `The Hobart LXEH is trusted by thousands of foodservice operations for its quiet operation, low water usage, and NSF-certified sanitization without chemicals.

• 30 racks per hour capacity
• Built-in 4kW electric booster heater
• Final rinse temp: 180°F for chemical-free sanitization
• Uses just 0.73 gallons per rack
• Single-rack chamber fits 20" × 20" racks
• ENERGY STAR certified — qualifies for utility rebates`,
      price:         5200,
      currency:      "USD",
      sku:           "HOB-LXEH",
      modelNumber:   "LXEH",
      stockQuantity: 4,
      isActive:      true,
      isFeatured:    true,
      brandId:       hobart.id,
      categoryId:    catWarewash.id,
    },
  });

  await prisma.productImage.createMany({
    data: [
      { productId: dishwasher1.id, imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80", altText: "Hobart LXEH undercounter dishwasher", position: 0 },
    ],
  });

  await prisma.productAttribute.createMany({
    data: [
      { productId: dishwasher1.id, attributeId: attrCapacity.id,    value: "30 racks / hour" },
      { productId: dishwasher1.id, attributeId: attrDimensions.id,  value: "24 × 26.25 × 33.75" },
      { productId: dishwasher1.id, attributeId: attrVoltage.id,     value: "208–240V / 1Ph or 3Ph" },
      { productId: dishwasher1.id, attributeId: attrEnergyStar.id,  value: "Yes" },
      { productId: dishwasher1.id, attributeId: attrWeight.id,      value: "188" },
    ],
  });

  await prisma.productDocument.createMany({
    data: [
      { productId: dishwasher1.id, title: "LXEH Installation Guide",     documentUrl: "https://example.com/docs/hobart-lxeh-install.pdf",  documentType: "Installation Manual" },
      { productId: dishwasher1.id, title: "LXEH Specification Sheet",    documentUrl: "https://example.com/docs/hobart-lxeh-spec.pdf",     documentType: "Specification Sheet" },
      { productId: dishwasher1.id, title: "ENERGY STAR Certificate",     documentUrl: "https://example.com/docs/hobart-lxeh-energystar.pdf", documentType: "Certification" },
    ],
  });

  // ── Product 8: Hobart AM15 Door-Type Dishwasher ────────────────────────────
  const dishwasher2 = await prisma.product.create({
    data: {
      name:             "Hobart AM15 Door-Type Dishmachine",
      slug:             "hobart-am15-door-type-dishmachine",
      shortDescription: "High-capacity door-type dishmachine, up to 222 racks/hour with built-in chemical dispensers.",
      description: `For high-volume operations that need serious throughput, the Hobart AM15 door-type machine delivers up to 222 racks per hour with minimal water and energy usage.

• Up to 222 racks per hour
• 50-second standard cycle
• Triple-filtered wash water for sparkling results
• Automatic door-activated start
• Built-in chemical dispensers for detergent and rinse aid
• Available in high-temp and low-temp configurations`,
      price:         9800,
      currency:      "USD",
      sku:           "HOB-AM15",
      modelNumber:   "AM15",
      stockQuantity: 2,
      isActive:      true,
      isFeatured:    false,
      brandId:       hobart.id,
      categoryId:    catWarewash.id,
    },
  });

  await prisma.productImage.createMany({
    data: [
      { productId: dishwasher2.id, imageUrl: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80", altText: "Hobart AM15 door-type dishmachine", position: 0 },
    ],
  });

  await prisma.productAttribute.createMany({
    data: [
      { productId: dishwasher2.id, attributeId: attrCapacity.id,    value: "Up to 222 racks / hour" },
      { productId: dishwasher2.id, attributeId: attrDimensions.id,  value: "28.5 × 30 × 67" },
      { productId: dishwasher2.id, attributeId: attrVoltage.id,     value: "208–240V / 3Ph" },
      { productId: dishwasher2.id, attributeId: attrEnergyStar.id,  value: "Yes" },
      { productId: dishwasher2.id, attributeId: attrWeight.id,      value: "430" },
    ],
  });

  // High-temp vs low-temp variants
  await prisma.productVariant.createMany({
    data: [
      { productId: dishwasher2.id, name: "High Temp (180°F rinse)", sku: "HOB-AM15-HT", price: null, stock: 2 },
      { productId: dishwasher2.id, name: "Low Temp (chemical sanitize)", sku: "HOB-AM15-LT", price: -500, stock: 0 },
    ],
  });

  // ── Product 9: Turbo Air 2-Door Undercounter Refrigerator ─────────────────
  const undercounter = await prisma.product.create({
    data: {
      name:             "Turbo Air MUR-28L 2-Door Undercounter Refrigerator",
      slug:             "turbo-air-mur-28l-undercounter-refrigerator",
      shortDescription: "7.8 cu ft two-door undercounter refrigerator with solid doors and LED lighting.",
      description: `Fits neatly under standard 36" countertops. The Turbo Air MUR-28L is the go-to undercounter unit for back bars, prep stations, and sandwich lines.

• 7.8 cu ft interior capacity
• R-290 hydrocarbon refrigerant
• Digital temperature display
• Automatic evaporation of condensate
• Two adjustable shelves per door section
• Works in ambient temps up to 100°F`,
      price:         1420,
      currency:      "USD",
      sku:           "TA-MUR28L",
      modelNumber:   "MUR-28L",
      stockQuantity: 18,
      isActive:      true,
      isFeatured:    false,
      brandId:       turboAir.id,
      categoryId:    catRefrig.id,
    },
  });

  await prisma.productImage.createMany({
    data: [
      { productId: undercounter.id, imageUrl: "https://images.unsplash.com/photo-1617785572067-ede4f77d69e3?w=800&q=80", altText: "Turbo Air undercounter refrigerator", position: 0 },
    ],
  });

  await prisma.productAttribute.createMany({
    data: [
      { productId: undercounter.id, attributeId: attrCapacity.id,    value: "7.8 cu ft" },
      { productId: undercounter.id, attributeId: attrDimensions.id,  value: "27.5 × 30 × 34.875" },
      { productId: undercounter.id, attributeId: attrVoltage.id,     value: "115V / 60 Hz" },
      { productId: undercounter.id, attributeId: attrEnergyStar.id,  value: "Yes" },
      { productId: undercounter.id, attributeId: attrWeight.id,      value: "152" },
    ],
  });

  // ── Product 10: Vulcan 60" Gas Range ──────────────────────────────────────
  const range1 = await prisma.product.create({
    data: {
      name:             "Vulcan V60 6-Burner Gas Range with Double Oven",
      slug:             "vulcan-v60-6-burner-gas-range-double-oven",
      shortDescription: "60-inch heavy-duty gas range with six open burners and two standard ovens, 330,000 BTU total.",
      description: `The Vulcan V60 is the flagship commercial range for serious production kitchens. Six 30,000 BTU open burners and two standard ovens — all in a 60-inch stainless steel package.

• Six 30,000 BTU cast iron grate burners
• Two 30,000 BTU standard ovens
• Full-width removable grease drip tray
• Stainless steel front, sides, and shelf
• Heavy-duty, 1-piece welded steel body
• Pilot-lit burners for reliability
• Available with griddle or char-broiler top options`,
      price:         7200,
      currency:      "USD",
      sku:           "VUL-V60-6B",
      modelNumber:   "V60",
      stockQuantity: 3,
      isActive:      true,
      isFeatured:    true,
      brandId:       vulcan.id,
      categoryId:    catOvens.id,
    },
  });

  await prisma.productImage.createMany({
    data: [
      { productId: range1.id, imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80", altText: "Vulcan V60 commercial gas range", position: 0 },
      { productId: range1.id, imageUrl: "https://images.unsplash.com/photo-1565891741441-64926e3838b0?w=800&q=80", altText: "Vulcan V60 oven interior", position: 1 },
    ],
  });

  await prisma.productAttribute.createMany({
    data: [
      { productId: range1.id, attributeId: attrBtu.id,        value: "330,000 total" },
      { productId: range1.id, attributeId: attrCapacity.id,    value: "6 burners + 2 ovens" },
      { productId: range1.id, attributeId: attrDimensions.id,  value: "60 × 32.5 × 58" },
      { productId: range1.id, attributeId: attrVoltage.id,     value: "120V pilot ignition" },
      { productId: range1.id, attributeId: attrEnergyStar.id,  value: "No" },
      { productId: range1.id, attributeId: attrWeight.id,      value: "720" },
    ],
  });

  // Gas type variants
  await prisma.productVariant.createMany({
    data: [
      { productId: range1.id, name: "Natural Gas",    sku: "VUL-V60-6B-NG", price: null, stock: 2 },
      { productId: range1.id, name: "Liquid Propane", sku: "VUL-V60-6B-LP", price: 150,  stock: 1 },
    ],
  });

  await prisma.productDocument.createMany({
    data: [
      { productId: range1.id, title: "V60 Installation & Operation Manual", documentUrl: "https://example.com/docs/vulcan-v60-manual.pdf",       documentType: "Installation Manual" },
      { productId: range1.id, title: "V60 Spec Sheet",                       documentUrl: "https://example.com/docs/vulcan-v60-spec.pdf",         documentType: "Specification Sheet" },
    ],
  });

  // ── Done ────────────────────────────────────────────────────────────────────

  console.log("\n✅  Seed complete!\n");
  console.log("   Brands:     5");
  console.log("   Categories: 6  (5 top-level + 1 subcategory)");
  console.log("   Attributes: 6");
  console.log("   Products:  10  (4 featured, 6 standard)");
  console.log("   Images:    12");
  console.log("   Variants:   6  (across 3 products)");
  console.log("   Documents:  7");
  console.log("\nProduct breakdown:");
  console.log("   Ovens & Ranges    → Vulcan VC44GD, Vulcan VC4GD, Vulcan V60");
  console.log("   Refrigeration     → Turbo Air M3R72-3, True T-49, Turbo Air MUR-28L");
  console.log("   Fryers            → Pitco SG14, Pitco SE14S");
  console.log("   Warewashing       → Hobart LXEH, Hobart AM15");
}

main()
  .catch((e) => {
    console.error("❌  Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());