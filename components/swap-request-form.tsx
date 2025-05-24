import React, { useEffect, useState } from "react";
import Cookies from "js-cookie"; // Import js-cookie

// Define an interface for user items
interface UserItem {
  id: string;
  title: string;
}

export interface SwapRequestFormProps {
  itemId: string; // ID of the item being requested
  itemTitle: string; // Title of the item being requested
  onCancel: () => void; // Function to close the dialog
}

export const SwapRequestForm: React.FC<SwapRequestFormProps> = ({ itemId, itemTitle, onCancel }) => {
  const [offeredItemId, setOfferedItemId] = useState("");
  const [userItems, setUserItems] = useState<UserItem[]>([]); // Define type for userItems
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserItems = async () => {
      const authToken = Cookies.get("authToken");

      if (!authToken) {
        alert("User not logged in.");
        setLoading(false);
        return;
      }

      const { id: userId } = JSON.parse(authToken); // Extract user ID from the authToken

      const response = await fetch(`https://liwedoc.vercel.app/postitem/${userId}`); // Endpoint to get user's items
      const data = await response.json();

      if (data.success) {
        setUserItems(data.items);
      } else {
        alert("Failed to load your items.");
      }
      setLoading(false);
    };

    fetchUserItems();
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
      body: JSON.stringify({ userId, itemId, offeredItemId }),
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
        <p>Loading your items...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <label htmlFor="offeredItemId" className="block mb-2">
            Select Item to Offer:
            <select
              id="offeredItemId"
              value={offeredItemId}
              onChange={(e) => setOfferedItemId(e.target.value)}
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