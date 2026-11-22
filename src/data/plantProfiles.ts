import organicFertilizerImg from '../assets/images/organic_fertilizer_1791175201556.jpg';
import growBagImg from '../assets/images/garden_grow_bag_1791175218939.jpg';
import tomatoSeedsImg from '../assets/images/tomato_seeds_1791175231860.jpg';
import plantSupportImg from '../assets/images/plant_support_1791175245195.jpg';
import soilMeterImg from '../assets/images/soil_meter_1791175256422.jpg';
import neemSprayImg from '../assets/images/neem_spray_1791175268287.jpg';
import pruningShearsImg from '../assets/images/pruning_shears_1791175283522.jpg';
import terracottaPotImg from '../assets/images/terracotta_pot_1791175297577.jpg';

import tomatoPlantImg from '../assets/images/tomato_plant_1791175685194.jpg';
import rosePlantImg from '../assets/images/rose_plant_1791175671018.jpg';
import potatoPlantImg from '../assets/images/potato_plant_1791175700638.jpg';
import chiliPlantImg from '../assets/images/chili_plant_1791175713631.jpg';
import brinjalPlantImg from '../assets/images/brinjal_plant_1791175727840.jpg';
import spinachPlantImg from '../assets/images/spinach_plant_1791175742564.jpg';
import mintPlantImg from '../assets/images/mint_plant_1791175763146.jpg';
import corianderPlantImg from '../assets/images/coriander_plant_1791175781685.jpg';
import basilPlantImg from '../assets/images/basil_plant_1791175798741.jpg';

export type PlantSpeciesId = 
  | 'tomato' 
  | 'rose' 
  | 'potato' 
  | 'chili' 
  | 'brinjal' 
  | 'spinach' 
  | 'mint' 
  | 'coriander' 
  | 'basil';

export interface PlantGrowthPoint {
  day: number;
  height: number; // in cm
  actual?: boolean;
}

export interface PlantMilestone {
  day: number;
  height: number;
  stage: string;
  label: string;
  iconType: string;
}

export interface RecommendedCareProduct {
  name: string;
  subtitle: string;
  category: string;
  price: number;
  rating: number;
  image: string;
  description: string;
}

export interface PlantProfile {
  id: PlantSpeciesId;
  name: string;
  variety: string;
  emoji: string;
  type: 'Outdoor Plant' | 'Indoor Plant' | 'Balcony / Garden' | 'Kitchen Herb';
  plantedDate: string;
  thumbnail: string;
  growthSummary: string;
  growthData: PlantGrowthPoint[];
  milestones: PlantMilestone[];
  carePlan: {
    watering: string;
    wateringSchedule: string;
    sunlight: string;
    sunlightHours: string;
    soil: string;
    soilType: string;
    fertilizer: string;
    fertilizerCadence: string;
  };
  recommendedProducts: RecommendedCareProduct[];
}

