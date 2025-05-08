import Link from "next/link"

export function CallToAction() {
  return (
    <div className="bg-teal-600 dark:bg-teal-700 rounded-lg p-8 text-white text-center mb-12">
      <h2 className="text-2xl font-bold mb-4">Ready to swap or trade?</h2>
      <p className="mb-6 max-w-2xl mx-auto">
        Join our community of traders and find the items you need or sell what you don't need anymore.
      </p>
      <Link
        href="/post"
        className="bg-white text-teal-600 dark:text-teal-700 px-6 py-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-200 font-medium"
      >
        Post an Item
      </Link>
    </div>
  )
}
