# Bài 5: Định tuyến nâng cao



## 🎯 Mục tiêu bài học

Sau khi hoàn thành bài học này, học viên sẽ có thể:
- Hiểu và implement Parallel Routes để hiển thị nhiều component cùng lúc
- Sử dụng Intercepting Routes để can thiệp vào navigation
- Tạo Modal routes và overlay interfaces
- Xây dựng complex layouts với multiple slots
- Áp dụng routing patterns nâng cao trong dự án thực tế

## 📝 Nội dung chi tiết

### 1. Parallel Routes (Tuyến đường song song)

Parallel Routes cho phép bạn render một hoặc nhiều trang trong cùng một layout cùng lúc. Điều này hữu ích cho việc tạo ra các dashboard phức tạp hoặc giao diện có nhiều vùng nội dung độc lập.

#### Cú pháp Parallel Routes
Sử dụng cú pháp `@folder` để tạo named slots:

```
app/
├── layout.tsx
├── page.tsx
├── @analytics/
│   └── page.tsx
├── @team/
│   └── page.tsx
└── @revenue/
    └── page.tsx
```

#### Layout với Multiple Slots
```tsx
// app/layout.tsx
export default function Layout({
  children,
  analytics,
  team,
  revenue,
}: {
  children: React.ReactNode
  analytics: React.ReactNode
  team: React.ReactNode
  revenue: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </header>
        
        <div className="grid grid-cols-12 gap-6">
          {/* Main content */}
          <div className="col-span-8">
            {children}
          </div>
          
          {/* Analytics panel */}
          <div className="col-span-4">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Analytics</h2>
              {analytics}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-6 mt-6">
          {/* Team section */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Team Activity</h2>
            {team}
          </div>
          
          {/* Revenue section */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Revenue</h2>
            {revenue}
          </div>
        </div>
      </div>
    </div>
  )
}
```

#### Slot Components
```tsx
// app/@analytics/page.tsx
export default function AnalyticsSlot() {
  const stats = [
    { label: 'Page Views', value: '12,345', change: '+5.2%' },
    { label: 'Users', value: '8,901', change: '+2.1%' },
    { label: 'Sessions', value: '4,567', change: '+8.7%' }
  ]

  return (
    <div className="space-y-4">
      {stats.map((stat) => (
        <div key={stat.label} className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">{stat.label}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
          <span className={`text-sm ${
            stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
          }`}>
            {stat.change}
          </span>
        </div>
      ))}
    </div>
  )
}

// app/@team/page.tsx
export default function TeamSlot() {
  const activities = [
    { user: 'John Doe', action: 'completed task', time: '2 minutes ago' },
    { user: 'Jane Smith', action: 'created project', time: '1 hour ago' },
    { user: 'Mike Johnson', action: 'updated document', time: '3 hours ago' }
  ]

  return (
    <div className="space-y-3">
      {activities.map((activity, index) => (
        <div key={index} className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
            {activity.user.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1">
            <p className="text-sm">
              <span className="font-medium">{activity.user}</span>
              {' '}{activity.action}
            </p>
            <p className="text-xs text-gray-500">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

// app/@revenue/page.tsx
export default function RevenueSlot() {
  const revenueData = [
    { month: 'Jan', amount: 45000 },
    { month: 'Feb', amount: 52000 },
    { month: 'Mar', amount: 48000 },
    { month: 'Apr', amount: 61000 }
  ]

  return (
    <div className="space-y-4">
      {revenueData.map((data) => (
        <div key={data.month} className="flex justify-between items-center">
          <span className="text-sm font-medium">{data.month}</span>
          <span className="text-lg font-bold">
            ${data.amount.toLocaleString()}
          </span>
        </div>
      ))}
      
      <div className="pt-4 border-t">
        <div className="flex justify-between items-center">
          <span className="font-semibold">Total</span>
          <span className="text-xl font-bold text-green-600">
            ${revenueData.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  )
}
```

### 2. Conditional Parallel Routes

Bạn có thể hiển thị parallel routes có điều kiện dựa trên user role hoặc feature flags:

```tsx
// app/layout.tsx
export default function Layout({
  children,
  analytics,
  admin,
}: {
  children: React.ReactNode
  analytics: React.ReactNode
  admin: React.ReactNode
}) {
  // Trong thực tế, bạn sẽ lấy user từ authentication context
  const user = { role: 'admin' }

  return (
    <div className="min-h-screen">
      <div className="flex">
        <main className="flex-1">{children}</main>
        
        <aside className="w-80 bg-gray-50 p-6">
          {analytics}
          
          {/* Chỉ hiển thị admin panel cho admin users */}
          {user.role === 'admin' && (
            <div className="mt-6">
              {admin}
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
```

