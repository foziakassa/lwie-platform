import Link from "next/link"

export function PostOptions() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-2">Post an Item</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            List an item you want to swap or trade with others. Perfect for physical goods.
          </p>
          <div className="space-y-4">
            <p>Examples of items you can list:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Electronics (phones, laptops, cameras)</li>
              <li>Clothing and accessories</li>
              <li>Home appliances and furniture</li>
              <li>Books, games, and collectibles</li>
              <li>Sports equipment</li>
            </ul>
            <Link
              href="/post/item/create"
              className="block w-full bg-teal-600 dark:bg-teal-500 text-white px-4 py-2 rounded-md text-center hover:bg-teal-700 dark:hover:bg-teal-600 mt-4"
            >
              Continue
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-2">Offer a Service</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            List a service you can provide in exchange for items or other services.
          </p>
          <div className="space-y-4">
            <p>Examples of services you can offer:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Professional skills (design, writing, programming)</li>
              <li>Repairs and maintenance</li>
              <li>Teaching and tutoring</li>
              <li>Photography and videography</li>
              <li>Transportation and delivery</li>
            </ul>
            <Link
              href="/post/service/create"
              className="block w-full bg-teal-600 dark:bg-teal-500 text-white px-4 py-2 rounded-md text-center hover:bg-teal-700 dark:hover:bg-teal-600 mt-4"
            >
              Continue
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
