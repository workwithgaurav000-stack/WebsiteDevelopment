/* =====================================================
   GAURAVTECH PREMIUM WEBSITE — FORM + INTERACTIONS
   ===================================================== */

const FORMSPREE_URL = "https://formspree.io/f/xljeozla";

const projects = [
  {id:"school",title:"Gaurav Demo School",category:"school",description:"Professional school website demo with modern design and admission-focused structure.",url:"https://gauravdemoschool.netlify.app/",icon:"🏫",price:6999},
  {id:"business",title:"TCC Thakur Cyber Cafe",category:"business",description:"Professional business website demo for a cyber cafe and digital service center.",url:"https://tccthakurcybercafe.netlify.app/",icon:"💼",price:3999},
  {id:"stopwatch",title:"SW Stopwatch",category:"other",description:"Simple and modern online stopwatch web application.",url:"https://swstopwatch.netlify.app/",icon:"⏱️",price:3499},
  {id:"omr",title:"OMR Test",category:"other",description:"Online OMR test and quiz website with answer and result functionality.",url:"https://omr-test.netlify.app/",icon:"📝",price:3499},
  {id:"restaurant",title:"Restaurant Website",category:"restaurant",description:"Restaurant website demo will be added soon.",url:"",icon:"🍽️",price:4499,comingSoon:true},
  {id:"hospital",title:"Hospital Website",category:"hospital",description:"Hospital and healthcare website demo will be added soon.",url:"",icon:"🏥",price:6999,comingSoon:true}
];

const categoryNames = {
  school:"School",
  restaurant:"Restaurant",
  business:"Business",
  hospital:"Hospital",
  other:"Other"
};

let selectedProject = null;
let currentReceipt = {};

document.addEventListener("DOMContentLoaded", () => {
  setupPreloader();
  setupNavbar();
  setupMobileMenu();
  setupReveal();
  setupPortfolio();
  setupBooking();
  document.getElementById("year").textContent = new Date().getFullYear();
});

function setupPreloader() {
  const preloader = document.getElementById("preloader");
  if (!preloader) return;
  const hide = () => preloader.classList.add("hide");
  window.addEventListener("load", () => setTimeout(hide, 350), {once:true});
  setTimeout(hide, 2200);
}

function setupNavbar() {
  const navbar = document.getElementById("navbar");
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 20);
  }, {passive:true});
}

function setupMobileMenu() {
  const btn = document.getElementById("menuBtn");
  const links = document.getElementById("navLinks");
  if (!btn || !links) return;

  btn.addEventListener("click", () => links.classList.toggle("active"));
  links.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => links.classList.remove("active"));
  });
}

function setupReveal() {
  const elements = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    elements.forEach(el => el.classList.add("show"));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  }, {threshold:0.12});
  elements.forEach(el => observer.observe(el));
}

function setupPortfolio() {
  const grid = document.getElementById("projectsGrid");
  const filters = document.querySelectorAll(".filter-btn");

  renderProjects("all");

  filters.forEach(button => {
    button.addEventListener("click", () => {
      filters.forEach(b => b.classList.remove("active"));
      button.classList.add("active");
      renderProjects(button.dataset.filter);
    });
  });
}

function renderProjects(filter) {
  const grid = document.getElementById("projectsGrid");
  if (!grid) return;

  const visible = filter === "all"
    ? projects
    : projects.filter(project => project.category === filter);

  grid.innerHTML = visible.map(project => {
    const demo = project.url
      ? `<a class="demo-btn" href="${project.url}" target="_blank" rel="noopener noreferrer">Live Demo ↗</a>`
      : `<span class="project-actions coming-soon">Coming Soon</span>`;

    const actions = project.url
      ? `<div class="project-actions">${demo}<button class="book-project-btn" type="button" onclick="openBooking('${project.id}')">Book / Buy</button></div>`
      : `<div class="project-actions"><span class="project-actions coming-soon">Coming Soon</span><button class="book-project-btn" type="button" onclick="openBooking('${project.id}')">Book / Buy</button></div>`;

    return `
      <article class="project-card reveal show">
        <div class="project-preview">
          <span class="project-category">${categoryNames[project.category]}</span>
          <div class="project-icon">${project.icon}</div>
        </div>
        <div class="project-body">
          <h3>${escapeHtml(project.title)}</h3>
          <p>${escapeHtml(project.description)}</p>
          ${actions}
        </div>
      </article>
    `;
  }).join("");
}

