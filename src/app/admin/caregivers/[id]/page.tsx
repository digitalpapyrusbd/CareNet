"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Ban,
  MessageSquare,
  FileText,
} from "lucide-react";
import { toast } from "sonner";

interface Caregiver {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  bio?: string;
  experience?: number;
  hourlyRate?: number;
  availability?: string;
  languages?: string[];
  skills?: string[];
  certifications?: string[];
  education?: string;
  backgroundCheckStatus?: string;
  backgroundCheckDate?: string;
  status: "PENDING" | "VERIFIED" | "REJECTED" | "SUSPENDED";
  verificationStatus: "PENDING" | "VERIFIED" | "REJECTED";
  verificationNotes?: string;
  profilePicture?: string;
  rating?: number;
  totalReviews?: number;
  completedJobs?: number;
  createdAt: string;
  updatedAt: string;
  agency?: {
    id: string;
    name: string;
  };
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  client: {
    firstName: string;
    lastName: string;
  };
}

interface VerificationPayload {
  status: "VERIFIED" | "REJECTED";
  notes: string;
  reason?: string;
}

export default function CaregiverDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const caregiverId = (params?.id || "") as string;

  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [verificationNotes, setVerificationNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  // Fetch caregiver data
  const {
    data: caregiver,
    isLoading,
    error,
  } = useQuery<Caregiver>({
    queryKey: ["caregiver", caregiverId],
    queryFn: async () => {
      // #region agent log
      fetch(
        "http://127.0.0.1:7242/ingest/b1fa42f1-6cf1-4fba-89a5-28a421cba99c",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            location: "caregivers/[id]/page.tsx:88",
            message: "Starting caregiver fetch",
            data: { caregiverId, endpoint: `/api/caregivers/${caregiverId}` },
            timestamp: Date.now(),
            sessionId: "debug-session",
            runId: "run1",
            hypothesisId: "A",
          }),
        },
      ).catch(() => {});
      // #endregion

      const response = await fetch(`/api/caregivers/${caregiverId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      // #region agent log
      fetch(
        "http://127.0.0.1:7242/ingest/b1fa42f1-6cf1-4fba-89a5-28a421cba99c",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            location: "caregivers/[id]/page.tsx:95",
            message: "API response received",
            data: {
              status: response.status,
              ok: response.ok,
              hasAuthToken: !!localStorage.getItem("authToken"),
            },
            timestamp: Date.now(),
            sessionId: "debug-session",
            runId: "run1",
            hypothesisId: "B",
          }),
        },
      ).catch(() => {});
      // #endregion

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        // #region agent log
        fetch(
          "http://127.0.0.1:7242/ingest/b1fa42f1-6cf1-4fba-89a5-28a421cba99c",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              location: "caregivers/[id]/page.tsx:100",
              message: "API error response",
              data: { status: response.status, errorData },
              timestamp: Date.now(),
              sessionId: "debug-session",
              runId: "run1",
              hypothesisId: "C",
            }),
          },
        ).catch(() => {});
        // #endregion
        throw new Error(errorData.error || "Failed to fetch caregiver");
      }

      const result = await response.json();
      // #region agent log
      fetch(
        "http://127.0.0.1:7242/ingest/b1fa42f1-6cf1-4fba-89a5-28a421cba99c",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            location: "caregivers/[id]/page.tsx:107",
            message: "Parsed response",
            data: {
              hasData: !!result.data,
              hasSuccess: result.success,
              caregiverId: result.data?.id,
            },
            timestamp: Date.now(),
            sessionId: "debug-session",
            runId: "run1",
            hypothesisId: "D",
          }),
        },
      ).catch(() => {});
      // #endregion

      return result.data;
    },
  });

  // Fetch reviews
  const { data: reviews = [] } = useQuery<Review[]>({
    queryKey: ["feedbacks", caregiverId],
    queryFn: async () => {
      const response = await fetch(`/api/feedbacks?caregiverId=${caregiverId}`);
      if (!response.ok) return [];
      return response.json();
    },
    enabled: !!caregiverId,
  });

  // Verify caregiver mutation
  const verifyMutation = useMutation({
    mutationFn: async (payload: VerificationPayload) => {
      const response = await fetch(`/api/caregivers/${caregiverId}/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to verify caregiver");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["caregiver", caregiverId] });
      queryClient.invalidateQueries({ queryKey: ["caregivers"] });
      toast.success("Caregiver status updated successfully");
      setVerifyDialogOpen(false);
      setRejectDialogOpen(false);
      setVerificationNotes("");
      setRejectionReason("");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update caregiver: ${error.message}`);
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
          <p className="mt-4 text-gray-600">Loading caregiver details...</p>
        </div>
      </div>
    );
  }

  if (error || !caregiver) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">
            Error Loading Caregiver
          </h2>
          <p className="text-gray-600 mb-4">
            {error?.message || "Caregiver not found"}
          </p>
          <Button onClick={() => router.push("/admin/caregivers")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Caregivers
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

  const fullName = `${caregiver.firstName} ${caregiver.lastName}`;

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/admin/caregivers")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{fullName}</h1>
            <p className="text-gray-600">Caregiver Profile</p>
          </div>
        </div>
        <Badge
          variant={getStatusBadgeVariant(caregiver.status)}
          className="text-sm px-4 py-2"
        >
          {caregiver.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Information Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={caregiver.profilePicture} alt={fullName} />
                  <AvatarFallback>
                    {caregiver.firstName.charAt(0)}
                    {caregiver.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-2xl">{fullName}</CardTitle>
                  <CardDescription>{caregiver.email}</CardDescription>
                  {caregiver.agency && (
                    <p className="text-sm text-gray-600 mt-1">
                      Agency: {caregiver.agency.name}
                    </p>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Phone Number
                  </Label>
                  <p className="mt-1">{caregiver.phoneNumber || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Date of Birth
                  </Label>
                  <p className="mt-1">
                    {caregiver.dateOfBirth
                      ? new Date(caregiver.dateOfBirth).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Gender
                  </Label>
                  <p className="mt-1">{caregiver.gender || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Experience
                  </Label>
                  <p className="mt-1">
                    {caregiver.experience
                      ? `${caregiver.experience} years`
                      : "N/A"}
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Address
                </Label>
                <p className="mt-1">
                  {caregiver.address && caregiver.city && caregiver.state
                    ? `${caregiver.address}, ${caregiver.city}, ${caregiver.state} ${caregiver.zipCode || ""} ${caregiver.country || ""}`
                    : "No address provided"}
                </p>
              </div>

              {caregiver.bio && (
                <>
                  <Separator />
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Bio
                    </Label>
                    <p className="mt-1 text-gray-700">{caregiver.bio}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Professional Details */}
          <Card>
            <CardHeader>
              <CardTitle>Professional Details</CardTitle>
              <CardDescription>
                Skills, certifications, and qualifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Hourly Rate
                  </Label>
                  <p className="mt-1 text-lg font-semibold">
                    {caregiver.hourlyRate
                      ? `$${caregiver.hourlyRate}/hr`
                      : "Not set"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Availability
                  </Label>
                  <p className="mt-1">
                    {caregiver.availability || "Not specified"}
                  </p>
                </div>
              </div>

              <Separator />

              {caregiver.languages && caregiver.languages.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Languages
                  </Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {caregiver.languages.map((lang: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {caregiver.skills && caregiver.skills.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Skills
                  </Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {caregiver.skills.map((skill: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {caregiver.certifications &&
                caregiver.certifications.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Certifications
                    </Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {caregiver.certifications.map(
                        (cert: string, index: number) => (
                          <Badge key={index} variant="default">
                            {cert}
                          </Badge>
                        ),
                      )}
                    </div>
                  </div>
                )}

              {caregiver.education && (
                <>
                  <Separator />
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Education
                    </Label>
                    <p className="mt-1">{caregiver.education}</p>
                  </div>
                </>
              )}

              {caregiver.backgroundCheckStatus && (
                <>
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Background Check
                      </Label>
                      <p className="mt-1">
                        <Badge
                          variant={
                            caregiver.backgroundCheckStatus === "PASSED"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {caregiver.backgroundCheckStatus}
                        </Badge>
                      </p>
                    </div>
                    {caregiver.backgroundCheckDate && (
                      <div>
                        <Label className="text-sm font-medium text-gray-500">
                          Check Date
                        </Label>
                        <p className="mt-1">
                          {new Date(
                            caregiver.backgroundCheckDate,
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Tabs for additional information */}
          <Tabs defaultValue="reviews" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="reviews">
                <MessageSquare className="mr-2 h-4 w-4" />
                Reviews ({reviews.length})
              </TabsTrigger>
              <TabsTrigger value="documents">
                <FileText className="mr-2 h-4 w-4" />
                Documents
              </TabsTrigger>
              <TabsTrigger value="notes">
                <Edit className="mr-2 h-4 w-4" />
                Notes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="reviews" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Client Reviews</CardTitle>
                  <CardDescription>
                    Feedback from previous clients
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {reviews.length > 0 ? (
                    <div className="space-y-4">
                      {reviews.map((review: Review) => (
                        <div
                          key={review.id}
                          className="border-b last:border-b-0 pb-4 last:pb-0"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>
                                  {review.client.firstName.charAt(0)}
                                  {review.client.lastName.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm">
                                  {review.client.firstName}{" "}
                                  {review.client.lastName}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {new Date(
                                    review.createdAt,
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-yellow-500">★</span>
                              <span className="font-semibold">
                                {review.rating.toFixed(1)}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-700">
                            {review.comment}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No reviews yet</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Documents & Certifications</CardTitle>
                  <CardDescription>
                    Uploaded documents and verification files
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      Background Check:{" "}
                      <span className="font-medium">
                        {caregiver.backgroundCheckStatus || "Pending"}
                      </span>
                    </p>
                    {caregiver.certifications &&
                      caregiver.certifications.length > 0 && (
                        <div>
                          <p className="text-sm text-gray-600">
                            Certifications:
                          </p>
                          <ul className="list-disc list-inside mt-1">
                            {caregiver.certifications.map(
                              (cert: string, index: number) => (
                                <li
                                  key={index}
                                  className="text-sm text-gray-700"
                                >
                                  {cert}
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      )}
                    <p className="text-sm text-gray-500 mt-4">
                      Document files should be stored and displayed here.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notes" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Admin Notes</CardTitle>
                  <CardDescription>
                    Internal notes and verification details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {caregiver.verificationNotes ? (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-700">
                        {caregiver.verificationNotes}
                      </p>
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
                <span className="text-sm text-gray-600">Rating</span>
                <div className="flex items-center gap-1">
                  <span className="text-2xl font-bold">
                    {caregiver.rating?.toFixed(1) || "N/A"}
                  </span>
                  <span className="text-yellow-500">★</span>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Reviews</span>
                <span className="text-2xl font-bold">
                  {caregiver.totalReviews || 0}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Completed Jobs</span>
                <span className="text-2xl font-bold">
                  {caregiver.completedJobs || 0}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Hourly Rate</span>
                <span className="text-2xl font-bold">
                  ${caregiver.hourlyRate || 0}
                </span>
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
                <Badge
                  variant={getStatusBadgeVariant(caregiver.verificationStatus)}
                  className="text-sm"
                >
                  {caregiver.verificationStatus}
                </Badge>
              </div>

              {caregiver.status === "PENDING" && (
                <div className="space-y-2">
                  <Button
                    onClick={() => setVerifyDialogOpen(true)}
                    className="w-full"
                    variant="default"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Verify Caregiver
                  </Button>
                  <Button
                    onClick={() => setRejectDialogOpen(true)}
                    className="w-full"
                    variant="destructive"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject Caregiver
                  </Button>
                </div>
              )}

              {caregiver.status === "VERIFIED" && (
                <Button
                  onClick={() => setRejectDialogOpen(true)}
                  className="w-full"
                  variant="outline"
                >
                  <Ban className="mr-2 h-4 w-4" />
                  Suspend Caregiver
                </Button>
              )}

              <Separator />

              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span className="font-medium">
                    {new Date(caregiver.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Updated:</span>
                  <span className="font-medium">
                    {new Date(caregiver.updatedAt).toLocaleDateString()}
                  </span>
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
            <DialogTitle>Verify Caregiver</DialogTitle>
            <DialogDescription>
              Confirm that you want to verify this caregiver. Add any notes
              about the verification.
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
            <Button
              variant="outline"
              onClick={() => setVerifyDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleVerify} disabled={verifyMutation.isPending}>
              {verifyMutation.isPending ? "Verifying..." : "Verify Caregiver"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Caregiver</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting this caregiver. This will be
              communicated to them.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rejection-reason">Rejection Reason *</Label>
              <Textarea
                id="rejection-reason"
                placeholder="Explain why this caregiver is being rejected..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!rejectionReason.trim() || verifyMutation.isPending}
            >
              {verifyMutation.isPending ? "Rejecting..." : "Reject Caregiver"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
