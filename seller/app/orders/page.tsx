"use client"
import { AdminHeader } from "@/components/admin-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {useState} from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronLeft, ChevronRight, Download, Eye, Filter, MoreHorizontal, Package, RefreshCw, X } from "lucide-react"

export default function OrdersPage() {
  const orders = [
      {
        id: 1,
        customer: "Wireless Headphones XL",
        date: "Electronics",
        amount: 299,
        stock: 432,
        status: "in-stock",
        fullfilment: "shipped",
      },
      {
        id: 2,
        customer: "Wireless Headphones XL",
        date: "Electronics",
        amount: 299,
        stock: 432,
        status: "in-stock",
        fullfilment: "shipped",
      },
      {
    
        id: 3,
        customer: "Wireless Headphones XL",
        date: "Electronics",
        amount: 299,
        stock: 432,
        status: "in-stock",
        fullfilment: "shipped",
      },
      {
    
        id: 4,
        customer: "Wireless Headphones XL",
        date: "Electronics",
        amount: 299,
        stock: 432,
        status: "in-stock",
        fullfilment: "shipped",
      },
      {
        id: 5,
        customer: "Wireless Headphones XL",
        date: "Electronics",
        amount: 299,
        stock: 432,
        status: "in-stock",
        fullfilment: "shipped",
      },
      {
        id: 6,
        customer: "Wireless Headphones XL",
        date: "Electronics",
        amount: 299,
        stock: 432,
        status: "in-stock",
        fullfilment: "shipped",
      },
      {
        id: 7,
        customer: "Wireless Headphones XL",
        date: "Electronics",
        amount: 299,
        stock: 432,
        status: "in-stock",
        fullfilment: "shipped",
      },
      {
        id: 8,
        customer: "Wireless Headphones XL",
        date: "Electronics",
        amount: 299,
        stock: 432,
        status: "in-stock",
        fullfilment: "shipped",
      },
      {
        id: 9,
        customer: "Wireless Headphones XL",
        date: "Electronics",
        amount: 299,
        stock: 432,
        status: "in-stock",
        fullfilment: "shipped",
      },
      {
        id: 10,
        customer: "Wireless Headphones XL",
        date: "Electronics",
        amount: 299,
        stock: 432,
        status: "in-stock",
        fullfilment: "shipped",
      },
      {
        id: 11,
        customer: "Wireless Headphones XL",
        date: "Electronics",
        amount: 299,
        stock: 432,
        status: "in-stock",
        fullfilment: "shipped",
      },
      {
        id: 12,
        customer: "Wireless Headphones XL",
        date: "Electronics",
        amount: 299,
        stock: 432,
        status: "in-stock",
        fullfilment: "shipped",
      },
      {
        id: 13,
        customer: "Wireless Headphones XL",
        date: "Electronics",
        amount: 299,
        stock: 432,
        status: "in-stock",
        fullfilment: "shipped",
      },
      {
        id: 14,
        customer: "Wireless Headphones XL",
        date: "Electronics",
        amount: 299,
        stock: 432,
        status: "in-stock",
        fullfilment: "shipped",
      },
      {
        id: 15,
        customer: "Wireless Headphones XL",
        date: "Electronics",
        amount: 299,
        stock: 432,
        status: "in-stock",
        fullfilment: "shipped",
      },
      {
        id: 16,
        customer: "Wireless Headphones XL",
        date: "Electronics",
        amount: 299,
        stock: 432,
        status: "in-stock",
        fullfilment: "shipped",
      },
      {
        id: 17,
        customer: "Wireless Headphones XL",
        date: "Electronics",
        amount: 299,
        stock: 432,
        status: "in-stock",
        fullfilment: "shipped",
      },
      // Add more items if you like
    ]
    
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 5;
  
    // Calculate pagination data
    const totalOrders = orders.length;
    const totalPages = Math.ceil(totalOrders / ordersPerPage);
  
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  
    const getCurrentOrders = () => {
      const startIndex = (currentPage - 1) * ordersPerPage;
      const endIndex = startIndex + ordersPerPage;
      return orders.slice(startIndex, endIndex);
    };
  
    const currentOrders = getCurrentOrders();
  
    const goToPage = (page: number) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
    };
  
    const nextPage = () => goToPage(currentPage + 1);
    const prevPage = () => goToPage(currentPage - 1);
    // Generate page numbers to show (with ellipsis for many pages)
    const getPageNumbers = () => {
      const pages = [];
      const maxVisiblePages = 3;
      
      if (totalPages <= maxVisiblePages) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        const startPage = Math.max(2, currentPage - 1);
        const endPage = Math.min(totalPages - 1, currentPage + 1);
        
        pages.push(1);
        if (startPage > 2) pages.push('...');
        for (let i = startPage; i <= endPage; i++) {
          pages.push(i);
        }
        if (endPage < totalPages - 1) pages.push('...');
        pages.push(totalPages);
      }
      
      return pages;
    };

    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <AdminHeader title="Orders" description="Manage customer orders" />
    
        <div className="flex items-center justify-between">
          <div className="flex flex-1 items-center gap-2">
            <Input placeholder="Search orders..." className="max-w-sm" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="ml-auto h-8 flex gap-1">
                  <Filter className="h-3.5 w-3.5" />
                  <span>Filter</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Status</DropdownMenuItem>
                <DropdownMenuItem>Date Range</DropdownMenuItem>
                <DropdownMenuItem>Payment Method</DropdownMenuItem>
                <DropdownMenuItem>Amount</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8">
              <Download className="mr-2 h-3.5 w-3.5" />
              Export
            </Button>
            <Button variant="outline" size="sm" className="h-8">
              <RefreshCw className="mr-2 h-3.5 w-3.5" />
              Refresh
            </Button>
          </div>
        </div>
    
        <Card>
          <CardHeader className="p-4">
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Process and manage customer orders</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Status</TableHead>
                  <TableHead>Fulfillment</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">#ORD-{String(order.id).padStart(5, '0')}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>${order.amount}.00</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Paid
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        Shipped
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Package className="mr-2 h-4 w-4" />
                            Update Status
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <X className="mr-2 h-4 w-4" />
                            Cancel Order
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <div className="flex items-center justify-between px-4 py-4 border-t">
          <div className="text-sm text-muted-foreground">
            Showing {indexOfFirstOrder + 1}-{Math.min(indexOfLastOrder, totalOrders)} of {totalOrders} order{totalOrders !== 1 ? 's' : ''}
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8"
              onClick={prevPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>
            
            {getPageNumbers().map((page, index) => (
              page === '...' ? (
                <Button key={index} variant="outline" size="sm" className="h-8 w-8" disabled>
                  ...
                </Button>
              ) : (
                <Button
                  key={index}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  className="h-8 w-8"
                  onClick={() => goToPage(Number(page))}
                >
                  {page}
                </Button>
              )
            ))}
            
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8"
              onClick={nextPage}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
          </div>
        </div>
        </Card>
      </div>
    )
  }
