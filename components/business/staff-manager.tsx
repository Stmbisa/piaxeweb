"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth/context"
import {
    Users,
    Plus,
    Search,
    Edit2,
    Trash2,
    Shield,
    User,
    Mail,
    Phone,
    Building2,
    Calendar,
    Clock,
    CheckCircle,
    XCircle
} from "lucide-react"

interface StaffMember {
    id: string
    name: string
    email: string
    phone: string
    role: 'manager' | 'cashier' | 'sales' | 'inventory' | 'admin'
    permissions: string[]
    status: 'active' | 'inactive'
    store_id?: string
    hire_date: string
    last_login?: string
}

interface StaffRole {
    id: string
    name: string
    description: string
    permissions: string[]
    color: string
}

const STAFF_ROLES: StaffRole[] = [
    {
        id: 'admin',
        name: 'Administrator',
        description: 'Full access to all business operations',
        permissions: ['all'],
        color: 'bg-purple-100 text-purple-700 border-purple-200'
    },
    {
        id: 'manager',
        name: 'Store Manager',
        description: 'Manage store operations and staff',
        permissions: ['manage_staff', 'view_reports', 'manage_inventory', 'process_orders'],
        color: 'bg-blue-100 text-blue-700 border-blue-200'
    },
    {
        id: 'cashier',
        name: 'Cashier',
        description: 'Process payments and handle transactions',
        permissions: ['process_payments', 'view_products', 'handle_returns'],
        color: 'bg-green-100 text-green-700 border-green-200'
    },
    {
        id: 'sales',
        name: 'Sales Associate',
        description: 'Assist customers and manage sales',
        permissions: ['view_products', 'assist_customers', 'create_orders'],
        color: 'bg-orange-100 text-orange-700 border-orange-200'
    },
    {
        id: 'inventory',
        name: 'Inventory Clerk',
        description: 'Manage stock and inventory',
        permissions: ['manage_inventory', 'update_stock', 'view_reports'],
        color: 'bg-yellow-100 text-yellow-700 border-yellow-200'
    }
]