export const PLANT_PROFILES: Record<PlantSpeciesId, PlantProfile> = {
  tomato: {
    id: 'tomato',
    name: 'Tomato Plant',
    variety: 'Balcony Roma Hybrid',
    emoji: '🍅',
    type: 'Outdoor Plant',
    plantedDate: '01 Oct 2026',
    thumbnail: tomatoPlantImg,
    growthSummary: 'Vigorous upright growth with active lateral branching, yellow star flower trusses and early fruit set.',
    growthData: [
      { day: 0, height: 1.2, actual: true },
      { day: 1, height: 2.1, actual: true },
      { day: 2, height: 2.8, actual: true },
      { day: 3, height: 4.3, actual: true },
      { day: 4, height: 5.4, actual: true },
      { day: 5, height: 6.8, actual: true },
      { day: 6, height: 7.9, actual: true },
      { day: 7, height: 9.2, actual: false },
      { day: 8, height: 10.1, actual: false },
      { day: 9, height: 11.2, actual: false },
      { day: 10, height: 12.4, actual: false },
      { day: 11, height: 13.7, actual: false },
      { day: 12, height: 14.8, actual: false },
      { day: 13, height: 15.9, actual: false },
      { day: 14, height: 16.8, actual: false },
    ],
    milestones: [
      { day: 1, height: 2.1, stage: 'Seedling', label: 'Day 1', iconType: 'sprout' },
      { day: 3, height: 4.3, stage: 'Early Vegetative', label: 'Day 3', iconType: 'sprout' },
      { day: 5, height: 6.8, stage: 'Vegetative', label: 'Day 5', iconType: 'branch' },
      { day: 7, height: 9.2, stage: 'Active Branching', label: 'Day 7', iconType: 'flower' },
      { day: 10, height: 12.4, stage: 'Flowering & Fruiting', label: 'Day 10', iconType: 'fruit' },
      { day: 14, height: 16.8, stage: 'Advanced Fruiting', label: 'Day 14', iconType: 'fruit' },
    ],
    carePlan: {
      watering: 'Moderate',
      wateringSchedule: 'Every 2-3 days',
      sunlight: 'Full Sun',
      sunlightHours: '6-8 hours/day',
      soil: 'Well Drained',
      soilType: 'Loamy compost mix',
      fertilizer: 'Organic (NPK)',
      fertilizerCadence: 'Every 10-14 days',
    },
    recommendedProducts: [
      { 
        name: 'Organic Fertilizer', 
        subtitle: 'Bio-NPK 1 Kg', 
        category: 'Soil Nutrient', 
        price: 299, 
        rating: 4.9, 
        image: organicFertilizerImg,
        description: 'Slow-release organic bio-fertilizer enriched with natural nitrogen, phosphorus and active soil microbes for lush tomato foliage.'
      },
      { 
        name: 'Grow Bag', 
        subtitle: '12x12 UV Felt', 
        category: 'Outdoor Container', 
        price: 149, 
        rating: 4.8, 
        image: growBagImg,
        description: 'Heavy-duty breathable geotextile grow bag that naturally air-prunes roots and prevents root-circling for balcony tomatoes.'
      },
      { 
        name: 'Tomato Seeds', 
        subtitle: 'F1 Roma Hybrid', 
        category: 'High Germination', 
        price: 99, 
        rating: 4.7, 
        image: tomatoSeedsImg,
        description: 'Heirloom untreated high-yield seeds with 95%+ germination rate, perfect for potted container gardens.'
      },
      { 
        name: 'Plant Support', 
        subtitle: 'Trellis & Stakes', 
        category: 'Bamboo Cage', 
        price: 129, 
        rating: 4.8, 
        image: plantSupportImg,
        description: 'Sturdy bamboo and coated metal ladder stakes that support heavy tomato branches and prevent stem breakage under fruit load.'
      },
      { 
        name: 'Soil Moisture Meter', 
        subtitle: '3-in-1 Dual Probe', 
        category: 'Smart Tool', 
        price: 599, 
        rating: 4.9, 
        image: soilMeterImg,
        description: 'Battery-free precision analog reader that measures root-depth soil wetness, pH acidity and ambient sunlight lux levels.'
      },
      { 
        name: 'Neem Spray', 
        subtitle: 'Cold-Pressed 500ml', 
        category: 'Organic Shield', 
        price: 249, 
        rating: 4.9, 
        image: neemSprayImg,
        description: 'Ready-to-use botanical Azadirachtin spray that protects tomato foliage against aphids, whiteflies, and leaf spot fungus.'
      },
    ]
  },

  rose: {
    id: 'rose',
    name: 'Rose Plant',
    variety: 'Fragrant Desi Gulab',
    emoji: '🌹',
    type: 'Outdoor Plant',
    plantedDate: '28 Sep 2026',
    thumbnail: rosePlantImg,
    growthSummary: 'Slow early establishment transitioning into robust woody canes with serrated compound leaves and blooming red roses.',
    growthData: [
      { day: 0, height: 2.0, actual: true },
      { day: 1, height: 2.6, actual: true },
      { day: 2, height: 3.2, actual: true },
      { day: 3, height: 4.1, actual: true },
      { day: 4, height: 5.0, actual: true },
      { day: 5, height: 6.2, actual: true },
      { day: 6, height: 7.1, actual: true },
      { day: 7, height: 8.3, actual: false },
      { day: 8, height: 9.4, actual: false },
      { day: 9, height: 10.6, actual: false },
      { day: 10, height: 11.8, actual: false },
      { day: 11, height: 13.0, actual: false },
      { day: 12, height: 14.1, actual: false },
      { day: 13, height: 15.0, actual: false },
      { day: 14, height: 15.9, actual: false },
    ],
    milestones: [
      { day: 1, height: 2.6, stage: 'Seedling Sprout', label: 'Day 1', iconType: 'sprout' },
      { day: 3, height: 4.1, stage: 'Cane Formation', label: 'Day 3', iconType: 'sprout' },
      { day: 5, height: 6.2, stage: 'Compound Foliage', label: 'Day 5', iconType: 'branch' },
      { day: 7, height: 8.3, stage: 'Bud Initiation', label: 'Day 7', iconType: 'flower' },
      { day: 10, height: 11.8, stage: 'Swelling Bud', label: 'Day 10', iconType: 'flower' },
      { day: 14, height: 15.9, stage: 'Full Rose Bloom', label: 'Day 14', iconType: 'flower' },
    ],
    carePlan: {
      watering: 'Moderate Deep Soak',
      wateringSchedule: 'Every 3-4 days',
      sunlight: 'Full Sun',
      sunlightHours: '6+ hours/day',
      soil: 'Rich Loam',
      soilType: 'Clay-loam with compost',
      fertilizer: 'Mustard Cake / Bone Meal',
      fertilizerCadence: 'Every 15 days',
    },
    recommendedProducts: [
      { name: 'Organic Fertilizer', subtitle: 'Rose Bloom Food', category: 'Nutrient Rich', price: 299, rating: 4.9, image: organicFertilizerImg, description: 'Potassium and phosphorus rich organic granules that stimulate prolific rose bud formation.' },
      { name: 'Pruning Shears', subtitle: 'SK-5 Titanium Blade', category: 'Bypass Cutters', price: 299, rating: 4.9, image: pruningShearsImg, description: 'Surgical clean cuts prevent cane die-back and fungal rot when deadheading spent rose blooms.' },
      { name: 'Terracotta Pot', subtitle: '8-inch Natural Clay', category: 'Breathable Clay', price: 199, rating: 4.8, image: terracottaPotImg, description: 'Porous kiln-fired clay allows optimal root respiration and prevents waterlogged roots.' },
      { name: 'Soil Moisture Meter', subtitle: '3-in-1 Dual Probe', category: 'Smart Tool', price: 599, rating: 4.9, image: soilMeterImg, description: 'Accurate instant moisture tester to prevent overwatering rose roots.' },
      { name: 'Neem Spray', subtitle: 'Cold-Pressed 500ml', category: 'Black Spot Shield', price: 249, rating: 4.9, image: neemSprayImg, description: 'Organic fungicide and pest repellent effective against rose black spot and aphids.' },
      { name: 'Plant Support', subtitle: 'Rose Bush Stakes', category: 'Support Ring', price: 129, rating: 4.8, image: plantSupportImg, description: 'Encourages straight cane growth and elevates heavy blooms above garden soil.' }
    ]
  },

  potato: {
    id: 'potato',
    name: 'Potato Plant',
    variety: 'Kufri Jyoti Solanum',
    emoji: '🥔',
    type: 'Outdoor Plant',
    plantedDate: '03 Oct 2026',
    thumbnail: potatoPlantImg,
    growthSummary: 'Rapid low-branching leafy canopy with multiple subterranean stolons and star-shaped violet blossoms.',
    growthData: [
      { day: 0, height: 1.0, actual: true },
      { day: 1, height: 1.8, actual: true },
      { day: 2, height: 2.7, actual: true },
      { day: 3, height: 3.9, actual: true },
      { day: 4, height: 5.1, actual: true },
      { day: 5, height: 6.4, actual: true },
      { day: 6, height: 7.6, actual: true },
      { day: 7, height: 8.8, actual: false },
      { day: 8, height: 9.9, actual: false },
      { day: 9, height: 11.0, actual: false },
      { day: 10, height: 12.1, actual: false },
      { day: 11, height: 13.2, actual: false },
      { day: 12, height: 14.1, actual: false },
      { day: 13, height: 14.9, actual: false },
      { day: 14, height: 15.5, actual: false },
    ],
    milestones: [
      { day: 1, height: 1.8, stage: 'Tuber Eye Sprout', label: 'Day 1', iconType: 'sprout' },
      { day: 3, height: 3.9, stage: 'Stem Emergence', label: 'Day 3', iconType: 'sprout' },
      { day: 5, height: 6.4, stage: 'Bushy Foliage', label: 'Day 5', iconType: 'branch' },
      { day: 7, height: 8.8, stage: 'Stolon Expansion', label: 'Day 7', iconType: 'branch' },
      { day: 10, height: 12.1, stage: 'Violet Blossoms', label: 'Day 10', iconType: 'flower' },
      { day: 14, height: 15.5, stage: 'Tuber Bulking Phase', label: 'Day 14', iconType: 'fruit' },
    ],
    carePlan: {
      watering: 'Regular Even Soil',
      wateringSchedule: 'Every 2-3 days',
      sunlight: 'Full Sun',
      sunlightHours: '6 hours/day',
      soil: 'Loose & Sandy',
      soilType: 'Mounded aeration soil',
      fertilizer: 'High Potassium (Potash)',
      fertilizerCadence: 'Every 14 days',
    },
    recommendedProducts: [
      { name: 'Organic Fertilizer', subtitle: 'High-K Potash Blend', category: 'Tuber Multiplier', price: 299, rating: 4.9, image: organicFertilizerImg, description: 'High potassium formula that swells underground tubers for heavier harvests.' },
      { name: 'Grow Bag', subtitle: 'Deep 15-Gallon Bag', category: 'Flap Harvest Bag', price: 179, rating: 4.8, image: growBagImg, description: 'Deep breathable container with side harvest flap for easily checking tuber size.' },
      { name: 'Soil Moisture Meter', subtitle: '3-in-1 Dual Probe', category: 'Smart Tool', price: 599, rating: 4.9, image: soilMeterImg, description: 'Ensures subterranean soil stays moist without becoming soggy and rotting seed potatoes.' },
      { name: 'Neem Spray', subtitle: 'Cold-Pressed 500ml', category: 'Pest Guard', price: 249, rating: 4.8, image: neemSprayImg, description: 'Prevents potato leaf beetle damage and early blight spores organically.' }
    ]
  },

  chili: {
    id: 'chili',
    name: 'Chili Plant',
    variety: 'G4 Hot Pepper',
    emoji: '🌶',
    type: 'Outdoor Plant',
    plantedDate: '02 Oct 2026',
    thumbnail: chiliPlantImg,
    growthSummary: 'Branching shrubby pepper canopy with glossy lanceolate leaves, delicate white flowers and dangling fiery chili pods.',
    growthData: [
      { day: 0, height: 1.1, actual: true },
      { day: 1, height: 1.9, actual: true },
      { day: 2, height: 2.6, actual: true },
      { day: 3, height: 3.7, actual: true },
      { day: 4, height: 4.8, actual: true },
      { day: 5, height: 6.0, actual: true },
      { day: 6, height: 7.2, actual: true },
      { day: 7, height: 8.5, actual: false },
      { day: 8, height: 9.6, actual: false },
      { day: 9, height: 10.7, actual: false },
      { day: 10, height: 11.9, actual: false },
      { day: 11, height: 13.0, actual: false },
      { day: 12, height: 14.1, actual: false },
      { day: 13, height: 15.1, actual: false },
      { day: 14, height: 16.0, actual: false },
    ],
    milestones: [
      { day: 1, height: 1.9, stage: 'Seedling Sprout', label: 'Day 1', iconType: 'sprout' },
      { day: 3, height: 3.7, stage: 'Cotyledon Stage', label: 'Day 3', iconType: 'sprout' },
      { day: 5, height: 6.0, stage: 'Glossy Foliage', label: 'Day 5', iconType: 'branch' },
      { day: 7, height: 8.5, stage: 'Y-Split Branching', label: 'Day 7', iconType: 'branch' },
      { day: 10, height: 11.9, stage: 'White Flower Buds', label: 'Day 10', iconType: 'flower' },
      { day: 14, height: 16.0, stage: 'Chili Pod Formation', label: 'Day 14', iconType: 'fruit' },
    ],
    carePlan: {
      watering: 'Moderate Dry-back',
      wateringSchedule: 'Every 2-3 days',
      sunlight: 'Full Sun',
      sunlightHours: '6-8 hours/day',
      soil: 'Well Drained',
      soilType: 'Loam with vermicompost',
      fertilizer: 'Bio-NPK Liquid',
      fertilizerCadence: 'Every 10 days',
    },
    recommendedProducts: [
      { name: 'Organic Fertilizer', subtitle: 'Bio-NPK Granules', category: 'Vegetable Feeder', price: 299, rating: 4.9, image: organicFertilizerImg, description: 'Balanced bio-organic nutrition for hot peppers and balcony kitchen garden veggies.' },
      { name: 'Grow Bag', subtitle: '12x12 UV Fabric', category: 'Outdoor Container', price: 149, rating: 4.8, image: growBagImg, description: 'UV-treated felt grow bag allows great air exchange around pepper root crowns.' },
      { name: 'Neem Spray', subtitle: 'Organic Pest Shield', category: 'Anti-Thrips Spray', price: 249, rating: 4.9, image: neemSprayImg, description: 'Effectively repels leaf-curl thrips, whiteflies, and mites on chili plants.' },
      { name: 'Soil Moisture Meter', subtitle: '3-in-1 Dual Probe', category: 'Smart Tool', price: 599, rating: 4.9, image: soilMeterImg, description: 'Prevents flower drop caused by irregular watering and dry root shocks.' },
      { name: 'Plant Support', subtitle: 'Bamboo Support Cage', category: 'Trellis Stakes', price: 129, rating: 4.7, image: plantSupportImg, description: 'Keeps pepper branches upright when loaded with heavy chili pods.' }
    ]
  },

  brinjal: {
    id: 'brinjal',
    name: 'Brinjal / Eggplant',
    variety: 'Pusa Purple Long',
    emoji: '🍆',
    type: 'Outdoor Plant',
    plantedDate: '30 Sep 2026',
    thumbnail: brinjalPlantImg,
    growthSummary: 'Sturdy purple-veined stem with broad velvet leaves, violet star blossoms and glossy purple eggplants.',
    growthData: [
      { day: 0, height: 1.2, actual: true },
      { day: 1, height: 2.0, actual: true },
      { day: 2, height: 2.9, actual: true },
      { day: 3, height: 4.1, actual: true },
      { day: 4, height: 5.3, actual: true },
      { day: 5, height: 6.7, actual: true },
      { day: 6, height: 8.0, actual: true },
      { day: 7, height: 9.3, actual: false },
      { day: 8, height: 10.5, actual: false },
      { day: 9, height: 11.8, actual: false },
      { day: 10, height: 13.0, actual: false },
      { day: 11, height: 14.3, actual: false },
      { day: 12, height: 15.4, actual: false },
      { day: 13, height: 16.4, actual: false },
      { day: 14, height: 17.3, actual: false },
    ],
    milestones: [
      { day: 1, height: 2.0, stage: 'Velvet Seedling', label: 'Day 1', iconType: 'sprout' },
      { day: 3, height: 4.1, stage: 'Broad Leaf Stage', label: 'Day 3', iconType: 'sprout' },
      { day: 5, height: 6.7, stage: 'Purple Stem Vigour', label: 'Day 5', iconType: 'branch' },
      { day: 7, height: 9.3, stage: 'Canopy Expansion', label: 'Day 7', iconType: 'branch' },
      { day: 10, height: 13.0, stage: 'Violet Star Flower', label: 'Day 10', iconType: 'flower' },
      { day: 14, height: 17.3, stage: 'Glossy Eggplant Pod', label: 'Day 14', iconType: 'fruit' },
    ],
    carePlan: {
      watering: 'Regular Moist Soil',
      wateringSchedule: 'Every 2 days',
      sunlight: 'Warm Direct Sun',
      sunlightHours: '6+ hours/day',
      soil: 'Rich Humus',
      soilType: 'Heavy feeding loamy soil',
      fertilizer: 'Composted Cattle Manure',
      fertilizerCadence: 'Every 12 days',
    },
    recommendedProducts: [
      { name: 'Organic Fertilizer', subtitle: 'Heavy Feeder Compost', category: 'Soil Nutrient', price: 299, rating: 4.9, image: organicFertilizerImg, description: 'Rich composted organic blend supporting large eggplants.' },
      { name: 'Grow Bag', subtitle: '15x15 Extra Deep', category: 'Felt Container', price: 179, rating: 4.8, image: growBagImg, description: 'Provides deep taproot space required for heavy brinjal shrubs.' },
      { name: 'Plant Support', subtitle: 'Heavy Staking Rods', category: 'Stakes', price: 129, rating: 4.8, image: plantSupportImg, description: 'Prevents heavy mature eggplants from dragging on the soil.' },
      { name: 'Neem Spray', subtitle: 'Borer Prevention', category: 'Organic Defense', price: 249, rating: 4.9, image: neemSprayImg, description: 'Protects tender brinjal shoots from shoot and fruit borers.' }
    ]
  },

  spinach: {
    id: 'spinach',
    name: 'Spinach / Palak',
    variety: 'Desi All Green Smooth',
    emoji: '🌿',
    type: 'Balcony / Garden',
    plantedDate: '04 Oct 2026',
    thumbnail: spinachPlantImg,
    growthSummary: 'Low-lying compact rosette with succulent tender green spade leaves radiating outward.',
    growthData: [
      { day: 0, height: 0.8, actual: true },
      { day: 1, height: 1.4, actual: true },
      { day: 2, height: 2.1, actual: true },
      { day: 3, height: 3.0, actual: true },
      { day: 4, height: 4.1, actual: true },
      { day: 5, height: 5.2, actual: true },
      { day: 6, height: 6.3, actual: true },
      { day: 7, height: 7.4, actual: false },
      { day: 8, height: 8.4, actual: false },
      { day: 9, height: 9.3, actual: false },
      { day: 10, height: 10.1, actual: false },
      { day: 11, height: 10.9, actual: false },
      { day: 12, height: 11.6, actual: false },
      { day: 13, height: 12.2, actual: false },
      { day: 14, height: 12.8, actual: false },
    ],
    milestones: [
      { day: 1, height: 1.4, stage: 'Cotyledon Sprout', label: 'Day 1', iconType: 'sprout' },
      { day: 3, height: 3.0, stage: 'First True Spade Leaves', label: 'Day 3', iconType: 'sprout' },
      { day: 5, height: 5.2, stage: 'Basal Rosette', label: 'Day 5', iconType: 'branch' },
      { day: 7, height: 7.4, stage: 'Foliage Thickening', label: 'Day 7', iconType: 'branch' },
      { day: 10, height: 10.1, stage: 'Crisp Broad Canopy', label: 'Day 10', iconType: 'branch' },
      { day: 14, height: 12.8, stage: 'Harvest-Ready Greens', label: 'Day 14', iconType: 'branch' },
    ],
    carePlan: {
      watering: 'Frequent Light Moisture',
      wateringSchedule: 'Daily / Every morning',
      sunlight: 'Filtered / Morning Sun',
      sunlightHours: '4-5 hours/day',
      soil: 'Rich Moist Soil',
      soilType: 'High nitrogen cocopeat',
      fertilizer: 'Liquid Seaweed Extract',
      fertilizerCadence: 'Weekly spray',
    },
    recommendedProducts: [
      { name: 'Organic Fertilizer', subtitle: 'Nitrogen Leaf Booster', category: 'Greens Food', price: 299, rating: 4.9, image: organicFertilizerImg, description: 'Natural nitrogen accelerator for deep green, tender palak leaves.' },
      { name: 'Pruning Shears', subtitle: 'Harvest Snips', category: 'Precision Trimmer', price: 299, rating: 4.8, image: pruningShearsImg, description: 'Harvest outer spinach leaves without injuring the central growing crown.' },
      { name: 'Soil Moisture Meter', subtitle: '3-in-1 Dual Probe', category: 'Smart Tool', price: 599, rating: 4.9, image: soilMeterImg, description: 'Prevents shallow root drying and bolting under intense midday heat.' }
    ]
  },

  mint: {
    id: 'mint',
    name: 'Mint / Pudina',
    variety: 'Fragrant Spearmint',
    emoji: '🌱',
    type: 'Kitchen Herb',
    plantedDate: '02 Oct 2026',
    thumbnail: mintPlantImg,
    growthSummary: 'Vigorous spreading runners with aromatic serrated paired leaves and rich square green stems.',
    growthData: [
      { day: 0, height: 1.0, actual: true },
      { day: 1, height: 1.6, actual: true },
      { day: 2, height: 2.3, actual: true },
      { day: 3, height: 3.2, actual: true },
      { day: 4, height: 4.3, actual: true },
      { day: 5, height: 5.5, actual: true },
      { day: 6, height: 6.8, actual: true },
      { day: 7, height: 8.0, actual: false },
      { day: 8, height: 9.1, actual: false },
      { day: 9, height: 10.2, actual: false },
      { day: 10, height: 11.3, actual: false },
      { day: 11, height: 12.3, actual: false },
      { day: 12, height: 13.2, actual: false },
      { day: 13, height: 14.1, actual: false },
      { day: 14, height: 14.8, actual: false },
    ],
    milestones: [
      { day: 1, height: 1.6, stage: 'Cutting / Root Sprout', label: 'Day 1', iconType: 'sprout' },
      { day: 3, height: 3.2, stage: 'Opposite Leaf Pairs', label: 'Day 3', iconType: 'sprout' },
      { day: 5, height: 5.5, stage: 'Lateral Node Shoots', label: 'Day 5', iconType: 'branch' },
      { day: 7, height: 8.0, stage: 'Aromatic Bushing', label: 'Day 7', iconType: 'branch' },
      { day: 10, height: 11.3, stage: 'Dense Trailing Herb', label: 'Day 10', iconType: 'branch' },
      { day: 14, height: 14.8, stage: 'Lush Kitchen Canopy', label: 'Day 14', iconType: 'branch' },
    ],
    carePlan: {
      watering: 'High Moisture Tolerance',
      wateringSchedule: 'Daily in summers',
      sunlight: 'Partial Sun / Indirect',
      sunlightHours: '4-6 hours/day',
      soil: 'Rich Moisture Retentive',
      soilType: 'Cocopeat & compost mix',
      fertilizer: 'Vermicompost Tea',
      fertilizerCadence: 'Every 14 days',
    },
    recommendedProducts: [
      { name: 'Organic Fertilizer', subtitle: 'Herb Compost Blend', category: 'Soil Food', price: 299, rating: 4.9, image: organicFertilizerImg, description: 'Microbe-rich vermicompost that fuels dense spearmint foliage.' },
      { name: 'Terracotta Pot', subtitle: '8-inch Clay Planter', category: 'Wide Shallow Bowl', price: 199, rating: 4.8, image: terracottaPotImg, description: 'Wide surface allows mint stolons and runners to spread freely.' },
      { name: 'Pruning Shears', subtitle: 'Herb Precision Snips', category: 'Trimmer', price: 299, rating: 4.9, image: pruningShearsImg, description: 'Frequent snipping stimulates bushier, more fragrant branching.' }
    ]
  },

  coriander: {
    id: 'coriander',
    name: 'Coriander / Cilantro',
    variety: 'Desi Khushboo Dhaniya',
    emoji: '🌿',
    type: 'Kitchen Herb',
    plantedDate: '01 Oct 2026',
    thumbnail: corianderPlantImg,
    growthSummary: 'Delicate feathery dissected foliage on slender aromatic stems, fast developing for culinary harvesting.',
    growthData: [
      { day: 0, height: 0.9, actual: true },
      { day: 1, height: 1.5, actual: true },
      { day: 2, height: 2.2, actual: true },
      { day: 3, height: 3.1, actual: true },
      { day: 4, height: 4.2, actual: true },
      { day: 5, height: 5.3, actual: true },
      { day: 6, height: 6.5, actual: true },
      { day: 7, height: 7.7, actual: false },
      { day: 8, height: 8.8, actual: false },
      { day: 9, height: 9.8, actual: false },
      { day: 10, height: 10.8, actual: false },
      { day: 11, height: 11.7, actual: false },
      { day: 12, height: 12.5, actual: false },
      { day: 13, height: 13.2, actual: false },
      { day: 14, height: 13.9, actual: false },
    ],
    milestones: [
      { day: 1, height: 1.5, stage: 'Split Seedling Sprout', label: 'Day 1', iconType: 'sprout' },
      { day: 3, height: 3.1, stage: 'Fan-Shaped Cotyledon', label: 'Day 3', iconType: 'sprout' },
      { day: 5, height: 5.3, stage: 'Dissected True Leaves', label: 'Day 5', iconType: 'branch' },
      { day: 7, height: 7.7, stage: 'Feathery Leaf Cluster', label: 'Day 7', iconType: 'branch' },
      { day: 10, height: 10.8, stage: 'Fragrant Canopy', label: 'Day 10', iconType: 'branch' },
      { day: 14, height: 13.9, stage: 'Fresh Herb Harvest', label: 'Day 14', iconType: 'branch' },
    ],
    carePlan: {
      watering: 'Gentle Misting',
      wateringSchedule: 'Every morning',
      sunlight: 'Morning Sun / Filtered',
      sunlightHours: '4-5 hours/day',
      soil: 'Sandy Loam',
      soilType: 'Quick draining light soil',
      fertilizer: 'Mild Organic NPK',
      fertilizerCadence: 'Monthly',
    },
    recommendedProducts: [
      { name: 'Organic Fertilizer', subtitle: 'Mild Herbal NPK', category: 'Leaf Feeder', price: 299, rating: 4.9, image: organicFertilizerImg, description: 'Gentle organic nutrients that won’t burn tender cilantro root hairs.' },
      { name: 'Soil Moisture Meter', subtitle: '3-in-1 Dual Probe', category: 'Smart Tool', price: 599, rating: 4.9, image: soilMeterImg, description: 'Maintains ideal moisture balance to prevent premature bolting to seed.' },
      { name: 'Pruning Shears', subtitle: 'Kitchen Herb Snips', category: 'Scissors', price: 299, rating: 4.8, image: pruningShearsImg, description: 'Delicate sharp tips for harvesting fresh coriander sprigs daily.' }
    ]
  },

  basil: {
    id: 'basil',
    name: 'Holy Basil / Tulsi',
    variety: 'Krishna Shyama Tulsi',
    emoji: '🌿',
    type: 'Balcony / Garden',
    plantedDate: '29 Sep 2026',
    thumbnail: basilPlantImg,
    growthSummary: 'Aromatic purple-tinged square stems with convex smooth leaves and terminal inflorescence spikes.',
    growthData: [
      { day: 0, height: 1.1, actual: true },
      { day: 1, height: 1.8, actual: true },
      { day: 2, height: 2.5, actual: true },
      { day: 3, height: 3.5, actual: true },
      { day: 4, height: 4.6, actual: true },
      { day: 5, height: 5.8, actual: true },
      { day: 6, height: 7.0, actual: true },
      { day: 7, height: 8.2, actual: false },
      { day: 8, height: 9.3, actual: false },
      { day: 9, height: 10.4, actual: false },
      { day: 10, height: 11.5, actual: false },
      { day: 11, height: 12.6, actual: false },
      { day: 12, height: 13.6, actual: false },
      { day: 13, height: 14.5, actual: false },
      { day: 14, height: 15.3, actual: false },
    ],
    milestones: [
      { day: 1, height: 1.8, stage: 'Sacred Sprout', label: 'Day 1', iconType: 'sprout' },
      { day: 3, height: 3.5, stage: 'Paired Aromatic Leaves', label: 'Day 3', iconType: 'sprout' },
      { day: 5, height: 5.8, stage: 'Branching Stems', label: 'Day 5', iconType: 'branch' },
      { day: 7, height: 8.2, stage: 'Bushy Foliage', label: 'Day 7', iconType: 'branch' },
      { day: 10, height: 11.5, stage: 'Flower Spikes (Manjari)', label: 'Day 10', iconType: 'flower' },
      { day: 14, height: 15.3, stage: 'Mature Sacred Shrub', label: 'Day 14', iconType: 'flower' },
    ],
    carePlan: {
      watering: 'Moderate Root Hydration',
      wateringSchedule: 'Every 2 days',
      sunlight: 'Full Sunlight',
      sunlightHours: '6+ hours/day',
      soil: 'Well Aerated Loam',
      soilType: 'Garden loam with neem cake',
      fertilizer: 'Organic Compost',
      fertilizerCadence: 'Monthly',
    },
    recommendedProducts: [
      { name: 'Terracotta Pot', subtitle: 'Traditional 8" Clay', category: 'Sacred Clay Pot', price: 199, rating: 4.9, image: terracottaPotImg, description: 'Traditional breathable earthen clay pot reverently handcrafted for Tulsi.' },
      { name: 'Organic Fertilizer', subtitle: 'Bio-Compost Granules', category: 'Pure Bio Nutrition', price: 299, rating: 4.9, image: organicFertilizerImg, description: '100% vegetarian cow-dung vermicompost for healthy medicinal foliage.' },
      { name: 'Neem Spray', subtitle: 'Cold-Pressed 500ml', category: 'Organic Protection', price: 249, rating: 4.9, image: neemSprayImg, description: 'Protects tender tulsi shoots from leaf-eating bugs and black aphids.' }
    ]
  }
};