### 3. Intercepting Routes (Can thiệp tuyến đường)

Intercepting Routes cho phép bạn can thiệp vào navigation và hiển thị route trong context hiện tại (như modal) thay vì navigate đến trang mới.

#### Cú pháp Intercepting Routes
- `(.)` - intercept same level
- `(..)` - intercept one level above
- `(..)(..)` - intercept two levels above
- `(...)` - intercept from root

```
app/
├── feed/
│   ├── page.tsx
│   └── @modal/
│       └── (..)photo/
│           └── [id]/
│               └── page.tsx    # Intercept /photo/[id]
├── photo/
│   └── [id]/
│       └── page.tsx           # Direct access /photo/[id]
└── layout.tsx
```

#### Layout với Modal Slot
```tsx
// app/layout.tsx
export default function Layout({
  children,
  modal,
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
      {modal}
    </div>
  )
}
```

#### Feed Page với Photo Grid
```tsx
// app/feed/page.tsx
import Link from 'next/link'

const photos = [
  { id: 1, title: 'Beautiful Sunset', url: '/images/sunset.jpg' },
  { id: 2, title: 'Mountain View', url: '/images/mountain.jpg' },
  { id: 3, title: 'City Lights', url: '/images/city.jpg' },
  { id: 4, title: 'Forest Path', url: '/images/forest.jpg' }
]

export default function FeedPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Photo Feed</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo) => (
          <Link 
            key={photo.id} 
            href={`/photo/${photo.id}`}
            className="group"
          >
            <div className="aspect-square bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg overflow-hidden group-hover:scale-105 transition-transform">
              <div className="w-full h-full flex items-center justify-center text-white font-medium">
                {photo.title}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
```

#### Intercepted Modal Route
```tsx
// app/@modal/(..)photo/[id]/page.tsx
'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'

interface Props {
  params: {
    id: string
  }
}

const photos: { [key: string]: any } = {
  '1': { title: 'Beautiful Sunset', description: 'A stunning sunset over the ocean' },
  '2': { title: 'Mountain View', description: 'Majestic mountains covered in snow' },
  '3': { title: 'City Lights', description: 'The city skyline at night' },
  '4': { title: 'Forest Path', description: 'A peaceful path through the forest' }
}

export default function PhotoModal({ params }: Props) {
  const router = useRouter()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const photo = photos[params.id]

  useEffect(() => {
    dialogRef.current?.showModal()
  }, [])

  const closeModal = () => {
    dialogRef.current?.close()
    router.back()
  }

  if (!photo) {
    return null
  }

  return (
    <dialog
      ref={dialogRef}
      className="backdrop:bg-black/80 bg-transparent p-0 max-w-4xl w-full"
      onClose={closeModal}
    >
      <div className="bg-white rounded-lg overflow-hidden">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">{photo.title}</h2>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>
        
        {/* Modal Content */}
        <div className="p-6">
          <div className="aspect-video bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg mb-4 flex items-center justify-center text-white text-2xl font-medium">
            {photo.title}
          </div>
          
          <p className="text-gray-600 mb-4">{photo.description}</p>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 text-red-500 hover:text-red-600">
                <span>❤️</span>
                <span>Like</span>
              </button>
              <button className="flex items-center space-x-2 text-blue-500 hover:text-blue-600">
                <span>💬</span>
                <span>Comment</span>
              </button>
              <button className="flex items-center space-x-2 text-green-500 hover:text-green-600">
                <span>📤</span>
                <span>Share</span>
              </button>
            </div>
            
            <a 
              href={`/photo/${params.id}`}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              View full page →
            </a>
          </div>
        </div>
      </div>
    </dialog>
  )
}
```

