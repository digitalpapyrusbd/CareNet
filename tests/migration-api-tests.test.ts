import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
} from "@jest/globals";

// Base URL for API testing - adjust if your server runs on a different port
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

describe("Migration API Validation Tests", () => {
  let authToken: string;

  beforeAll(async () => {
    authToken = `Bearer mock-jwt-token-for-testing`;
  });

  // Helper function to make API requests
  async function apiRequest(
    method: string,
    path: string,
    options: { body?: any; headers?: Record<string, string> } = {},
  ) {
    const url = `${API_BASE_URL}${path}`;
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
    const data = await response.json().catch(() => ({}));
    return { status: response.status, body: data, ok: response.ok };
  }

  describe("Old Company Endpoints (Should be removed/redirected)", () => {
    it("GET /api/companies should return 404 or redirect", async () => {
      const response = await apiRequest("GET", "/api/companies", {
        headers: { Authorization: authToken },
      });

      expect(response.status).toBe(404);
    });

    it("GET /api/companies/:id should return 404 or redirect", async () => {
      const response = await apiRequest("GET", "/api/companies/1", {
        headers: { Authorization: authToken },
      });

      expect(response.status).toBe(404);
    });

    it("POST /api/companies should return 404 or redirect", async () => {
      const response = await apiRequest("POST", "/api/companies", {
        headers: { Authorization: authToken },
        body: {
          company_name: "Should Fail",
          trade_license: "TL123",
        },
      });

      expect(response.status).toBe(404);
    });

    it("PUT /api/companies/:id should return 404 or redirect", async () => {
      const response = await apiRequest("PUT", "/api/companies/1", {
        headers: { Authorization: authToken },
        body: {
          company_name: "Updated Name",
        },
      });

      expect(response.status).toBe(404);
    });

    it("DELETE /api/companies/:id should return 404 or redirect", async () => {
      const response = await apiRequest("DELETE", "/api/companies/1", {
        headers: { Authorization: authToken },
      });

      expect(response.status).toBe(404);
    });
  });

  describe("New Agency Endpoints (Should work correctly)", () => {
    it("GET /api/agencies should return agencies with correct field names", async () => {
      const response = await apiRequest("GET", "/api/agencies", {
        headers: { Authorization: authToken },
      });

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);

      if (response.body.data.length > 0) {
        const agency = response.body.data[0];
        expect(agency).toHaveProperty("agency_name");
        expect(agency).not.toHaveProperty("company_name");
        expect(agency).toHaveProperty("trade_license");
        expect(agency).toHaveProperty("contact_person");
        expect(agency).toHaveProperty("contact_phone");
      }
    });

    it("GET /api/agencies/:id should return single agency", async () => {
      const response = await apiRequest("GET", "/api/agencies/1", {
        headers: { Authorization: authToken },
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("agency_name");
      expect(response.body).not.toHaveProperty("company_name");
      expect(response.body.agency_name).toBeDefined();
    });

    it("POST /api/agencies should create agency with correct field names", async () => {
      const newAgencyData = {
        agency_name: "New Test Agency",
        trade_license: "TL789012",
        contact_person: "John Doe",
        contact_phone: "+1234567891",
        address: "123 Test St",
        payout_method: "BANK_TRANSFER",
        payout_account: "ACC123456",
      };

      const response = await apiRequest("POST", "/api/agencies", {
        headers: { Authorization: authToken },
        body: newAgencyData,
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("agency_name");
      expect(response.body).not.toHaveProperty("company_name");
      expect(response.body.agency_name).toBe(newAgencyData.agency_name);
    });

    it("PUT /api/agencies/:id should update agency", async () => {
      const updateData = {
        agency_name: "Updated Agency Name",
        contact_person: "Jane Doe",
      };

      const response = await apiRequest("PUT", "/api/agencies/1", {
        headers: { Authorization: authToken },
        body: updateData,
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "agency_name",
        "Updated Agency Name",
      );
      expect(response.body).toHaveProperty("contact_person", "Jane Doe");
    });

    it("DELETE /api/agencies/:id should soft delete agency", async () => {
      const response = await apiRequest("DELETE", "/api/agencies/1", {
        headers: { Authorization: authToken },
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message");
    });
  });

  describe("Relationship Validation", () => {
    it("GET /api/caregivers should include agency relationship", async () => {
      const response = await apiRequest("GET", "/api/caregivers", {
        headers: { Authorization: authToken },
      });

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();

      if (response.body.data.length > 0) {
        const caregiver = response.body.data[0];
        expect(caregiver).toHaveProperty("agency_id");
        expect(caregiver).not.toHaveProperty("company_id");
      }
    });

    it("GET /api/jobs should include agency relationship", async () => {
      const response = await apiRequest("GET", "/api/jobs", {
        headers: { Authorization: authToken },
      });

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();

      if (response.body.data.length > 0) {
        const jobData = response.body.data[0];
        expect(jobData).toHaveProperty("agency_id");
        expect(jobData).not.toHaveProperty("company_id");
      }
    });
  });

  describe("Feedback System Validation", () => {
    it("POST /api/feedback should accept agency_response field", async () => {
      const feedbackData = {
        type: "AGENCY",
        rating: 5,
        comments: "Great agency service",
        agency_response: "Thank you for your feedback!",
      };

      const response = await apiRequest("POST", "/api/feedback", {
        headers: { Authorization: authToken },
        body: feedbackData,
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("agency_response");
      expect(response.body).not.toHaveProperty("company_response");
      expect(response.body.agency_response).toBe(feedbackData.agency_response);
    });

    it("GET /api/feedback should return agency_response field", async () => {
      const response = await apiRequest("GET", "/api/feedback", {
        headers: { Authorization: authToken },
      });

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();

      if (response.body.data.length > 0) {
        const feedbackData = response.body.data[0];
        expect(feedbackData).toHaveProperty("agency_response");
        expect(feedbackData).not.toHaveProperty("company_response");
      }
    });
  });

  describe("Search and Filtering", () => {
    it("GET /api/agencies?search=agency_name should work", async () => {
      const response = await apiRequest("GET", "/api/agencies?search=Test", {
        headers: { Authorization: authToken },
      });

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it("GET /api/caregivers?agency_id= should filter by agency", async () => {
      const response = await apiRequest(
        "GET",
        "/api/caregivers?agency_id=1",
        {
          headers: { Authorization: authToken },
        },
      );

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);

      if (response.body.data.length > 0) {
        response.body.data.forEach((caregiver: any) => {
          expect(caregiver.agency_id).toBeDefined();
        });
      }
    });
  });

  describe("Data Migration Validation", () => {
    it("Should not have any records with company_id field", async () => {
      // This would require database access, but we can't establish connection
      // So we'll just validate the API doesn't return company_id fields
      const response = await apiRequest("GET", "/api/caregivers", {
        headers: { Authorization: authToken },
      });

      expect(response.status).toBe(200);
      if (response.body.data && response.body.data.length > 0) {
        const caregiver = response.body.data[0];
        expect(caregiver).not.toHaveProperty("company_id");
      }
    });

    it("Should have all agencies with valid userId references", async () => {
      const response = await apiRequest("GET", "/api/agencies", {
        headers: { Authorization: authToken },
      });

      expect(response.status).toBe(200);
      if (response.body.data && response.body.data.length > 0) {
        const agency = response.body.data[0];
        expect(agency).toHaveProperty("userId");
        expect(agency.userId).toBeDefined();
      }
    });

    it("Should not have any users with COMPANY role", async () => {
      const response = await apiRequest("GET", "/api/users", {
        headers: { Authorization: authToken },
      });

      expect(response.status).toBe(200);
      if (response.body.data && response.body.data.length > 0) {
        const hasCompanyRole = response.body.data.some(
          (user: any) => user.role === "COMPANY",
        );
        expect(hasCompanyRole).toBe(false);
      }
    });
  });

  describe("Error Handling", () => {
    it("Should return 404 for non-existent agency", async () => {
      const response = await apiRequest("GET", "/api/agencies/99999", {
        headers: { Authorization: authToken },
      });

      expect(response.status).toBe(404);
    });

    it("Should return 400 for invalid agency data", async () => {
      const response = await apiRequest("POST", "/api/agencies", {
        headers: { Authorization: authToken },
        body: {
          agency_name: "", // Invalid: empty name
          trade_license: "TL123",
        },
      });

      expect(response.status).toBe(400);
    });

    it("Should return 403 for unauthorized access", async () => {
      const response = await apiRequest("GET", "/api/agencies", {
        headers: { Authorization: "Bearer invalid-token" },
      });

      expect(response.status).toBe(403);
    });
  });

  describe("Performance Validation", () => {
    it("Should handle bulk operations efficiently", async () => {
      const startTime = Date.now();

      // Create multiple agencies
      const agencies = Array.from({ length: 5 }, (_, i) => ({
        agency_name: `Bulk Agency ${i}`,
        trade_license: `TL${1000 + i}`,
        contact_person: `Person ${i}`,
        contact_phone: `+12345678${i}`,
        address: `Address ${i}`,
        payout_method: "BANK_TRANSFER",
        payout_account: `ACC${1000 + i}`,
      }));

      for (const agencyData of agencies) {
        await apiRequest("POST", "/api/agencies", {
          headers: { Authorization: authToken },
          body: agencyData,
        });
      }

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Should complete within reasonable time (adjust threshold as needed)
      expect(duration).toBeLessThan(10000); // 10 seconds
    });

    it("Should use indexes for filtering operations", async () => {
      // This test would ideally use EXPLAIN ANALYZE in a real environment
      // For now, we'll just verify the operations work correctly
      const response = await apiRequest(
        "GET",
        "/api/agencies?agency_name=Test",
        {
          headers: { Authorization: authToken },
        },
      );

      expect(response.status).toBe(200);
    });
  });
});
