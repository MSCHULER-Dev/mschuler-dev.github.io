document.documentElement.classList.add("js-enabled");

const header = document.getElementById("header");
const scrollProgress = document.getElementById("scroll-progress");
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

/* BARRE DE DÉFILEMENT */

function updateScroll() {
  const scrollTop = window.scrollY;
  const documentHeight =
    document.documentElement.scrollHeight - window.innerHeight;

  if (header) {
    header.classList.toggle("scrolled", scrollTop > 50);
  }

  if (scrollProgress) {
    const progress =
      documentHeight > 0 ? (scrollTop / documentHeight) * 100 : 0;

    scrollProgress.style.width = `${progress}%`;
  }
}

window.addEventListener("scroll", updateScroll, { passive: true });
updateScroll();

/* MENU MOBILE */

function closeMenu() {
  if (!menuToggle || !navLinks) return;

  menuToggle.classList.remove("active");
  navLinks.classList.remove("active");
  menuToggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const menuIsOpen = navLinks.classList.toggle("active");

    menuToggle.classList.toggle("active", menuIsOpen);
    menuToggle.setAttribute("aria-expanded", String(menuIsOpen));
    document.body.classList.toggle("menu-open", menuIsOpen);
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}

/* APPARITION AU DÉFILEMENT */

const revealElements = document.querySelectorAll(".reveal");

if (reducedMotion) {
  revealElements.forEach((element) => {
    element.classList.add("visible");
  });
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -45px 0px"
    }
  );

  revealElements.forEach((element, index) => {
    element.style.transitionDelay = `${(index % 4) * 80}ms`;
    revealObserver.observe(element);
  });
}

/* IMAGES DES PRESTATIONS */

const craftImage = document.getElementById("craft-image");
const craftItems = document.querySelectorAll(".craft-item");

if (craftImage && craftItems.length > 0) {
  const defaultImage = craftImage.getAttribute("src");

  craftItems.forEach((item) => {
    const imagePath = item.dataset.image;

    if (imagePath) {
      const preloadedImage = new Image();
      preloadedImage.src = imagePath;
    }

    item.addEventListener("mouseenter", () => {
      if (!imagePath || craftImage.src.includes(imagePath)) return;

      craftImage.style.opacity = "0";
      craftImage.style.transform = "scale(1.04)";

      window.setTimeout(() => {
        craftImage.src = imagePath;
        craftImage.style.opacity = "1";
        craftImage.style.transform = "scale(1)";
      }, 220);
    });

    item.addEventListener("focus", () => {
      if (imagePath) {
        craftImage.src = imagePath;
      }
    });
  });

  document
    .querySelector(".craft-list")
    ?.addEventListener("mouseleave", () => {
      craftImage.style.opacity = "0";

      window.setTimeout(() => {
        craftImage.src = defaultImage;
        craftImage.style.opacity = "1";
      }, 220);
    });
}

/* SÉLECTEUR D’ESSENCES */

const woodPreview = document.getElementById("wood-preview");
const woodName = document.getElementById("wood-name");
const woodOrigin = document.getElementById("wood-origin");
const woodDescription = document.getElementById("wood-description");
const woodOptions = document.querySelectorAll(".wood-option");

const woodColors = {
  oak: "#b88755",
  walnut: "#5a3825",
  ash: "#d2b98f"
};

woodOptions.forEach((option) => {
  option.setAttribute(
    "aria-pressed",
    String(option.classList.contains("active"))
  );

  option.addEventListener("click", () => {
    woodOptions.forEach((button) => {
      button.classList.remove("active");
      button.setAttribute("aria-pressed", "false");
    });

    option.classList.add("active");
    option.setAttribute("aria-pressed", "true");

    const selectedWood = option.dataset.wood;

    if (woodPreview && woodColors[selectedWood]) {
      woodPreview.style.backgroundColor = woodColors[selectedWood];
    }

    if (woodName) {
      woodName.textContent = option.dataset.name || "";
    }

    if (woodOrigin) {
      woodOrigin.textContent = option.dataset.origin || "";
    }

    if (woodDescription) {
      woodDescription.textContent =
        option.dataset.description || "";
    }
  });
});