#### Direct Photo Page
```tsx
// app/photo/[id]/page.tsx
import Link from 'next/link'

interface Props {
  params: {
    id: string
  }
}

const photos: { [key: string]: any } = {
  '1': { 
    title: 'Beautiful Sunset', 
    description: 'A stunning sunset over the ocean with vibrant colors painting the sky.',
    details: 'Captured with Canon EOS R5, f/8, 1/60s, ISO 100'
  },
  '2': { 
    title: 'Mountain View', 
    description: 'Majestic mountains covered in snow under a clear blue sky.',
    details: 'Captured with Nikon D850, f/11, 1/125s, ISO 200'
  }
}

export default function PhotoPage({ params }: Props) {
  const photo = photos[params.id]
  
  if (!photo) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-red-600">Photo not found</h1>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link 
        href="/feed"
        className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
      >
        ← Back to Feed
      </Link>
      
      <article>
        <h1 className="text-4xl font-bold mb-6">{photo.title}</h1>
        
        <div className="aspect-video bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg mb-6 flex items-center justify-center text-white text-3xl font-medium">
          {photo.title}
        </div>
        
        <div className="prose max-w-none">
          <p className="text-lg text-gray-700 mb-4">{photo.description}</p>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold mb-2">Camera Settings</h3>
            <p className="text-sm text-gray-600">{photo.details}</p>
          </div>
          
          <div className="flex items-center justify-between py-6 border-t border-b">
            <div className="flex items-center space-x-6">
              <button className="flex items-center space-x-2 text-red-500 hover:text-red-600">
                <span className="text-xl">❤️</span>
                <span>126 Likes</span>
              </button>
              <button className="flex items-center space-x-2 text-blue-500 hover:text-blue-600">
                <span className="text-xl">💬</span>
                <span>23 Comments</span>
              </button>
              <button className="flex items-center space-x-2 text-green-500 hover:text-green-600">
                <span className="text-xl">📤</span>
                <span>Share</span>
              </button>
            </div>
            
            <div className="text-sm text-gray-500">
              Photo ID: {params.id}
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}
```

### 4. Complex Routing Patterns

#### Shopping Cart với Intercepted Checkout
```
app/
├── shop/
│   ├── page.tsx
│   ├── cart/
│   │   ├── page.tsx
│   │   └── @modal/
│   │       └── (.)checkout/
│   │           └── page.tsx    # Modal checkout
│   └── checkout/
│       └── page.tsx           # Full page checkout
```

#### Multi-step Form với Parallel Routes
```
app/
├── onboarding/
│   ├── layout.tsx
│   ├── @progress/
│   │   └── page.tsx
│   ├── @form/
│   │   ├── step1/
│   │   │   └── page.tsx
│   │   ├── step2/
│   │   │   └── page.tsx
│   │   └── step3/
│   │       └── page.tsx
│   └── @sidebar/
│       └── page.tsx
```

## 🏆 Bài tập thực hành

### Đề bài: Xây dựng Dashboard Analytics với Routing nâng cao

Tạo một dashboard analytics phức tạp với các yêu cầu:
1. **Main Dashboard**: Hiển thị tổng quan
2. **Parallel Routes**: Analytics, Team Activity, Recent Orders
3. **Intercepted Modal**: Xem chi tiết order trong modal
4. **Navigation**: Smooth transition giữa các sections
5. **Responsive**: Hoạt động tốt trên mobile và desktop

### Lời giải chi tiết:

**Bước 1**: Tạo dự án
```bash
npx create-next-app@latest analytics-dashboard --typescript --tailwind --eslint --app
cd analytics-dashboard
```

**Bước 2**: Cấu trúc thư mục
```
app/
├── layout.tsx
├── page.tsx
├── dashboard/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── @analytics/
│   │   └── page.tsx
│   ├── @activity/
│   │   └── page.tsx
│   ├── @orders/
│   │   └── page.tsx
│   └── @modal/
│       └── (..)order/
│           └── [id]/
│               └── page.tsx
├── order/
│   └── [id]/
│       └── page.tsx
└── components/
    ├── Chart.tsx
    ├── StatCard.tsx
    └── OrderCard.tsx
```

**Bước 3**: Dashboard Layout
```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
  analytics,
  activity,
  orders,
  modal,
}: {
  children: React.ReactNode
  analytics: React.ReactNode
  activity: React.ReactNode
  orders: React.ReactNode
  modal: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">Monitor your business performance</p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main content */}
          <div className="lg:col-span-8 space-y-6">
            {children}
            
            {/* Orders section */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
              {orders}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Analytics */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Analytics Overview</h2>
              {analytics}
            </div>
            
            {/* Activity */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Team Activity</h2>
              {activity}
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal overlay */}
      {modal}
    </div>
  )
}
```

**Bước 4**: Main Dashboard Content
```tsx
// app/dashboard/page.tsx
import StatCard from '../components/StatCard'
import Chart from '../components/Chart'

export default function DashboardPage() {
  const stats = [
    { title: 'Total Revenue', value: '$124,563', change: '+12.5%', positive: true },
    { title: 'Orders', value: '1,234', change: '+3.2%', positive: true },
    { title: 'Customers', value: '856', change: '-2.1%', positive: false },
    { title: 'Conversion Rate', value: '3.45%', change: '+0.8%', positive: true }
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>
      
      {/* Chart */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
        <Chart />
      </div>
    </div>
  )
}
```

