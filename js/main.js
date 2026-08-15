document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const mobileNav = document.querySelector(".mobile-nav");
  const mobileClose = document.querySelector(".mobile-close");
  const mobileLinks = document.querySelectorAll(".mobile-nav a");
  const dropdownToggles = document.querySelectorAll(".nav-dropdown-toggle");
  const yearEl = document.getElementById("year");
  const homeLinks = document.querySelectorAll('a[href="#home"]');
  const serviceReadMoreLinks = document.querySelectorAll(".service-read-more");
  const servicePanels = document.querySelectorAll(".service-cluster-panel");

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  homeLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth"
      });
      if (mobileNav && mobileNav.classList.contains("is-open")) {
        toggleMobileNav(false);
      }
    });
  });

  const toggleMobileNav = (open) => {
    if (!mobileNav || !navToggle) {
      return;
    }
    mobileNav.classList.toggle("is-open", open);
    mobileNav.setAttribute("aria-hidden", String(!open));
    navToggle.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";

    if (open && window.gsap && !prefersReducedMotion) {
      gsap.fromTo(
        ".mobile-nav nav a",
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.38, stagger: 0.08, ease: "power2.out" }
      );
    }
  };

  if (navToggle && mobileClose && mobileNav) {
    navToggle.addEventListener("click", () => toggleMobileNav(true));
    mobileClose.addEventListener("click", () => toggleMobileNav(false));
    mobileLinks.forEach((link) => link.addEventListener("click", () => toggleMobileNav(false)));
  }

  const openServicePanel = (panelId) => {
    const targetPanel = document.getElementById(panelId);
    if (!targetPanel) {
      return;
    }

    const shouldOpen = !targetPanel.classList.contains("is-open");

    servicePanels.forEach((panel) => {
      const isMatch = panel.id === panelId;
      panel.classList.toggle("is-open", isMatch && shouldOpen);
      panel.setAttribute("aria-hidden", String(!(isMatch && shouldOpen)));
    });

    if (shouldOpen) {
      setTimeout(() => {
        targetPanel.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "start"
        });
      }, 50);
    }
  };

  serviceReadMoreLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const panelId = link.dataset.panel;
      if (!panelId) {
        return;
      }
      openServicePanel(panelId);
    });
  });

  document.querySelectorAll(".service-close").forEach((button) => {
    button.addEventListener("click", () => {
      const panel = button.closest(".service-cluster-panel");
      if (!panel) {
        return;
      }
      panel.classList.remove("is-open");
      panel.setAttribute("aria-hidden", "true");
    });
  });

  const trainingToggle = document.querySelector(".training-details-toggle");
  if (trainingToggle) {
    const syncTrainingToggle = () => {
      const details = trainingToggle.closest(".training-details");
      const content = document.getElementById(trainingToggle.getAttribute("aria-controls"));
      const isExpanded = trainingToggle.getAttribute("aria-expanded") === "true";

      if (details) {
        details.classList.toggle("is-open", isExpanded);
      }

      if (content) {
        content.setAttribute("aria-hidden", String(!isExpanded));
      }
    };

    trainingToggle.addEventListener("click", () => {
      const isExpanded = trainingToggle.getAttribute("aria-expanded") === "true";
      trainingToggle.setAttribute("aria-expanded", String(!isExpanded));
      syncTrainingToggle();
    });

    syncTrainingToggle();
  }

  dropdownToggles.forEach((toggle) => {
    toggle.addEventListener("click", (event) => {
      event.stopPropagation();
      const parent = toggle.closest(".has-dropdown");
      const isOpen = parent.classList.contains("open");

      document.querySelectorAll(".has-dropdown").forEach((item) => {
        item.classList.remove("open");
        const btn = item.querySelector(".nav-dropdown-toggle");
        if (btn) btn.setAttribute("aria-expanded", "false");
      });

      if (!isOpen) {
        parent.classList.add("open");
        toggle.setAttribute("aria-expanded", "true");
      }
    });
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".has-dropdown")) {
      document.querySelectorAll(".has-dropdown").forEach((item) => {
        item.classList.remove("open");
        const btn = item.querySelector(".nav-dropdown-toggle");
        if (btn) btn.setAttribute("aria-expanded", "false");
      });
    }
  });

  let lastScrollY = window.scrollY;
  const setHeaderState = () => {
    if (!header) {
      return;
    }
    const currentScrollY = window.scrollY;
    header.classList.toggle("is-scrolled", currentScrollY > 60);

    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      header.classList.add("is-hidden");
    } else {
      header.classList.remove("is-hidden");
    }
    lastScrollY = currentScrollY;
  };
  setHeaderState();
  window.addEventListener("scroll", setHeaderState, { passive: true });

  // CSS-based reveal animations with IntersectionObserver
  const revealElements = document.querySelectorAll(
    ".reveal, .reveal-fade-up, .reveal-fade-left, .reveal-fade-right, .reveal-zoom, .stagger-children"
  );

  if (revealElements.length > 0) {
    if ("IntersectionObserver" in window && !prefersReducedMotion) {
      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
      );

      revealElements.forEach((el) => revealObserver.observe(el));
    } else {
      revealElements.forEach((el) => el.classList.add("is-visible"));
    }
  }

  const teamCards = document.querySelectorAll(".team-card");
  teamCards.forEach((card) => {
    const image = card.querySelector("img");
    if (!image) {
      return;
    }

    const revealCard = () => {
      card.classList.add("is-active");
      if (window.gsap && !prefersReducedMotion) {
        gsap.to(image, { filter: "grayscale(0)", duration: 0.35, ease: "power2.out" });
      } else {
        image.style.filter = "grayscale(0)";
      }
    };

    const hideCard = () => {
      card.classList.remove("is-active");
      if (window.gsap && !prefersReducedMotion) {
        gsap.to(image, { filter: "grayscale(1)", duration: 0.3, ease: "power2.out" });
      } else {
        image.style.filter = "grayscale(1)";
      }
    };

    card.addEventListener("mouseenter", revealCard);
    card.addEventListener("mouseleave", hideCard);
    card.addEventListener("focusin", revealCard);
    card.addEventListener("focusout", hideCard);
    card.addEventListener("click", () => {
      if (window.matchMedia("(max-width: 1023px)").matches) {
        if (card.classList.contains("is-active")) {
          hideCard();
        } else {
          revealCard();
        }
      }
    });
  });

  const testimonialCarousel = document.querySelector(".testimonial-carousel");
  const testimonialSlidesWrapper = document.querySelector(".testimonial-slides");
  const testimonialDotsWrapper = document.querySelector(".testimonial-dots");
  let testimonialIndex = 0;
  let testimonialTimer = null;

  const getTestimonialSlides = () => (testimonialSlidesWrapper ? Array.from(testimonialSlidesWrapper.querySelectorAll(".testimonial-slide")) : []);
  const getTestimonialDots = () => (testimonialDotsWrapper ? Array.from(testimonialDotsWrapper.querySelectorAll("button")) : []);

  const syncTestimonialDots = () => {
    if (!testimonialDotsWrapper) {
      return;
    }

    const slides = getTestimonialSlides();
    const dots = getTestimonialDots();

    if (slides.length > dots.length) {
      for (let i = dots.length; i < slides.length; i += 1) {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.setAttribute("aria-label", `Show testimonial ${i + 1}`);
        testimonialDotsWrapper.appendChild(dot);
      }
    } else if (slides.length < dots.length) {
      dots.slice(slides.length).forEach((dot) => dot.remove());
    }

    const updatedDots = getTestimonialDots();
    updatedDots.forEach((dot, index) => {
      dot.classList.toggle("is-active", index === testimonialIndex);
      dot.onclick = () => {
        showTestimonial(index);
        stopTestimonialAutoPlay();
        startTestimonialAutoPlay();
      };
    });
  };

  const showTestimonial = (index) => {
    const testimonialSlides = getTestimonialSlides();
    if (!testimonialSlides.length) {
      return;
    }

    const next = (index + testimonialSlides.length) % testimonialSlides.length;

    if (window.gsap && !prefersReducedMotion) {
      gsap.killTweensOf(testimonialSlides);
    }

    testimonialSlides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === next;
      slide.classList.toggle("is-active", isActive);
      slide.style.zIndex = isActive ? "2" : "1";

      if (window.gsap && !prefersReducedMotion) {
        gsap.to(slide, {
          opacity: isActive ? 1 : 0,
          visibility: isActive ? "visible" : "hidden",
          duration: isActive ? 0.42 : 0.3,
          ease: "power2.out",
          overwrite: true
        });
      } else {
        slide.style.opacity = isActive ? "1" : "0";
        slide.style.visibility = isActive ? "visible" : "hidden";
      }
    });

    testimonialIndex = next;
    syncTestimonialDots();
  };

  const startTestimonialAutoPlay = () => {
    if (!testimonialSlidesWrapper || !getTestimonialSlides().length) {
      return;
    }
    testimonialTimer = window.setInterval(() => showTestimonial(testimonialIndex + 1), 3000);
  };

  const stopTestimonialAutoPlay = () => {
    if (testimonialTimer) {
      window.clearInterval(testimonialTimer);
      testimonialTimer = null;
    }
  };

  if (testimonialCarousel) {
    testimonialCarousel.addEventListener("mouseenter", stopTestimonialAutoPlay);
    testimonialCarousel.addEventListener("mouseleave", startTestimonialAutoPlay);
    testimonialCarousel.addEventListener("focusin", stopTestimonialAutoPlay);
    testimonialCarousel.addEventListener("focusout", startTestimonialAutoPlay);

    let startX = 0;
    testimonialCarousel.addEventListener("touchstart", (event) => {
      startX = event.changedTouches[0].clientX;
    }, { passive: true });

    testimonialCarousel.addEventListener("touchend", (event) => {
      const endX = event.changedTouches[0].clientX;
      const delta = startX - endX;
      if (Math.abs(delta) > 40) {
        showTestimonial(testimonialIndex + (delta > 0 ? 1 : -1));
        stopTestimonialAutoPlay();
        startTestimonialAutoPlay();
      }
    }, { passive: true });
  }

  syncTestimonialDots();
  startTestimonialAutoPlay();

  const reviewTrigger = document.querySelector(".add-review-trigger");
  const reviewForm = document.getElementById("review-form");
  const reviewNameInput = document.getElementById("review-name");
  const reviewTextInput = document.getElementById("review-text");
  const reviewCancelButton = document.querySelector(".review-cancel");

  if (reviewTrigger && reviewForm) {
    reviewTrigger.addEventListener("click", () => {
      reviewForm.hidden = !reviewForm.hidden;
      if (!reviewForm.hidden) {
        reviewNameInput.focus();
      }
    });
  }

  if (reviewCancelButton && reviewForm) {
    reviewCancelButton.addEventListener("click", () => {
      reviewForm.reset();
      reviewForm.hidden = true;
    });
  }

  if (reviewForm) {
    reviewForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const name = reviewNameInput.value.trim();
      const reviewText = reviewTextInput.value.trim();

      if (!name || !reviewText) {
        return;
      }

      const slide = document.createElement("figure");
      slide.className = "testimonial-slide";

      const blockquote = document.createElement("blockquote");
      blockquote.textContent = reviewText;

      const figcaption = document.createElement("figcaption");
      figcaption.textContent = name;

      slide.appendChild(blockquote);
      slide.appendChild(figcaption);

      if (testimonialSlidesWrapper) {
        testimonialSlidesWrapper.insertBefore(slide, testimonialSlidesWrapper.firstChild);
      }

      const slides = getTestimonialSlides();
      slides.forEach((slideItem, index) => {
        const isActive = index === 0;
        slideItem.classList.toggle("is-active", isActive);
        if (window.gsap && !prefersReducedMotion) {
          gsap.to(slideItem, { opacity: isActive ? 1 : 0, visibility: isActive ? "visible" : "hidden", duration: 0.3, ease: "power2.out" });
        } else {
          slideItem.style.opacity = isActive ? "1" : "0";
          slideItem.style.visibility = isActive ? "visible" : "hidden";
        }
        slideItem.style.zIndex = isActive ? "2" : "1";
      });

      testimonialIndex = 0;
      syncTestimonialDots();
      reviewForm.reset();
      reviewForm.hidden = true;
      stopTestimonialAutoPlay();
      startTestimonialAutoPlay();
    });
  }

  const splitHeroTitle = () => {
    const heroTitle = document.querySelector(".hero-title");
    if (!heroTitle) {
      return;
    }
    const words = heroTitle.textContent.trim().split(/\s+/);
    heroTitle.innerHTML = words.map((word) => `<span>${word}</span>`).join(" ");
  };
  splitHeroTitle();




  // GSAP Animations
  if (window.gsap) {
    gsap.registerPlugin(ScrollTrigger);
  }

  if (window.gsap && !prefersReducedMotion) {
    const heroTimeline = gsap.timeline({ defaults: { ease: "power2.out" } });
    heroTimeline
      .from(".hero-eyebrow", { y: 12, opacity: 0, duration: 0.28 })
      .from(".hero-title span", { y: 26, opacity: 0, duration: 0.34, stagger: 0.04 }, "-=0.1")
      .from(".hero-body", { y: 14, opacity: 0, duration: 0.28 }, "-=0.15")
      .from(".primary-cta", { scale: 0.94, opacity: 0, duration: 0.26 }, "-=0.1");

    const sealStrokes = document.querySelectorAll(".hero-seal circle, .hero-seal path");
    sealStrokes.forEach((stroke) => {
      const length = stroke.getTotalLength();
      stroke.style.strokeDasharray = `${length}`;
      stroke.style.strokeDashoffset = `${length}`;
    });
    heroTimeline.to(sealStrokes, { strokeDashoffset: 0, duration: 0.55, stagger: 0.05 }, "-=0.26");

    gsap.from(".about-visual img", {
      scrollTrigger: { trigger: ".about", start: "top 72%" },
      x: -20,
      y: 10,
      opacity: 0,
      duration: 0.55,
      stagger: 0.1,
      ease: "power2.out"
    });




    gsap.from(".experience-badge", {
      scrollTrigger: { trigger: ".about", start: "top 65%" },
      scale: 0.65,
      opacity: 0,
      duration: 0.52,
      ease: "back.out(1.2)",
      delay: 0.12
    });

    });

    gsap.from(".founder-card", {
      scrollTrigger: { trigger: ".team-pyramid", start: "top 75%" },
      opacity: 0,
      scale: 0.96,
      duration: 0.42,
      ease: "power2.out"
    });

    gsap.from(".director-card", {
      scrollTrigger: { trigger: ".team-pyramid", start: "top 72%" },
      opacity: 0,
      y: 18,
      duration: 0.42,
      delay: 0.15,
      stagger: 0.15,
      ease: "power2.out"
    });

    const serviceCards = document.querySelectorAll(".service-card");
    serviceCards.forEach((card) => {
      const seal = card.querySelector(".service-seal");
      if (!seal) {
        return;
      }
      card.addEventListener("mouseenter", () => {
        gsap.to(seal, { rotate: 15, duration: 0.24, ease: "power2.out" });
      });
      card.addEventListener("mouseleave", () => {
        gsap.to(seal, { rotate: 0, duration: 0.24, ease: "power2.out" });
      });
    });
  } else {
    document.querySelectorAll(".testimonial-slide").forEach((slide, index) => {
      slide.style.opacity = index === 0 ? "1" : "0";
    });
  }

  if (window.gsap) {
    window.addEventListener("resize", () => ScrollTrigger.refresh());
    window.addEventListener("orientationchange", () => ScrollTrigger.refresh());
  }
});
