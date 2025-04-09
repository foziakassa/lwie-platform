"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

interface VehicleSpecificationsProps {
  data: any
  updateData: (data: any) => void
  vehicleType: string
}

export default function VehicleSpecifications({ data, updateData, vehicleType }: VehicleSpecificationsProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    "Basic Information": true,
    "Vehicle Details": false,
    "Engine & Performance": false,
    "Exterior & Interior": false,
    Condition: false,
    History: false,
  })

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  const handleChange = (id: string, value: any) => {
    updateData({ [id]: value })
  }

  // Car specifications
  const carSpecifications = (
    <>
      {/* Basic Information Section */}
      <div className="border-t border-gray-200 pt-4">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection("Basic Information")}
        >
          <h3 className="text-base font-medium">Basic Information</h3>
          <ChevronDown
            className={`h-5 w-5 text-gray-500 transform transition-transform ${
              openSections["Basic Information"] ? "rotate-180" : ""
            }`}
          />
        </div>

        {openSections["Basic Information"] && (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="make" className="block text-sm font-medium">
                  Make <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="make"
                    value={data.make || ""}
                    onChange={(e) => handleChange("make", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none"
                  >
                    <option value="">Select make</option>
                    <option value="Toyota">Toyota</option>
                    <option value="Honda">Honda</option>
                    <option value="Ford">Ford</option>
                    <option value="Hyundai">Hyundai</option>
                    <option value="Nissan">Nissan</option>
                    <option value="Suzuki">Suzuki</option>
                    <option value="Mercedes-Benz">Mercedes-Benz</option>
                    <option value="BMW">BMW</option>
                    <option value="Volkswagen">Volkswagen</option>
                    <option value="Other">Other</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="model" className="block text-sm font-medium">
                  Model <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="model"
                  value={data.model || ""}
                  onChange={(e) => handleChange("model", e.target.value)}
                  placeholder="e.g., Corolla, Civic, Focus"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="year" className="block text-sm font-medium">
                  Year <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="year"
                  value={data.year || ""}
                  onChange={(e) => handleChange("year", e.target.value)}
                  placeholder="e.g., 2020"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="trim" className="block text-sm font-medium">
                  Trim/Version
                </label>
                <input
                  type="text"
                  id="trim"
                  value={data.trim || ""}
                  onChange={(e) => handleChange("trim", e.target.value)}
                  placeholder="e.g., LE, EX, SE"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Vehicle Details Section */}
      <div className="border-t border-gray-200 pt-4">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection("Vehicle Details")}
        >
          <h3 className="text-base font-medium">Vehicle Details</h3>
          <ChevronDown
            className={`h-5 w-5 text-gray-500 transform transition-transform ${
              openSections["Vehicle Details"] ? "rotate-180" : ""
            }`}
          />
        </div>

        {openSections["Vehicle Details"] && (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="bodyType" className="block text-sm font-medium">
                  Body Type
                </label>
                <div className="relative">
                  <select
                    id="bodyType"
                    value={data.bodyType || ""}
                    onChange={(e) => handleChange("bodyType", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none"
                  >
                    <option value="">Select body type</option>
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Hatchback">Hatchback</option>
                    <option value="Pickup">Pickup</option>
                    <option value="Coupe">Coupe</option>
                    <option value="Wagon">Wagon</option>
                    <option value="Van">Van</option>
                    <option value="Convertible">Convertible</option>
                    <option value="Other">Other</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="transmission" className="block text-sm font-medium">
                  Transmission
                </label>
                <div className="relative">
                  <select
                    id="transmission"
                    value={data.transmission || ""}
                    onChange={(e) => handleChange("transmission", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none"
                  >
                    <option value="">Select transmission</option>
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                    <option value="CVT">CVT</option>
                    <option value="Semi-Automatic">Semi-Automatic</option>
                    <option value="Dual-Clutch">Dual-Clutch</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label htmlFor="mileage" className="block text-sm font-medium">
                  Mileage (km) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="mileage"
                  value={data.mileage || ""}
                  onChange={(e) => handleChange("mileage", e.target.value)}
                  placeholder="e.g., 50000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="color" className="block text-sm font-medium">
                  Color
                </label>
                <input
                  type="text"
                  id="color"
                  value={data.color || ""}
                  onChange={(e) => handleChange("color", e.target.value)}
                  placeholder="e.g., Silver, Black, White"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="doors" className="block text-sm font-medium">
                  Doors
                </label>
                <div className="relative">
                  <select
                    id="doors"
                    value={data.doors || ""}
                    onChange={(e) => handleChange("doors", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none"
                  >
                    <option value="">Select doors</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Engine & Performance Section */}
      <div className="border-t border-gray-200 pt-4">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection("Engine & Performance")}
        >
          <h3 className="text-base font-medium">Engine & Performance</h3>
          <ChevronDown
            className={`h-5 w-5 text-gray-500 transform transition-transform ${
              openSections["Engine & Performance"] ? "rotate-180" : ""
            }`}
          />
        </div>

        {openSections["Engine & Performance"] && (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="fuelType" className="block text-sm font-medium">
                  Fuel Type
                </label>
                <div className="relative">
                  <select
                    id="fuelType"
                    value={data.fuelType || ""}
                    onChange={(e) => handleChange("fuelType", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none"
                  >
                    <option value="">Select fuel type</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Electric">Electric</option>
                    <option value="LPG">LPG</option>
                    <option value="CNG">CNG</option>
                    <option value="Other">Other</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="engineSize" className="block text-sm font-medium">
                  Engine Size (L)
                </label>
                <input
                  type="text"
                  id="engineSize"
                  value={data.engineSize || ""}
                  onChange={(e) => handleChange("engineSize", e.target.value)}
                  placeholder="e.g., 1.8, 2.0, 3.5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="driveType" className="block text-sm font-medium">
                  Drive Type
                </label>
                <div className="relative">
                  <select
                    id="driveType"
                    value={data.driveType || ""}
                    onChange={(e) => handleChange("driveType", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none"
                  >
                    <option value="">Select drive type</option>
                    <option value="FWD">FWD (Front-Wheel Drive)</option>
                    <option value="RWD">RWD (Rear-Wheel Drive)</option>
                    <option value="AWD">AWD (All-Wheel Drive)</option>
                    <option value="4WD">4WD (Four-Wheel Drive)</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="horsepower" className="block text-sm font-medium">
                  Horsepower (HP)
                </label>
                <input
                  type="number"
                  id="horsepower"
                  value={data.horsepower || ""}
                  onChange={(e) => handleChange("horsepower", e.target.value)}
                  placeholder="e.g., 150"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Exterior & Interior Section */}
      <div className="border-t border-gray-200 pt-4">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection("Exterior & Interior")}
        >
          <h3 className="text-base font-medium">Exterior & Interior</h3>
          <ChevronDown
            className={`h-5 w-5 text-gray-500 transform transition-transform ${
              openSections["Exterior & Interior"] ? "rotate-180" : ""
            }`}
          />
        </div>

        {openSections["Exterior & Interior"] && (
          <div className="mt-4 space-y-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium">Features</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={data.airConditioning || false}
                    onChange={(e) => handleChange("airConditioning", e.target.checked)}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Air Conditioning</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={data.powerWindows || false}
                    onChange={(e) => handleChange("powerWindows", e.target.checked)}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Power Windows</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={data.powerSteering || false}
                    onChange={(e) => handleChange("powerSteering", e.target.checked)}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Power Steering</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={data.powerLocks || false}
                    onChange={(e) => handleChange("powerLocks", e.target.checked)}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Power Locks</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={data.sunroof || false}
                    onChange={(e) => handleChange("sunroof", e.target.checked)}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Sunroof</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={data.leatherSeats || false}
                    onChange={(e) => handleChange("leatherSeats", e.target.checked)}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Leather Seats</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={data.bluetooth || false}
                    onChange={(e) => handleChange("bluetooth", e.target.checked)}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Bluetooth</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={data.navigation || false}
                    onChange={(e) => handleChange("navigation", e.target.checked)}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Navigation</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={data.backupCamera || false}
                    onChange={(e) => handleChange("backupCamera", e.target.checked)}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Backup Camera</span>
                </label>
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="additionalFeatures" className="block text-sm font-medium">
                Additional Features
              </label>
              <textarea
                id="additionalFeatures"
                value={data.additionalFeatures || ""}
                onChange={(e) => handleChange("additionalFeatures", e.target.value)}
                placeholder="List any additional features or modifications..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 min-h-[80px]"
              />
            </div>
          </div>
        )}
      </div>

      {/* Condition Section */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection("Condition")}>
          <h3 className="text-base font-medium">Condition</h3>
          <ChevronDown
            className={`h-5 w-5 text-gray-500 transform transition-transform ${
              openSections["Condition"] ? "rotate-180" : ""
            }`}
          />
        </div>

        {openSections["Condition"] && (
          <div className="mt-4 space-y-4">
            <div className="space-y-1">
              <label htmlFor="mechanicalCondition" className="block text-sm font-medium">
                Mechanical Condition <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="mechanicalCondition"
                  value={data.mechanicalCondition || ""}
                  onChange={(e) => handleChange("mechanicalCondition", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none"
                >
                  <option value="">Select condition</option>
                  <option value="Excellent">Excellent - No issues, runs perfectly</option>
                  <option value="Good">Good - Minor issues, runs well</option>
                  <option value="Fair">Fair - Some issues that need attention</option>
                  <option value="Poor">Poor - Major issues, needs significant repairs</option>
                  <option value="Not Running">Not Running - Does not start or run</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="exteriorCondition" className="block text-sm font-medium">
                Exterior Condition
              </label>
              <div className="relative">
                <select
                  id="exteriorCondition"
                  value={data.exteriorCondition || ""}
                  onChange={(e) => handleChange("exteriorCondition", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none"
                >
                  <option value="">Select condition</option>
                  <option value="Excellent">Excellent - Like new, no visible damage</option>
                  <option value="Good">Good - Minor scratches or dents</option>
                  <option value="Fair">Fair - Noticeable scratches, dents, or rust</option>
                  <option value="Poor">Poor - Significant damage or rust</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="interiorCondition" className="block text-sm font-medium">
                Interior Condition
              </label>
              <div className="relative">
                <select
                  id="interiorCondition"
                  value={data.interiorCondition || ""}
                  onChange={(e) => handleChange("interiorCondition", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none"
                >
                  <option value="">Select condition</option>
                  <option value="Excellent">Excellent - Like new, no wear or damage</option>
                  <option value="Good">Good - Minor wear or stains</option>
                  <option value="Fair">Fair - Noticeable wear, tears, or stains</option>
                  <option value="Poor">Poor - Significant damage or wear</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="knownIssues" className="block text-sm font-medium">
                Known Issues
              </label>
              <textarea
                id="knownIssues"
                value={data.knownIssues || ""}
                onChange={(e) => handleChange("knownIssues", e.target.value)}
                placeholder="Describe any known issues or problems with the vehicle..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 min-h-[80px]"
              />
            </div>
          </div>
        )}
      </div>

      {/* History Section */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection("History")}>
          <h3 className="text-base font-medium">History</h3>
          <ChevronDown
            className={`h-5 w-5 text-gray-500 transform transition-transform ${
              openSections["History"] ? "rotate-180" : ""
            }`}
          />
        </div>

        {openSections["History"] && (
          <div className="mt-4 space-y-4">
            <div className="space-y-1">
              <label htmlFor="owners" className="block text-sm font-medium">
                Number of Previous Owners
              </label>
              <div className="relative">
                <select
                  id="owners"
                  value={data.owners || ""}
                  onChange={(e) => handleChange("owners", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none"
                >
                  <option value="">Select number</option>
                  <option value="0">0 (I am the first owner)</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4+">4 or more</option>
                  <option value="Unknown">Unknown</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="serviceHistory" className="block text-sm font-medium">
                Service History
              </label>
              <div className="relative">
                <select
                  id="serviceHistory"
                  value={data.serviceHistory || ""}
                  onChange={(e) => handleChange("serviceHistory", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none"
                >
                  <option value="">Select service history</option>
                  <option value="Full">Full service history</option>
                  <option value="Partial">Partial service history</option>
                  <option value="None">No service history</option>
                  <option value="Unknown">Unknown</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="accidentHistory" className="block text-sm font-medium">
                Accident History
              </label>
              <div className="relative">
                <select
                  id="accidentHistory"
                  value={data.accidentHistory || ""}
                  onChange={(e) => handleChange("accidentHistory", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none"
                >
                  <option value="">Select accident history</option>
                  <option value="None">No accidents</option>
                  <option value="Minor">Minor accidents</option>
                  <option value="Major">Major accidents</option>
                  <option value="Unknown">Unknown</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="importStatus" className="block text-sm font-medium">
                Import Status
              </label>
              <div className="relative">
                <select
                  id="importStatus"
                  value={data.importStatus || ""}
                  onChange={(e) => handleChange("importStatus", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none"
                >
                  <option value="">Select import status</option>
                  <option value="Local">Locally purchased</option>
                  <option value="Imported">Imported</option>
                  <option value="Unknown">Unknown</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )

  // Motorcycle specifications
  const motorcycleSpecifications = (
    <>
      {/* Basic Information Section */}
      <div className="border-t border-gray-200 pt-4">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection("Basic Information")}
        >
          <h3 className="text-base font-medium">Basic Information</h3>
          <ChevronDown
            className={`h-5 w-5 text-gray-500 transform transition-transform ${
              openSections["Basic Information"] ? "rotate-180" : ""
            }`}
          />
        </div>

        {openSections["Basic Information"] && (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="make" className="block text-sm font-medium">
                  Make <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="make"
                    value={data.make || ""}
                    onChange={(e) => handleChange("make", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none"
                  >
                    <option value="">Select make</option>
                    <option value="Honda">Honda</option>
                    <option value="Yamaha">Yamaha</option>
                    <option value="Suzuki">Suzuki</option>
                    <option value="Kawasaki">Kawasaki</option>
                    <option value="Bajaj">Bajaj</option>
                    <option value="TVS">TVS</option>
                    <option value="Royal Enfield">Royal Enfield</option>
                    <option value="Harley-Davidson">Harley-Davidson</option>
                    <option value="BMW">BMW</option>
                    <option value="Other">Other</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="model" className="block text-sm font-medium">
                  Model <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="model"
                  value={data.model || ""}
                  onChange={(e) => handleChange("model", e.target.value)}
                  placeholder="e.g., CBR, YZF, GSX-R"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="year" className="block text-sm font-medium">
                  Year <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="year"
                  value={data.year || ""}
                  onChange={(e) => handleChange("year", e.target.value)}
                  placeholder="e.g., 2020"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="type" className="block text-sm font-medium">
                  Type
                </label>
                <div className="relative">
                  <select
                    id="type"
                    value={data.type || ""}
                    onChange={(e) => handleChange("type", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none"
                  >
                    <option value="">Select type</option>
                    <option value="Sport">Sport</option>
                    <option value="Cruiser">Cruiser</option>
                    <option value="Touring">Touring</option>
                    <option value="Standard">Standard</option>
                    <option value="Dirt">Dirt/Off-road</option>
                    <option value="Scooter">Scooter</option>
                    <option value="Moped">Moped</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Other">Other</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Engine & Performance Section */}
      <div className="border-t border-gray-200 pt-4">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection("Engine & Performance")}
        >
          <h3 className="text-base font-medium">Engine & Performance</h3>
          <ChevronDown
            className={`h-5 w-5 text-gray-500 transform transition-transform ${
              openSections["Engine & Performance"] ? "rotate-180" : ""
            }`}
          />
        </div>

        {openSections["Engine & Performance"] && (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="engineSize" className="block text-sm font-medium">
                  Engine Size (cc)
                </label>
                <input
                  type="number"
                  id="engineSize"
                  value={data.engineSize || ""}
                  onChange={(e) => handleChange("engineSize", e.target.value)}
                  placeholder="e.g., 150, 250, 600"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="transmission" className="block text-sm font-medium">
                  Transmission
                </label>
                <div className="relative">
                  <select
                    id="transmission"
                    value={data.transmission || ""}
                    onChange={(e) => handleChange("transmission", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none"
                  >
                    <option value="">Select transmission</option>
                    <option value="Manual">Manual</option>
                    <option value="Automatic">Automatic</option>
                    <option value="Semi-Automatic">Semi-Automatic</option>
                    <option value="CVT">CVT</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="fuelType" className="block text-sm font-medium">
                  Fuel Type
                </label>
                <div className="relative">
                  <select
                    id="fuelType"
                    value={data.fuelType || ""}
                    onChange={(e) => handleChange("fuelType", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none"
                  >
                    <option value="">Select fuel type</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Other">Other</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="mileage" className="block text-sm font-medium">
                  Mileage (km) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="mileage"
                  value={data.mileage || ""}
                  onChange={(e) => handleChange("mileage", e.target.value)}
                  placeholder="e.g., 5000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Condition Section */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection("Condition")}>
          <h3 className="text-base font-medium">Condition</h3>
          <ChevronDown
            className={`h-5 w-5 text-gray-500 transform transition-transform ${
              openSections["Condition"] ? "rotate-180" : ""
            }`}
          />
        </div>

        {openSections["Condition"] && (
          <div className="mt-4 space-y-4">
            <div className="space-y-1">
              <label htmlFor="mechanicalCondition" className="block text-sm font-medium">
                Mechanical Condition <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="mechanicalCondition"
                  value={data.mechanicalCondition || ""}
                  onChange={(e) => handleChange("mechanicalCondition", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none"
                >
                  <option value="">Select condition</option>
                  <option value="Excellent">Excellent - No issues, runs perfectly</option>
                  <option value="Good">Good - Minor issues, runs well</option>
                  <option value="Fair">Fair - Some issues that need attention</option>
                  <option value="Poor">Poor - Major issues, needs significant repairs</option>
                  <option value="Not Running">Not Running - Does not start or run</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="bodyCondition" className="block text-sm font-medium">
                Body Condition
              </label>
              <div className="relative">
                <select
                  id="bodyCondition"
                  value={data.bodyCondition || ""}
                  onChange={(e) => handleChange("bodyCondition", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none"
                >
                  <option value="">Select condition</option>
                  <option value="Excellent">Excellent - Like new, no visible damage</option>
                  <option value="Good">Good - Minor scratches or dents</option>
                  <option value="Fair">Fair - Noticeable scratches, dents, or rust</option>
                  <option value="Poor">Poor - Significant damage or rust</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="knownIssues" className="block text-sm font-medium">
                Known Issues
              </label>
              <textarea
                id="knownIssues"
                value={data.knownIssues || ""}
                onChange={(e) => handleChange("knownIssues", e.target.value)}
                placeholder="Describe any known issues or problems with the motorcycle..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 min-h-[80px]"
              />
            </div>
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection("Features")}>
          <h3 className="text-base font-medium">Features</h3>
          <ChevronDown
            className={`h-5 w-5 text-gray-500 transform transition-transform ${
              openSections["Features"] ? "rotate-180" : ""
            }`}
          />
        </div>

        {openSections["Features"] && (
          <div className="mt-4 space-y-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium">Features</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={data.abs || false}
                    onChange={(e) => handleChange("abs", e.target.checked)}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">ABS</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={data.discBrakes || false}
                    onChange={(e) => handleChange("discBrakes", e.target.checked)}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Disc Brakes</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={data.electricStart || false}
                    onChange={(e) => handleChange("electricStart", e.target.checked)}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Electric Start</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={data.alloyWheels || false}
                    onChange={(e) => handleChange("alloyWheels", e.target.checked)}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Alloy Wheels</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={data.digitalSpeedometer || false}
                    onChange={(e) => handleChange("digitalSpeedometer", e.target.checked)}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Digital Speedometer</span>
                </label>
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="additionalFeatures" className="block text-sm font-medium">
                Additional Features
              </label>
              <textarea
                id="additionalFeatures"
                value={data.additionalFeatures || ""}
                onChange={(e) => handleChange("additionalFeatures", e.target.value)}
                placeholder="List any additional features or modifications..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 min-h-[80px]"
              />
            </div>
          </div>
        )}
      </div>
    </>
  )

  // Render the appropriate specifications based on vehicle type
  return (
    <div className="space-y-6">
      {vehicleType === "Cars" && carSpecifications}
      {vehicleType === "Motorcycles" && motorcycleSpecifications}
      {/* Add other vehicle types as needed */}
    </div>
  )
}