//   return (
//     <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
//       <AdminHeader title="Orders" description="Manage customer orders" />

//       <div className="flex items-center justify-between">
//         <div className="flex flex-1 items-center gap-2">
//           <Input placeholder="Search orders..." className="max-w-sm" />
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="outline" size="sm" className="ml-auto h-8 flex gap-1">
//                 <Filter className="h-3.5 w-3.5" />
//                 <span>Filter</span>
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuLabel>Filter by</DropdownMenuLabel>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem>Status</DropdownMenuItem>
//               <DropdownMenuItem>Date Range</DropdownMenuItem>
//               <DropdownMenuItem>Payment Method</DropdownMenuItem>
//               <DropdownMenuItem>Amount</DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//         <div className="flex items-center gap-2">
//           <Button variant="outline" size="sm" className="h-8">
//             <Download className="mr-2 h-3.5 w-3.5" />
//             Export
//           </Button>
//           <Button variant="outline" size="sm" className="h-8">
//             <RefreshCw className="mr-2 h-3.5 w-3.5" />
//             Refresh
//           </Button>
//         </div>
//       </div>

//       <Card>
//         <CardHeader className="p-4">
//           <CardTitle>Recent Orders</CardTitle>
//           <CardDescription>Process and manage customer orders</CardDescription>
//         </CardHeader>
//         <CardContent className="p-0">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Order ID</TableHead>
//                 <TableHead>Customer</TableHead>
//                 <TableHead>Date</TableHead>
//                 <TableHead>Amount</TableHead>
//                 <TableHead>Payment Status</TableHead>
//                 <TableHead>Fulfillment</TableHead>
//                 <TableHead className="text-right">Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               <TableRow>
//                 <TableCell className="font-medium">#ORD-12345</TableCell>
//                 <TableCell>John Doe</TableCell>
//                 <TableCell>Apr 5, 2025</TableCell>
//                 <TableCell>$299.00</TableCell>
//                 <TableCell>
//                   <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
//                     Paid
//                   </Badge>
//                 </TableCell>
//                 <TableCell>
//                   <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
//                     Shipped
//                   </Badge>
//                 </TableCell>
//                 <TableCell className="text-right">
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button variant="ghost" size="icon">
//                         <MoreHorizontal className="h-4 w-4" />
//                         <span className="sr-only">Actions</span>
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="end">
//                       <DropdownMenuItem>
//                         <Eye className="mr-2 h-4 w-4" />
//                         View Details
//                       </DropdownMenuItem>
//                       <DropdownMenuItem>
//                         <Package className="mr-2 h-4 w-4" />
//                         Update Status
//                       </DropdownMenuItem>
//                       <DropdownMenuSeparator />
//                       <DropdownMenuItem className="text-destructive">
//                         <X className="mr-2 h-4 w-4" />
//                         Cancel Order
//                       </DropdownMenuItem>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </TableCell>
//               </TableRow>
//               <TableRow>
//                 <TableCell className="font-medium">#ORD-12344</TableCell>
//                 <TableCell>Jane Cooper</TableCell>
//                 <TableCell>Apr 4, 2025</TableCell>
//                 <TableCell>$199.00</TableCell>
//                 <TableCell>
//                   <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
//                     Paid
//                   </Badge>
//                 </TableCell>
//                 <TableCell>
//                   <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
//                     Processing
//                   </Badge>
//                 </TableCell>
//                 <TableCell className="text-right">
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button variant="ghost" size="icon">
//                         <MoreHorizontal className="h-4 w-4" />
//                         <span className="sr-only">Actions</span>
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="end">
//                       <DropdownMenuItem>
//                         <Eye className="mr-2 h-4 w-4" />
//                         View Details
//                       </DropdownMenuItem>
//                       <DropdownMenuItem>
//                         <Package className="mr-2 h-4 w-4" />
//                         Update Status
//                       </DropdownMenuItem>
//                       <DropdownMenuSeparator />
//                       <DropdownMenuItem className="text-destructive">
//                         <X className="mr-2 h-4 w-4" />
//                         Cancel Order
//                       </DropdownMenuItem>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </TableCell>
//               </TableRow>
//               <TableRow>
//                 <TableCell className="font-medium">#ORD-12343</TableCell>
//                 <TableCell>Robert Davis</TableCell>
//                 <TableCell>Apr 3, 2025</TableCell>
//                 <TableCell>$1299.00</TableCell>
//                 <TableCell>
//                   <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
//                     Paid
//                   </Badge>
//                 </TableCell>
//                 <TableCell>
//                   <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
//                     Delivered
//                   </Badge>
//                 </TableCell>
//                 <TableCell className="text-right">
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button variant="ghost" size="icon">
//                         <MoreHorizontal className="h-4 w-4" />
//                         <span className="sr-only">Actions</span>
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="end">
//                       <DropdownMenuItem>
//                         <Eye className="mr-2 h-4 w-4" />
//                         View Details
//                       </DropdownMenuItem>
//                       <DropdownMenuItem>
//                         <Package className="mr-2 h-4 w-4" />
//                         Update Status
//                       </DropdownMenuItem>
//                       <DropdownMenuSeparator />
//                       <DropdownMenuItem className="text-destructive">
//                         <X className="mr-2 h-4 w-4" />
//                         Cancel Order
//                       </DropdownMenuItem>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </TableCell>
//               </TableRow>
//               <TableRow>
//                 <TableCell className="font-medium">#ORD-12342</TableCell>
//                 <TableCell>Emily Miller</TableCell>
//                 <TableCell>Apr 2, 2025</TableCell>
//                 <TableCell>$899.00</TableCell>
//                 <TableCell>
//                   <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
//                     Pending
//                   </Badge>
//                 </TableCell>
//                 <TableCell>
//                   <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
//                     Unfulfilled
//                   </Badge>
//                 </TableCell>
//                 <TableCell className="text-right">
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button variant="ghost" size="icon">
//                         <MoreHorizontal className="h-4 w-4" />
//                         <span className="sr-only">Actions</span>
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="end">
//                       <DropdownMenuItem>
//                         <Eye className="mr-2 h-4 w-4" />
//                         View Details
//                       </DropdownMenuItem>
//                       <DropdownMenuItem>
//                         <Package className="mr-2 h-4 w-4" />
//                         Update Status
//                       </DropdownMenuItem>
//                       <DropdownMenuSeparator />
//                       <DropdownMenuItem className="text-destructive">
//                         <X className="mr-2 h-4 w-4" />
//                         Cancel Order
//                       </DropdownMenuItem>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </TableCell>
//               </TableRow>
//               <TableRow>
//                 <TableCell className="font-medium">#ORD-12341</TableCell>
//                 <TableCell>William Smith</TableCell>
//                 <TableCell>Apr 1, 2025</TableCell>
//                 <TableCell>$499.00</TableCell>
//                 <TableCell>
//                   <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
//                     Failed
//                   </Badge>
//                 </TableCell>
//                 <TableCell>
//                   <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
//                     Unfulfilled
//                   </Badge>
//                 </TableCell>
//                 <TableCell className="text-right">
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button variant="ghost" size="icon">
//                         <MoreHorizontal className="h-4 w-4" />
//                         <span className="sr-only">Actions</span>
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="end">
//                       <DropdownMenuItem>
//                         <Eye className="mr-2 h-4 w-4" />
//                         View Details
//                       </DropdownMenuItem>
//                       <DropdownMenuItem>
//                         <Package className="mr-2 h-4 w-4" />
//                         Update Status
//                       </DropdownMenuItem>
//                       <DropdownMenuSeparator />
//                       <DropdownMenuItem className="text-destructive">
//                         <X className="mr-2 h-4 w-4" />
//                         Cancel Order
//                       </DropdownMenuItem>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </TableCell>
//               </TableRow>
//             </TableBody>
//           </Table>
//         </CardContent>
//         <div className="flex items-center justify-between px-4 py-4 border-t">
//           <div className="text-sm text-muted-foreground">Showing 5 of 50 orders</div>
//           <div className="flex items-center gap-2">
//             <Button variant="outline" size="icon" className="h-8 w-8">
//               <ChevronLeft className="h-4 w-4" />
//               <span className="sr-only">Previous page</span>
//             </Button>
//             <Button variant="outline" size="sm" className="h-8 w-8">
//               1
//             </Button>
//             <Button variant="outline" size="sm" className="h-8 w-8">
//               2
//             </Button>
//             <Button variant="outline" size="sm" className="h-8 w-8">
//               3
//             </Button>
//             <Button variant="outline" size="icon" className="h-8 w-8">
//               <ChevronRight className="h-4 w-4" />
//               <span className="sr-only">Next page</span>
//             </Button>
//           </div>
//         </div>
//       </Card>
//     </div>
//   )
// }

