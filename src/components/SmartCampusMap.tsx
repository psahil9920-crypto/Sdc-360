import React, { useState } from 'react';
import {
  Search,
  Filter,
  Layers,
  MapPin,
  Users,
  Tv,
  Phone,
  Compass,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  Info,
  CheckCircle,
} from 'lucide-react';
import { CampusLocation, LocationCategory } from '../types';

interface SmartCampusMapProps {
  locations: CampusLocation[];
  selectedLocationName?: string;
  onNavigateToReport: (locationName: string) => void;
}

export const SmartCampusMap: React.FC<SmartCampusMapProps> = ({
  locations,
  selectedLocationName,
  onNavigateToReport,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBlock, setSelectedBlock] = useState<string>('All');
  const [selectedFloor, setSelectedFloor] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeLocation, setActiveLocation] = useState<CampusLocation | null>(
    locations.find((l) => l.name.toLowerCase().includes(selectedLocationName?.toLowerCase() || '')) || locations[0]
  );
  const [routeFrom, setRouteFrom] = useState<string>('loc-am1'); // Central Cafeteria as default start
  const [showDirections, setShowDirections] = useState(false);

  // Filtered locations
  const filteredLocations = locations.filter((loc) => {
    const matchesSearch =
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.inCharge.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.equipment.some((eq) => eq.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesBlock = selectedBlock === 'All' || loc.block === selectedBlock;
    const matchesFloor = selectedFloor === 'All' || loc.floor === selectedFloor;
    const matchesCategory = selectedCategory === 'all' || loc.category === selectedCategory;

    return matchesSearch && matchesBlock && matchesFloor && matchesCategory;
  });

  const blocks = ['All', 'Block A', 'Block B', 'Block C', 'Block D', 'Block E', 'Amenities'];
  const floors = ['All', 'Ground', '1st Floor', '2nd Floor'];
  const categories: { label: string; value: string }[] = [
    { label: 'All Places', value: 'all' },
    { label: '🖥️ Labs', value: 'lab' },
    { label: '🎓 Classrooms', value: 'classroom' },
    { label: '📚 Library', value: 'library' },
    { label: '🏢 Offices', value: 'office' },
    { label: '☕ Amenities', value: 'amenity' },
  ];

  const getCategoryColor = (cat: LocationCategory) => {
    switch (cat) {
      case 'lab':
        return 'bg-blue-500 text-white border-blue-600';
      case 'classroom':
        return 'bg-indigo-500 text-white border-indigo-600';
      case 'library':
        return 'bg-emerald-500 text-white border-emerald-600';
      case 'office':
        return 'bg-purple-500 text-white border-purple-600';
      case 'amenity':
        return 'bg-amber-500 text-white border-amber-600';
      case 'sports':
        return 'bg-rose-500 text-white border-rose-600';
      default:
        return 'bg-slate-500 text-white border-slate-600';
    }
  };

  const calculateRouteSteps = () => {
    const startLoc = locations.find((l) => l.id === routeFrom) || locations[locations.length - 2];
    const endLoc = activeLocation || locations[0];

    const isSameBlock = startLoc.block === endLoc.block;
    const isSameFloor = startLoc.floor === endLoc.floor;

    const steps = [
      `Start at ${startLoc.name} (${startLoc.code})`,
      isSameBlock
        ? `Walk along corridor of ${startLoc.block}`
        : `Exit ${startLoc.block} towards Central Campus Quadrangle`,
      !isSameBlock ? `Enter ${endLoc.block} via the Main Glass Atrium` : null,
      !isSameFloor ? `Take the elevator/smart staircase to ${endLoc.floor}` : null,
      `Arrive at ${endLoc.name} (${endLoc.code})`,
    ].filter(Boolean) as string[];

    const distanceMeters = isSameBlock ? 45 : 160;
    const estTimeMinutes = isSameBlock ? 1 : 2.5;

    return { steps, distanceMeters, estTimeMinutes, startLoc, endLoc };
  };

  const routeInfo = calculateRouteSteps();

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-600 rounded-3xl p-6 text-white shadow-xl mb-6 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold text-cyan-200 mb-2">
              <Compass className="w-3.5 h-3.5 text-amber-300" />
              <span>SMART CAMPUS MAP 2030</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">Interactive Campus Navigator</h1>
            <p className="text-sm text-blue-100 max-w-xl">
              Locate classrooms, computer labs, library pods, faculty offices, and emergency centers with real-time occupancy and turn-by-turn guidance.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <div className="px-3 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
              <span className="text-blue-200">Total Facilities:</span> <strong className="text-white">{locations.length}</strong>
            </div>
            <div className="px-3 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
              <span className="text-blue-200">Active Wi-Fi Zones:</span> <strong className="text-emerald-300">100%</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 mb-6 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by room name, code (e.g. A-G01, Turing Hall), lab equipment, or professor..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
            />
          </div>

          {/* Block Selector */}
          <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 shrink-0">Block:</span>
            {blocks.map((b) => (
              <button
                key={b}
                onClick={() => setSelectedBlock(b)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedBlock === b
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        {/* Floor and Category Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 shrink-0 flex items-center">
              <Layers className="w-3.5 h-3.5 mr-1" /> Floor:
            </span>
            {floors.map((f) => (
              <button
                key={f}
                onClick={() => setSelectedFloor(f)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedFloor === f
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none">
            {categories.map((c) => (
              <button
                key={c.value}
                onClick={() => setSelectedCategory(c.value)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === c.value
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Map Visual & Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visual Map Canvas (7 cols on lg) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Campus Map: SD College 2030 Master Blueprint</span>
            </div>
            <span className="text-[11px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
              Showing {filteredLocations.length} locations
            </span>
          </div>

          {/* Interactive SVG Campus Layout */}
          <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-slate-100 via-blue-50/40 to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/40 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-inner p-4">
            {/* Campus Pathways Grid overlay */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
              <defs>
                <pattern id="campusGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-slate-300 dark:text-slate-700" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#campusGrid)" />
              {/* Walking routes connecting blocks */}
              <path
                d="M 120 180 Q 240 220 320 220 T 480 200"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray="4 4"
                className="text-blue-400/50"
              />
              <path
                d="M 320 220 L 320 380"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray="4 4"
                className="text-indigo-400/50"
              />
            </svg>

            {/* Block Zones Background Shapes */}
            {/* Block A: Computing Complex */}
            <div className="absolute top-[18%] left-[12%] w-[26%] h-[28%] bg-blue-500/10 border-2 border-blue-500/40 rounded-2xl flex flex-col justify-between p-2 pointer-events-none">
              <span className="text-[10px] font-black tracking-wider text-blue-700 dark:text-blue-300 uppercase">
                Block A: Computing & IT
              </span>
              <span className="text-[9px] text-blue-500">Ramanujan Complex</span>
            </div>

            {/* Block B: Academic Wing */}
            <div className="absolute top-[16%] left-[42%] w-[24%] h-[32%] bg-indigo-500/10 border-2 border-indigo-500/40 rounded-2xl flex flex-col justify-between p-2 pointer-events-none">
              <span className="text-[10px] font-black tracking-wider text-indigo-700 dark:text-indigo-300 uppercase">
                Block B: Academic Wing
              </span>
              <span className="text-[9px] text-indigo-500">Turing Hall & HOD</span>
            </div>

            {/* Block C: Central Library */}
            <div className="absolute top-[14%] left-[70%] w-[22%] h-[32%] bg-emerald-500/10 border-2 border-emerald-500/40 rounded-2xl flex flex-col justify-between p-2 pointer-events-none">
              <span className="text-[10px] font-black tracking-wider text-emerald-700 dark:text-emerald-300 uppercase">
                Block C: Central Library
              </span>
              <span className="text-[9px] text-emerald-500">Dr. Kalam Center</span>
            </div>

            {/* Block D: Maker & Science Arena */}
            <div className="absolute top-[55%] left-[16%] w-[24%] h-[30%] bg-amber-500/10 border-2 border-amber-500/40 rounded-2xl flex flex-col justify-between p-2 pointer-events-none">
              <span className="text-[10px] font-black tracking-wider text-amber-700 dark:text-amber-300 uppercase">
                Block D: Maker & IoT
              </span>
              <span className="text-[9px] text-amber-500">Robotics Prototyping</span>
            </div>

            {/* Amenities: Cafeteria & Courtyard */}
            <div className="absolute top-[50%] left-[44%] w-[22%] h-[26%] bg-teal-500/10 border-2 border-teal-500/40 rounded-2xl flex flex-col justify-between p-2 pointer-events-none">
              <span className="text-[10px] font-black tracking-wider text-teal-700 dark:text-teal-300 uppercase">
                Central Cafeteria
              </span>
              <span className="text-[9px] text-teal-600">Green Courtyard</span>
            </div>

            {/* Block E: Admin Complex */}
            <div className="absolute top-[54%] left-[68%] w-[24%] h-[32%] bg-purple-500/10 border-2 border-purple-500/40 rounded-2xl flex flex-col justify-between p-2 pointer-events-none">
              <span className="text-[10px] font-black tracking-wider text-purple-700 dark:text-purple-300 uppercase">
                Block E: Admin & Health
              </span>
              <span className="text-[9px] text-purple-500">Dean / First Aid</span>
            </div>

            {/* Interactive Pin Markers */}
            {filteredLocations.map((loc) => {
              const isSelected = activeLocation?.id === loc.id;
              return (
                <button
                  key={loc.id}
                  onClick={() => {
                    setActiveLocation(loc);
                    setShowDirections(false);
                  }}
                  style={{
                    left: `${loc.coordinates.x}%`,
                    top: `${loc.coordinates.y}%`,
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all group z-20 ${
                    isSelected ? 'scale-125 z-30' : 'hover:scale-115'
                  }`}
                  title={`${loc.name} (${loc.code})`}
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-[10px] shadow-md border-2 transition-transform ${getCategoryColor(
                      loc.category
                    )} ${isSelected ? 'ring-4 ring-blue-400 ring-offset-2' : ''}`}
                  >
                    <MapPin className="w-4 h-4" />
                  </div>

                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-slate-900 text-white text-[10px] rounded-md whitespace-nowrap shadow-lg pointer-events-none z-30">
                    <span className="font-bold">{loc.code}</span>: {loc.name}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Map Legend */}
          <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800 mt-2 gap-2">
            <span className="font-semibold text-slate-600 dark:text-slate-300">Legend:</span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-md bg-blue-500" /> <span>Labs</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-md bg-indigo-500" /> <span>Classrooms</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-md bg-emerald-500" /> <span>Library</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-md bg-purple-500" /> <span>Admin</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-md bg-teal-500" /> <span>Cafeteria / Sports</span>
            </span>
          </div>
        </div>

        {/* Selected Location Details & Turn-by-Turn Wayfinder (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-4">
          {activeLocation ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
              {/* Location Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-bold">
                      {activeLocation.code}
                    </span>
                    <span className="text-xs text-slate-400">
                      {activeLocation.block} • {activeLocation.floor}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                    {activeLocation.name}
                  </h3>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    activeLocation.status === 'Available'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      : activeLocation.status === 'In Class'
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                  }`}
                >
                  {activeLocation.status}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                {activeLocation.description}
              </p>

              {/* Current Activity Banner */}
              {activeLocation.currentActivity && (
                <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-xs mb-4">
                  <span className="font-semibold text-blue-800 dark:text-blue-300">Current Schedule: </span>
                  <span className="text-blue-900 dark:text-blue-200">{activeLocation.currentActivity}</span>
                </div>
              )}

              {/* Occupancy Progress */}
              <div className="space-y-1.5 mb-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center">
                    <Users className="w-3.5 h-3.5 mr-1 text-slate-400" /> Live Occupancy
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {activeLocation.currentOccupancy} / {activeLocation.capacity} seats (
                    {Math.round((activeLocation.currentOccupancy / activeLocation.capacity) * 100)}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                    style={{
                      width: `${Math.min(
                        100,
                        (activeLocation.currentOccupancy / activeLocation.capacity) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {/* Equipment & Facilities */}
              <div className="space-y-2 mb-4">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center">
                  <Tv className="w-3.5 h-3.5 mr-1" /> Installed Equipment & Features
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {activeLocation.equipment.map((eq, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs"
                    >
                      {eq}
                    </span>
                  ))}
                </div>
              </div>

              {/* In-Charge Details */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs mb-5">
                <div className="font-semibold text-slate-800 dark:text-slate-200">
                  Facility In-Charge: {activeLocation.inCharge}
                </div>
                <div className="text-slate-500 dark:text-slate-400 flex items-center mt-1">
                  <Phone className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  {activeLocation.contact}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => setShowDirections(!showDirections)}
                  className="flex-1 inline-flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-colors"
                >
                  <Compass className="w-4 h-4" />
                  <span>{showDirections ? 'Hide Route' : 'Get Walking Directions'}</span>
                </button>

                <button
                  onClick={() => onNavigateToReport(activeLocation.name)}
                  className="inline-flex items-center justify-center space-x-1.5 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  <span>Report Issue Here</span>
                </button>
              </div>

              {/* Directions Panel */}
              {showDirections && (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 animate-fadeIn">
                  <div className="flex items-center justify-between mb-3 text-xs">
                    <span className="font-bold text-slate-900 dark:text-white flex items-center">
                      <Sparkles className="w-3.5 h-3.5 text-blue-500 mr-1" /> Turn-by-Turn Route
                    </span>
                    <span className="text-slate-500">
                      ~{routeInfo.estTimeMinutes} min walk ({routeInfo.distanceMeters}m)
                    </span>
                  </div>

                  {/* Route From Selector */}
                  <div className="mb-3">
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Starting Point:</label>
                    <select
                      value={routeFrom}
                      onChange={(e) => setRouteFrom(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white"
                    >
                      {locations.map((loc) => (
                        <option key={loc.id} value={loc.id}>
                          {loc.name} ({loc.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Route Steps */}
                  <div className="space-y-2 text-xs">
                    {routeInfo.steps.map((step, idx) => (
                      <div key={idx} className="flex items-start space-x-2">
                        <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="text-slate-700 dark:text-slate-300 leading-snug">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 text-center text-slate-500 border border-slate-200 dark:border-slate-800">
              <MapPin className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-sm">Click any pin on the campus blueprint or choose from the list to view facility specs and directions.</p>
            </div>
          )}

          {/* Quick List of Matching Places */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 max-h-64 overflow-y-auto">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">
              Browse Locations ({filteredLocations.length})
            </div>
            <div className="space-y-1">
              {filteredLocations.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => {
                    setActiveLocation(loc);
                    setShowDirections(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                    activeLocation?.id === loc.id
                      ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="truncate">
                    <span className="font-bold mr-1.5 text-blue-600 dark:text-blue-400">{loc.code}</span>
                    <span>{loc.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0 ml-2">{loc.floor}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
