"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CheckCircle, XCircle, AlertCircle, Edit, Ban, MessageSquare, FileText } from "lucide-react";
import { toast } from "sonner";

interface Agency {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  licenseNumber?: string;
  taxId?: string;
  website?: string;
  description?: string;
  status: "PENDING" | "VERIFIED" | "REJECTED" | "SUSPENDED";
  verificationStatus: "PENDING" | "VERIFIED" | "REJECTED";
  verificationNotes?: string;
  profilePicture?: string;
  coverImage?: string;
  rating?: number;
  totalReviews?: number;
  createdAt: string;
  updatedAt: string;
  _count?: {
    caregivers: number;
    jobPostings: number;
  };
}

interface VerificationPayload {
  status: "VERIFIED" | "REJECTED";
  notes: string;
  reason?: string;
}

export default function AgencyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const agencyId = (params?.id || '') as string;

  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [verificationNotes, setVerificationNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  // Fetch agency data
  const { data: agency, isLoading, error } = useQuery<Agency>({
    queryKey: ["agency", agencyId],
    queryFn: async () => {
      const response = await fetch(`/api/agencies/${agencyId}`);
      if (!response.ok) throw new Error("Failed to fetch agency");
      return response.json();
    },
  });

  // Verify agency mutation
  const verifyMutation = useMutation({
    mutationFn: async (payload: VerificationPayload) => {
      const response = await fetch(`/api/agencies/${agencyId}/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to verify agency");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agency", agencyId] });
      queryClient.invalidateQueries({ queryKey: ["agencies"] });
      toast.success("Agency status updated successfully");
      setVerifyDialogOpen(false);
      setRejectDialogOpen(false);
      setVerificationNotes("");
      setRejectionReason("");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update agency: ${error.message}`);
    },
  });

  const handleVerify = () => {
    verifyMutation.mutate({
      status: "VERIFIED",
      notes: verificationNotes,
    });
  };

  const handleReject = () => {
    verifyMutation.mutate({
      status: "REJECTED",
      notes: rejectionReason,
      reason: rejectionReason,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading agency details...</p>
        </div>
      </div>
    );
  }

  if (error || !agency) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error Loading Agency</h2>
          <p className="text-gray-600 mb-4">{error?.message || "Agency not found"}</p>
          <Button onClick={() => router.push("/admin/agencies")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Agencies
          </Button>
        </div>
      </div>
    );
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return "default";
      case "REJECTED":
        return "destructive";
      case "SUSPENDED":
        return "secondary";
      default:
        return "secondary";
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/admin/agencies")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{agency.name}</h1>
            <p className="text-gray-600">Agency Details</p>
          </div>
        </div>
        <Badge variant={getStatusBadgeVariant(agency.status)} className="text-sm px-4 py-2">
          {agency.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Agency Information Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={agency.profilePicture} alt={agency.name} />
                  <AvatarFallback>{agency.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-2xl">{agency.name}</CardTitle>
                  <CardDescription>{agency.email}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Phone Number</Label>
                  <p className="mt-1">{agency.phoneNumber || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">License Number</Label>
                  <p className="mt-1">{agency.licenseNumber || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Tax ID</Label>
                  <p className="mt-1">{agency.taxId || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Website</Label>
                  <p className="mt-1">
                    {agency.website ? (
                      <a href={agency.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {agency.website}
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-medium text-gray-500">Address</Label>
                <p className="mt-1">
                  {agency.address && agency.city && agency.state
                    ? `${agency.address}, ${agency.city}, ${agency.state} ${agency.zipCode || ""} ${agency.country || ""}`
                    : "No address provided"}
                </p>
              </div>

              {agency.description && (
                <>
                  <Separator />
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Description</Label>
                    <p className="mt-1 text-gray-700">{agency.description}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Tabs for additional information */}
          <Tabs defaultValue="documents" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="documents">
                <FileText className="mr-2 h-4 w-4" />
                Documents
              </TabsTrigger>
              <TabsTrigger value="activity">
                <MessageSquare className="mr-2 h-4 w-4" />
                Activity
              </TabsTrigger>
              <TabsTrigger value="notes">
                <Edit className="mr-2 h-4 w-4" />
                Notes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="documents" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Verification Documents</CardTitle>
                  <CardDescription>Business licenses and certifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      License Number: <span className="font-medium">{agency.licenseNumber || "Not provided"}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Tax ID: <span className="font-medium">{agency.taxId || "Not provided"}</span>
                    </p>
                    <p className="text-sm text-gray-500 mt-4">Additional documents should be stored and displayed here.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Agency activity log</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">No recent activity to display</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notes" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Admin Notes</CardTitle>
                  <CardDescription>Internal notes and verification details</CardDescription>
                </CardHeader>
                <CardContent>
                  {agency.verificationNotes ? (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-700">{agency.verificationNotes}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No notes available</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Caregivers</span>
                <span className="text-2xl font-bold">{agency._count?.caregivers || 0}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Job Postings</span>
                <span className="text-2xl font-bold">{agency._count?.jobPostings || 0}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Rating</span>
                <span className="text-2xl font-bold">{agency.rating?.toFixed(1) || "N/A"}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Reviews</span>
                <span className="text-2xl font-bold">{agency.totalReviews || 0}</span>
              </div>
            </CardContent>
          </Card>

          {/* Verification Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Verification Status</CardTitle>
              <CardDescription>Current verification state</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant={getStatusBadgeVariant(agency.verificationStatus)} className="text-sm">
                  {agency.verificationStatus}
                </Badge>
              </div>

              {agency.status === "PENDING" && (
                <div className="space-y-2">
                  <Button onClick={() => setVerifyDialogOpen(true)} className="w-full" variant="default">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Verify Agency
                  </Button>
                  <Button onClick={() => setRejectDialogOpen(true)} className="w-full" variant="destructive">
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject Agency
                  </Button>
                </div>
              )}

              {agency.status === "VERIFIED" && (
                <Button onClick={() => setRejectDialogOpen(true)} className="w-full" variant="outline">
                  <Ban className="mr-2 h-4 w-4" />
                  Suspend Agency
                </Button>
              )}

              <Separator />

              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span className="font-medium">{new Date(agency.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Updated:</span>
                  <span className="font-medium">{new Date(agency.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Verify Dialog */}
      <Dialog open={verifyDialogOpen} onOpenChange={setVerifyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify Agency</DialogTitle>
            <DialogDescription>
              Confirm that you want to verify this agency. Add any notes about the verification.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="verification-notes">Verification Notes</Label>
              <Textarea
                id="verification-notes"
                placeholder="Add any notes about this verification..."
                value={verificationNotes}
                onChange={(e) => setVerificationNotes(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setVerifyDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleVerify} disabled={verifyMutation.isPending}>
              {verifyMutation.isPending ? "Verifying..." : "Verify Agency"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Agency</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting this agency. This will be communicated to the agency.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rejection-reason">Rejection Reason *</Label>
              <Textarea
                id="rejection-reason"
                placeholder="Explain why this agency is being rejected..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!rejectionReason.trim() || verifyMutation.isPending}
            >
              {verifyMutation.isPending ? "Rejecting..." : "Reject Agency"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
