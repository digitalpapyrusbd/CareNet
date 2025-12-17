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
| +88017123456700 | admin@carenet.com | Super Admin |
| +88017123456701 | demosuperadmin1@carenet.com | Demo Super Admin 1 |
| +88017123456702 | demosuperadmin2@carenet.com | Demo Super Admin 2 |

## Moderator
| Phone Number | Email | Name |
|--------------|-------|------|
| +88017123456703 | moderator@carenet.com | Platform Moderator |
| +88017123456704 | demomoderator1@carenet.com | Demo Moderator 1 |
| +88017123456705 | demomoderator2@carenet.com | Demo Moderator 2 |

## Company / Agency
| Phone Number | Email | Name |
|--------------|-------|------|
| +88017123456706 | company@carenet.com | Care Services Ltd |
| +88017123456707 | democompany1@carenet.com | Demo Company 1 |
| +88017123456708 | democompany2@carenet.com | Demo Company 2 |

## Caregiver
| Phone Number | Email | Name |
|--------------|-------|------|
| +88017123456709 | caregiver1@carenet.com | Fatima Akter |
| +88017123456710 | caregiver2@carenet.com | Rahman Khan |
| +88017123456711 | democaregiver1@carenet.com | Demo Caregiver 1 |
| +88017123456712 | democaregiver2@carenet.com | Demo Caregiver 2 |

## Guardian
| Phone Number | Email | Name |
|--------------|-------|------|
| +88017123456713 | guardian@carenet.com | Ahmed Hassan |
| +88017123456714 | demoguardian1@carenet.com | Demo Guardian 1 |
| +88017123456715 | demoguardian2@carenet.com | Demo Guardian 2 |

## Patient User Accounts
| Phone Number | Email | Name |
|--------------|-------|------|
| +88017123456716 | demopatient1@carenet.com | Demo Patient User 1 |
| +88017123456717 | demopatient2@carenet.com | Demo Patient User 2 |

---

## Database Design Note
The system uses **phone numbers** as the primary authentication identifier:
- `phone` field: Required, unique (primary login)
- `email` field: Optional, unique (secondary identifier)

Login form accepts: **Phone number + Password**

**Quick Test Logins:**
- Super Admin: `+88017123456701` / `Demo@123`
- Moderator: `+88017123456704` / `Demo@123`
- Company: `+88017123456707` / `Demo@123`
- Caregiver: `+88017123456711` / `Demo@123`
- Guardian: `+88017123456714` / `Demo@123`
