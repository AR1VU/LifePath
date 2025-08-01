import { Character, GameEvent, AssetTemplate, OwnedAsset } from '../types/game';

export const ASSET_TEMPLATES: AssetTemplate[] = [
  // Real Estate
  {
    id: 'studio_apartment',
    name: 'Studio Apartment',
    type: 'real_estate',
    category: 'Apartment',
    basePrice: 150000,
    monthlyMaintenance: 800,
    description: 'A small but cozy studio apartment in the city.',
    requirements: { minAge: 18, minMoney: 30000 }
  },
  {
    id: 'family_home',
    name: 'Family Home',
    type: 'real_estate',
    category: 'House',
    basePrice: 350000,
    monthlyMaintenance: 1500,
    description: 'A comfortable 3-bedroom family home with a yard.',
    requirements: { minAge: 21, minMoney: 70000 }
  },
  {
    id: 'luxury_mansion',
    name: 'Luxury Mansion',
    type: 'real_estate',
    category: 'Mansion',
    basePrice: 2500000,
    monthlyMaintenance: 8000,
    description: 'An opulent mansion with 10 bedrooms and a pool.',
    requirements: { minAge: 25, minMoney: 500000 }
  },
  
  // Vehicles
  {
    id: 'bicycle',
    name: 'Mountain Bike',
    type: 'vehicle',
    category: 'Bike',
    basePrice: 800,
    monthlyMaintenance: 20,
    description: 'A reliable mountain bike for daily commuting.',
    requirements: { minAge: 12 }
  },
  {
    id: 'economy_car',
    name: 'Economy Car',
    type: 'vehicle',
    category: 'Car',
    basePrice: 18000,
    monthlyMaintenance: 300,
    description: 'A fuel-efficient compact car perfect for city driving.',
    requirements: { minAge: 16, license: true }
  },
  {
    id: 'sports_car',
    name: 'Sports Car',
    type: 'vehicle',
    category: 'Sports Car',
    basePrice: 85000,
    monthlyMaintenance: 800,
    description: 'A sleek sports car that turns heads on the street.',
    requirements: { minAge: 18, minMoney: 20000, license: true }
  },
  {
    id: 'yacht',
    name: 'Luxury Yacht',
    type: 'vehicle',
    category: 'Boat',
    basePrice: 1200000,
    monthlyMaintenance: 5000,
    description: 'A magnificent yacht for ocean adventures.',
    requirements: { minAge: 25, minMoney: 250000 }
  },
  
  // Miscellaneous
  {
    id: 'crypto_portfolio',
    name: 'Cryptocurrency Portfolio',
    type: 'misc',
    category: 'Investment',
    basePrice: 5000,
    description: 'A diversified portfolio of various cryptocurrencies.',
    requirements: { minAge: 18, minMoney: 1000 }
  },
  {
    id: 'diamond_necklace',
    name: 'Diamond Necklace',
    type: 'misc',
    category: 'Jewelry',
    basePrice: 25000,
    description: 'An exquisite diamond necklace that sparkles brilliantly.',
    requirements: { minAge: 18, minMoney: 5000 }
  },
  {
    id: 'golden_retriever',
    name: 'Golden Retriever',
    type: 'misc',
    category: 'Pet',
    basePrice: 1500,
    monthlyMaintenance: 200,
    description: 'A loyal and friendly golden retriever companion.',
    requirements: { minAge: 16 }
  }
];

export function getAvailableAssets(character: Character): AssetTemplate[] {
  return ASSET_TEMPLATES.filter(asset => {
    if (asset.requirements?.minAge && character.age < asset.requirements.minAge) {
      return false;
    }
    if (asset.requirements?.minMoney && character.stats.money < asset.requirements.minMoney) {
      return false;
    }
    if (asset.requirements?.license && character.age < 16) {
      return false;
    }
    return true;
  });
}

