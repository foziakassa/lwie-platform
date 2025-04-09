"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

interface LaptopSpecificationsProps {
  data: any
  updateData: (data: any) => void
}

export default function LaptopSpecifications({ data, updateData }: LaptopSpecificationsProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    "Basic Information": true,
    "Hardware Specifications": false,
    "Display & Graphics": false,
    "Storage & Memory": false,
    Connectivity: false,
    "Battery & Power": false,
    "Physical Characteristics": false,
    Condition: false,
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

  return (
    <div className="space-y-6">
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
                <label htmlFor="brand" className="block text-sm font-medium">
                  Brand <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="brand"
                    value={data.brand || ""}
                    onChange={(e) => handleChange("brand", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none"
                  >
                    <option value="">Select brand</option>
                    <option value="Apple">Apple</option>
                    <option value="Dell">Dell</option>
                    <option value="HP">HP</option>
                    <option value="Lenovo">Lenovo</option>
                    <option value="Asus">Asus</option>
                    <option value="Acer">Acer</option>
                    <option value="Microsoft">Microsoft</option>
                    <option value="Samsung">Samsung</option>
                    <option value="MSI">MSI</option>
                    <option value="Toshiba">Toshiba</option>
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
                  placeholder="e.g., MacBook Pro, XPS 13, ThinkPad X1"
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
                  placeholder="e.g., 2022"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="operatingSystem" className="block text-sm font-medium">
                  Operating System
                </label>
                <div className="relative">
                  <select
                    id="operatingSystem"
                    value={data.operatingSystem || ""}
                    onChange={(e) => handleChange("operatingSystem", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none"
                  >
                    <option value="">Select OS</option>
                    <option value="Windows 11">Windows 11</option>
                    <option value="Windows 10">Windows 10</option>
                    <option value="macOS">macOS</option>
                    <option value="Chrome OS">Chrome OS</option>
                    <option value="Linux">Linux</option>
                    <option value="No OS">No OS</option>
                    <option value="Other">Other</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hardware Specifications Section */}
      <div className="border-t border-gray-200 pt-4">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection("Hardware Specifications")}
        >
          <h3 className="text-base font-medium">Hardware Specifications</h3>
          <ChevronDown
            className={`h-5 w-5 text-gray-500 transform transition-transform ${
              openSections["Hardware Specifications"] ? "rotate-180" : ""
            }`}
          />
        </div>

        {openSections["Hardware Specifications"] && (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="processor" className="block text-sm font-medium">
                  Processor (CPU)
                </label>
                <input
                  type="text"
                  id="processor"
                  value={data.processor || ""}
                  onChange={(e) => handleChange("processor", e.target.value)}
                  placeholder="e.g., Intel Core i7-12700H, AMD Ryzen 7 5800H"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="processorSpeed" className="block text-sm font-medium">
                  Processor Speed (GHz)
                </label>
                <input
                  type="text"
                  id="processorSpeed"
                  value={data.processorSpeed || ""}
                  onChange={(e) => handleChange("processorSpeed", e.target.value)}
                  placeholder="e.g., 2.3, 3.5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="ram" className="block text-sm font-medium">
                  RAM (GB)
                </label>
                <div className="relative">
                  <select
                    id="ram"
                    value={data.ram || ""}
                    onChange={(e) => handleChange("ram", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none"
                  >
                    <option value="">Select RAM</option>
                    <option value="4">4 GB</option>
                    <option value="8">8 GB</option>
                    <option value="16">16 GB</option>
                    <option value="32">32 GB</option>
                    <option value="64">64 GB</option>
                    <option value="Other">Other</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="ramType" className="block text-sm font-medium">
                  RAM Type
                </label>
                <div className="relative">
                  <select
                    id="ramType"
                    value={data.ramType || ""}
                    onChange={(e) => handleChange("ramType", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none"
                  >
                    <option value="">Select RAM type</option>
                    <option value="DDR4">DDR4</option>
                    <option value="DDR5">DDR5</option>
                    <option value="LPDDR4">LPDDR4</option>
                    <option value="LPDDR5">LPDDR5</option>
                    <option value="Other">Other</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Display & Graphics Section */}
      <div className="border-t border-gray-200 pt-4">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection("Display & Graphics")}
        >
          <h3 className="text-base font-medium">Display & Graphics</h3>
          <ChevronDown
            className={`h-5 w-5 text-gray-500 transform transition-transform ${
              openSections["Display & Graphics"] ? "rotate-180" : ""
            }`}
          />
        </div>

        {openSections["Display & Graphics"] && (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="screenSize" className="block text-sm font-medium">
                  Screen Size (inches)
                </label>
                <input
                  type="text"
                  id="screenSize"
                  value={data.screenSize || ""}
                  onChange={(e) => handleChange("screenSize", e.target.value)}
                  placeholder="e.g., 13.3, 15.6, 17.3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="resolution" className="block text-sm font-medium">
                  Screen Resolution
                </label>
                <input
                  type="text"
                  id="resolution"
                  value={data.resolution || ""}
                  onChange={(e) => handleChange("resolution", e.target.value)}
                  placeholder="e.g., 1920x1080, 2560x1440, 3840x2160"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="displayType" className="block text-sm font-medium">
                  Display Type
                </label>
                <div className="relative">
                  <select
                    id="displayType"
                    value={data.displayType || ""}
                    onChange={(e) => handleChange("displayType", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none"
                  >
                    <option value="">Select display type</option>
                    <option value="IPS">IPS</option>
                    <option value="OLED">OLED</option>
                    <option value="AMOLED">AMOLED</option>
                    <option value="TN">TN</option>
                    <option value="VA">VA</option>
                    <option value="Mini-LED">Mini-LED</option>
                    <option value="Retina">Retina</option>
                    <option value="Other">Other</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="graphicsCard" className="block text-sm font-medium">
                  Graphics Card (GPU)
                </label>
                <input
                  type="text"
                  id="graphicsCard"
                  value={data.graphicsCard || ""}
                  onChange={(e) => handleChange("graphicsCard", e.target.value)}
                  placeholder="e.g., NVIDIA RTX 3060, AMD Radeon RX 6600M"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={data.touchscreen || false}
                  onChange={(e) => handleChange("touchscreen", e.target.checked)}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Touchscreen</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Storage & Memory Section */}
      <div className="border-t border-gray-200 pt-4">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection("Storage & Memory")}
        >
          <h3 className="text-base font-medium">Storage & Memory</h3>
          <ChevronDown
            className={`h-5 w-5 text-gray-500 transform transition-transform ${
              openSections["Storage & Memory"] ? "rotate-180" : ""
            }`}
          />
        </div>

        {openSections["Storage & Memory"] && (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="storageType" className="block text-sm font-medium">
                  Storage Type
                </label>
                <div className="relative">
                  <select
                    id="storageType"
                    value={data.storageType || ""}
                    onChange={(e) => handleChange("storageType", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none"
                  >
                    <option value="">Select storage type</option>
                    <option value="SSD">SSD</option>
                    <option value="HDD">HDD</option>
                    <option value="Hybrid">Hybrid (SSD + HDD)</option>
                    <option value="eMMC">eMMC</option>
                    <option value="Other">Other</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="storageCapacity" className="block text-sm font-medium">
                  Storage Capacity (GB)
                </label>
                <div className="relative">
                  <select
                    id="storageCapacity"
                    value={data.storageCapacity || ""}
                    onChange={(e) => handleChange("storageCapacity", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none"
                  >
                    <option value="">Select capacity</option>
                    <option value="128">128 GB</option>
                    <option value="256">256 GB</option>
                    <option value="512">512 GB</option>
                    <option value="1000">1 TB (1000 GB)</option>
                    <option value="2000">2 TB (2000 GB)</option>
                    <option value="Other">Other</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Connectivity Section */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection("Connectivity")}>
          <h3 className="text-base font-medium">Connectivity</h3>
          <ChevronDown
            className={`h-5 w-5 text-gray-500 transform transition-transform ${
              openSections["Connectivity"] ? "rotate-180" : ""
            }`}
          />
        </div>

        {openSections["Connectivity"] && (
          <div className="mt-4 space-y-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium">Connectivity Features</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={data.wifi || false}
                    onChange={(e) => handleChange("wifi", e.target.checked)}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Wi-Fi</span>
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
                    checked={data.hdmi || false}
                    onChange={(e) => handleChange("hdmi", e.target.checked)}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">HDMI</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={data.usb || false}
                    onChange={(e) => handleChange("usb", e.target.checked)}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">USB</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={data.usbC || false}
                    onChange={(e) => handleChange("usbC", e.target.checked)}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">USB-C</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={data.thunderbolt || false}
                    onChange={(e) => handleChange("thunderbolt", e.target.checked)}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Thunderbolt</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={data.ethernetPort || false}
                    onChange={(e) => handleChange("ethernetPort", e.target.checked)}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Ethernet Port</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={data.sdCardReader || false}
                    onChange={(e) => handleChange("sdCardReader", e.target.checked)}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">SD Card Reader</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Battery & Power Section */}
      <div className="border-t border-gray-200 pt-4">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection("Battery & Power")}
        >
          <h3 className="text-base font-medium">Battery & Power</h3>
          <ChevronDown
            className={`h-5 w-5 text-gray-500 transform transition-transform ${
              openSections["Battery & Power"] ? "rotate-180" : ""
            }`}
          />
        </div>

        {openSections["Battery & Power"] && (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="batteryLife" className="block text-sm font-medium">
                  Battery Life (hours)
                </label>
                <input
                  type="text"
                  id="batteryLife"
                  value={data.batteryLife || ""}
                  onChange={(e) => handleChange("batteryLife", e.target.value)}
                  placeholder="e.g., 8, 10, 15"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="batteryCondition" className="block text-sm font-medium">
                  Battery Condition
                </label>
                <div className="relative">
                  <select
                    id="batteryCondition"
                    value={data.batteryCondition || ""}
                    onChange={(e) => handleChange("batteryCondition", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none"
                  >
                    <option value="">Select condition</option>
                    <option value="Excellent">Excellent (90-100% health)</option>
                    <option value="Good">Good (70-89% health)</option>
                    <option value="Fair">Fair (50-69% health)</option>
                    <option value="Poor">Poor (below 50% health)</option>
                    <option value="Replaced">Recently Replaced</option>
                    <option value="Unknown">Unknown</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Physical Characteristics Section */}
      <div className="border-t border-gray-200 pt-4">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection("Physical Characteristics")}
        >
          <h3 className="text-base font-medium">Physical Characteristics</h3>
          <ChevronDown
            className={`h-5 w-5 text-gray-500 transform transition-transform ${
              openSections["Physical Characteristics"] ? "rotate-180" : ""
            }`}
          />
        </div>

        {openSections["Physical Characteristics"] && (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="color" className="block text-sm font-medium">
                  Color
                </label>
                <input
                  type="text"
                  id="color"
                  value={data.color || ""}
                  onChange={(e) => handleChange("color", e.target.value)}
                  placeholder="e.g., Silver, Space Gray, Black"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="weight" className="block text-sm font-medium">
                  Weight (kg)
                </label>
                <input
                  type="text"
                  id="weight"
                  value={data.weight || ""}
                  onChange={(e) => handleChange("weight", e.target.value)}
                  placeholder="e.g., 1.4, 2.1"
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
              <label htmlFor="overallCondition" className="block text-sm font-medium">
                Overall Condition <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="overallCondition"
                  value={data.overallCondition || ""}
                  onChange={(e) => handleChange("overallCondition", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none"
                >
                  <option value="">Select condition</option>
                  <option value="Like New">Like New - Barely used, no visible wear</option>
                  <option value="Excellent">Excellent - Minor signs of use, fully functional</option>
                  <option value="Good">Good - Some signs of use, fully functional</option>
                  <option value="Fair">Fair - Noticeable wear, fully functional</option>
                  <option value="Poor">Poor - Heavy wear, may have minor issues</option>
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
                placeholder="Describe any known issues or problems with the laptop..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 min-h-[80px]"
              />
            </div>

            <div className="space-y-1">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={data.includesCharger || false}
                  onChange={(e) => handleChange("includesCharger", e.target.checked)}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Includes Charger</span>
              </label>
            </div>

            <div className="space-y-1">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={data.includesOriginalBox || false}
                  onChange={(e) => handleChange("includesOriginalBox", e.target.checked)}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Includes Original Box</span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

