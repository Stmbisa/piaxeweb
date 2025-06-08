import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Scan, ShoppingCart, CreditCard } from 'lucide-react'

export function BarcodePaymentDemo() {
    return (
        <section className="py-16 bg-gradient-to-br from-background via-purple-50/20 to-blue-50/30">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">POS-Free Store Payments</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Shop and pay in physical stores without traditional POS systems. Just scan, add to cart, and checkout.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                    {/* Step 1: Scan */}
                    <Card className="text-center">
                        <CardHeader>
                            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                <Scan className="w-8 h-8 text-primary" />
                            </div>
                            <CardTitle className="text-xl">Scan Product</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Use your phone to scan the barcode on any product in the store
                            </p>
                        </CardContent>
                    </Card>

                    {/* Step 2: Add to Cart */}
                    <Card className="text-center">
                        <CardHeader>
                            <div className="mx-auto w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                                <ShoppingCart className="w-8 h-8 text-secondary" />
                            </div>
                            <CardTitle className="text-xl">Add to Cart</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Review product details and add items to your digital cart
                            </p>
                        </CardContent>
                    </Card>

                    {/* Step 3: Checkout */}
                    <Card className="text-center">
                        <CardHeader>
                            <div className="mx-auto w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                                <CreditCard className="w-8 h-8 text-green-600" />
                            </div>
                            <CardTitle className="text-xl">Secure Checkout</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Complete payment securely through Piaxe's escrow system
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}