export interface PlantInputRecommendation extends RecommendedCareProduct {
  dosage?: string;
}

export function resolveInputProductImage(inputType?: string, name = '', category = ''): string {
  const combined = `${inputType || ''} ${name} ${category}`.toLowerCase();
  if (combined.includes('prun') || combined.includes('shear') || combined.includes('snip') || combined.includes('cutter') || combined.includes('trim')) {
    return pruningShearsImg;
  }
  if (combined.includes('neem') || combined.includes('fungic') || combined.includes('spray') || combined.includes('treatment') || combined.includes('shield') || combined.includes('copper') || combined.includes('pest')) {
    return neemSprayImg;
  }
  if (combined.includes('meter') || combined.includes('probe') || combined.includes('sensor') || combined.includes('tool') || combined.includes('hygro')) {
    return soilMeterImg;
  }
  if (combined.includes('trellis') || combined.includes('stake') || combined.includes('pole') || combined.includes('support') || combined.includes('cage')) {
    return plantSupportImg;
  }
  if (combined.includes('terracotta') || combined.includes('clay') || combined.includes('ceramic') || combined.includes('orchid pot') || combined.includes('planter')) {
    return terracottaPotImg;
  }
  if (combined.includes('grow bag') || combined.includes('bag') || combined.includes('container') || combined.includes('pot')) {
    return growBagImg;
  }
  if (combined.includes('seed')) {
    return tomatoSeedsImg;
  }
  return organicFertilizerImg;
}

