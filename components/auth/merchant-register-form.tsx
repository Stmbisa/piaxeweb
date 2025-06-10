"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
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
      <div className="glass-card w-full max-w-2xl mx-auto animate-glass-appear">
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-foreground">Business Account Active</h3>
            <p className="text-muted-foreground mb-4">You already have a business account.</p>
            <Link href="/business/dashboard">
              <button className="glass-button-primary px-6 py-3">
                Go to Business Dashboard
              </button>
            </Link>
          </div>
        </div>
      </div>
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
    <div className="glass-card-enhanced w-full max-w-2xl mx-auto animate-glass-appear">
      <div className="text-center space-y-4 mb-8">
        <h1 className="text-2xl font-bold text-foreground">Create Business Account</h1>
        <p className="text-muted-foreground">
          Set up your business profile to start accepting payments
        </p>
      </div>
      <div className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="glass-card text-red-400 px-4 py-3"
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '12px'
              }}>
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                className="glass-input"
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
                <SelectTrigger className="glass-input">
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
                <SelectTrigger className="glass-input">
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
                className="glass-input"
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
                className="glass-input"
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
                className="glass-input"
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
                  className="glass-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="City"
                  value={formData.address.city}
                  onChange={(e) => handleInputChange("address.city", e.target.value)}
                  required
                  className="glass-input"
                />
                <Input
                  placeholder="State/Province"
                  value={formData.address.state}
                  onChange={(e) => handleInputChange("address.state", e.target.value)}
                  required
                  className="glass-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="ZIP/Postal Code"
                  value={formData.address.zipCode}
                  onChange={(e) => handleInputChange("address.zipCode", e.target.value)}
                  required
                  className="glass-input"
                />
                <Input
                  placeholder="Country"
                  value={formData.address.country}
                  onChange={(e) => handleInputChange("address.country", e.target.value)}
                  required
                  className="glass-input"
                />
              </div>
            </div>
          </div>

          <button type="submit" className="glass-button-primary w-full px-6 py-3" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Create Business Account"}
          </button>
        </form>
      </div>
    </div>
  )
}
