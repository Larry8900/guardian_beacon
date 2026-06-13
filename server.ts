import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json());

// In-Memory Fallback Seed Data in case file DB is brand new
const INITIAL_USERS = [
  {
    id: 'user-001',
    name: 'Aleksey Smirnov',
    age: 29,
    phoneNumber: '+1 (555) 382-9102',
    email: 'aleksey.s@example.com',
    isVerified: true,
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    physicalDescription: '6\'1" tall, athletic build. Dark blonde hair, light green eyes. Compass tattoo on right inner forearm. Usually wears athletic shoes.',
    allowedLocation: {
      latitude: 40.7128,
      longitude: -74.0060,
      accuracy: 10,
      timestamp: Date.now() - 3600000,
    },
    idVerified: true,
    idDocumentName: 'PASSPORT_US_XXXX_9102.pdf'
  },
  {
    id: 'user-002',
    name: 'Elena Rostova',
    age: 22,
    phoneNumber: '+1 (555) 482-0192',
    email: 'elena.rostova@example.com',
    isVerified: true,
    profilePhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    physicalDescription: '5\'4" tall, petite build. Long auburn hair. Wears wire-frame reading glasses, a thin silver anchor necklace, and has a small birthmark below left temple.',
    allowedLocation: {
      latitude: 34.0522,
      longitude: -118.2437,
      accuracy: 15,
      timestamp: Date.now() - 7200000,
    },
    idVerified: true,
    idDocumentName: 'DRIVERS_LIC_CA_XXXX_0192.pdf'
  },
  {
    id: 'user-003',
    name: 'Marcus Vance',
    age: 42,
    phoneNumber: '+1 (555) 728-1194',
    email: 'marcus.v@example.com',
    isVerified: false,
    idVerified: false
  },
  {
    id: 'user-004',
    name: 'Sarah Jenkins',
    age: 31,
    phoneNumber: '+1 (555) 901-3829',
    email: 'sarah.j@example.com',
    isVerified: true,
    profilePhoto: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80',
    physicalDescription: '5\'7" tall. Shoulder-length curly red-blonde hair. Prominent freckles on nose and cheeks. Usually carries a leather handbag and wears a gold-plated wristwatch.',
    allowedLocation: {
      latitude: 41.8781,
      longitude: -87.6298,
      accuracy: 25,
      timestamp: Date.now() - 1800000,
    },
    idVerified: true,
    idDocumentName: 'STATE_ID_IL_XXXX_3829.pdf'
  }
];

const INITIAL_ALERTS = [
  {
    id: 'alert-1',
    name: 'Elena Rostova',
    age: 22,
    gender: 'Female',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    lastKnownLocation: 'Grand Central Terminal (Sector B), New York, NY',
    physicalDescription: '5\'4" tall, petite build. Long auburn hair. Wears wire-frame reading glasses, a thin silver anchor necklace, and has a small birthmark below left temple.',
    contactInformation: '+1 (555) 482-0192 / Emergency Rescue Dispatch Desk',
    timeReported: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: 'ACTIVE',
    isVerifiedUser: true,
    taggedUserId: 'user-002'
  },
  {
    id: 'alert-2',
    name: 'Liam Peterson',
    age: 9,
    gender: 'Male',
    image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=400&q=80',
    lastKnownLocation: 'Oakwood Public Park, Chicago, IL',
    physicalDescription: 'About 4\'2" tall. Bright blue t-shirt, beige cargo shorts, green sneakers. Short brown hair. Left-handed. Unusually expressive eyes.',
    contactInformation: '+1 (555) 103-9482 (Parent: Jessica Peterson)',
    timeReported: new Date(Date.now() - 3600000 * 8).toISOString(),
    status: 'ACTIVE',
    isVerifiedUser: false,
  },
  {
    id: 'alert-3',
    name: 'Aleksey Smirnov',
    age: 29,
    gender: 'Male',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    lastKnownLocation: 'Market Square Tech District, Downtown Austin, TX',
    physicalDescription: '6\'1" tall, athletic build. Dark blonde hair, light green eyes. Compass tattoo on right inner forearm. Usually wears athletic shoes.',
    contactInformation: '+1 (555) 382-9102 / Guardian Task Force Contact',
    timeReported: new Date(Date.now() - 3600000 * 18).toISOString(),
    status: 'ACTIVE',
    isVerifiedUser: true,
    taggedUserId: 'user-001'
  }
];

