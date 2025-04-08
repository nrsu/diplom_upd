"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  Store,
  CreditCard,
  MessageSquare,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const menuItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: BarChart3,
  },
  {
    title: "Products",
    href: "/products",
    icon: Package,
  },
  {
    title: "Orders",
    href: "/orders",
    icon: ShoppingCart,
  },
  {
    title: "Customers",
    href: "/customers",
    icon: Users,
  },
  // {
  //   title: "Stores",
  //   href: "/stores",
  //   icon: Store,
  // },
  // {
  //   title: "Transactions",
  //   href: "/transactions",
  //   icon: CreditCard,
  // },
  // {
  //   title: "Messages",
  //   href: "/messages",
  //   icon: MessageSquare,
  // },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div
      className={cn(
        "border-r bg-background transition-all duration-300 ease-in-out relative",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <div className={cn("flex items-center gap-2", collapsed && "justify-center w-full")}>
          <Store className="h-6 w-6" />
          {!collapsed && <span className="font-bold text-xl">ZhibekZholy</span>}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn("absolute -right-3 top-6 h-6 w-6 rounded-full border bg-background", collapsed && "rotate-180")}
        >
          <ChevronLeft className="h-3 w-3" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </div>

      <div className="py-4">
        <nav className="space-y-1 px-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
                pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                collapsed && "justify-center px-0",
              )}
            >
              <item.icon className="h-5 w-5" />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          ))}
        </nav>
      </div>

      <div
        className={cn(
          "absolute bottom-0 w-full border-t p-4",
          collapsed ? "flex justify-center" : "flex items-center justify-between",
        )}
      >
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder-user.jpg" alt="Admin" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <p className="font-medium">Admin User</p>
              <p className="text-xs text-muted-foreground">admin@example.com</p>
            </div>
          </div>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {collapsed ? (
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-user.jpg" alt="Admin" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
              </Button>
            ) : (
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Settings className="h-4 w-4" />
              </Button>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

