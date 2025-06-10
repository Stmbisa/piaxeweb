"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth/context"

interface BusinessData {
  businessName: string
  businessType: string
  description: string
  website: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  phone: string
  category: string
}

export function MerchantRegisterForm() {
  const { user, isBusiness, createBusinessAccount } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState<BusinessData>({
    businessName: "",
    businessType: "",
    description: "",
    website: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: ""
    },
    phone: "",
    category: ""
  })

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
    }
  }, [user, router])

  // Show message if already a business
  if (isBusiness) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Business Account Active</h3>
            <p className="text-muted-foreground mb-4">You already have a business account.</p>
            <Button asChild>
              <Link href="/business/dashboard">Go to Business Dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith("address.")) {
      const addressField = field.split(".")[1]
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await createBusinessAccount(formData)
      router.push("/business/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create business account")
    } finally {
      setIsLoading(false)
    }
  }

  const businessTypes = [
    "Retail",
    "Wholesale",
    "Services",
    "Manufacturing",
    "E-commerce",
    "Other",
    "Crypto",
    "Gambling"
  ]

  const categories = [
    "Food & Beverage",
    "Retail & Fashion",
    "Technology",
    "Professional Services",
    "Healthcare",
    "Education",
    "Entertainment",
    "Other"
  ]

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create Business Account</CardTitle>
        <CardDescription>
          Set up your business profile to start accepting payments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                type="text"
                placeholder="Enter your business name"
                value={formData.businessName}
                onChange={(e) => handleInputChange("businessName", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="businessType">Business Type</Label>
              <Select
                value={formData.businessType}
                onValueChange={(value) => handleInputChange("businessType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  {businessTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="phone">Business Phone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter business phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="website">Website (Optional)</Label>
              <Input
                id="website"
                type="url"
                placeholder="https://yourwebsite.com"
                value={formData.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="description">Business Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your business"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-4">
              <Label>Business Address</Label>

              <div>
                <Input
                  placeholder="Street Address"
                  value={formData.address.street}
                  onChange={(e) => handleInputChange("address.street", e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="City"
                  value={formData.address.city}
                  onChange={(e) => handleInputChange("address.city", e.target.value)}
                  required
                />
                <Input
                  placeholder="State/Province"
                  value={formData.address.state}
                  onChange={(e) => handleInputChange("address.state", e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="ZIP/Postal Code"
                  value={formData.address.zipCode}
                  onChange={(e) => handleInputChange("address.zipCode", e.target.value)}
                  required
                />
                <Input
                  placeholder="Country"
                  value={formData.address.country}
                  onChange={(e) => handleInputChange("address.country", e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Create Business Account"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