function setupBooking() {
  const form = document.getElementById("bookingForm");
  const type = document.getElementById("websiteType");
  const project = document.getElementById("projectSelect");

  populateProjectSelect();

  type.addEventListener("change", () => {
    const match = projects.find(p => p.category === type.value);
    if (match) project.value = match.id;
  });

  project.addEventListener("change", () => {
    const chosen = projects.find(p => p.id === project.value);
    if (chosen) {
      selectedProject = chosen;
      type.value = chosen.category;
    }
  });

  form.addEventListener("submit", submitBooking);
}

function populateProjectSelect() {
  const select = document.getElementById("projectSelect");
  select.innerHTML = `<option value="">Select project</option>` +
    projects.map(p => `<option value="${p.id}">${escapeHtml(p.title)} — ₹${p.price.toLocaleString("en-IN")}</option>`).join("");
}

function openBooking(projectId = "") {
  const modal = document.getElementById("bookingModal");
  const select = document.getElementById("projectSelect");
  const type = document.getElementById("websiteType");

  selectedProject = projects.find(p => p.id === projectId) || null;

  if (selectedProject) {
    select.value = selectedProject.id;
    type.value = selectedProject.category;
  } else {
    select.value = "";
    type.value = "";
  }

  modal.classList.add("active");
  modal.setAttribute("aria-hidden","false");
  document.body.classList.add("modal-open");

  setTimeout(() => document.getElementById("fullName").focus(), 150);
}

function closeBooking() {
  const modal = document.getElementById("bookingModal");
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden","true");
  document.body.classList.remove("modal-open");
}

function closeReceipt() {
  const modal = document.getElementById("receiptModal");
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden","true");
  document.body.classList.remove("modal-open");
}

async function submitBooking(event) {
  event.preventDefault();

  const form = document.getElementById("bookingForm");
  const button = document.getElementById("submitBtn");
  const emailField = document.getElementById("customerEmail");
  const email = emailField.value.trim();

  emailField.value = email;
  emailField.setCustomValidity("");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    emailField.setCustomValidity("Enter a valid email address, for example you@example.com.");
  }

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const projectId = document.getElementById("projectSelect").value;
  const chosen = projects.find(p => p.id === projectId);

  if (!chosen) {
    alert("Please select a website project.");
    return;
  }

  const now = new Date();
  const orderNumber = createOrderNumber();
  const date = now.toLocaleDateString("en-IN", {day:"2-digit",month:"long",year:"numeric"});
  const time = now.toLocaleTimeString("en-IN", {hour:"2-digit",minute:"2-digit",second:"2-digit"});

  document.getElementById("orderNumberField").value = orderNumber;
  document.getElementById("orderDateField").value = date;
  document.getElementById("orderTimeField").value = time;
  document.getElementById("websitePriceField").value = `₹${chosen.price.toLocaleString("en-IN")}`;

  button.disabled = true;
  button.classList.add("loading");

  try {
    const response = await fetch(FORMSPREE_URL, {
      method: "POST",
      body: new FormData(form),
      headers: {Accept:"application/json"}
    });

    let result = {};
    try { result = await response.json(); } catch (_) {}

    if (!response.ok || result?.ok === false) {
      const errorText = result?.errors?.map(e => e.message).join(", ") || result?.message || `Form submission failed (${response.status}).`;
      throw new Error(errorText);
    }

    currentReceipt = {
      orderNumber,
      date,
      time,
      name: document.getElementById("fullName").value.trim(),
      organization: document.getElementById("organization").value.trim() || "—",
      project: chosen.title,
      price: chosen.price
    };

    fillReceipt(currentReceipt);
    form.reset();
    selectedProject = null;
    closeBooking();
    openReceipt();

  } catch (error) {
    console.error("Formspree error:", error);
    if (error instanceof TypeError) {
      // A native POST works when fetch is blocked by local-file or CORS rules.
      button.classList.remove("loading");
      form.submit();
      return;
    }
    if (error.message.toLowerCase().includes("should be an email")) {
      emailField.setCustomValidity("Enter a valid email address, for example you@example.com.");
      emailField.reportValidity();
      emailField.focus();
      return;
    }
    alert(`Booking send nahi ho paayi: ${error.message}`);
  } finally {
    button.disabled = false;
    button.classList.remove("loading");
  }
}