export function getRecommendedInputsForPlant(params: {
  plantName: string;
  speciesId?: PlantSpeciesId | 'custom' | 'none';
  healthStatus?: string;
  diseaseName?: string;
  aiRecommendedInputs?: Array<{
    name: string;
    subtitle: string;
    category: string;
    inputType?: string;
    price?: number;
    rating?: number;
    dosage?: string;
    description: string;
  }>;
}): PlantInputRecommendation[] {
  const { plantName, speciesId, healthStatus, diseaseName, aiRecommendedInputs } = params;
  const cleanName = (plantName || 'Plant').replace(/\s*\([^)]*\)\s*/g, '').trim() || 'Plant';
  const lower = (plantName || '').toLowerCase();
  const isUnhealthy =
    healthStatus === 'Diseased' ||
    healthStatus === 'Critical' ||
    healthStatus === 'Warning' ||
    healthStatus === 'Possible Issue';

  // 1. If Gemini live analysis already produced tailored per-plant recommended inputs, use them directly
  if (Array.isArray(aiRecommendedInputs) && aiRecommendedInputs.length >= 2) {
    return aiRecommendedInputs.slice(0, 5).map((item) => ({
      name: item.name,
      subtitle: item.subtitle,
      category: item.category,
      price: typeof item.price === 'number' && item.price > 0 ? Math.round(item.price) : 249,
      rating: typeof item.rating === 'number' && item.rating >= 4 ? Number(item.rating.toFixed(1)) : 4.8,
      image: resolveInputProductImage(item.inputType, item.name, item.category),
      dosage: item.dosage,
      description: item.description,
    }));
  }

  // 2. If it matches one of the 9 exact seeded profiles, start with that profile's tailored inputs
  let baseProducts: PlantInputRecommendation[] | null = null;
  if (speciesId && speciesId !== 'custom' && speciesId !== 'none' && PLANT_PROFILES[speciesId]) {
    baseProducts = [...PLANT_PROFILES[speciesId].recommendedProducts];
  } else if (/snake plant|sansevieria|dracaena trifasciata|aloe|cactus|cacti|succulent|jade|echeveria|haworthia|zz plant|zamioculcas|agave|sedum|kalanchoe/.test(lower)) {
    baseProducts = [
      {
        name: 'Gritty Succulent & Cactus Mix',
        subtitle: 'Perlite, Pumice & Coarse Sand',
        category: 'Fast-Draining Substrate',
        price: 279,
        rating: 4.9,
        image: organicFertilizerImg,
        dosage: 'Use as 100% repotting base',
        description: `Ultra-porous mineral blend formulated for ${cleanName} to drain excess water immediately and prevent rhizome or root rot.`,
      },
      {
        name: 'Breathable Terracotta Pot',
        subtitle: '6-8" Unsealed Clay Planter',
        category: 'Moisture-Wicking Pot',
        price: 199,
        rating: 4.9,
        image: terracottaPotImg,
        dosage: '1-2 inches wider than root ball',
        description: `Porous clay walls let ${cleanName} soil dry evenly between sparse waterings, keeping succulent roots firm and oxygenated.`,
      },
      {
        name: 'Low-Nitrogen Succulent Feed',
        subtitle: 'Balanced Bio-Drops NPK 2-7-7',
        category: 'Gentle Nutrient',
        price: 229,
        rating: 4.8,
        image: neemSprayImg,
        dosage: '2 ml per 1L water, once a month',
        description: `Mild, salt-free liquid mineral feed that strengthens fleshy leaves without causing soft, leggy growth on ${cleanName}.`,
      },
      {
        name: 'Root-Depth Moisture Probe',
        subtitle: 'Zero-Battery Soil Tester',
        category: 'Dry-Cycle Monitor',
        price: 499,
        rating: 4.9,
        image: soilMeterImg,
        dosage: 'Water only when probe reads Dry',
        description: `Eliminates overwatering guesswork by checking deep root-zone dryness before irrigating ${cleanName}.`,
      },
    ];
  } else if (/grape|vitis|cucumber|gourd|pumpkin|squash|melon|passion\s?fruit|bean|pea|ivy|vine|creeper|bougainvillea|clematis/.test(lower)) {
    baseProducts = [
      {
        name: 'Heavy-Duty Vine Trellis Kit',
        subtitle: 'Modular Climbing Support & Ties',
        category: 'Canopy Support',
        price: 349,
        rating: 4.9,
        image: plantSupportImg,
        dosage: 'Train main canes horizontally',
        description: `Provides sturdy structural airflow and sun exposure for climbing ${cleanName} tendrils and fruiting canes.`,
      },
      {
        name: 'High-Potash Fruit & Vine Food',
        subtitle: 'Organic NPK 5-10-15 + Boron',
        category: 'Vine Nutrition',
        price: 319,
        rating: 4.9,
        image: organicFertilizerImg,
        dosage: '2 tbsp around root ring every 14 days',
        description: `Potassium-rich organic granules that fuel strong cane lignification, healthy foliage, and sweeter fruit set on ${cleanName}.`,
      },
      {
        name: 'Bypass Cane Pruning Shears',
        subtitle: 'SK-5 High-Carbon Steel Blade',
        category: 'Canopy Maintenance',
        price: 299,
        rating: 4.9,
        image: pruningShearsImg,
        dosage: 'Sterilize blade with 70% alcohol',
        description: `Delivers clean bevel cuts for removing infected leaves, thinning dense foliage, and winter cane pruning on ${cleanName}.`,
      },
      {
        name: 'Organic Anti-Fungal Neem Shield',
        subtitle: 'Cold-Pressed Azadirachtin 500ml',
        category: 'Leaf Spot Defense',
        price: 249,
        rating: 4.9,
        image: neemSprayImg,
        dosage: '5 ml per 1L water at dusk every 7 days',
        description: `Botanical broad-spectrum spray protecting ${cleanName} foliage against anthracnose, downy mildew, and fungal leaf spots.`,
      },
    ];
  } else if (/fiddle|ficus|monstera|money plant|pothos|epipremnum|philodendron|peace lily|spathiphyllum|rubber plant|calathea|maranta|alocasia|syngonium|aglaonema|anthurium|palm|fern|dracaena|dieffenbachia/.test(lower)) {
    baseProducts = [
      {
        name: 'Chunky Aroid & Foliage Mix',
        subtitle: 'Pine Bark, Perlite & Cocopeat',
        category: 'Aerated Indoor Soil',
        price: 329,
        rating: 4.9,
        image: organicFertilizerImg,
        dosage: 'Refresh top 2 inches every 6 months',
        description: `Airy, moisture-balanced substrate engineered for ${cleanName} roots to prevent compaction and indoor root rot.`,
      },
      {
        name: 'Balanced Foliage Liquid NPK',
        subtitle: '20-20-20 + Chelated Iron',
        category: 'Leaf Gloss Feed',
        price: 289,
        rating: 4.9,
        image: neemSprayImg,
        dosage: 'Half-strength every 2-3 weeks',
        description: `Supports large, deeply pigmented new leaves and strong stem turgor on indoor ${cleanName} specimens.`,
      },
      {
        name: 'Coir Moss Pole & Plant Ties',
        subtitle: 'Natural Climbing Support Stake',
        category: 'Structural Support',
        price: 249,
        rating: 4.8,
        image: plantSupportImg,
        dosage: 'Anchor beside main stem',
        description: `Supports upright trunk stability and aerial root anchoring as ${cleanName} matures indoors.`,
      },
      {
        name: '3-in-1 Moisture & Light Meter',
        subtitle: 'Soil Wetness + Lux Reader',
        category: 'Indoor Care Tool',
        price: 549,
        rating: 4.9,
        image: soilMeterImg,
        dosage: 'Check 3 inches deep before watering',
        description: `Tracks exact root moisture and window light intensity to stop leaf drop and brown edges on ${cleanName}.`,
      },
    ];
  } else if (/hibiscus|jasmine|mogra|marigold|sunflower|chrysanthemum|petunia|ixora|adenium|dahlia|lily|lotus|tulip|lavender|geranium|zinnia|periwinkle|vinca|plumeria|oleander|gardenia|camellia|hydrangea/.test(lower)) {
    baseProducts = [
      {
        name: 'Organic Bloom Booster Blend',
        subtitle: 'Bone Meal + High-P Potash',
        category: 'Flower Stimulator',
        price: 299,
        rating: 4.9,
        image: organicFertilizerImg,
        dosage: '2 tbsp every 15 days during budding',
        description: `Phosphorus and potassium-rich flowering feed formulated to maximize bud count and vibrant blooms on ${cleanName}.`,
      },
      {
        name: 'Cold-Pressed Neem Pest Spray',
        subtitle: 'Mealybug & Aphid Shield 500ml',
        category: 'Bud Protection',
        price: 249,
        rating: 4.9,
        image: neemSprayImg,
        dosage: 'Mist leaf undersides weekly at dusk',
        description: `Protects tender ${cleanName} flower buds from sap-sucking mealybugs, aphids, and whiteflies without harming pollinators.`,
      },
      {
        name: 'Bypass Deadheading Shears',
        subtitle: 'Precision SK-5 Flower Trimmer',
        category: 'Bloom Pruning',
        price: 299,
        rating: 4.9,
        image: pruningShearsImg,
        dosage: 'Trim spent blooms above leaf node',
        description: `Clean cuts remove faded flowers and trigger rapid lateral branching with fresh ${cleanName} buds.`,
      },
      {
        name: '10-Inch Terracotta Clay Pot',
        subtitle: 'Breathable Sun-Ready Planter',
        category: 'Root Cooling Pot',
        price: 229,
        rating: 4.8,
        image: terracottaPotImg,
        dosage: 'Ensure unobstructed drainage hole',
        description: `Keeps ${cleanName} root zones cool under full sun while preventing soggy compost buildup.`,
      },
    ];
  } else if (/orchid|phalaenopsis|dendrobium|cattleya|vanda|bromeliad/.test(lower)) {
    baseProducts = [
      {
        name: 'Orchid Bark & Charcoal Mix',
        subtitle: 'Chunky Epiphyte Fir Bark',
        category: 'Airy Bark Medium',
        price: 349,
        rating: 4.9,
        image: organicFertilizerImg,
        dosage: 'Repot every 18-24 months',
        description: `Zero-soil coarse bark chunks replicate natural tree-canopy airflow around sensitive ${cleanName} aerial roots.`,
      },
      {
        name: 'Slotted Breathable Orchid Pot',
        subtitle: 'Side-Ventilated Root Planter',
        category: 'Epiphyte Container',
        price: 249,
        rating: 4.9,
        image: terracottaPotImg,
        dosage: 'Allow roots to turn silvery between soaks',
        description: `360-degree ventilation slots let ${cleanName} roots breathe and photosynthesize without crown rot.`,
      },
      {
        name: 'Flower Spike Support Clips',
        subtitle: 'Slender Bamboo Stakes & Clips',
        category: 'Spike Support',
        price: 149,
        rating: 4.8,
        image: plantSupportImg,
        dosage: 'Clip gently below first flower node',
        description: `Holds tall arching ${cleanName} flower spikes upright without bruising delicate stems.`,
      },
      {
        name: 'Sterile Root Trimming Snips',
        subtitle: 'Precision Stainless Micro-Tip',
        category: 'Root Hygiene',
        price: 279,
        rating: 4.8,
        image: pruningShearsImg,
        dosage: 'Flame or alcohol sterilize before cuts',
        description: `Cleanly trims papery dead velamen roots and spent spikes on ${cleanName}.`,
      },
    ];
  } else if (/lemon|citrus|lime|orange|mango|guava|pomegranate|papaya|banana|fig|apple|peach|berry|strawberry|mulberry|sapota|chikoo|avocado|pomegranate/.test(lower)) {
    baseProducts = [
      {
        name: 'Citrus & Fruit Tree Nutrition',
        subtitle: 'Organic NPK + Iron & Zinc',
        category: 'Fruiting Tree Feed',
        price: 349,
        rating: 4.9,
        image: organicFertilizerImg,
        dosage: 'Apply along drip line every 21 days',
        description: `Prevents yellowing iron-chlorosis and fuels heavy flowering and fruit retention on ${cleanName}.`,
      },
      {
        name: 'Heavy-Duty 18x18 Grow Bag',
        subtitle: 'UV-Stabilized Deep Root Bag',
        category: 'Fruit Tree Container',
        price: 249,
        rating: 4.8,
        image: growBagImg,
        dosage: 'Fill with 60% loam + 40% compost',
        description: `Extra-deep breathable fabric container supports the expansive taproot and feeder roots of potted ${cleanName}.`,
      },
      {
        name: 'Neem Oil Leaf-Miner Shield',
        subtitle: 'Cold-Pressed Botanical Spray',
        category: 'Canopy Defense',
        price: 249,
        rating: 4.9,
        image: neemSprayImg,
        dosage: 'Spray new leaf flushes every 10 days',
        description: `Defends tender ${cleanName} shoots from leaf miners, citrus psyllids, and scale insects.`,
      },
      {
        name: 'Heavy Bypass Pruning Shears',
        subtitle: 'Woody Branch Trimmer',
        category: 'Canopy Shaping',
        price: 329,
        rating: 4.9,
        image: pruningShearsImg,
        dosage: 'Prune crossing inward branches',
        description: `Shapes an open sun-receiving canopy and removes water sprouts cleanly on ${cleanName}.`,
      },
    ];
  } else if (/curry leaf|murraya|rosemary|thyme|oregano|parsley|sage|lemongrass|dill|fennel|chive|fenugreek|methi|lettuce|kale|cabbage|broccoli|herb/.test(lower)) {
    baseProducts = [
      {
        name: 'Nitrogen-Rich Vermicompost Mix',
        subtitle: 'Organic Leaf & Herb Booster',
        category: 'Foliage Nutrient',
        price: 269,
        rating: 4.9,
        image: organicFertilizerImg,
        dosage: 'Top-dress 2 tbsp every 14 days',
        description: `Feeds lush, deeply aromatic leaf growth and essential oil concentration in ${cleanName}.`,
      },
      {
        name: '8-Inch Breathable Clay Planter',
        subtitle: 'Natural Terracotta Herb Pot',
        category: 'Herb Container',
        price: 199,
        rating: 4.8,
        image: terracottaPotImg,
        dosage: 'Pair with saucer & morning sun',
        description: `Prevents sour waterlogged roots while keeping ${cleanName} soil evenly aerated.`,
      },
      {
        name: 'Precision Herb Harvest Snips',
        subtitle: 'Micro-Tip Stainless Scissors',
        category: 'Harvest Tool',
        price: 249,
        rating: 4.9,
        image: pruningShearsImg,
        dosage: 'Pinch above paired leaf nodes',
        description: `Regular clean snipping encourages dense, bushy side shoots on ${cleanName}.`,
      },
      {
        name: 'Organic Neem Guard Spray',
        subtitle: 'Edible-Safe Pest Repellent',
        category: 'Kitchen-Safe Shield',
        price: 229,
        rating: 4.9,
        image: neemSprayImg,
        dosage: 'Rinse leaves gently before cooking',
        description: `Gentle botanical spray keeps aphids and psyllids off tender ${cleanName} stems.`,
      },
    ];
  } else {
    // Intelligent universal botanical profile customized with the exact detected plant name
    baseProducts = [
      {
        name: `Balanced Bio-NPK for ${cleanName}`,
        subtitle: 'Organic Slow-Release Granules',
        category: 'Species Nutrition',
        price: 299,
        rating: 4.9,
        image: organicFertilizerImg,
        dosage: '1-2 tbsp every 14-21 days',
        description: `Complete macro and trace mineral nutrition formulated to support steady vegetative growth and chlorophyll vigor in ${cleanName}.`,
      },
      {
        name: 'Aerated Breathable Planter',
        subtitle: 'Root-Oxygenating Clay / Felt Pot',
        category: 'Root Container',
        price: 219,
        rating: 4.8,
        image: terracottaPotImg,
        dosage: 'Size up 2 inches when rootbound',
        description: `Maintains optimal soil drainage and root airflow tailored for healthy ${cleanName} root development.`,
      },
      {
        name: '3-in-1 Moisture & Light Probe',
        subtitle: 'Root Wetness + pH + Sunlight',
        category: 'Precision Care Tool',
        price: 549,
        rating: 4.9,
        image: soilMeterImg,
        dosage: 'Check root zone before each watering',
        description: `Helps dial in exact hydration cadence and light levels specific to ${cleanName}.`,
      },
      {
        name: 'Cold-Pressed Neem Bio-Shield',
        subtitle: 'Organic Pest & Fungal Spray',
        category: 'Preventive Care',
        price: 249,
        rating: 4.9,
        image: neemSprayImg,
        dosage: '5 ml per 1L water every 10-14 days',
        description: `Broad-spectrum organic defense keeping ${cleanName} foliage free of sap-suckers and fungal spores.`,
      },
    ];
  }

  // 3. Disease-aware prioritization: if the plant is currently Diseased/Critical/Warning, surface a targeted recovery treatment first!
  if (isUnhealthy && diseaseName && !diseaseName.toLowerCase().includes('healthy') && !diseaseName.toLowerCase().includes('none')) {
    const cleanDisease = diseaseName.split('(')[0].trim();
    const targetedTreatment: PlantInputRecommendation = {
      name: `${cleanDisease} Bio-Remedy Spray`,
      subtitle: 'Cold-Pressed Neem + Copper Bio-Shield',
      category: 'Priority Recovery Input',
      price: 269,
      rating: 4.9,
      image: neemSprayImg,
      dosage: 'Spray affected foliage at dusk every 5-7 days',
      description: `Targeted organic treatment specifically recommended to halt ${cleanDisease} on your ${cleanName} and protect emerging healthy leaves.`,
    };
    const filtered = baseProducts.filter(
      (p) => !p.name.toLowerCase().includes('neem') && !p.category.toLowerCase().includes('defense')
    );
    return [targetedTreatment, ...filtered].slice(0, 5);
  }

  return baseProducts.slice(0, 5);
}

