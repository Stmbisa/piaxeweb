"use client";

import React, { useMemo, useState } from "react";
import { Copy, MapPin, Clock, Handshake, KeyRound, PackageCheck, RotateCcw, Star, ListOrdered, Users2 } from "lucide-react";
import UgxOnlyCurrencySelector from "@/components/common/UgxOnlyCurrencySelector";

type Term = {
    type: string;
    data: Record<string, any>;
};

function ToggleRow({
    label,
    description,
    enabled,
    onToggle,
    icon,
}: {
    label: string;
    description?: string;
    enabled: boolean;
    onToggle: (v: boolean) => void;
    icon?: React.ReactNode;
}) {
    return (
        <div className="glass-card p-4 rounded-xl flex items-start gap-3">
            <div className="glass-icon-button">{icon}</div>
            <div className="flex-1">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h4 className="font-semibold text-sm">{label}</h4>
                        {description ? (
                            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
                        ) : null}
                    </div>
                    <button
                        type="button"
                        onClick={() => onToggle(!enabled)}
                        className={`text-[11px] px-3 py-1.5 rounded-full ${enabled ? "glass-button-primary" : "glass-button-secondary"
                            }`}
                    >
                        {enabled ? "Enabled" : "Enable"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export function EscrowSimulation() {
    // Core inputs
    const [receiverId, setReceiverId] = useState("096b723a-45c5-4957-94d7-747835136265");
    const [amount, setAmount] = useState("5000.00");
    const [currency, setCurrency] = useState("UGX");
    const [paymentMethod, setPaymentMethod] = useState("mtn");

    // Terms toggles + inputs
    const [locationOn, setLocationOn] = useState(false);
    const [latitude, setLatitude] = useState<string>("");
    const [longitude, setLongitude] = useState<string>("");
    const [radiusMeters, setRadiusMeters] = useState<string>("");

    const [timeOn, setTimeOn] = useState(false);
    const [deadline, setDeadline] = useState<string>("");

    const [meetingOn, setMeetingOn] = useState(false);
    const [meetingParticipants, setMeetingParticipants] = useState<string>(""); // comma-separated user ids

    const [agreementOn, setAgreementOn] = useState(false);
    const [agreementThreshold, setAgreementThreshold] = useState<number>(2);

    const [passwordOn, setPasswordOn] = useState(false);
    const [password, setPassword] = useState<string>("");

    const [deliveryOn, setDeliveryOn] = useState(false);
    const [deliveryMethod, setDeliveryMethod] = useState("confirmation");
    const [deliveryDeadline, setDeliveryDeadline] = useState<string>("");

    const [returnOn, setReturnOn] = useState(false);
    const [returnDays, setReturnDays] = useState<number>(7);

    const [qualityOn, setQualityOn] = useState(false);
    const [ratingThreshold, setRatingThreshold] = useState<number>(4);

    const [sequentialOn, setSequentialOn] = useState(false);
    const [sequentialOrder, setSequentialOrder] = useState<string>(""); // comma-separated user ids

    const [multipartyOn, setMultipartyOn] = useState(false);
    const [multipartyParticipants, setMultipartyParticipants] = useState<string>("");

    const terms: Term[] = useMemo(() => {
        const t: Term[] = [];
        if (locationOn) {
            t.push({
                type: "geo_verification",
                data: {
                    latitude: latitude ? parseFloat(latitude) : undefined,
                    longitude: longitude ? parseFloat(longitude) : undefined,
                    radius_meters: radiusMeters ? parseInt(radiusMeters) : undefined,
                },
            });
        }
        if (timeOn) {
            t.push({ type: "time_lock", data: { release_after: deadline || undefined } });
        }
        if (meetingOn) {
            t.push({ type: "meeting_confirmation", data: { participants: meetingParticipants.split(",").map((s) => s.trim()).filter(Boolean) } });
        }
        if (agreementOn) {
            t.push({ type: "multi_party_approval_threshold", data: { required: agreementThreshold } });
        }
        if (passwordOn) {
            t.push({ type: "password_confirmation", data: { secret_hint: password ? "provided" : undefined } });
        }
        if (deliveryOn) {
            t.push({ type: "delivery_confirmation", data: { confirmation_method: deliveryMethod, confirmation_deadline: deliveryDeadline || undefined } });
        }
        if (returnOn) {
            t.push({ type: "return_period", data: { days: returnDays } });
        }
        if (qualityOn) {
            t.push({ type: "rating_threshold", data: { minimum_rating: ratingThreshold } });
        }
        if (sequentialOn) {
            t.push({ type: "sequential_approvals", data: { order: sequentialOrder.split(",").map((s) => s.trim()).filter(Boolean) } });
        }
        if (multipartyOn) {
            t.push({ type: "multi_party_all", data: { participants: multipartyParticipants.split(",").map((s) => s.trim()).filter(Boolean) } });
        }
        return t;
    }, [locationOn, latitude, longitude, radiusMeters, timeOn, deadline, meetingOn, meetingParticipants, agreementOn, agreementThreshold, passwordOn, password, deliveryOn, deliveryMethod, deliveryDeadline, returnOn, returnDays, qualityOn, ratingThreshold, sequentialOn, sequentialOrder, multipartyOn, multipartyParticipants]);

    const requestBody = useMemo(() => {
        return {
            receiver_id: receiverId,
            amount,
            currency_code: currency,
            payment_method: paymentMethod,
            terms: terms.filter(Boolean),
            user_info: {
                email: "",
                phone_number: "",
                otp: "",
                device_info: { device_id: "web_demo", platform: "web", os_version: "" },
                ip_address: "",
            },
        };
    }, [receiverId, amount, currency, paymentMethod, terms]);

    const curl = useMemo(() => {
        return `curl --request POST \\\n  --url https://api.gopiaxis.com/escrows/ \\\n  --header 'Authorization: Bearer <ACCESS_TOKEN>' \\\n  --header 'api-key: <YOUR_PUBLIC_API_KEY>' \\\n  --header 'content-type: application/json' \\\n  --data '${JSON.stringify(requestBody, null, 2)}'`;
    }, [requestBody]);

    const [copied, setCopied] = useState(false);
    const copy = async () => {
        try {
            await navigator.clipboard.writeText(curl);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch { }
    };

    return (
        <section className="container mx-auto px-4 py-10" id="escrow-sim">
            <div className="glass-card-primary rounded-2xl p-6 md:p-10 animate-glass-appear">
                <h2 className="text-3xl font-bold mb-2 text-primary-foreground">Escrow Simulation</h2>
                <p className="text-primary-foreground/80 mb-6 text-sm">Choose conditions and preview the API body you would send to create an escrow.</p>

                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Builder */}
                    <div className="space-y-4">
                        <div className="glass-card p-4 rounded-xl">
                            <h3 className="text-sm font-semibold mb-3">Parties & Payment</h3>
                            <div className="grid sm:grid-cols-2 gap-3 text-xs">
                                <label className="flex flex-col gap-1">
                                    <span>Receiver ID</span>
                                    <input value={receiverId} onChange={(e) => setReceiverId(e.target.value)} className="glass-input px-3 py-2 rounded-md" placeholder="UUID" />
                                </label>
                                <label className="flex flex-col gap-1">
                                    <span>Amount</span>
                                    <input value={amount} onChange={(e) => setAmount(e.target.value)} className="glass-input px-3 py-2 rounded-md" placeholder="5000.00" />
                                </label>
                                <div className="flex flex-col gap-1">
                                    <UgxOnlyCurrencySelector
                                        title="Currency"
                                        currencies={[
                                            { code: "UGX", name: "Ugandan Shilling" },
                                            { code: "USD", name: "US Dollar" },
                                            { code: "EUR", name: "Euro" },
                                            { code: "GBP", name: "British Pound" },
                                        ]}
                                        value={currency}
                                        onChange={setCurrency}
                                        className="text-primary-foreground"
                                    />
                                </div>
                                <label className="flex flex-col gap-1">
                                    <span>Payment Method</span>
                                    <input value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="glass-input px-3 py-2 rounded-md" placeholder="mtn" />
                                </label>
                            </div>
                        </div>

                        <ToggleRow label="Location (Geo)" description="Verify presence within a radius" enabled={locationOn} onToggle={setLocationOn} icon={<MapPin className="w-4 h-4 text-primary" />} />
                        {locationOn && (
                            <div className="grid grid-cols-3 gap-3 text-xs">
                                <input className="glass-input px-3 py-2 rounded-md" placeholder="Latitude" value={latitude} onChange={(e) => setLatitude(e.target.value)} />
                                <input className="glass-input px-3 py-2 rounded-md" placeholder="Longitude" value={longitude} onChange={(e) => setLongitude(e.target.value)} />
                                <input className="glass-input px-3 py-2 rounded-md" placeholder="Radius (m)" value={radiusMeters} onChange={(e) => setRadiusMeters(e.target.value)} />
                            </div>
                        )}

                        <ToggleRow label="Time Lock" description="Release after a deadline" enabled={timeOn} onToggle={setTimeOn} icon={<Clock className="w-4 h-4 text-primary" />} />
                        {timeOn && (
                            <input type="datetime-local" className="glass-input px-3 py-2 rounded-md text-xs" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
                        )}

                        <ToggleRow label="Meeting Term" description="Require specified people to meet" enabled={meetingOn} onToggle={setMeetingOn} icon={<Handshake className="w-4 h-4 text-primary" />} />
                        {meetingOn && (
                            <input className="glass-input px-3 py-2 rounded-md text-xs" placeholder="user1,user2" value={meetingParticipants} onChange={(e) => setMeetingParticipants(e.target.value)} />
                        )}

                        <ToggleRow label="Agreement Threshold" description="Number of approvals required" enabled={agreementOn} onToggle={setAgreementOn} icon={<Users2 className="w-4 h-4 text-primary" />} />
                        {agreementOn && (
                            <input type="number" min={1} className="glass-input px-3 py-2 rounded-md text-xs" value={agreementThreshold} onChange={(e) => setAgreementThreshold(parseInt(e.target.value || "0"))} />
                        )}

                        <ToggleRow label="Password Term" description="Provide a shared secret" enabled={passwordOn} onToggle={setPasswordOn} icon={<KeyRound className="w-4 h-4 text-primary" />} />
                        {passwordOn && (
                            <input className="glass-input px-3 py-2 rounded-md text-xs" placeholder="secret" value={password} onChange={(e) => setPassword(e.target.value)} />
                        )}

                        <ToggleRow label="Delivery Confirmation" description="Require delivery confirmation" enabled={deliveryOn} onToggle={setDeliveryOn} icon={<PackageCheck className="w-4 h-4 text-primary" />} />
                        {deliveryOn && (
                            <div className="grid grid-cols-2 gap-3 text-xs">
                                <select className="glass-input px-3 py-2 rounded-md" value={deliveryMethod} onChange={(e) => setDeliveryMethod(e.target.value)}>
                                    <option value="confirmation">confirmation</option>
                                    <option value="scan">scan</option>
                                </select>
                                <input type="datetime-local" className="glass-input px-3 py-2 rounded-md" value={deliveryDeadline} onChange={(e) => setDeliveryDeadline(e.target.value)} />
                            </div>
                        )}

                        <ToggleRow label="Return Period" description="Return within N days or release" enabled={returnOn} onToggle={setReturnOn} icon={<RotateCcw className="w-4 h-4 text-primary" />} />
                        {returnOn && (
                            <input type="number" min={1} className="glass-input px-3 py-2 rounded-md text-xs" value={returnDays} onChange={(e) => setReturnDays(parseInt(e.target.value || "0"))} />
                        )}

                        <ToggleRow label="Product Quality" description="Minimum rating threshold" enabled={qualityOn} onToggle={setQualityOn} icon={<Star className="w-4 h-4 text-primary" />} />
                        {qualityOn && (
                            <input type="number" min={1} max={5} className="glass-input px-3 py-2 rounded-md text-xs" value={ratingThreshold} onChange={(e) => setRatingThreshold(parseInt(e.target.value || "0"))} />
                        )}

                        <ToggleRow label="Sequential Steps" description="Approvals in strict order" enabled={sequentialOn} onToggle={setSequentialOn} icon={<ListOrdered className="w-4 h-4 text-primary" />} />
                        {sequentialOn && (
                            <input className="glass-input px-3 py-2 rounded-md text-xs" placeholder="userA,userB,userC" value={sequentialOrder} onChange={(e) => setSequentialOrder(e.target.value)} />
                        )}

                        <ToggleRow label="Multiparty (All)" description="All participants must approve" enabled={multipartyOn} onToggle={setMultipartyOn} icon={<Users2 className="w-4 h-4 text-primary" />} />
                        {multipartyOn && (
                            <input className="glass-input px-3 py-2 rounded-md text-xs" placeholder="user1,user2,user3" value={multipartyParticipants} onChange={(e) => setMultipartyParticipants(e.target.value)} />
                        )}
                    </div>

                    {/* Preview */}
                    <div className="flex flex-col gap-4">
                        <div className="glass-card p-4 rounded-xl">
                            <h3 className="text-sm font-semibold mb-3">Preview Request Body</h3>
                            <pre className="text-xs whitespace-pre-wrap font-mono leading-relaxed bg-black/30 p-3 rounded-md border border-white/10">{JSON.stringify(requestBody, null, 2)}</pre>
                        </div>
                        <div className="glass-card p-4 rounded-xl">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-semibold">Example cURL</h3>
                                <button onClick={copy} className="glass-icon-button px-3 py-1.5 rounded-full text-[11px] inline-flex items-center gap-2">
                                    <Copy className="w-4 h-4" /> {copied ? "Copied" : "Copy"}
                                </button>
                            </div>
                            <pre className="text-xs whitespace-pre-wrap font-mono leading-relaxed bg-black/30 p-3 rounded-md border border-white/10">{curl}</pre>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