/* PARTICULES DE BOIS */

const particleContainer =
  document.getElementById("wood-particles");

function createWoodParticle() {
  if (!particleContainer || document.hidden) return;

  const particle = document.createElement("span");

  particle.className = "wood-particle";
  particle.style.left = `${Math.random() * 85}%`;
  particle.style.bottom = `${Math.random() * 28}%`;
  particle.style.animationDuration =
    `${5 + Math.random() * 4}s`;
  particle.style.animationDelay =
    `${Math.random() * 0.5}s`;

  particle.addEventListener("animationend", () => {
    particle.remove();
  });

  particleContainer.appendChild(particle);
}

if (particleContainer && !reducedMotion) {
  for (let index = 0; index < 7; index += 1) {
    window.setTimeout(createWoodParticle, index * 260);
  }

  window.setInterval(createWoodParticle, 850);
}
/* LIEN ACTIF DU MENU */

const navigationLinks =
  document.querySelectorAll(".nav-links a");

const homeLink = document.querySelector(
  '.nav-links a[href="index.html"]'
);

const sectionLinks = [
  {
    section: document.getElementById("savoir-faire"),
    link: document.querySelector(
      '.nav-links a[href="#savoir-faire"]'
    )
  },
  {
    section: document.getElementById("atelier"),
    link: document.querySelector(
      '.nav-links a[href="#atelier"]'
    )
  }
];

function updateActiveNavigation() {
  const position =
    window.scrollY + (header?.offsetHeight || 0) + 160;

  let activeLink = homeLink;

  sectionLinks.forEach(({ section, link }) => {
    if (section && link && position >= section.offsetTop) {
      activeLink = link;
    }
  });

  navigationLinks.forEach((link) => {
    link.classList.toggle("active", link === activeLink);
  });
}

window.addEventListener(
  "scroll",
  updateActiveNavigation,
  { passive: true }
);

updateActiveNavigation();
/* FILTRES DES RÉALISATIONS */

const projectFilters =
  document.querySelectorAll(".project-filter");

const projectCards =
  document.querySelectorAll(".project-card");

if (projectFilters.length && projectCards.length) {
  const urlCategory =
    new URLSearchParams(window.location.search)
      .get("categorie");

  function filterProjects(category) {
    projectFilters.forEach((button) => {
      const isActive =
        button.dataset.filter === category;

      button.classList.toggle("active", isActive);
      button.setAttribute(
        "aria-pressed",
        String(isActive)
      );
    });

    projectCards.forEach((card) => {
      const isVisible =
        category === "all" ||
        card.dataset.category === category;

      card.classList.toggle("hidden", !isVisible);
    });
  }

  projectFilters.forEach((button) => {
    button.addEventListener("click", () => {
      filterProjects(button.dataset.filter);
    });
  });

  const availableFilters = Array.from(projectFilters)
    .map((button) => button.dataset.filter);

  filterProjects(
    availableFilters.includes(urlCategory)
      ? urlCategory
      : "all"
  );
}
/* FORMULAIRE DE DEVIS */

const quoteForm =
  document.getElementById("quote-form");

if (quoteForm) {
  quoteForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!quoteForm.checkValidity()) {
      quoteForm.reportValidity();
      return;
    }

    const formData = new FormData(quoteForm);

    const firstname = formData.get("firstname");
    const lastname = formData.get("lastname");
    const email = formData.get("email");
    const phone = formData.get("phone") || "Non renseigné";
    const projectType = formData.get("project-type");
    const budget = formData.get("budget") || "Non renseigné";
    const location = formData.get("location") || "Non renseigné";
    const message = formData.get("message");

    const subject =
      `Demande de devis — ${firstname} ${lastname}`;

    const body = `
Bonjour Atelier Weber,

Je souhaite vous présenter mon projet.

Nom : ${firstname} ${lastname}
E-mail : ${email}
Téléphone : ${phone}
Type de projet : ${projectType}
Budget envisagé : ${budget}
Lieu du projet : ${location}

Description du projet :
${message}

Cordialement,
${firstname} ${lastname}
    `.trim();

    window.location.href =
      `mailto:contact@atelier-weber.fr` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;
  });
}