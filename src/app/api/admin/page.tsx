'use client';

import React, { useState, useEffect } from 'react';
import {
    Search,
    RefreshCw,
    MessageCircle,
    Calendar,
    Users,
    MapPin,
    Lock,
    DollarSign,
    CheckCircle2,
    Clock
} from 'lucide-react';

interface BookingRecord {
    id: string;
    reference_number: string;
    package_id: string;
    package_title: string;
    safari_date: string;
    adults: number;
    children: number;
    residency: string;
    pickup_point: string;
    full_name: string;
    email: string;
    phone: string;
    notes: string;
    safari_total_zar: number;
    deposit_zar: number;
    balance_zar: number;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    created_at: string;
}

export default function AdminPortal() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [pinInput, setPinInput] = useState('');
    const [pinError, setPinError] = useState(false);

    const [bookings, setBookings] = useState<BookingRecord[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);

    // 1. Check stored session on mount without triggering synchronous setState
    useEffect(() => {
        const storedPin = sessionStorage.getItem('safaric_admin_pin');
        if (storedPin) {
            const timer = setTimeout(() => {
                setPinInput(storedPin);
                setIsAuthenticated(true);
            }, 0);
            return () => clearTimeout(timer);
        }
    }, []);

    // 2. Fetch bookings asynchronously when authenticated or filters change
    useEffect(() => {
        if (!isAuthenticated) return;
        const pin = sessionStorage.getItem('safaric_admin_pin') || pinInput;
        if (!pin) return;

        let cancelled = false;

        const executeFetch = async () => {
            // Yield execution to avoid synchronous setState inside the effect frame
            await Promise.resolve();
            if (cancelled) return;

            setIsLoading(true);
            try {
                const url = `/api/admin/bookings?status=${filterStatus}&search=${encodeURIComponent(searchTerm)}`;
                const res = await fetch(url, {
                    headers: { 'x-admin-pin': pin },
                });

                if (cancelled) return;

                if (res.ok) {
                    const data = await res.json();
                    setBookings(data.bookings || []);
                    setPinError(false);
                } else if (res.status === 401) {
                    setIsAuthenticated(false);
                    setPinError(true);
                    sessionStorage.removeItem('safaric_admin_pin');
                }
            } catch (err) {
                console.error('Fetch bookings error:', err);
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        };

        executeFetch();

        return () => {
            cancelled = true;
        };
    }, [isAuthenticated, pinInput, filterStatus, searchTerm, refreshKey]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        sessionStorage.setItem('safaric_admin_pin', pinInput);
        setIsAuthenticated(true);
        setRefreshKey((prev) => prev + 1);
    };

    const updateStatus = async (id: string, newStatus: string) => {
        const pin = sessionStorage.getItem('safaric_admin_pin') || pinInput;
        try {
            const res = await fetch(`/api/admin/bookings/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-pin': pin,
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                setBookings((prev) =>
                    prev.map((b) => (b.id === id ? { ...b, status: newStatus as BookingRecord['status'] } : b))
                );
            }
        } catch (err) {
            console.error('Status update failed:', err);
        }
    };

    const openGuestWhatsApp = (booking: BookingRecord) => {
        const cleanPhone = booking.phone.replace(/[^0-9]/g, '');
        const message = `Hello ${booking.full_name}, this is SAFARIC Kruger Operations regarding your reservation (${booking.reference_number}) for the ${booking.package_title} on ${booking.safari_date}.`;
        window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#122216] flex items-center justify-center p-4">
                <form
                    onSubmit={handleLogin}
                    className="bg-[#1C3322] border border-[#C2933D]/40 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6 text-white"
                >
                    <div className="text-center space-y-2">
                        <div className="w-12 h-12 bg-[#122216] border border-[#C2933D]/50 rounded-2xl flex items-center justify-center mx-auto text-[#DEAE59]">
                            <Lock className="w-6 h-6" />
                        </div>
                        <h1 className="font-serif text-2xl font-bold">SAFARIC Operations Desk</h1>
                        <p className="text-xs text-stone-300">Enter authorization key to manage live bookings</p>
                    </div>

                    <div>
                        <input
                            type="password"
                            placeholder="Enter Operations PIN"
                            value={pinInput}
                            onChange={(e) => setPinInput(e.target.value)}
                            required
                            className="w-full bg-[#122216] border border-[#C2933D]/30 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C2933D]"
                        />
                        {pinError && (
                            <span className="text-xs text-rose-400 mt-1 block">Invalid PIN. Access denied.</span>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-[#C2933D] to-[#DEAE59] text-[#122216] font-bold py-3 rounded-xl text-xs uppercase tracking-wider hover:brightness-110 transition cursor-pointer"
                    >
                        Authenticate Desk
                    </button>
                </form>
            </div>
        );
    }

    const pendingCount = bookings.filter((b) => b.status === 'pending').length;
    const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;
    const totalDepositZAR = bookings.reduce((sum, b) => sum + Number(b.deposit_zar || 0), 0);

    return (
        <div className="min-h-screen bg-[#122216] text-stone-100 p-4 sm:p-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#C2933D]/20 pb-6">
                    <div>
                        <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#C2933D] block">
                            Internal Operations Portal
                        </span>
                        <h1 className="font-serif text-3xl font-bold text-white">
                            SAFARIC Reservation Dispatch
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setRefreshKey((prev) => prev + 1)}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1C3322] border border-[#C2933D]/30 text-xs font-semibold hover:border-[#C2933D] transition cursor-pointer"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                            <span>Refresh</span>
                        </button>
                        <button
                            onClick={() => {
                                sessionStorage.removeItem('safaric_admin_pin');
                                setIsAuthenticated(false);
                            }}
                            className="px-4 py-2 rounded-xl bg-stone-800 text-stone-400 hover:text-white text-xs font-semibold transition cursor-pointer"
                        >
                            Exit
                        </button>
                    </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-5 rounded-2xl bg-[#1C3322] border border-[#C2933D]/20">
                        <div className="flex items-center justify-between text-stone-400 text-xs mb-2">
                            <span>Total Inquiries</span>
                            <Calendar className="w-4 h-4 text-[#C2933D]" />
                        </div>
                        <div className="text-2xl font-bold font-serif text-white">{bookings.length}</div>
                    </div>

                    <div className="p-5 rounded-2xl bg-[#1C3322] border border-[#C2933D]/20">
                        <div className="flex items-center justify-between text-amber-400 text-xs mb-2">
                            <span>Awaiting Confirmation</span>
                            <Clock className="w-4 h-4" />
                        </div>
                        <div className="text-2xl font-bold font-serif text-amber-300">{pendingCount}</div>
                    </div>

                    <div className="p-5 rounded-2xl bg-[#1C3322] border border-[#C2933D]/20">
                        <div className="flex items-center justify-between text-emerald-400 text-xs mb-2">
                            <span>Confirmed Departures</span>
                            <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div className="text-2xl font-bold font-serif text-emerald-300">{confirmedCount}</div>
                    </div>

                    <div className="p-5 rounded-2xl bg-[#1C3322] border border-[#C2933D]/20">
                        <div className="flex items-center justify-between text-[#DEAE59] text-xs mb-2">
                            <span>Pending Deposits</span>
                            <DollarSign className="w-4 h-4" />
                        </div>
                        <div className="text-2xl font-bold font-serif text-[#DEAE59]">
                            R {totalDepositZAR.toLocaleString()}
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#1C3322] p-4 rounded-2xl border border-[#C2933D]/20">
                    <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
                        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((st) => (
                            <button
                                key={st}
                                onClick={() => setFilterStatus(st)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition whitespace-nowrap cursor-pointer ${
                                    filterStatus === st
                                        ? 'bg-[#C2933D] text-[#122216]'
                                        : 'bg-[#122216] text-stone-300 hover:text-white'
                                }`}
                            >
                                {st}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-72">
                        <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                        <input
                            type="text"
                            placeholder="Search by name, ref, or mobile..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#122216] border border-stone-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-[#C2933D]"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="bg-[#1C3322] rounded-2xl border border-[#C2933D]/20 overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-[#122216] text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-800">
                            <tr>
                                <th className="py-4 px-6">Reference & Date</th>
                                <th className="py-4 px-6">Guest Information</th>
                                <th className="py-4 px-6">Tour & Pickup</th>
                                <th className="py-4 px-6">Financials</th>
                                <th className="py-4 px-6">Status</th>
                                <th className="py-4 px-6 text-right">Dispatch Actions</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-800">
                            {bookings.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-stone-400">
                                        No safari reservations match the active filter criteria.
                                    </td>
                                </tr>
                            ) : (
                                bookings.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-[#162a1c] transition">
                                        <td className="py-4 px-6">
                                                <span className="font-mono font-bold text-[#DEAE59] block">
                                                    {booking.reference_number}
                                                </span>
                                            <div className="flex items-center gap-1 text-stone-300 mt-1">
                                                <Calendar className="w-3.5 h-3.5 text-[#C2933D]" />
                                                <span>{booking.safari_date}</span>
                                            </div>
                                        </td>

                                        <td className="py-4 px-6">
                                            <div className="font-semibold text-white text-sm">
                                                {booking.full_name}
                                            </div>
                                            <div className="text-stone-400 mt-0.5">{booking.phone}</div>
                                            <div className="text-[11px] text-stone-500">{booking.email}</div>
                                            <div className="text-[10px] text-[#C2933D] capitalize mt-0.5">
                                                {booking.residency}
                                            </div>
                                        </td>

                                        <td className="py-4 px-6">
                                            <div className="font-medium text-white">
                                                {booking.package_title}
                                            </div>
                                            <div className="flex items-center gap-1 text-stone-400 mt-1">
                                                <Users className="w-3 h-3 text-[#C2933D]" />
                                                <span>{booking.adults} Adults{booking.children ? `, ${booking.children} Kids` : ''}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-stone-400 mt-0.5">
                                                <MapPin className="w-3 h-3 text-[#C2933D]" />
                                                <span>{booking.pickup_point}</span>
                                            </div>
                                        </td>

                                        <td className="py-4 px-6">
                                            <div className="text-white font-semibold">
                                                Total: R {Number(booking.safari_total_zar).toLocaleString()}
                                            </div>
                                            <div className="text-[#DEAE59] font-medium mt-0.5">
                                                Deposit: R {Number(booking.deposit_zar).toLocaleString()}
                                            </div>
                                        </td>

                                        <td className="py-4 px-6">
                                            <select
                                                value={booking.status}
                                                onChange={(e) => updateStatus(booking.id, e.target.value)}
                                                className={`px-2.5 py-1 rounded-lg text-xs font-semibold focus:outline-none cursor-pointer border ${
                                                    booking.status === 'confirmed'
                                                        ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                                                        : booking.status === 'pending'
                                                            ? 'bg-amber-950 text-amber-300 border-amber-700'
                                                            : booking.status === 'completed'
                                                                ? 'bg-blue-950 text-blue-300 border-blue-700'
                                                                : 'bg-rose-950 text-rose-300 border-rose-700'
                                                }`}
                                            >
                                                <option value="pending" className="bg-[#122216] text-white">Pending</option>
                                                <option value="confirmed" className="bg-[#122216] text-white">Confirmed</option>
                                                <option value="completed" className="bg-[#122216] text-white">Completed</option>
                                                <option value="cancelled" className="bg-[#122216] text-white">Cancelled</option>
                                            </select>
                                        </td>

                                        <td className="py-4 px-6 text-right">
                                            <button
                                                onClick={() => openGuestWhatsApp(booking)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366] text-stone-950 font-bold text-xs hover:brightness-110 transition cursor-pointer"
                                                title="Message guest on WhatsApp"
                                            >
                                                <MessageCircle className="w-3.5 h-3.5" />
                                                <span>Reply</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}