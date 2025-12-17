# Demo User Login Credentials

**Default password:** `Demo@123`

**Login with:** Phone number (not email)

**Password Requirements Met:**
- Minimum: 8 characters ✓
- Maximum: 128 characters ✓
- Requires: uppercase (D) ✓
- Requires: lowercase (emo) ✓
- Requires: number (123) ✓
- Requires: special character (@) ✓

---

## Super Admin
| Phone Number | Email | Name |
|--------------|-------|------|
| +8801712345101 | admin@carenet.com | Super Admin |
| +8801712345102 | demosuperadmin1@carenet.com | Demo Super Admin 1 |
| +8801712345103 | demosuperadmin2@carenet.com | Demo Super Admin 2 |

## Moderator
| Phone Number | Email | Name |
|--------------|-------|------|
| +8801712345201 | moderator@carenet.com | Platform Moderator |
| +8801712345202 | demomoderator1@carenet.com | Demo Moderator 1 |
| +8801712345203 | demomoderator2@carenet.com | Demo Moderator 2 |

## Company / Agency
| Phone Number | Email | Name |
|--------------|-------|------|
| +8801712345301 | company@carenet.com | Care Services Ltd |
| +8801712345302 | democompany1@carenet.com | Demo Company 1 |
| +8801712345303 | democompany2@carenet.com | Demo Company 2 |

## Caregiver
| Phone Number | Email | Name |
|--------------|-------|------|
| +8801712345401 | caregiver1@carenet.com | Fatima Akter |
| +8801712345402 | caregiver2@carenet.com | Rahman Khan |
| +8801712345403 | democaregiver1@carenet.com | Demo Caregiver 1 |
| +8801712345404 | democaregiver2@carenet.com | Demo Caregiver 2 |

## Guardian
| Phone Number | Email | Name |
|--------------|-------|------|
| +8801712345501 | guardian@carenet.com | Ahmed Hassan |
| +8801712345502 | demoguardian1@carenet.com | Demo Guardian 1 |
| +8801712345503 | demoguardian2@carenet.com | Demo Guardian 2 |

## Patient User Accounts
| Phone Number | Email | Name |
|--------------|-------|------|
| +8801712345601 | demopatient1@carenet.com | Demo Patient User 1 |
| +8801712345602 | demopatient2@carenet.com | Demo Patient User 2 |

---

## Database Design Note
The system uses **phone numbers** as the primary authentication identifier:
- `phone` field: Required, unique (primary login)
- `email` field: Optional, unique (secondary identifier)

Login form accepts: **Phone number + Password**

**Quick Test Logins:**
- Super Admin: `+8801712345102` / `Demo@123`
- Moderator: `+8801712345202` / `Demo@123`
- Company: `+8801712345302` / `Demo@123`
- Caregiver: `+8801712345403` / `Demo@123`
- Guardian: `+8801712345502` / `Demo@123`