**Bước 5**: Analytics Parallel Route
```tsx
// app/dashboard/@analytics/page.tsx
export default function AnalyticsSlot() {
  const metrics = [
    { label: 'Page Views', value: '45,678', icon: '👁️' },
    { label: 'Unique Visitors', value: '12,345', icon: '👤' },
    { label: 'Bounce Rate', value: '32.1%', icon: '📊' },
    { label: 'Avg. Session', value: '4m 23s', icon: '⏱️' }
  ]

  return (
    <div className="space-y-4">
      {metrics.map((metric) => (
        <div key={metric.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <span className="text-xl">{metric.icon}</span>
            <span className="text-sm font-medium text-gray-700">{metric.label}</span>
          </div>
          <span className="text-lg font-bold text-gray-900">{metric.value}</span>
        </div>
      ))}
    </div>
  )
}
```

**Bước 6**: Orders Parallel Route với Intercepted Links
```tsx
// app/dashboard/@orders/page.tsx
import Link from 'next/link'
import OrderCard from '../../components/OrderCard'

const orders = [
  { id: 1, customer: 'John Doe', amount: 299.99, status: 'Completed', date: '2024-01-15' },
  { id: 2, customer: 'Jane Smith', amount: 549.99, status: 'Processing', date: '2024-01-15' },
  { id: 3, customer: 'Mike Johnson', amount: 199.99, status: 'Shipped', date: '2024-01-14' },
  { id: 4, customer: 'Sarah Wilson', amount: 799.99, status: 'Completed', date: '2024-01-14' }
]

export default function OrdersSlot() {
  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <Link key={order.id} href={`/order/${order.id}`}>
          <OrderCard order={order} />
        </Link>
      ))}
      
      <div className="text-center pt-4">
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          View all orders →
        </button>
      </div>
    </div>
  )
}
```

**Bước 7**: Intercepted Modal Route
```tsx
// app/dashboard/@modal/(..)order/[id]/page.tsx
'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'

interface Props {
  params: {
    id: string
  }
}

const orderDetails: { [key: string]: any } = {
  '1': {
    id: 1,
    customer: 'John Doe',
    email: 'john@example.com',
    amount: 299.99,
    status: 'Completed',
    date: '2024-01-15',
    items: [
      { name: 'Premium Headphones', price: 199.99, quantity: 1 },
      { name: 'USB Cable', price: 29.99, quantity: 1 },
      { name: 'Shipping', price: 9.99, quantity: 1 }
    ]
  },
  '2': {
    id: 2,
    customer: 'Jane Smith',
    email: 'jane@example.com',
    amount: 549.99,
    status: 'Processing',
    date: '2024-01-15',
    items: [
      { name: 'Wireless Mouse', price: 79.99, quantity: 2 },
      { name: 'Keyboard', price: 129.99, quantity: 1 },
      { name: 'Monitor Stand', price: 89.99, quantity: 1 }
    ]
  }
}

export default function OrderModal({ params }: Props) {
  const router = useRouter()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const order = orderDetails[params.id]

  useEffect(() => {
    dialogRef.current?.showModal()
  }, [])

  const closeModal = () => {
    dialogRef.current?.close()
    router.back()
  }

  if (!order) {
    return null
  }

  return (
    <dialog
      ref={dialogRef}
      className="backdrop:bg-black/50 bg-transparent p-0 max-w-2xl w-full"
      onClose={closeModal}
    >
      <div className="bg-white rounded-lg overflow-hidden shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b bg-gray-50">
          <h2 className="text-xl font-semibold">Order #{order.id}</h2>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Customer</h3>
              <p className="text-gray-600">{order.customer}</p>
              <p className="text-gray-500 text-sm">{order.email}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Status</h3>
              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {order.status}
              </span>
              <p className="text-gray-500 text-sm mt-1">{order.date}</p>
            </div>
          </div>
          
          {/* Items */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
            <div className="space-y-2">
              {order.items.map((item: any, index: number) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">${item.price}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Total */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total</span>
              <span className="text-2xl font-bold text-green-600">${order.amount}</span>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex justify-between items-center mt-6">
            <a 
              href={`/order/${params.id}`}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View full details →
            </a>
            <div className="space-x-3">
              <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50">
                Print Receipt
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Update Status
              </button>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  )
}
```

