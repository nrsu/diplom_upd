// Base API URL - in a real app, this would be your backend API endpoint
const API_URL = "https://api.example.com" // Replace with your actual API URL

// Helper function to get auth token
const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token")
  }
  return null
}

// Helper function for API requests
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken()

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "API request failed")
    }

    return await response.json()
  } catch (error) {
    console.error("API request error:", error)
    throw error
  }
}

// Products API
export const productsAPI = {
  getAll: async (category?: string, search?: string) => {
    // In a real app, this would be an API call
    // return fetchAPI(`/products?category=${category || ''}&search=${search || ''}`)

    // For demo purposes, we'll use mock data with a delay to simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Mock products data
    const products = [
      {
        id: 1,
        name: "Wireless Bluetooth Headphones",
        category: "Electronics",
        price: 79.99,
        originalPrice: 99.99,
        discount: 20,
        image: "/placeholder.svg?height=400&width=400",
        colors: ["Black", "White", "Blue"],
        sizes: ["One Size"],
      },
      {
        id: 2,
        name: "Premium Cotton T-Shirt",
        category: "Clothing",
        price: 24.99,
        image: "/placeholder.svg?height=400&width=400",
        colors: ["White", "Black", "Gray", "Navy"],
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      },
      {
        id: 3,
        name: "Smart Watch Series 5",
        category: "Electronics",
        price: 199.99,
        originalPrice: 249.99,
        discount: 20,
        image: "/placeholder.svg?height=400&width=400",
        colors: ["Black", "Silver", "Gold"],
        sizes: ["40mm", "44mm"],
      },
      {
        id: 4,
        name: "Kitchen Knife Set",
        category: "Home & Kitchen",
        price: 49.99,
        image: "/placeholder.svg?height=400&width=400",
        colors: ["Silver", "Black"],
        sizes: ["One Size"],
      },
      {
        id: 5,
        name: "Organic Face Cream",
        category: "Beauty",
        price: 34.99,
        image: "/placeholder.svg?height=400&width=400",
        colors: ["Default"],
        sizes: ["50ml", "100ml"],
      },
      {
        id: 6,
        name: "Yoga Mat",
        category: "Sports",
        price: 29.99,
        originalPrice: 39.99,
        discount: 25,
        image: "/placeholder.svg?height=400&width=400",
        colors: ["Purple", "Blue", "Black", "Pink"],
        sizes: ["Standard"],
      },
      {
        id: 7,
        name: "Stainless Steel Water Bottle",
        category: "Sports",
        price: 19.99,
        image: "/placeholder.svg?height=400&width=400",
        colors: ["Silver", "Black", "Blue", "Red"],
        sizes: ["500ml", "750ml", "1L"],
      },
      {
        id: 8,
        name: "Wireless Earbuds",
        category: "Electronics",
        price: 89.99,
        originalPrice: 119.99,
        discount: 25,
        image: "/placeholder.svg?height=400&width=400",
        colors: ["White", "Black"],
        sizes: ["One Size"],
      },
      {
        id: 9,
        name: "Ceramic Coffee Mug",
        category: "Home & Kitchen",
        price: 12.99,
        image: "/placeholder.svg?height=400&width=400",
        colors: ["White", "Black", "Blue", "Red"],
        sizes: ["Standard"],
      },
    ]

    // Filter by category if provided
    let filteredProducts = products
    if (category) {
      filteredProducts = filteredProducts.filter((product) => product.category.toLowerCase() === category.toLowerCase())
    }

    // Filter by search term if provided
    if (search) {
      filteredProducts = filteredProducts.filter((product) => product.name.toLowerCase().includes(search.toLowerCase()))
    }

    return filteredProducts
  },

  getById: async (id: number) => {
    // In a real app, this would be an API call
    // return fetchAPI(`/products/${id}`)

    // For demo purposes, we'll use mock data with a delay to simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Mock products data
    const products = [
      {
        id: 1,
        name: "Wireless Bluetooth Headphones",
        category: "Electronics",
        price: 79.99,
        originalPrice: 99.99,
        discount: 20,
        image: "/placeholder.svg?height=400&width=400",
        colors: ["Black", "White", "Blue"],
        sizes: ["One Size"],
        description:
          "Experience premium sound quality with these wireless Bluetooth headphones. Featuring noise cancellation technology and long battery life, these headphones are perfect for music lovers on the go.",
      },
      {
        id: 2,
        name: "Premium Cotton T-Shirt",
        category: "Clothing",
        price: 24.99,
        image: "/placeholder.svg?height=400&width=400",
        colors: ["White", "Black", "Gray", "Navy"],
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        description:
          "Made from 100% organic cotton, this premium t-shirt offers both comfort and style. The breathable fabric makes it perfect for everyday wear in any season.",
      },
      {
        id: 3,
        name: "Smart Watch Series 5",
        category: "Electronics",
        price: 199.99,
        originalPrice: 249.99,
        discount: 20,
        image: "/placeholder.svg?height=400&width=400",
        colors: ["Black", "Silver", "Gold"],
        sizes: ["40mm", "44mm"],
        description:
          "Stay connected and track your fitness with this advanced smartwatch. Features include heart rate monitoring, GPS, water resistance, and compatibility with all your favorite apps.",
      },
      {
        id: 4,
        name: "Kitchen Knife Set",
        category: "Home & Kitchen",
        price: 49.99,
        image: "/placeholder.svg?height=400&width=400",
        colors: ["Silver", "Black"],
        sizes: ["One Size"],
        description:
          "This professional-grade kitchen knife set includes chef's knife, bread knife, utility knife, and paring knife. Made from high-quality stainless steel with ergonomic handles for precision cutting.",
      },
    ]

    const product = products.find((p) => p.id === id)

    if (!product) {
      throw new Error("Product not found")
    }

    return product
  },
}

// Orders API
export const ordersAPI = {
  getAll: async () => {
    // Check if user is authenticated
    const token = getAuthToken()
    if (!token) {
      throw new Error("Authentication required")
    }

    // In a real app, this would be an API call
    // return fetchAPI('/orders')

    // For demo purposes, we'll use mock data with a delay to simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock orders data
    return [
      {
        id: "ORD-12345",
        date: "March 8, 2025",
        status: "Processing",
        total: 329.97,
        shippingAddress: "123 Main St, Anytown, CA 12345",
        paymentMethod: "Credit Card (ending in 4242)",
        items: [
          {
            id: 1,
            name: "Wireless Bluetooth Headphones",
            price: 79.99,
            quantity: 1,
            image: "/placeholder.svg?height=50&width=50",
          },
          {
            id: 3,
            name: "Smart Watch Series 5",
            price: 199.99,
            quantity: 1,
            image: "/placeholder.svg?height=50&width=50",
          },
          {
            id: 4,
            name: "Kitchen Knife Set",
            price: 49.99,
            quantity: 1,
            image: "/placeholder.svg?height=50&width=50",
          },
        ],
      },
      {
        id: "ORD-12344",
        date: "March 1, 2025",
        status: "Shipped",
        total: 114.97,
        shippingAddress: "123 Main St, Anytown, CA 12345",
        paymentMethod: "PayPal",
        items: [
          {
            id: 2,
            name: "Premium Cotton T-Shirt",
            price: 24.99,
            quantity: 2,
            image: "/placeholder.svg?height=50&width=50",
          },
          {
            id: 5,
            name: "Organic Face Cream",
            price: 34.99,
            quantity: 1,
            image: "/placeholder.svg?height=50&width=50",
          },
          {
            id: 7,
            name: "Stainless Steel Water Bottle",
            price: 19.99,
            quantity: 1,
            image: "/placeholder.svg?height=50&width=50",
          },
        ],
      },
      {
        id: "ORD-12343",
        date: "February 15, 2025",
        status: "Delivered",
        total: 249.97,
        shippingAddress: "123 Main St, Anytown, CA 12345",
        paymentMethod: "Credit Card (ending in 4242)",
        items: [
          {
            id: 8,
            name: "Wireless Earbuds",
            price: 89.99,
            quantity: 1,
            image: "/placeholder.svg?height=50&width=50",
          },
          {
            id: 3,
            name: "Smart Watch Series 5",
            price: 199.99,
            quantity: 1,
            image: "/placeholder.svg?height=50&width=50",
          },
        ],
      },
    ]
  },

  getById: async (id: string) => {
    // Check if user is authenticated
    const token = getAuthToken()
    if (!token) {
      throw new Error("Authentication required")
    }

    // In a real app, this would be an API call
    // return fetchAPI(`/orders/${id}`)

    // For demo purposes, we'll use mock data with a delay to simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Mock orders data
    const orders = [
      {
        id: "ORD-12345",
        date: "March 8, 2025",
        status: "Processing",
        total: 329.97,
        shippingAddress: "123 Main St, Anytown, CA 12345",
        paymentMethod: "Credit Card (ending in 4242)",
        items: [
          {
            id: 1,
            name: "Wireless Bluetooth Headphones",
            price: 79.99,
            quantity: 1,
            image: "/placeholder.svg?height=50&width=50",
          },
          {
            id: 3,
            name: "Smart Watch Series 5",
            price: 199.99,
            quantity: 1,
            image: "/placeholder.svg?height=50&width=50",
          },
          {
            id: 4,
            name: "Kitchen Knife Set",
            price: 49.99,
            quantity: 1,
            image: "/placeholder.svg?height=50&width=50",
          },
        ],
      },
      {
        id: "ORD-12344",
        date: "March 1, 2025",
        status: "Shipped",
        total: 114.97,
        shippingAddress: "123 Main St, Anytown, CA 12345",
        paymentMethod: "PayPal",
        items: [
          {
            id: 2,
            name: "Premium Cotton T-Shirt",
            price: 24.99,
            quantity: 2,
            image: "/placeholder.svg?height=50&width=50",
          },
          {
            id: 5,
            name: "Organic Face Cream",
            price: 34.99,
            quantity: 1,
            image: "/placeholder.svg?height=50&width=50",
          },
          {
            id: 7,
            name: "Stainless Steel Water Bottle",
            price: 19.99,
            quantity: 1,
            image: "/placeholder.svg?height=50&width=50",
          },
        ],
      },
      {
        id: "ORD-12343",
        date: "February 15, 2025",
        status: "Delivered",
        total: 249.97,
        shippingAddress: "123 Main St, Anytown, CA 12345",
        paymentMethod: "Credit Card (ending in 4242)",
        items: [
          {
            id: 8,
            name: "Wireless Earbuds",
            price: 89.99,
            quantity: 1,
            image: "/placeholder.svg?height=50&width=50",
          },
          {
            id: 3,
            name: "Smart Watch Series 5",
            price: 199.99,
            quantity: 1,
            image: "/placeholder.svg?height=50&width=50",
          },
        ],
      },
    ]

    const order = orders.find((o) => o.id === id)

    if (!order) {
      throw new Error("Order not found")
    }

    return order
  },
}

