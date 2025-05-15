document.addEventListener("DOMContentLoaded", () => {
    // Menú móvil
    const mobileMenuBtn = document.querySelector(".mobile-menu");
    const navLinks = document.querySelector(".nav-links");
    
    mobileMenuBtn.addEventListener("click", () => {
      navLinks.style.display = navLinks.style.display === "flex" ? "none" : "flex";
    });
    
    // Ajustar menú en resize
    window.addEventListener("resize", () => {
      if (window.innerWidth > 992) {
        navLinks.style.display = "flex";
      } else {
        navLinks.style.display = "none";
      }
    });
    
    // Efecto de carga
    document.body.style.opacity = "0";
    setTimeout(() => {
      document.body.style.transition = "opacity 0.5s ease";
      document.body.style.opacity = "1";
    }, 100);
  });