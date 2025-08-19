// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Calculator, Leaf, Smartphone, Monitor, Wifi, Globe, TrendingUp, Info } from 'lucide-react';

const DigitalFootprintCalculator = () => {
  const [formData, setFormData] = useState({
    // Navigation web
    googleSearches: 10,
    websitePages: 50,
    emailsSent: 20,
    emailsReceived: 50,
    
    // Streaming et médias
    youtubeHours: 2,
    youtubeQuality: 'hd',
    netflixHours: 1,
    netflixQuality: 'hd',
    musicStreaming: 3,
    
    // Réseaux sociaux
    facebookMinutes: 30,
    instagramMinutes: 45,
    tiktokMinutes: 60,
    twitterMinutes: 20,
    linkedinMinutes: 15,
    
    // Gaming et apps
    mobileGaming: 60,
    onlineGaming: 120,
    videoCallsMinutes: 90,
    cloudStorage: 10,
    
    // Appareils
    devices: ['smartphone', 'laptop'],
    connectionType: 'fiber',
    
    // Habitudes
    downloadGames: 2,
    softwareUpdates: 4,
    photoUpload: 20,
    videoUpload: 2
  });

  const [results, setResults] = useState({
    dailyData: 0,
    monthlyData: 0,
    yearlyData: 0,
    co2Monthly: 0,
    co2Yearly: 0,
    equivalents: {}
  });

  const [showDetails, setShowDetails] = useState(false);

  // Coefficients de consommation (en Mo)
  const dataConsumption = {
    googleSearch: 0.2,
    websitePage: 2.5,
    emailSent: 0.075,
    emailReceived: 0.075,
    youtubeMinute: { sd: 5, hd: 12, "4k": 25 },
    netflixMinute: { sd: 7, hd: 15, "4k": 35 },
    musicMinute: 1.2,
    facebookMinute: 2.5,
    instagramMinute: 3.5,
    tiktokMinute: 8,
    twitterMinute: 1.8,
    linkedinMinute: 2,
    mobileGamingMinute: 5,
    onlineGamingMinute: 45,
    videoCallMinute: 15,
    cloudStorageGB: 1024,
    downloadGameGB: 50 * 1024,
    softwareUpdateGB: 2 * 1024,
    photoMB: 3,
    videoMB: 150
  };

  // Coefficient CO2 : 4g CO2/Mo (moyenne mondiale)
  const co2PerMB = 0.004;

  const calculateFootprint = () => {
    let dailyMB = 0;

    // Navigation
    dailyMB += formData.googleSearches * dataConsumption.googleSearch;
    dailyMB += formData.websitePages * dataConsumption.websitePage;
    dailyMB += formData.emailsSent * dataConsumption.emailSent;
    dailyMB += formData.emailsReceived * dataConsumption.emailReceived;

    // Streaming
    dailyMB += formData.youtubeHours * 60 * dataConsumption.youtubeMinute[formData.youtubeQuality];
    dailyMB += formData.netflixHours * 60 * dataConsumption.netflixMinute[formData.netflixQuality];
    dailyMB += formData.musicStreaming * 60 * dataConsumption.musicMinute;

    // Réseaux sociaux
    dailyMB += formData.facebookMinutes * dataConsumption.facebookMinute;
    dailyMB += formData.instagramMinutes * dataConsumption.instagramMinute;
    dailyMB += formData.tiktokMinutes * dataConsumption.tiktokMinute;
    dailyMB += formData.twitterMinutes * dataConsumption.twitterMinute;
    dailyMB += formData.linkedinMinutes * dataConsumption.linkedinMinute;

    // Gaming et apps
    dailyMB += formData.mobileGaming * dataConsumption.mobileGamingMinute;
    dailyMB += formData.onlineGaming * dataConsumption.onlineGamingMinute;
    dailyMB += formData.videoCallsMinutes * dataConsumption.videoCallMinute;

    // Stockage cloud (réparti sur le mois)
    dailyMB += (formData.cloudStorage * dataConsumption.cloudStorageGB) / 30;

    // Téléchargements (répartis sur le mois)
    dailyMB += (formData.downloadGames * dataConsumption.downloadGameGB) / 30;
    dailyMB += (formData.softwareUpdates * dataConsumption.softwareUpdateGB) / 30;

    // Upload photos/vidéos
    dailyMB += formData.photoUpload * dataConsumption.photoMB;
    dailyMB += formData.videoUpload * dataConsumption.videoMB;

    const monthlyMB = dailyMB * 30;
    const yearlyMB = dailyMB * 365;

    const monthlyGB = monthlyMB / 1024;
    const yearlyGB = yearlyMB / 1024;

    const co2Monthly = monthlyMB * co2PerMB;
    const co2Yearly = yearlyMB * co2PerMB;

    // Équivalents
    const equivalents = {
      carKmMonthly: Math.round(co2Monthly / 0.12), // 120g CO2/km
      carKmYearly: Math.round(co2Yearly / 0.12),
      treesMonthly: Math.round(co2Monthly / 21), // 21kg CO2 absorbé/an par arbre
      treesYearly: Math.round(co2Yearly / 21),
      lightBulbHours: Math.round(co2Yearly / 0.06), // 60g CO2/h ampoule LED
      phonesCharged: Math.round(co2Yearly / 8.22) // 8.22g CO2 par charge
    };

    setResults({
      dailyData: dailyMB,
      monthlyData: monthlyGB,
      yearlyData: yearlyGB,
      co2Monthly,
      co2Yearly,
      equivalents
    });
  };

  useEffect(() => {
    calculateFootprint();
  }, [formData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDeviceToggle = (device) => {
    setFormData(prev => ({
      ...prev,
      devices: prev.devices.includes(device) 
        ? prev.devices.filter(d => d !== device)
        : [...prev.devices, device]
    }));
  };

  const formatData = (mb) => {
    if (mb >= 1024) {
      return `${(mb / 1024).toFixed(2)} Go`;
    }
    return `${mb.toFixed(0)} Mo`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Calculator className="w-8 h-8 text-green-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">Calculateur d'Empreinte Numérique</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez votre consommation de données numériques et son impact environnemental
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Formulaire */}
          <div className="lg:col-span-2 space-y-6">
            {/* Navigation Web */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Globe className="w-6 h-6 text-blue-600 mr-3" />
                <h3 className="text-xl font-semibold">Navigation Web</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Recherches Google/jour</label>
                  <input
                    type="number"
                    value={formData.googleSearches}
                    onChange={(e) => handleInputChange('googleSearches', parseInt(e.target.value) || 0)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Pages web visitées/jour</label>
                  <input
                    type="number"
                    value={formData.websitePages}
                    onChange={(e) => handleInputChange('websitePages', parseInt(e.target.value) || 0)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Emails envoyés/jour</label>
                  <input
                    type="number"
                    value={formData.emailsSent}
                    onChange={(e) => handleInputChange('emailsSent', parseInt(e.target.value) || 0)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Emails reçus/jour</label>
                  <input
                    type="number"
                    value={formData.emailsReceived}
                    onChange={(e) => handleInputChange('emailsReceived', parseInt(e.target.value) || 0)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Streaming et Médias */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Monitor className="w-6 h-6 text-red-600 mr-3" />
                <h3 className="text-xl font-semibold">Streaming et Médias</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">YouTube (heures/jour)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.youtubeHours}
                    onChange={(e) => handleInputChange('youtubeHours', parseFloat(e.target.value) || 0)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Qualité YouTube</label>
                  <select
                    value={formData.youtubeQuality}
                    onChange={(e) => handleInputChange('youtubeQuality', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="sd">SD (480p)</option>
                    <option value="hd">HD (1080p)</option>
                    <option value="4k">4K</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Netflix (heures/jour)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.netflixHours}
                    onChange={(e) => handleInputChange('netflixHours', parseFloat(e.target.value) || 0)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Qualité Netflix</label>
                  <select
                    value={formData.netflixQuality}
                    onChange={(e) => handleInputChange('netflixQuality', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="sd">SD</option>
                    <option value="hd">HD</option>
                    <option value="4k">4K</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Streaming musical (heures/jour)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.musicStreaming}
                    onChange={(e) => handleInputChange('musicStreaming', parseFloat(e.target.value) || 0)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Réseaux Sociaux */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Smartphone className="w-6 h-6 text-purple-600 mr-3" />
                <h3 className="text-xl font-semibold">Réseaux Sociaux</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Facebook (minutes/jour)</label>
                  <input
                    type="number"
                    value={formData.facebookMinutes}
                    onChange={(e) => handleInputChange('facebookMinutes', parseInt(e.target.value) || 0)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Instagram (minutes/jour)</label>
                  <input
                    type="number"
                    value={formData.instagramMinutes}
                    onChange={(e) => handleInputChange('instagramMinutes', parseInt(e.target.value) || 0)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">TikTok (minutes/jour)</label>
                  <input
                    type="number"
                    value={formData.tiktokMinutes}
                    onChange={(e) => handleInputChange('tiktokMinutes', parseInt(e.target.value) || 0)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Twitter/X (minutes/jour)</label>
                  <input
                    type="number"
                    value={formData.twitterMinutes}
                    onChange={(e) => handleInputChange('twitterMinutes', parseInt(e.target.value) || 0)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">LinkedIn (minutes/jour)</label>
                  <input
                    type="number"
                    value={formData.linkedinMinutes}
                    onChange={(e) => handleInputChange('linkedinMinutes', parseInt(e.target.value) || 0)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Gaming et Applications */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <TrendingUp className="w-6 h-6 text-orange-600 mr-3" />
                <h3 className="text-xl font-semibold">Gaming et Applications</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Jeux mobiles (minutes/jour)</label>
                  <input
                    type="number"
                    value={formData.mobileGaming}
                    onChange={(e) => handleInputChange('mobileGaming', parseInt(e.target.value) || 0)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Jeux en ligne (minutes/jour)</label>
                  <input
                    type="number"
                    value={formData.onlineGaming}
                    onChange={(e) => handleInputChange('onlineGaming', parseInt(e.target.value) || 0)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Appels vidéo (minutes/jour)</label>
                  <input
                    type="number"
                    value={formData.videoCallsMinutes}
                    onChange={(e) => handleInputChange('videoCallsMinutes', parseInt(e.target.value) || 0)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Stockage cloud (Go/mois)</label>
                  <input
                    type="number"
                    value={formData.cloudStorage}
                    onChange={(e) => handleInputChange('cloudStorage', parseInt(e.target.value) || 0)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Téléchargements et Uploads */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Wifi className="w-6 h-6 text-green-600 mr-3" />
                <h3 className="text-xl font-semibold">Téléchargements et Uploads</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Téléchargement jeux/mois</label>
                  <input
                    type="number"
                    value={formData.downloadGames}
                    onChange={(e) => handleInputChange('downloadGames', parseInt(e.target.value) || 0)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Mises à jour logiciels/mois</label>
                  <input
                    type="number"
                    value={formData.softwareUpdates}
                    onChange={(e) => handleInputChange('softwareUpdates', parseInt(e.target.value) || 0)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Photos uploadées/jour</label>
                  <input
                    type="number"
                    value={formData.photoUpload}
                    onChange={(e) => handleInputChange('photoUpload', parseInt(e.target.value) || 0)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Vidéos uploadées/jour</label>
                  <input
                    type="number"
                    value={formData.videoUpload}
                    onChange={(e) => handleInputChange('videoUpload', parseInt(e.target.value) || 0)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Configuration */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Configuration</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Type de connexion</label>
                  <select
                    value={formData.connectionType}
                    onChange={(e) => handleInputChange('connectionType', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="fiber">Fibre optique</option>
                    <option value="adsl">ADSL</option>
                    <option value="4g">4G</option>
                    <option value="5g">5G</option>
                    <option value="wifi">Wi-Fi public</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Appareils utilisés</label>
                  <div className="flex flex-wrap gap-2">
                    {['smartphone', 'laptop', 'desktop', 'tablet', 'smartwatch'].map(device => (
                      <button
                        key={device}
                        onClick={() => handleDeviceToggle(device)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          formData.devices.includes(device)
                            ? 'bg-blue-500 text-indigo-600'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {device === 'smartphone' && '📱 Smartphone'}
                        {device === 'laptop' && '💻 Portable'}
                        {device === 'desktop' && '🖥️ PC Bureau'}
                        {device === 'tablet' && '📱 Tablette'}
                        {device === 'smartwatch' && '⌚ Montre'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Résultats */}
          <div className="space-y-6">
            {/* Consommation de données */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Consommation de données</h3>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Info className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatData(results.dailyData)}
                  </div>
                  <div className="text-sm text-gray-600">par jour</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {results.monthlyData.toFixed(2)} Go
                  </div>
                  <div className="text-sm text-gray-600">par mois</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {results.yearlyData.toFixed(2)} Go
                  </div>
                  <div className="text-sm text-gray-600">par an</div>
                </div>
              </div>
            </div>

            {/* Impact environnemental */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Leaf className="w-6 h-6 text-green-600 mr-3" />
                <h3 className="text-xl font-semibold">Impact CO₂</h3>
              </div>
              <div className="space-y-4">
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {results.co2Monthly.toFixed(2)} kg
                  </div>
                  <div className="text-sm text-gray-600">CO₂ par mois</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {results.co2Yearly.toFixed(2)} kg
                  </div>
                  <div className="text-sm text-gray-600">CO₂ par an</div>
                </div>
              </div>
            </div>

            {/* Équivalents */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Équivalents (par an)</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span>🚗 Km en voiture</span>
                  <span className="font-semibold">{results.equivalents.carKmYearly?.toLocaleString()} km</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span>🌳 Arbres à planter</span>
                  <span className="font-semibold">{results.equivalents.treesYearly} arbres</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span>💡 Heures d'éclairage LED</span>
                  <span className="font-semibold">{results.equivalents.lightBulbHours?.toLocaleString()} h</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span>🔋 Charges de smartphone</span>
                  <span className="font-semibold">{results.equivalents.phonesCharged?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Conseils */}
            <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-3">💡 Conseils pour réduire</h3>
              <ul className="space-y-2 text-sm">
                <li>• Réduisez la qualité vidéo quand possible</li>
                <li>• Utilisez le Wi-Fi plutôt que la 4G/5G</li>
                <li>• Fermez les apps en arrière-plan</li>
                <li>• Téléchargez plutôt que streamer</li>
                <li>• Nettoyez régulièrement votre stockage cloud</li>
                <li>• Désactivez la lecture automatique des vidéos</li>
                <li>• Utilisez un bloqueur de publicités</li>
                <li>• Préférez l'audio au streaming vidéo</li>
              </ul>
            </div>

            {/* Comparaison */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">📊 Votre profil</h3>
              <div className="space-y-3">
                {results.yearlyData < 50 && (
                  <div className="p-3 bg-green-100 text-green-800 rounded-lg">
                    <div className="font-medium">🌱 Utilisateur éco-responsable</div>
                    <div className="text-sm">Votre consommation est faible !</div>
                  </div>
                )}
                {results.yearlyData >= 50 && results.yearlyData < 200 && (
                  <div className="p-3 bg-yellow-100 text-yellow-800 rounded-lg">
                    <div className="font-medium">⚖️ Utilisateur modéré</div>
                    <div className="text-sm">Consommation dans la moyenne</div>
                  </div>
                )}
                {results.yearlyData >= 200 && results.yearlyData < 500 && (
                  <div className="p-3 bg-orange-100 text-orange-800 rounded-lg">
                    <div className="font-medium">📈 Gros consommateur</div>
                    <div className="text-sm">Pensez à optimiser vos usages</div>
                  </div>
                )}
                {results.yearlyData >= 500 && (
                  <div className="p-3 bg-red-100 text-red-800 rounded-lg">
                    <div className="font-medium">🚨 Très gros consommateur</div>
                    <div className="text-sm">Action urgente recommandée</div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions recommandées */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">🎯 Actions prioritaires</h3>
              <div className="space-y-3 text-sm">
                {formData.youtubeHours > 3 && (
                  <div className="p-3 bg-red-50 border-l-4 border-red-400">
                    <strong>YouTube :</strong> Réduisez le temps ou la qualité vidéo
                  </div>
                )}
                {formData.netflixHours > 2 && (
                  <div className="p-3 bg-red-50 border-l-4 border-red-400">
                    <strong>Streaming :</strong> Limitez les heures de visionnage
                  </div>
                )}
                {formData.tiktokMinutes > 120 && (
                  <div className="p-3 bg-orange-50 border-l-4 border-orange-400">
                    <strong>TikTok :</strong> Très consommateur de données
                  </div>
                )}
                {formData.onlineGaming > 180 && (
                  <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400">
                    <strong>Gaming :</strong> Optimisez les paramètres réseau
                  </div>
                )}
                {formData.cloudStorage > 50 && (
                  <div className="p-3 bg-blue-50 border-l-4 border-blue-400">
                    <strong>Cloud :</strong> Nettoyez vos fichiers régulièrement
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Détails techniques */}
        {showDetails && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">📋 Détails techniques</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Consommation par activité (Mo/jour)</h4>
                <div className="space-y-1">
                  <div>Recherches Google: {(formData.googleSearches * dataConsumption.googleSearch).toFixed(1)} Mo</div>
                  <div>Navigation web: {(formData.websitePages * dataConsumption.websitePage).toFixed(1)} Mo</div>
                  <div>Emails: {((formData.emailsSent + formData.emailsReceived) * dataConsumption.emailSent).toFixed(1)} Mo</div>
                  <div>YouTube: {(formData.youtubeHours * 60 * dataConsumption.youtubeMinute[formData.youtubeQuality]).toFixed(1)} Mo</div>
                  <div>Netflix: {(formData.netflixHours * 60 * dataConsumption.netflixMinute[formData.netflixQuality]).toFixed(1)} Mo</div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Réseaux sociaux (Mo/jour)</h4>
                <div className="space-y-1">
                  <div>Facebook: {(formData.facebookMinutes * dataConsumption.facebookMinute).toFixed(1)} Mo</div>
                  <div>Instagram: {(formData.instagramMinutes * dataConsumption.instagramMinute).toFixed(1)} Mo</div>
                  <div>TikTok: {(formData.tiktokMinutes * dataConsumption.tiktokMinute).toFixed(1)} Mo</div>
                  <div>Twitter: {(formData.twitterMinutes * dataConsumption.twitterMinute).toFixed(1)} Mo</div>
                  <div>LinkedIn: {(formData.linkedinMinutes * dataConsumption.linkedinMinute).toFixed(1)} Mo</div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Gaming & Apps (Mo/jour)</h4>
                <div className="space-y-1">
                  <div>Jeux mobiles: {(formData.mobileGaming * dataConsumption.mobileGamingMinute).toFixed(1)} Mo</div>
                  <div>Jeux en ligne: {(formData.onlineGaming * dataConsumption.onlineGamingMinute).toFixed(1)} Mo</div>
                  <div>Appels vidéo: {(formData.videoCallsMinutes * dataConsumption.videoCallMinute).toFixed(1)} Mo</div>
                  <div>Cloud: {((formData.cloudStorage * dataConsumption.cloudStorageGB) / 30).toFixed(1)} Mo</div>
                  <div>Uploads: {(formData.photoUpload * dataConsumption.photoMB + formData.videoUpload * dataConsumption.videoMB).toFixed(1)} Mo</div>
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-2">Méthodologie</h4>
              <p className="text-sm text-gray-600">
                Les calculs sont basés sur des données moyennes de consommation par activité. 
                Le facteur d'émission CO₂ utilisé est de 4g CO₂/Mo (moyenne mondiale incluant 
                production d'électricité, infrastructure réseau et centres de données). 
                Les équivalences sont calculées sur des bases standardisées : 120g CO₂/km pour 
                une voiture, 21kg CO₂ absorbé/an par arbre mature.
              </p>
            </div>
          </div>
        )}

        {/* Footer éducatif */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg p-6">
          <div className="text-center mb-4">
            <h3 className="text-xl font-semibold">🌍 Le saviez-vous ?</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div className="text-center">
              <div className="text-2xl mb-2">4%</div>
              <div>Part du numérique dans les émissions mondiales de CO₂</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">70%</div>
              <div>De l'empreinte du numérique vient de nos appareils</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">9%</div>
              <div>Croissance annuelle de la consommation de données</div>
            </div>
          </div>
          <div className="mt-6 text-center">
            <p className="italic">
              "Chaque octet compte pour la planète. Adoptez des habitudes numériques responsables !"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalFootprintCalculator;