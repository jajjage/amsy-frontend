"use client";

import { useAuthContext } from "@/context/AuthContext";
import { useRequestResellerUpgrade } from "@/hooks/useReseller";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface BecomeResellerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface BenefitCard {
  title: string;
  description: string;
}

const BENEFITS: BenefitCard[] = [
  {
    title: "Massive Discounts",
    description: "Get wholesale pricing on bulk purchases",
  },
  {
    title: "Bulk Tools",
    description: "Access batch processing and automation",
  },
  {
    title: "API Access",
    description: "Integrate with your own systems",
  },
  {
    title: "Priority Support",
    description: "Dedicated support team for your business",
  },
];

export const BecomeResellerModal: React.FC<BecomeResellerModalProps> = ({
  open,
  onOpenChange,
}) => {
  const { user } = useAuthContext();
  const { mutate: submitRequest, isPending } = useRequestResellerUpgrade();
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      return;
    }

    submitRequest(message, {
      onSuccess: () => {
        setIsSuccess(true);
      },
    });
  };

  const handleGotIt = () => {
    setMessage("");
    setIsSuccess(false);
    onOpenChange(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setMessage("");
      setIsSuccess(false);
    }
    onOpenChange(newOpen);
  };

  const isSubmitDisabled = !message.trim() || isPending;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl">
        {!isSuccess ? (
          <>
            <DialogHeader>
              <DialogTitle>Unlock Exclusive Wholesale Rates</DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Benefits Grid */}
              <div className="grid grid-cols-2 gap-4">
                {BENEFITS.map((benefit) => (
                  <div
                    key={benefit.title}
                    className="p-4 border rounded-lg bg-slate-50"
                  >
                    <h3 className="font-semibold text-sm mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-xs text-slate-600">
                      {benefit.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* User Information */}
              <div className="border-t pt-4">
                <h3 className="font-semibold text-sm mb-3">Your Information</h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-slate-600">Name:</span>{" "}
                    <span className="font-medium">{user?.fullName}</span>
                  </p>
                  <p>
                    <span className="text-slate-600">Email:</span>{" "}
                    <span className="font-medium">{user?.email}</span>
                  </p>
                  <p>
                    <span className="text-slate-600">Phone:</span>{" "}
                    <span className="font-medium">{user?.phoneNumber}</span>
                  </p>
                </div>
              </div>

              {/* Message Textarea */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-semibold mb-2 block">
                    Tell us about your business
                  </label>
                  <Textarea
                    placeholder="I run a cyber cafe with 50+ computers and want to resell topup services to my customers..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitDisabled}
                  className="w-full"
                >
                  {isPending ? "Submitting..." : "Submit Application"}
                </Button>
              </form>
            </div>
          </>
        ) : (
          // Success State
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold">Application Submitted!</h2>
              <p className="text-slate-600 text-sm">
                We will review your request and contact you shortly.
              </p>
            </div>
            <Button onClick={handleGotIt} className="w-full mt-4">
              Got it
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
