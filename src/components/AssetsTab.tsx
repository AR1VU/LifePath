import React, { useState } from 'react';
import { Home, Car, Gem, DollarSign, TrendingUp, TrendingDown, ShoppingCart } from 'lucide-react';
import { useGameStore } from '../stores/gameStore';
import { getAvailableAssets, purchaseAsset, sellAsset, calculateNetWorth } from '../utils/assets';

const AssetsTab: React.FC = () => {
  const { character, setCharacter, addEvent } = useGameStore();
  const [showMarketplace, setShowMarketplace] = useState(false);

  if (!character) return null;

  const availableAssets = getAvailableAssets(character);
  const netWorth = calculateNetWorth(character);

  const handlePurchaseAsset = (assetId: string) => {
    try {
      const result = purchaseAsset(character, assetId);
      setCharacter(result.character);
      addEvent(result.event);
      if (result.success) {
        setShowMarketplace(false);
      }
    } catch (error) {
      console.error('Failed to purchase asset:', error);
    }
  };

  const handleSellAsset = (assetId: string) => {
    try {
      const result = sellAsset(character, assetId);
      setCharacter(result.character);
      addEvent(result.event);
    } catch (error) {
      console.error('Failed to sell asset:', error);
    }
  };

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'real_estate': return Home;
      case 'vehicle': return Car;
      case 'misc': return Gem;
      default: return DollarSign;
    }
  };

  const getAssetTypeColor = (type: string) => {
    switch (type) {
      case 'real_estate': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'vehicle': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'misc': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  if (character.age < 16) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Assets & Property</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Build your wealth through smart investments
          </p>
        </div>

        <div className="glass-card rounded-2xl premium-shadow dark:premium-shadow-dark p-12 text-center">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center mb-6">
            <span className="text-3xl">👶</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Too Young for Assets
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            You're too young to own property or make major purchases. Focus on your education and family for now!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Assets & Property</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Build your wealth through smart investments
        </p>
      </div>

      {/* Net Worth Overview */}
      <div className="glass-card rounded-2xl premium-shadow dark:premium-shadow-dark p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Net Worth</h3>
            <p className="text-gray-600 dark:text-gray-400">Your total financial value</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              ${netWorth.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Net Worth</div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              ${character.stats.money.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Cash</div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              ${character.ownedAssets.reduce((sum, asset) => sum + asset.currentValue, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Assets Value</div>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {character.ownedAssets.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Assets Owned</div>
          </div>
        </div>
      </div>

      {/* Marketplace Button */}
      <div className="glass-card rounded-2xl premium-shadow dark:premium-shadow-dark p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">Asset Marketplace</h3>
          <button
            onClick={() => setShowMarketplace(!showMarketplace)}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>{showMarketplace ? 'Hide Marketplace' : 'Browse Assets'}</span>
          </button>
        </div>

        {showMarketplace && (
          <div className="mt-6 space-y-4">
            {availableAssets.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                No assets available for purchase at your current age and financial status.
              </p>
            ) : (
              availableAssets.map((asset) => (
                <div key={asset.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        {React.createElement(getAssetIcon(asset.type), { className: "w-5 h-5 text-gray-600 dark:text-gray-400" })}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-800 dark:text-white">{asset.name}</h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{asset.description}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getAssetTypeColor(asset.type)}`}>
                      {asset.category}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-lg font-bold text-gray-800 dark:text-white">
                        ${asset.basePrice.toLocaleString()}
                      </div>
                      {asset.monthlyMaintenance && (
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          ${asset.monthlyMaintenance}/month maintenance
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handlePurchaseAsset(asset.id)}
                      disabled={character.stats.money < asset.basePrice}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-colors"
                    >
                      Purchase
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Owned Assets */}
      {character.ownedAssets.length > 0 && (
        <div className="glass-card rounded-2xl premium-shadow dark:premium-shadow-dark p-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Your Assets</h3>
          <div className="space-y-4">
            {character.ownedAssets.map((asset) => {
              const Icon = getAssetIcon(asset.type);
              const valueChange = asset.currentValue - asset.purchasePrice;
              const valueChangePercent = ((valueChange / asset.purchasePrice) * 100).toFixed(1);
              
              return (
                <div key={asset.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-800 dark:text-white">{asset.name}</h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          Purchased at age {asset.purchasedAt} for ${asset.purchasePrice.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getAssetTypeColor(asset.type)}`}>
                      {asset.category}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-800 dark:text-white">
                        ${asset.currentValue.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Current Value</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-lg font-bold flex items-center justify-center space-x-1 ${
                        valueChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {valueChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        <span>{valueChange >= 0 ? '+' : ''}${valueChange.toLocaleString()}</span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {valueChangePercent}% change
                      </div>
                    </div>
                    <div className="text-center">
                      {asset.monthlyMaintenance && (
                        <>
                          <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
                            ${asset.monthlyMaintenance}/mo
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Maintenance</div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleSellAsset(asset.id)}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                    >
                      Sell Asset
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* No Assets Message */}
      {character.ownedAssets.length === 0 && (
        <div className="glass-card rounded-2xl premium-shadow dark:premium-shadow-dark p-12 text-center">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center mb-6">
            <Home className="w-12 h-12 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            No Assets Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Start building your wealth by purchasing your first asset! Browse the marketplace to see what's available.
          </p>
        </div>
      )}
    </div>
  );
};

export default AssetsTab;