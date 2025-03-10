"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchBarProps {
  className?: string
}

export function SearchBar({ className = "" }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/product-list?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className={`relative flex items-center ${className}`}>
      <Input
        type="search"
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pr-10"
      />
      <Button type="submit" variant="ghost" size="icon" className="absolute right-0">
        <Search className="h-4 w-4" />
      </Button>
    </form>
  )
}