**Bước 8**: Helper Components
```tsx
// app/components/StatCard.tsx
interface Props {
  title: string
  value: string
  change: string
  positive: boolean
}

export default function StatCard({ title, value, change, positive }: Props) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <span className={`text-sm font-medium ${
          positive ? 'text-green-600' : 'text-red-600'
        }`}>
          {change}
        </span>
      </div>
    </div>
  )
}

// app/components/OrderCard.tsx
interface Order {
  id: number
  customer: string
  amount: number
  status: string
  date: string
}

interface Props {
  order: Order
}

export default function OrderCard({ order }: Props) {
  return (
    <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="font-medium text-gray-900">#{order.id}</p>
          <p className="text-sm text-gray-600">{order.customer}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          order.status === 'Completed' ? 'bg-green-100 text-green-800' :
          order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {order.status}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-lg font-bold text-gray-900">${order.amount}</span>
        <span className="text-xs text-gray-500">{order.date}</span>
      </div>
    </div>
  )
}
```

**Giải thích logic:**
1. **Parallel Routes**: Sử dụng `@analytics`, `@activity`, `@orders` slots để hiển thị nhiều component cùng lúc
2. **Intercepting Routes**: `(..)order/[id]` intercept navigation để hiển thị modal thay vì navigate
3. **Modal Management**: Sử dụng HTML dialog element với useRef và useRouter
4. **Responsive Design**: Grid layout thích ứng với các screen sizes khác nhau
5. **State Management**: Modal tự động mở khi component mount và đóng khi navigate back

## 🔑 Những điểm quan trọng cần lưu ý

1. **Parallel Routes**: 
   - Sử dụng `@folder` syntax để tạo named slots
   - Layout component nhận slots như props
   - Useful cho dashboard và complex layouts

2. **Intercepting Routes**:
   - `(.)` same level, `(..)` one level up, `(...)` from root
   - Perfect cho modals và overlays
   - User có thể vẫn bookmark và share direct URLs

3. **Modal Patterns**:
   - Sử dụng HTML dialog element cho accessibility
   - Handle close với router.back() để maintain navigation stack
   - Provide fallback cho direct URL access

4. **Performance Considerations**:
   - Parallel routes render concurrently
   - Each slot can have its own loading states
   - Consider code splitting for large parallel components

5. **SEO & Accessibility**:
   - Intercepted routes should have accessible fallbacks
   - Modal content should be properly labeled
   - Consider focus management in modals

6. **Common Pitfalls**:
   - Forgetting default.tsx for parallel route slots
   - Not handling direct URL access for intercepted routes
   - Modal state management complexity

## 📝 Bài tập về nhà

Xây dựng một **Social Media Dashboard** với routing patterns phức tạp:

### Yêu cầu chính:
1. **Main Dashboard** với multiple parallel routes:
   - `@feed` - Social media feed
   - `@trending` - Trending topics  
   - `@messages` - Direct messages
   - `@notifications` - User notifications

2. **Intercepted Modal Routes**:
   - `/post/[id]` - View post in modal from feed
   - `/user/[id]` - View user profile in modal
   - `/message/[id]` - View message thread in modal

3. **Advanced Features**:
   - Real-time updates simulation
   - Infinite scroll trong feed
   - Message threads với nested routing
   - Profile editing với multi-step form

### Cấu trúc routing:
```
app/
├── dashboard/
│   ├── layout.tsx
│   ├── @feed/
│   │   └── page.tsx
│   ├── @trending/
│   │   └── page.tsx
│   ├── @messages/
│   │   └── page.tsx
│   ├── @notifications/
│   │   └── page.tsx
│   └── @modal/
│       ├── (.)post/[id]/page.tsx
│       ├── (.)user/[id]/page.tsx
│       └── (..)messages/[id]/page.tsx
├── post/[id]/page.tsx
├── user/[id]/page.tsx
├── messages/
│   ├── page.tsx
│   └── [id]/page.tsx
└── profile/
    └── edit/
        ├── layout.tsx
        ├── @form/
        │   ├── basic/page.tsx
        │   ├── preferences/page.tsx
        │   └── privacy/page.tsx
        └── @progress/
            └── page.tsx
```

### Yêu cầu kỹ thuật:
- TypeScript với proper interfaces
- Tailwind CSS cho responsive design
- Mock real-time data với useEffect intervals
- Smooth animations cho modals và transitions
- Proper error boundaries và loading states
- Keyboard navigation support cho accessibility

### Bonus features:
- Dark/light theme toggle
- Drag & drop cho reordering components
- Push notifications simulation
- Advanced search với filters
- Export dashboard data functionality