function fillReceipt(data) {
  document.getElementById("receiptOrder").textContent = data.orderNumber;
  document.getElementById("receiptDate").textContent = data.date;
  document.getElementById("receiptTime").textContent = data.time;
  document.getElementById("receiptName").textContent = data.name;
  document.getElementById("receiptOrganization").textContent = data.organization;
  document.getElementById("receiptProject").textContent = data.project;
  document.getElementById("receiptPrice").textContent = `₹${data.price.toLocaleString("en-IN")}`;
  document.getElementById("receiptTotal").textContent = `₹${data.price.toLocaleString("en-IN")}`;
}

function openReceipt() {
  const modal = document.getElementById("receiptModal");
  modal.classList.add("active");
  modal.setAttribute("aria-hidden","false");
  document.body.classList.add("modal-open");
}

function createOrderNumber() {
  const random = Math.floor(1000 + Math.random() * 9000);
  const stamp = Date.now().toString().slice(-6);
  return `GT-${new Date().getFullYear()}-${stamp}-${random}`;
}

function printReceipt() {
  const d = currentReceipt;
  if (!d.name) return;

  const html = createReceiptHtml(d);

  const win = window.open("", "_blank", "width=760,height=800");
  if (!win) {
    alert("Please allow pop-ups to print the receipt.");
    return;
  }
  win.document.open();
  win.document.write(html);
  win.document.close();
}

function downloadReceipt() {
  const d = currentReceipt;
  if (!d.name) return;

  const blob = new Blob([createReceiptHtml(d)], {type:"text/html;charset=utf-8"});
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `GauravTech-Receipt-${d.orderNumber}.html`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
}

function createReceiptHtml(d) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <title>GauravTech Booking Receipt - ${d.orderNumber}</title>
    <meta charset="UTF-8">
    <style>
      body{font-family:Arial,sans-serif;padding:35px;color:#111}
      .receipt{max-width:600px;margin:auto;border:1px solid #ddd;padding:28px;border-radius:16px}
      h1{margin:0 0 5px;font-size:28px}.muted{color:#666;font-size:13px}
      .line{border-top:1px solid #ddd;margin:18px 0}
      .row{display:flex;justify-content:space-between;gap:20px;padding:8px 0}
      .row span{color:#666}.row strong{text-align:right}
      .total{font-size:20px;font-weight:800;margin-top:10px}
      .thanks{margin-top:20px;padding:15px;background:#f3fff9;border:1px solid #b8efd5;border-radius:10px}
      @media print{body{padding:0}.receipt{border:0}}
    </style>
  </head>
  <body>
    <div class="receipt">
      <h1>GauravTech</h1>
      <div class="muted">BOOKING RECEIPT</div>
      <div class="line"></div>
      <div class="row"><span>Order No.</span><strong>${escapeHtml(d.orderNumber)}</strong></div>
      <div class="row"><span>Date</span><strong>${escapeHtml(d.date)}</strong></div>
      <div class="row"><span>Time</span><strong>${escapeHtml(d.time)}</strong></div>
      <div class="row"><span>Customer</span><strong>${escapeHtml(d.name)}</strong></div>
      <div class="row"><span>Organization</span><strong>${escapeHtml(d.organization)}</strong></div>
      <div class="row"><span>Project</span><strong>${escapeHtml(d.project)}</strong></div>
      <div class="line"></div>
      <div class="row total"><span>Total</span><strong>₹${d.price.toLocaleString("en-IN")}</strong></div>
      <div class="thanks"><strong>Thank you for choosing GauravTech.</strong><br>Gaurav Kumar will reply soon.</div>
    </div>
    <script>window.onload=()=>window.print();<\/script>
  </body>
  </html>`;
}

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({behavior:"smooth"});
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'", "&#039;");
}

document.addEventListener("keydown", event => {
  if (event.key !== "Escape") return;
  closeBooking();
  closeReceipt();
});

document.querySelectorAll(".modal-overlay").forEach(overlay => {
  overlay.addEventListener("click", event => {
    if (event.target === overlay) {
      overlay.id === "bookingModal" ? closeBooking() : closeReceipt();
    }
  });
});