const INITIAL_SIGHTINGS = [
  {
    id: 'sight-1',
    alertId: 'alert-1',
    reporterName: 'David K.',
    reporterContact: '+1 (555) 902-1203',
    sightingTime: new Date(Date.now() - 3600000 * 4).toISOString(),
    sightingLocation: 'Times Square Subway Station Platform 3',
    sightingDetails: 'Spotted a young woman matching her height and hair layout boarding the N train uptown. She was wearing a grey hoodie and looked a bit disoriented.',
    status: 'INVESTIGATING'
  },
  {
    id: 'sight-2',
    alertId: 'alert-2',
    reporterName: 'Maria G.',
    reporterContact: '+1 (555) 441-2940',
    sightingTime: new Date(Date.now() - 3600000 * 7).toISOString(),
    sightingLocation: 'Convenience Store at 4th St & Oak Ave',
    sightingDetails: 'Saw a boy in a green hat buying a drink. He fit the description perfectly. He walked away towards the North park entrance quickly.',
    status: 'CONFIRMED'
  }
];

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'CRITICAL ALERT: Liam Peterson (Age 9)',
    message: 'Missing child alert launched near Oakwood Public Park. Citizens within 15 miles are requested to inspect garages, backyards, and nearby fields.',
    timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
    alertId: 'alert-2',
    type: 'CRITICAL'
  },
  {
    id: 'notif-2',
    title: 'New Sighting Confirmed',
    message: 'A sighting report near Oak Ave convenience store for Liam Peterson was flagged as highly credible. Search efforts are converging there.',
    timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
    alertId: 'alert-2',
    type: 'UPDATE'
  },
  {
    id: 'notif-3',
    title: 'ALERT ACTIVATED: Aleksey Smirnov (Age 29)',
    message: 'Aleksey Smirnov has been reported missing. Verified medical profile and last known device coordinate of 30.2672 N, 97.7431 W loaded.',
    timestamp: new Date(Date.now() - 3600000 * 18).toISOString(),
    alertId: 'alert-3',
    type: 'CRITICAL'
  }
];

const STORE_PATH = path.join(process.cwd(), "db-store.json");

// Utility to read database helper
function getDB() {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const data = fs.readFileSync(STORE_PATH, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Failed to read JSON DB:", err);
  }
  // Initialize and write default DB
  const defaultDB = {
    users: INITIAL_USERS,
    alerts: INITIAL_ALERTS,
    sightings: INITIAL_SIGHTINGS,
    notifications: INITIAL_NOTIFICATIONS
  };
  saveDB(defaultDB);
  return defaultDB;
}

// Utility to save database helper
function saveDB(data: any) {
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write to JSON DB:", err);
  }
}

// Lazy initialization of GoogleGenAI SDK to prevent app crashing on startup if key is missing
let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        }
      }
    });
  }
  return aiClient;
}

// ==========================================
// REST API ENDPOINTS
// ==========================================

// Get all dynamic active notifications
app.get("/api/notifications", (req, res) => {
  const db = getDB();
  res.json(db.notifications);
});

// Clear notifications
app.post("/api/notifications/clear", (req, res) => {
  const db = getDB();
  db.notifications = [];
  saveDB(db);
  res.json({ success: true, notifications: [] });
});

// Get registered users list
app.get("/api/users", (req, res) => {
  const db = getDB();
  // Safe mapping, don't return passwords if any exist
  res.json(db.users);
});

// Sign-up / Register user
app.post("/api/auth/register", (req, res) => {
  const { name, age, phoneNumber, email, profilePhoto, physicalDescription, idDocumentName, idVerified } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "Name and Email are required fields." });
  }

  const db = getDB();
  const existingUser = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    return res.status(400).json({ error: "A user with this email already exists." });
  }

  const newUser = {
    id: "user-" + Date.now(),
    name,
    age: Number(age) || 21,
    phoneNumber: phoneNumber || "",
    email,
    isVerified: !!idVerified,
    profilePhoto: profilePhoto || "",
    physicalDescription: physicalDescription || "",
    idVerified: !!idVerified,
    idDocumentName: idDocumentName || "",
    allowedLocation: {
      latitude: 40.7128 + (Math.random() - 0.5) * 0.1,
      longitude: -74.0060 + (Math.random() - 0.5) * 0.1,
      accuracy: 10 + Math.floor(Math.random() * 20),
      timestamp: Date.now()
    }
  };

  db.users.push(newUser);
  saveDB(db);
  res.status(201).json(newUser);
});

// Sign-in / Login
app.post("/api/auth/login", (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email target is required." });
  }

  const db = getDB();
  const matched = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
  if (!matched) {
    return res.status(404).json({ error: "No profile registered under this email yet." });
  }

  res.json(matched);
});