export function StaffManager() {
    const [staffMembers, setStaffMembers] = useState<StaffMember[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [showAddForm, setShowAddForm] = useState(false)
    const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null)
    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        role: 'cashier' as StaffMember['role'],
        store_id: ''
    })

    const { user, token } = useAuth()
    const { toast } = useToast()

    useEffect(() => {
        loadStaffMembers()
    }, [])

    const loadStaffMembers = async () => {
        setLoading(true)
        try {
            // Mock data for now - replace with actual API call
            const mockStaff: StaffMember[] = [
                {
                    id: '1',
                    name: 'John Smith',
                    email: 'john@business.com',
                    phone: '+256701234567',
                    role: 'manager',
                    permissions: ['manage_staff', 'view_reports', 'manage_inventory', 'process_orders'],
                    status: 'active',
                    hire_date: '2024-01-15',
                    last_login: '2024-06-10T08:30:00Z'
                },
                {
                    id: '2',
                    name: 'Sarah Johnson',
                    email: 'sarah@business.com',
                    phone: '+256701234568',
                    role: 'cashier',
                    permissions: ['process_payments', 'view_products', 'handle_returns'],
                    status: 'active',
                    hire_date: '2024-02-01',
                    last_login: '2024-06-10T07:45:00Z'
                },
                {
                    id: '3',
                    name: 'Mike Wilson',
                    email: 'mike@business.com',
                    phone: '+256701234569',
                    role: 'inventory',
                    permissions: ['manage_inventory', 'update_stock', 'view_reports'],
                    status: 'active',
                    hire_date: '2024-03-10',
                    last_login: '2024-06-09T16:20:00Z'
                }
            ]
            setStaffMembers(mockStaff)
        } catch (error) {
            console.error('Error loading staff members:', error)
            toast({
                title: "Error",
                description: "Failed to load staff members",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleAddStaff = async () => {
        if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
            toast({
                title: "Error",
                description: "Please fill in all required fields",
                variant: "destructive",
            })
            return
        }

        try {
            const selectedRole = STAFF_ROLES.find(role => role.id === formData.role)
            const newStaff: StaffMember = {
                id: Date.now().toString(),
                name: formData.name.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim(),
                role: formData.role,
                permissions: selectedRole?.permissions || [],
                status: 'active',
                hire_date: new Date().toISOString().split('T')[0],
                store_id: formData.store_id || undefined
            }

            setStaffMembers(prev => [...prev, newStaff])
            setFormData({ name: '', email: '', phone: '', role: 'cashier', store_id: '' })
            setShowAddForm(false)

            toast({
                title: "Success",
                description: "Staff member added successfully",
            })
        } catch (error) {
            console.error('Error adding staff member:', error)
            toast({
                title: "Error",
                description: "Failed to add staff member",
                variant: "destructive",
            })
        }
    }

    const handleEditStaff = (staff: StaffMember) => {
        setEditingStaff(staff)
        setFormData({
            name: staff.name,
            email: staff.email,
            phone: staff.phone,
            role: staff.role,
            store_id: staff.store_id || ''
        })
    }

    const handleUpdateStaff = async () => {
        if (!editingStaff) return

        try {
            const selectedRole = STAFF_ROLES.find(role => role.id === formData.role)
            const updatedStaff: StaffMember = {
                ...editingStaff,
                name: formData.name.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim(),
                role: formData.role,
                permissions: selectedRole?.permissions || [],
                store_id: formData.store_id || undefined
            }

            setStaffMembers(prev => prev.map(staff =>
                staff.id === editingStaff.id ? updatedStaff : staff
            ))
            setEditingStaff(null)
            setFormData({ name: '', email: '', phone: '', role: 'cashier', store_id: '' })

            toast({
                title: "Success",
                description: "Staff member updated successfully",
            })
        } catch (error) {
            console.error('Error updating staff member:', error)
            toast({
                title: "Error",
                description: "Failed to update staff member",
                variant: "destructive",
            })
        }
    }

    const handleDeleteStaff = async (staffId: string) => {
        try {
            setStaffMembers(prev => prev.filter(staff => staff.id !== staffId))
            toast({
                title: "Success",
                description: "Staff member removed successfully",
            })
        } catch (error) {
            console.error('Error deleting staff member:', error)
            toast({
                title: "Error",
                description: "Failed to remove staff member",
                variant: "destructive",
            })
        }
    }

    const toggleStaffStatus = async (staffId: string) => {
        try {
            setStaffMembers(prev => prev.map(staff =>
                staff.id === staffId
                    ? { ...staff, status: staff.status === 'active' ? 'inactive' : 'active' }
                    : staff
            ))
            toast({
                title: "Success",
                description: "Staff status updated successfully",
            })
        } catch (error) {
            console.error('Error updating staff status:', error)
            toast({
                title: "Error",
                description: "Failed to update staff status",
                variant: "destructive",
            })
        }
    }

    const filteredStaff = staffMembers.filter(staff =>
        staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.role.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const getRoleInfo = (roleId: string) => {
        return STAFF_ROLES.find(role => role.id === roleId) || STAFF_ROLES[1]
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString()
    }

    const formatLastLogin = (dateString?: string) => {
        if (!dateString) return 'Never'
        const date = new Date(dateString)
        const now = new Date()
        const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

        if (diffHours < 1) return 'Just now'
        if (diffHours < 24) return `${diffHours} hours ago`
        return `${Math.floor(diffHours / 24)} days ago`
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-muted-foreground">Loading staff members...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Staff Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Staff</p>
                                <p className="text-2xl font-bold">{staffMembers.length}</p>
                            </div>
                            <Users className="w-8 h-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Active Staff</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {staffMembers.filter(staff => staff.status === 'active').length}
                                </p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Managers</p>
                                <p className="text-2xl font-bold text-purple-600">
                                    {staffMembers.filter(staff => staff.role === 'manager' || staff.role === 'admin').length}
                                </p>
                            </div>
                            <Shield className="w-8 h-8 text-purple-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Online Now</p>
                                <p className="text-2xl font-bold text-orange-600">
                                    {staffMembers.filter(staff => {
                                        if (!staff.last_login) return false
                                        const lastLogin = new Date(staff.last_login)
                                        const hoursSince = (Date.now() - lastLogin.getTime()) / (1000 * 60 * 60)
                                        return hoursSince < 1
                                    }).length}
                                </p>
                            </div>
                            <Clock className="w-8 h-8 text-orange-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Staff Actions */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                            placeholder="Search staff members..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 w-64"
                        />
                    </div>
                </div>
                <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
                    <DialogTrigger asChild>
                        <Button className="flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Add Staff Member
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Add New Staff Member</DialogTitle>
                            <DialogDescription>
                                Add a new team member to your business
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name *</Label>
                                <Input
                                    id="name"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="john@business.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number *</Label>
                                <Input
                                    id="phone"
                                    placeholder="+256701234567"
                                    value={formData.phone}
                                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="role">Role *</Label>
                                <Select value={formData.role} onValueChange={(value: StaffMember['role']) => setFormData(prev => ({ ...prev, role: value }))}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {STAFF_ROLES.map((role) => (
                                            <SelectItem key={role.id} value={role.id}>
                                                {role.name} - {role.description}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setShowAddForm(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleAddStaff}>
                                Add Staff Member
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Staff List */}
            <Card>
                <CardHeader>
                    <CardTitle>Staff Members</CardTitle>
                    <CardDescription>
                        Manage your team members and their roles
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {filteredStaff.map((staff) => {
                            const roleInfo = getRoleInfo(staff.role)
                            return (
                                <div key={staff.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                                            <User className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold">{staff.name}</h4>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Mail className="w-3 h-3" />
                                                    {staff.email}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Phone className="w-3 h-3" />
                                                    {staff.phone}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    Joined {formatDate(staff.hire_date)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <Badge className={roleInfo.color}>
                                                {roleInfo.name}
                                            </Badge>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Last login: {formatLastLogin(staff.last_login)}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Badge className={staff.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                                                {staff.status === 'active' ? (
                                                    <CheckCircle className="w-3 h-3 mr-1" />
                                                ) : (
                                                    <XCircle className="w-3 h-3 mr-1" />
                                                )}
                                                {staff.status}
                                            </Badge>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" size="sm" onClick={() => handleEditStaff(staff)}>
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => toggleStaffStatus(staff.id)}
                                            >
                                                {staff.status === 'active' ? (
                                                    <XCircle className="w-4 h-4 text-red-600" />
                                                ) : (
                                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                                )}
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-600 hover:text-red-700"
                                                onClick={() => handleDeleteStaff(staff.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}

                        {filteredStaff.length === 0 && (
                            <div className="text-center py-8">
                                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="font-semibold mb-2">No staff members found</h3>
                                <p className="text-muted-foreground">
                                    {searchTerm ? 'Try adjusting your search terms' : 'Add your first team member to get started'}
                                </p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Edit Staff Dialog */}
            <Dialog open={!!editingStaff} onOpenChange={(open) => !open && setEditingStaff(null)}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Edit Staff Member</DialogTitle>
                        <DialogDescription>
                            Update staff member information and role
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Full Name *</Label>
                            <Input
                                id="edit-name"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-email">Email Address *</Label>
                            <Input
                                id="edit-email"
                                type="email"
                                placeholder="john@business.com"
                                value={formData.email}
                                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-phone">Phone Number *</Label>
                            <Input
                                id="edit-phone"
                                placeholder="+256701234567"
                                value={formData.phone}
                                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-role">Role *</Label>
                            <Select value={formData.role} onValueChange={(value: StaffMember['role']) => setFormData(prev => ({ ...prev, role: value }))}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {STAFF_ROLES.map((role) => (
                                        <SelectItem key={role.id} value={role.id}>
                                            {role.name} - {role.description}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingStaff(null)}>
                            Cancel
                        </Button>
                        <Button onClick={handleUpdateStaff}>
                            Update Staff Member
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Roles & Permissions Info */}
            <Card>
                <CardHeader>
                    <CardTitle>Staff Roles & Permissions</CardTitle>
                    <CardDescription>
                        Understanding different roles and their access levels
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {STAFF_ROLES.map((role) => (
                            <div key={role.id} className="p-4 border rounded-lg">
                                <div className="flex items-center gap-2 mb-3">
                                    <Badge className={role.color}>{role.name}</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-3">{role.description}</p>
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-muted-foreground">Permissions:</p>
                                    {role.permissions.map((permission) => (
                                        <div key={permission} className="text-xs text-muted-foreground">
                                            • {permission.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
