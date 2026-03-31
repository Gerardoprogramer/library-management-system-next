'use client';

import { useEffect, useState } from "react";
import { CheckCircle, ArrowLeft, Sparkles, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePaymentDetails } from "@/hooks/queries/usePaymentDetails";
import { useSearchParams } from "next/navigation";
import { formatDate } from "@/lib/date-utils";


export default function PaymentSuccessPage() {
 return (
  <h1>Payment Successful</h1>
 )
}