// Edit Profile Page endpoint
app.post("/api/auth/update-profile", (req, res) => {
  const { id, name, age, phoneNumber, physicalDescription, isVerified, idVerified, idDocumentName, profilePhoto } = req.body;
  if (!id) {
    return res.status(400).json({ error: "Missing identity token." });
  }

  const db = getDB();
  const idx = db.users.findIndex((u: any) => u.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: "User identity profile not found." });
  }

  const updated = {
    ...db.users[idx],
    name: name || db.users[idx].name,
    age: age !== undefined ? Number(age) : db.users[idx].age,
    phoneNumber: phoneNumber !== undefined ? phoneNumber : db.users[idx].phoneNumber,
    physicalDescription: physicalDescription !== undefined ? physicalDescription : db.users[idx].physicalDescription,
    isVerified: isVerified !== undefined ? !!isVerified : db.users[idx].isVerified,
    idVerified: idVerified !== undefined ? !!idVerified : db.users[idx].idVerified,
    idDocumentName: idDocumentName !== undefined ? idDocumentName : db.users[idx].idDocumentName,
    profilePhoto: profilePhoto !== undefined ? profilePhoto : db.users[idx].profilePhoto,
  };

  db.users[idx] = updated;
  saveDB(db);
  res.json(updated);
});

// Get Alerts
app.get("/api/alerts", (req, res) => {
  const db = getDB();
  res.json(db.alerts);
});

// Create Alert
app.post("/api/alerts", (req, res) => {
  const { name, age, gender, image, lastKnownLocation, physicalDescription, contactInformation, taggedUserId, isVerifiedUser } = req.body;
  if (!name || !lastKnownLocation || !physicalDescription || !contactInformation) {
    return res.status(400).json({ error: "Missing required details. Name, Last Location, Physical Descriptors, and Contacts are mandatory." });
  }

  const db = getDB();
  const newAlert = {
    id: "alert-" + Date.now(),
    name,
    age: Number(age) || 18,
    gender: gender || "Unknown",
    image: image || "",
    lastKnownLocation,
    physicalDescription,
    contactInformation,
    timeReported: new Date().toISOString(),
    status: "ACTIVE" as const,
    isVerifiedUser: !!isVerifiedUser,
    taggedUserId: taggedUserId || undefined
  };

  db.alerts.unshift(newAlert);

  // Trigger auto critical notification broadcast!
  const criticalNotification = {
    id: "notif-" + Date.now(),
    title: `CRITICAL ALERT: ${newAlert.name} Reported Missing`,
    message: `Urgent community broadcast initiated. Subject was last witnessed at: ${newAlert.lastKnownLocation}. Descriptor: ${newAlert.physicalDescription}`,
    timestamp: newAlert.timeReported,
    alertId: newAlert.id,
    type: "CRITICAL" as const
  };
  db.notifications.unshift(criticalNotification);

  saveDB(db);
  res.status(201).json(newAlert);
});

// Resolve Alert
app.post("/api/alerts/:id/resolve", (req, res) => {
  const { id } = req.params;
  const db = getDB();
  const alertIndex = db.alerts.findIndex((a: any) => a.id === id);
  if (alertIndex === -1) {
    return res.status(404).json({ error: "No matching alert found." });
  }

  db.alerts[alertIndex].status = "RESOLVED";

  // Create update notification
  const resolveNotification = {
    id: "notif-" + Date.now(),
    title: `CASE RESOLVED: ${db.alerts[alertIndex].name}`,
    message: `Great news! The active missing broadcast has been successfully marked as resolved. Thank you to all spotters.`,
    timestamp: new Date().toISOString(),
    alertId: id,
    type: "INFO" as const
  };
  db.notifications.unshift(resolveNotification);

  saveDB(db);
  res.json({ success: true, alert: db.alerts[alertIndex] });
});

// Get Sightings for alert or broad
app.get("/api/sightings", (req, res) => {
  const db = getDB();
  res.json(db.sightings);
});

// Create Sighting Report
app.post("/api/sightings", (req, res) => {
  const { alertId, reporterName, reporterContact, sightingLocation, sightingDetails, image } = req.body;
  if (!alertId || !reporterName || !sightingLocation || !sightingDetails) {
    return res.status(400).json({ error: "Incomplete sighting parameters." });
  }

  const db = getDB();
  const targetedAlert = db.alerts.find((a: any) => a.id === alertId);

  const newSighting = {
    id: "sight-" + Date.now(),
    alertId,
    reporterName,
    reporterContact: reporterContact || "",
    sightingTime: new Date().toISOString(),
    sightingLocation,
    sightingDetails,
    image: image || "",
    status: "UNVERIFIED" as const
  };

  db.sightings.unshift(newSighting);

  // Trigger telemetry notification update!
  const updateNotification = {
    id: "notif-" + Date.now(),
    title: `Sighting Report Sighted for ${targetedAlert ? targetedAlert.name : "Active Alert"}`,
    message: `A new community spotter lead has been recorded near [${newSighting.sightingLocation}]: "${newSighting.sightingDetails.substring(0, 80)}..."`,
    timestamp: newSighting.sightingTime,
    alertId: newSighting.alertId,
    type: "UPDATE" as const
  };
  db.notifications.unshift(updateNotification);

  saveDB(db);
  res.status(201).json(newSighting);
});

