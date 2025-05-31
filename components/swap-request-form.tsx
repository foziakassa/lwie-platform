import React, { useEffect, useState } from "react";
import Cookies from "js-cookie"; // Import js-cookie

// Define an interface for user items
interface UserItem {
  id: string;
  title: string;
}

interface UserService {
  id: string;
  title: string;
}

export interface SwapRequestFormProps {
  itemId: string; // ID of the item being requested
  itemTitle: string; // Title of the item being requested
  onCancel: () => void; // Function to close the dialog
}

export const SwapRequestForm: React.FC<SwapRequestFormProps> = ({ itemId, itemTitle, onCancel }) => {
  const [offeredId, setOfferedId] = useState("");
  const [userItems, setUserItems] = useState<UserItem[]>([]);
  const [userServices, setUserServices] = useState<UserService[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOfferingItem, setIsOfferingItem] = useState(true); // State to track if offering an item

  useEffect(() => {
    const fetchUserItemsAndServices = async () => {
      const authToken = Cookies.get("authToken");

      if (!authToken) {
        alert("User not logged in.");
        setLoading(false);
        return;
      }

      const { id: userId } = JSON.parse(authToken); // Extract user ID from the authToken

      // Fetch user's items
      const itemsResponse = await fetch(`https://liwedoc.vercel.app/postitem/${userId}`);
      const itemsData = await itemsResponse.json();

      if (itemsData.success) {
        setUserItems(itemsData.items);
      } else {
        alert("Failed to load your items.");
      }

      // Fetch user's services
      const servicesResponse = await fetch(`https://liwedoc.vercel.app/postservice/${userId}`);
      const servicesData = await servicesResponse.json();

      if (servicesData.success) {
        setUserServices(servicesData.services);
      } else {
        alert("Failed to load your services.");
      }

      setLoading(false);
    };

    fetchUserItemsAndServices();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const authToken = Cookies.get("authToken");

    if (!authToken) {
      alert("User not logged in.");
      return;
    }

    const { id: userId } = JSON.parse(authToken); // Extract user ID again for the request

    const response = await fetch('https://liwedoc.vercel.app/api/swap-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        requestedId: itemId,
        requestedType: "item", // Assuming the requested type is always an item
        offeredId,
        offeredType: isOfferingItem ? "item" : "service" // Determine the offered type
      }),
    });

    const data = await response.json();

    if (data.success) {
      alert("Swap request sent successfully!");
      onCancel(); // Close the dialog
    } else {
      alert("Failed to send swap request: " + data.message);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Swap Request for: {itemTitle}</h2>
      {loading ? (
        <p>Loading your items and services...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label>
              <input
                type="radio"
                value="item"
                checked={isOfferingItem}
                onChange={() => setIsOfferingItem(true)}
              />
              Offer an Item
            </label>
            <label className="ml-4">
              <input
                type="radio"
                value="service"
                checked={!isOfferingItem}
                onChange={() => setIsOfferingItem(false)}
              />
              Offer a Service
            </label>
          </div>

          {isOfferingItem ? (
            <label htmlFor="offeredItemId" className="block mb-2">
              Select Item to Offer:
              <select
                id="offeredItemId"
                value={offeredId}
                onChange={(e) => setOfferedId(e.target.value)}
                className="border border-gray-300 rounded p-2 w-full"
                required
              >
                <option value="">Select an item</option>
                {userItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <label htmlFor="offeredServiceId" className="block mb-2">
              Select Service to Offer:
              <select
                id="offeredServiceId"
                value={offeredId}
                onChange={(e) => setOfferedId(e.target.value)}
                className="border border-gray-300 rounded p-2 w-full"
                required
              >
                <option value="">Select a service</option>
                {userServices.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.title}
                  </option>
                ))}
              </select>
            </label>
          )}
          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
            >
              Submit Request
            </button>
          </div>
        </form>
      )}
    </div>
  );
};