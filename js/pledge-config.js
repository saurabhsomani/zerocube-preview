/* Zero Cube Pledge — configuration (the ONLY file to edit when connecting the backend).
   ENDPOINT: the Google Apps Script Web App URL (ends in /exec). While it is "", nothing is sent or saved:
   - SOFT LAUNCH (DEMO:false): the counter and Wall of Honour show an empty "first pledges after launch" state, no SAMPLE data;
     the Founding Members waitlist form falls back to a pre-filled email to WAITLIST_EMAIL.
   - DEMO:true (local design review only): clearly marked SAMPLE pledges are shown, as before. Never publish with DEMO:true.
   MEMBERSHIP_OPEN: true from the post-bank-account launch (24 Oct 2026). Payment details live in build_parts/launch_config.py (PAY).
   See SETUP.md in the project root for the step-by-step backend setup. */
window.ZC_PLEDGE_CONFIG = {
  ENDPOINT: "",
  DEMO: false,
  MEMBERSHIP_OPEN: true,   /* LAUNCH 24 Oct 2026: bank account active, membership open */
  WAITLIST_EMAIL: "zerocubecif@gmail.com",
  SITE_URL: "https://saurabhsomani.github.io/zerocube/",
  PLEDGE_PATH: "pledge.html",
  DIRECTORY_PATH: "wall-of-honour.html",
  HASHTAG: "ZeroCubePledge",
  MAX_PHOTO_PX: 600
};