// Update Sighting status (Investigating/Confirmed)
app.post("/api/sightings/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!["UNVERIFIED", "INVESTIGATING", "CONFIRMED"].includes(status)) {
    return res.status(400).json({ error: "Invalid status value." });
  }

  const db = getDB();
  const idx = db.sightings.findIndex((s: any) => s.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: "Sighting not found." });
  }

  db.sightings[idx].status = status;

  // Let's broadcast high credibility update notice to users if confirmed
  if (status === "CONFIRMED") {
    const alertId = db.sightings[idx].alertId;
    const targetedAlert = db.alerts.find((a: any) => a.id === alertId);
    const confNotif = {
      id: "notif-" + Date.now(),
      title: `High Credibility Sighting Confirmed`,
      message: `A lead regarding ${targetedAlert ? targetedAlert.name : "active search"} has been verified as highly credible. Near: ${db.sightings[idx].sightingLocation}.`,
      timestamp: new Date().toISOString(),
      alertId,
      type: "UPDATE" as const
    };
    db.notifications.unshift(confNotif);
  }

  saveDB(db);
  res.json({ success: true, sighting: db.sightings[idx] });
});

// ==========================================
// GEMINI INTELLIGENCE ASSISTANCE
// ==========================================

// analyze sighting report details or construct structured advising strategy
app.post("/api/ai/analyze-sighting", async (req, res) => {
  const { sightingDetails, lastKnownLocation, subjectName } = req.body;

  if (!sightingDetails) {
    return res.status(400).json({ error: "Sighting report details must be completed to analyze." });
  }

  try {
    const aiInstance = getAi();
    
    const prompt = `Analyze this citizen sighting report for missing subject: "${subjectName || "the person"}".
    
Last Known Location of original broadcast: ${lastKnownLocation || "Unknown"}
Citizen report text: "${sightingDetails}"

Produce a structured advisory analysis in plain language (markdown format if appropriate). Include:
1. "Subject Match Confidence Index" (High / Medium / Low) with brief 1-sentence reasoning based on description details.
2. "Urgent Search Radius Shift" (Specific locations or search vectors that search teams should pivot to immediately e.g. transport lines, direction of travel).
3. "First Responder Tactical Advice" (Immediate directives for spotters or local volunteers on the ground, e.g. secure security footage fast, alert specific local nodes).

Keep it professional, constructive, and direct. Avoid any robotic preambles.`;

    const response = await aiInstance.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    const advice = response.text || "Unable to extract intelligence indicators at this moment. Dispatch agents immediately.";
    res.json({ advice });
  } catch (err: any) {
    console.error("Gemini Sighting analysis failed:", err);
    res.json({ advice: `[AI Intel Offline]: Could not query Gemini. Dispatching search teams based on standard protocols. Details: ${err?.message || "Internal Service Error"}` });
  }
});

// generate optimized emergency search advisory based on missing person's descriptors
app.post("/api/ai/optimize-search", async (req, res) => {
  const { name, age, physicalDescription, lastKnownLocation } = req.body;
  
  if (!name || !physicalDescription) {
    return res.status(400).json({ error: "Name and physical descriptors are required." });
  }

  try {
    const aiInstance = getAi();
    
    const prompt = `Optimize search strategies and broadcast advisories for missing person:
Name: ${name}
Age: ${age}
Physical Characteristics: ${physicalDescription}
Last Known Location: ${lastKnownLocation}

Generate:
1. Enhanced Broadcast Bulletin Copy: An eye-catching, highly descriptive, structured summary to engage the public and point out unique identifiable features.
2. Specialized Rescue Priority Index: Areas where a person of this age and description might navigate or require assistance (e.g. shelter points, medical centers, parks).
3. Key Questioning Prompts: Specific questions local emergency dispatchers can ask potential spotters who call in.

Provide the response in clear, concise markdown formatting.`;

    const response = await aiInstance.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ optimization: response.text });
  } catch (err: any) {
    console.error("Gemini Search Optimization failed:", err);
    res.json({ optimization: `### System Notice: Emergency Optimization Standard Operating Procedures
Due to network restrictions:
- Prioritize search within a 3-mile radius of **${lastKnownLocation || "the last reported location"}**.
- Coordinate matching checks with hospitals and local shelters.
- Inquire about clothing changes, footwear markers, and distinctive gear when matching caller leads.` });
  }
});

// ==========================================
// VITE AND SPA HANDLINGS
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    // Mount Vite dev server middleware
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server started on http://localhost:${PORT}`);
  });
}

startServer();
