/* Zero Cube Pledge — configuration (the ONLY file to edit when connecting the backend).
   ENDPOINT: the Google Apps Script Web App URL (ends in /exec). While it is "", nothing is sent or saved:
   - SOFT LAUNCH (DEMO:false): the counter and Wall of Honour show an empty "first pledges after launch" state, no SAMPLE data;
     the Founding Members waitlist form falls back to a pre-filled email to WAITLIST_EMAIL.
   - DEMO:true (local design review only): clearly marked SAMPLE pledges are shown, as before. Never publish with DEMO:true.
   MEMBERSHIP_OPEN: false until the bank account is active and membership payments open (Phase 2).
   See SETUP.md in the project root for the step-by-step backend setup. */
window.ZC_PLEDGE_CONFIG = {
  ENDPOINT: "",
  DEMO: false,
  MEMBERSHIP_OPEN: false,
  WAITLIST_EMAIL: "zerocubecif@gmail.com",
  SITE_URL: "https://saurabhsomani.github.io/zerocube/",
  PLEDGE_PATH: "pledge.html",
  DIRECTORY_PATH: "wall-of-honour.html",
  HASHTAG: "ZeroCubePledge",
  MAX_PHOTO_PX: 600
};