export function purchaseAsset(character: Character, assetId: string): { character: Character; event: GameEvent; success: boolean } {
  const assetTemplate = ASSET_TEMPLATES.find(a => a.id === assetId);
  if (!assetTemplate) {
    throw new Error('Asset not found');
  }

  const finalPrice = Math.floor(assetTemplate.basePrice * (0.9 + Math.random() * 0.2)); // ±10% price variation

  if (character.stats.money < finalPrice) {
    const event: GameEvent = {
      id: crypto.randomUUID(),
      age: character.age,
      title: 'Purchase Failed',
      description: `You don't have enough money to buy the ${assetTemplate.name}. You need $${finalPrice.toLocaleString()}.`,
      statChanges: { happiness: -3 },
      timestamp: new Date(),
      type: 'negative',
      category: 'assets'
    };
    return { character, event, success: false };
  }

  const newAsset: OwnedAsset = {
    id: crypto.randomUUID(),
    type: assetTemplate.type,
    name: assetTemplate.name,
    purchasePrice: finalPrice,
    currentValue: finalPrice,
    purchasedAt: character.age,
    monthlyMaintenance: assetTemplate.monthlyMaintenance,
    description: assetTemplate.description,
    category: assetTemplate.category
  };

  const updatedCharacter = {
    ...character,
    stats: {
      ...character.stats,
      money: character.stats.money - finalPrice
    },
    finances: {
      ...character.finances,
      assets: [...(character.finances?.assets || []), newAsset]
    }
  };

  const happinessBoost = assetTemplate.type === 'real_estate' ? 15 : 
                       assetTemplate.type === 'vehicle' ? 10 : 5;

  const event: GameEvent = {
    id: crypto.randomUUID(),
    age: character.age,
    title: 'Asset Purchased',
    description: `You bought a ${assetTemplate.name} for $${finalPrice.toLocaleString()}!`,
    statChanges: { happiness: happinessBoost, reputation: 3 },
    timestamp: new Date(),
    type: 'positive',
    category: 'assets'
  };

  return { character: updatedCharacter, event, success: true };
}

export function sellAsset(character: Character, assetId: string): { character: Character; event: GameEvent } {
  const asset = (character.finances?.assets || []).find(a => a.id === assetId);
  if (!asset) {
    throw new Error('Asset not found');
  }

  // Calculate depreciation
  const yearsOwned = character.age - asset.purchasedAt;
  const depreciationRate = asset.type === 'real_estate' ? 0.02 : 
                          asset.type === 'vehicle' ? 0.15 : 0.1;
  
  const currentValue = Math.max(
    asset.purchasePrice * 0.1, // Minimum 10% of original value
    asset.purchasePrice * Math.pow(1 - depreciationRate, yearsOwned)
  );

  const salePrice = Math.floor(currentValue * (0.8 + Math.random() * 0.2)); // Market variation

  const updatedCharacter = {
    ...character,
    stats: {
      ...character.stats,
      money: character.stats.money + salePrice
    },
    finances: {
      ...character.finances,
      assets: (character.finances?.assets || []).filter(a => a.id !== assetId)
    }
  };

  const profit = salePrice - asset.purchasePrice;
  const event: GameEvent = {
    id: crypto.randomUUID(),
    age: character.age,
    title: 'Asset Sold',
    description: `You sold your ${asset.name} for $${salePrice.toLocaleString()}. ${profit >= 0 ? `Profit: $${profit.toLocaleString()}` : `Loss: $${Math.abs(profit).toLocaleString()}`}`,
    statChanges: { happiness: profit >= 0 ? 5 : -5 },
    timestamp: new Date(),
    type: profit >= 0 ? 'positive' : 'negative',
    category: 'assets'
  };

  return { character: updatedCharacter, event };
}

export function updateAssetValues(character: Character): Character {
  // Initialize finances if undefined (for backward compatibility)
  if (!character.finances) {
    return {
      ...character,
      finances: {
        savings: 0,
        debt: 0,
        investments: 0,
        monthlyExpenses: 200,
        assets: []
      }
    };
  }

  // Initialize assets array if undefined
  if (!character.finances.assets) {
    return {
      ...character,
      finances: {
        ...character.finances,
        assets: []
      }
    };
  }

  const updatedAssets = character.finances.assets.map(asset => {
    // Random market fluctuation
    const fluctuation = 0.95 + Math.random() * 0.1; // -5% to +5%
    const newValue = Math.floor(asset.currentValue * fluctuation);
    
    return {
      ...asset,
      currentValue: Math.max(asset.purchasePrice * 0.1, newValue)
    };
  });

  return {
    ...character,
    finances: {
      ...character.finances,
      assets: updatedAssets
    }
  };
}

export function calculateNetWorth(character: Character): number {
  const assetValue = (character.finances?.assets || []).reduce((total, asset) => total + asset.currentValue, 0);
  const cash = character.stats.money;
  const savings = character.finances?.savings || 0;
  const investments = character.finances?.investments || 0;
  const debt = character.finances?.debt || 0;
  
  return cash + savings + investments + assetValue - debt;
}

export function getMonthlyAssetExpenses(character: Character): number {
  return (character.finances?.assets || []).reduce((total, asset) => {
    return total + (asset.monthlyMaintenance || 0);
  }, 0);
}